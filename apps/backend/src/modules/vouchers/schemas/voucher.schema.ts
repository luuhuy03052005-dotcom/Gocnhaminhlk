import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VoucherDocument = HydratedDocument<Voucher>;
export type VoucherType = 'PERCENT' | 'FIXED_AMOUNT';
export type VoucherStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'LOCKED';

@Schema({
  collection: 'vouchers',
  timestamps: true,
})
export class Voucher {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, enum: ['PERCENT', 'FIXED_AMOUNT'] })
  type: VoucherType;

  @Prop({ required: true, min: 0 })
  value: number;

  @Prop({ min: 0 })
  minOrderAmount?: number;

  @Prop({ min: 0 })
  maxDiscountAmount?: number;

  @Prop({ required: true, index: true })
  startDate: Date;

  @Prop({ required: true, index: true })
  endDate: Date;

  @Prop({ min: 0 })
  quantity?: number;

  @Prop({ required: true, enum: ['ACTIVE', 'INACTIVE', 'EXPIRED', 'LOCKED'], default: 'ACTIVE', index: true })
  status: VoucherStatus;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);

