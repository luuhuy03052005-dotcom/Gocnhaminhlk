import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SystemSettingDocument = HydratedDocument<SystemSetting>;

@Schema({
  collection: 'system_settings',
  timestamps: true,
})
export class SystemSetting {
  @Prop({ required: true, unique: true, trim: true })
  key: string;

  @Prop({ required: true, type: Object })
  value: Record<string, unknown>;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  updatedByAdminId?: Types.ObjectId;
}

export const SystemSettingSchema = SchemaFactory.createForClass(SystemSetting);

