import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RolePermissionDocument = HydratedDocument<RolePermission>;

@Schema({
  collection: 'role_permissions',
  timestamps: true,
})
export class RolePermission {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Role', index: true })
  roleId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Permission', index: true })
  permissionId: Types.ObjectId;
}

export const RolePermissionSchema = SchemaFactory.createForClass(RolePermission);
RolePermissionSchema.index({ roleId: 1, permissionId: 1 }, { unique: true });

