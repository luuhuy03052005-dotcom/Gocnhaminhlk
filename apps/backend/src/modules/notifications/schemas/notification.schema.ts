import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;
export type NotificationType = 'SYSTEM' | 'PROMOTION' | 'ORDER' | 'VOUCHER';
export type NotificationTargetType = 'ALL' | 'USER' | 'GROUP';

@Schema({
  collection: 'notifications',
  timestamps: true,
})
export class Notification {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ required: true, enum: ['SYSTEM', 'PROMOTION', 'ORDER', 'VOUCHER'] })
  type: NotificationType;

  @Prop({ required: true, enum: ['ALL', 'USER', 'GROUP'], index: true })
  targetType: NotificationTargetType;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Admin', index: true })
  createdByAdminId: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ createdAt: -1 });
