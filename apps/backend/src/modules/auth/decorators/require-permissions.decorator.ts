import { SetMetadata } from '@nestjs/common';
import { PermissionCode } from '../../roles/schemas/permission.schema';

export const REQUIRED_PERMISSIONS_KEY = 'required_permissions';

export const RequirePermissions = (...permissions: PermissionCode[]) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions);
