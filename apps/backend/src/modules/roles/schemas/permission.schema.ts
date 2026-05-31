import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

export const permissionCodes = [
  'menu.read',
  'menu.write',
  'voucher.read',
  'voucher.write',
  'banner.read',
  'banner.write',
  'gallery.read',
  'gallery.write',
  'website_content.read',
  'website_content.write',
  'user.read',
  'user.write',
  'orders.read',
  'orders.update',
  'notification.read',
  'notification.write',
  'feature_flag.read',
  'feature_flag.write',
  'audit_log.read',
  'admin.read',
  'admin.write',
  'upload.write',
  'system_settings.read',
  'system_settings.write',
] as const;

export type PermissionCode = (typeof permissionCodes)[number];

@Schema({
  collection: 'permissions',
  timestamps: true,
})
export class Permission {
  @Prop({ required: true, unique: true, enum: permissionCodes })
  code: PermissionCode;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, default: true, index: true })
  isActive: boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

