import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserNotificationDocument = HydratedDocument<UserNotification>;

@Schema({
  collection: 'user_notifications',
  timestamps: true,
})
export class UserNotification {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Notification', index: true })
  notificationId: Types.ObjectId;

  @Prop({ required: true, default: false, index: true })
  isRead: boolean;

  @Prop()
  readAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export const UserNotificationSchema =
  SchemaFactory.createForClass(UserNotification);
UserNotificationSchema.index({ userId: 1, notificationId: 1 }, { unique: true });
