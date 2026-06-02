import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PointAccountDocument = HydratedDocument<PointAccount>;

@Schema({
  collection: 'point_accounts',
  timestamps: true,
})
export class PointAccount {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, min: 0, default: 0 })
  balance: number;
}

export const PointAccountSchema = SchemaFactory.createForClass(PointAccount);
