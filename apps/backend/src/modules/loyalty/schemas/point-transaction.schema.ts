import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PointTransactionDocument = HydratedDocument<PointTransaction>;
export type PointTransactionType = 'EARN' | 'REDEEM' | 'ADJUST';

@Schema({
  collection: 'point_transactions',
  timestamps: true,
})
export class PointTransaction {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['EARN', 'REDEEM', 'ADJUST'] })
  type: PointTransactionType;

  @Prop({ required: true })
  points: number;

  @Prop({ trim: true })
  reason?: string;

  createdAt: Date;

  updatedAt: Date;
}

export const PointTransactionSchema = SchemaFactory.createForClass(PointTransaction);
PointTransactionSchema.index({ userId: 1, createdAt: -1 });
