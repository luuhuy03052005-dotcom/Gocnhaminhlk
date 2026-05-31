import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { AdminRequest } from '../../auth/decorators/current-admin.decorator';
import { AuditLogsService } from '../audit-logs.service';
import {
  AUDIT_ACTION_KEY,
  AuditActionMetadata,
} from '../decorators/audit-action.decorator';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const metadata = this.reflector.getAllAndOverride<AuditActionMetadata>(
      AUDIT_ACTION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!metadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<AdminRequest>();

    return next.handle().pipe(
      tap((response) => {
        if (!request.admin) {
          return;
        }

        const rawTargetId = metadata.targetIdParam
          ? request.params[metadata.targetIdParam]
          : undefined;
        const targetId = Array.isArray(rawTargetId) ? rawTargetId[0] : rawTargetId;

        void this.auditLogsService
          .create({
            actorAdminId: request.admin.id,
            action: metadata.action,
            targetType: metadata.targetType,
            targetId,
            after: this.toAuditObject(response),
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          })
          .catch((error: unknown) => {
            this.logger.error(
              `Failed to write audit log for action ${metadata.action}`,
              error instanceof Error ? error.stack : undefined,
            );
          });
      }),
    );
  }

  private toAuditObject(value: unknown): Record<string, unknown> | undefined {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return undefined;
    }

    return value as Record<string, unknown>;
  }
}
