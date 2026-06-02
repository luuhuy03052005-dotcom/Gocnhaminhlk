import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserVoucherDocument = HydratedDocument<UserVoucher>;
export type UserVoucherStatus = 'UNUSED' | 'USED' | 'EXPIRED' | 'LOCKED';

@Schema({
  collection: 'user_vouchers',
  timestamps: true,
})
export class UserVoucher {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Voucher', index: true })
  voucherId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['UNUSED', 'USED', 'EXPIRED', 'LOCKED'],
    default: 'UNUSED',
    index: true,
  })
  status: UserVoucherStatus;

  @Prop({ required: true, default: Date.now })
  assignedAt: Date;

  @Prop()
  usedAt?: Date;
}

export const UserVoucherSchema = SchemaFactory.createForClass(UserVoucher);
UserVoucherSchema.index({ userId: 1, voucherId: 1 }, { unique: true });
