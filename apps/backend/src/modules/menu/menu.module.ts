import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuCategory, MenuCategorySchema } from './schemas/menu-category.schema';
import { MenuItem, MenuItemSchema } from './schemas/menu-item.schema';
import { MenuService } from './menu.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MenuCategory.name, schema: MenuCategorySchema },
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
  ],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
