import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;
export type AdminStatus = 'ACTIVE' | 'BLOCKED';

@Schema({
  collection: 'admins',
  timestamps: true,
})
export class Admin {
  @Prop({ required: true, unique: true, trim: true })
  firebaseUid: string;

  @Prop({ required: false, unique: true, sparse: true, trim: true })
  phoneNumber: string;

  @Prop({ required: false, unique: true, sparse: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Role' })
  roleId: Types.ObjectId;

  @Prop({ required: true, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE', index: true })
  status: AdminStatus;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
