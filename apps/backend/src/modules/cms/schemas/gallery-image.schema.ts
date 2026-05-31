import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GalleryImageDocument = HydratedDocument<GalleryImage>;

@Schema({
  collection: 'gallery_images',
  timestamps: true,
})
export class GalleryImage {
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
  badge?: string;

  @Prop({ trim: true })
  ctaLabel?: string;

  @Prop({ trim: true })
  ctaLink?: string;

  @Prop({ trim: true })
  objectPosition?: string;

  @Prop({ required: true, default: 0, index: true })
  displayOrder: number;

  @Prop({ required: true, default: true, index: true })
  isActive: boolean;
}

export const GalleryImageSchema = SchemaFactory.createForClass(GalleryImage);

