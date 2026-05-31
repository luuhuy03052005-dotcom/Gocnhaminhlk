import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WebsiteContentDocument = HydratedDocument<WebsiteContent>;

@Schema({
  collection: 'website_contents',
  timestamps: true,
})
export class WebsiteContent {
  @Prop({ required: true, unique: true, trim: true })
  key: string;

  @Prop({ required: true, type: Object, default: {} })
  value: Record<string, unknown>;

  @Prop({ required: true, default: true, index: true })
  isActive: boolean;
}

export const WebsiteContentSchema = SchemaFactory.createForClass(WebsiteContent);

