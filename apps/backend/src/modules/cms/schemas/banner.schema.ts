import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BannerDocument = HydratedDocument<Banner>;
export type BannerType = 'promo' | 'menu';

@Schema({
  collection: 'banners',
  timestamps: true,
})
export class Banner {
  @Prop({ required: true, enum: ['promo', 'menu'], default: 'promo' })
  type: BannerType;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  subtitle?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, trim: true })
  imageUrl: string;

  @Prop({ required: true, trim: true })
  alt: string;

  @Prop({ trim: true })
  ctaLabel?: string;

  @Prop({ trim: true })
  ctaLink?: string;

  @Prop({ trim: true })
  badge?: string;

  @Prop({ trim: true })
  price?: string;

  @Prop({ required: true, default: 0, index: true })
  displayOrder: number;

  @Prop({ required: true, default: true, index: true })
  isActive: boolean;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);

