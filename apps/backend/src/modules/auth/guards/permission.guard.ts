import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionCode } from '../../roles/schemas/permission.schema';
import { AdminRequest } from '../decorators/current-admin.decorator';
import { REQUIRED_PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<PermissionCode[]>(REQUIRED_PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AdminRequest>();
    if (!request.admin) {
      throw new UnauthorizedException({
        error: 'UNAUTHORIZED',
        message: 'Admin authentication is required.',
      });
    }

    const hasPermission = requiredPermissions.every((permission) =>
      request.admin?.permissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException({
        error: 'PERMISSION_DENIED',
        message: 'Admin account does not have permission for this action.',
        details: {
          requiredPermissions,
        },
      });
    }

    return true;
  }
}
