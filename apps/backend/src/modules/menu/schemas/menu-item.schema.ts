import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MenuItemDocument = HydratedDocument<MenuItem>;

@Schema({
  collection: 'menu_items',
  timestamps: true,
})
export class MenuItem {
  @Prop({ required: true, type: Types.ObjectId, ref: 'MenuCategory', index: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  slug: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  imageUrl?: string;

  @Prop({ required: true, default: true, index: true })
  isAvailable: boolean;

  @Prop({ default: false })
  isBestSeller?: boolean;

  @Prop({ required: true, default: 0, index: true })
  displayOrder: number;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
MenuItemSchema.index({ categoryId: 1, displayOrder: 1 });

