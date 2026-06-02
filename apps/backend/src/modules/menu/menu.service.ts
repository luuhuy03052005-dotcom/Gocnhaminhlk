import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

export interface UpsertMenuCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpsertMenuItemInput {
  categoryId?: string | Types.ObjectId;
  name?: string;
  slug?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  isBestSeller?: boolean;
  displayOrder?: number;
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

  findAllCategories() {
    return this.menuCategoryModel.find().sort({ displayOrder: 1, name: 1 }).exec();
  }

  countCategories() {
    return this.menuCategoryModel.countDocuments().exec();
  }

  findCategoryById(id: string) {
    return this.menuCategoryModel.findById(id).exec();
  }

  createCategory(input: Required<Pick<UpsertMenuCategoryInput, 'name' | 'slug'>> & UpsertMenuCategoryInput) {
    return this.menuCategoryModel.create(input);
  }

  updateCategory(id: string, input: UpsertMenuCategoryInput) {
    return this.menuCategoryModel
      .findByIdAndUpdate(id, { $set: this.compact(input) }, { new: true })
      .exec();
  }

  deactivateCategory(id: string) {
    return this.updateCategory(id, { isActive: false });
  }

  findAllItems() {
    return this.menuItemModel.find().sort({ displayOrder: 1, name: 1 }).exec();
  }

  countItems() {
    return this.menuItemModel.countDocuments().exec();
  }

  findItemById(id: string) {
    return this.menuItemModel.findById(id).exec();
  }

  createItem(input: Required<Pick<UpsertMenuItemInput, 'categoryId' | 'name' | 'slug' | 'price'>> & UpsertMenuItemInput) {
    return this.menuItemModel.create({
      ...input,
      categoryId: this.toObjectId(input.categoryId),
    });
  }

  updateItem(id: string, input: UpsertMenuItemInput) {
    const update = {
      ...input,
      categoryId: input.categoryId ? this.toObjectId(input.categoryId) : undefined,
    };

    return this.menuItemModel
      .findByIdAndUpdate(id, { $set: this.compact(update) }, { new: true })
      .exec();
  }

  deactivateItem(id: string) {
    return this.updateItem(id, { isAvailable: false });
  }

  private formatPrice(price: number): string {
    if (price > 0 && price % 1000 === 0) {
      return `${price / 1000}k`;
    }

    return `${price.toLocaleString('vi-VN')} VND`;
  }

  private toObjectId(value: string | Types.ObjectId): Types.ObjectId {
    return typeof value === 'string' ? new Types.ObjectId(value) : value;
  }

  private compact<T extends object>(value: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).filter(
        ([, item]) => item !== undefined,
      ),
    ) as Partial<T>;
  }
}
