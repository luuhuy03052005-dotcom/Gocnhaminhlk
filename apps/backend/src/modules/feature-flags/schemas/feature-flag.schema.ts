import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FeatureFlagDocument = HydratedDocument<FeatureFlag>;

@Schema({
  collection: 'feature_flags',
  timestamps: true,
})
export class FeatureFlag {
  @Prop({ required: true, unique: true, trim: true })
  key: string;

  @Prop({ required: true, default: false })
  enabled: boolean;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  updatedByAdminId?: Types.ObjectId;
}

export const FeatureFlagSchema = SchemaFactory.createForClass(FeatureFlag);
