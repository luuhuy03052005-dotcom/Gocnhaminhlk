import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;
export type AdminRoleCode = 'STAFF' | 'MANAGER' | 'SUPER_ADMIN' | 'CONTENT_EDITOR' | 'ORDER_MANAGER';

@Schema({
  collection: 'roles',
  timestamps: true,
})
export class Role {
  @Prop({
    required: true,
    unique: true,
    enum: ['STAFF', 'MANAGER', 'SUPER_ADMIN', 'CONTENT_EDITOR', 'ORDER_MANAGER'],
  })
  code: AdminRoleCode;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, default: true, index: true })
  isActive: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
