import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuCategory, MenuCategoryDocument } from './schemas/menu-category.schema';
import { MenuItem, MenuItemDocument } from './schemas/menu-item.schema';

export interface PublicMenuItem {
  name: string;
  price: string;
  desc?: string;
  isBestSeller?: boolean;
}

export interface PublicMenuCategory {
  id: string;
  name: string;
  items: PublicMenuItem[];
}

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuCategory.name)
    private readonly menuCategoryModel: Model<MenuCategoryDocument>,
    @InjectModel(MenuItem.name)
    private readonly menuItemModel: Model<MenuItemDocument>,
  ) {}

  async getPublicMenu(): Promise<PublicMenuCategory[]> {
    const categories = await this.menuCategoryModel
      .find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .exec();

    if (categories.length === 0) {
      return [];
    }

    const categoryIds = categories.map((category) => category._id);
    const items = await this.menuItemModel
      .find({ categoryId: { $in: categoryIds }, isAvailable: true })
      .sort({ displayOrder: 1, name: 1 })
      .exec();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      items: items
        .filter((item) => item.categoryId.toString() === category.id)
        .map((item) => ({
          name: item.name,
          price: this.formatPrice(item.price),
          desc: item.description,
          isBestSeller: item.isBestSeller,
        })),
    }));
  }

  private formatPrice(price: number): string {
    if (price > 0 && price % 1000 === 0) {
      return `${price / 1000}k`;
    }

    return `${price.toLocaleString('vi-VN')} VND`;
  }
}

