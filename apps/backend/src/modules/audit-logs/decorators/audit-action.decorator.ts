import { SetMetadata } from '@nestjs/common';

export interface AuditActionMetadata {
  action: string;
  targetType: string;
  targetIdParam?: string;
}

export const AUDIT_ACTION_KEY = 'audit_action';

export const AuditAction = (metadata: AuditActionMetadata) =>
  SetMetadata(AUDIT_ACTION_KEY, metadata);
