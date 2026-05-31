import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MenuCategoryDocument = HydratedDocument<MenuCategory>;

@Schema({
  collection: 'menu_categories',
  timestamps: true,
})
export class MenuCategory {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, default: 0, index: true })
  displayOrder: number;

  @Prop({ required: true, default: true, index: true })
  isActive: boolean;
}

export const MenuCategorySchema = SchemaFactory.createForClass(MenuCategory);

