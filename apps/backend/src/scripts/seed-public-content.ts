import { NestFactory } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { AppModule } from '../app.module';

interface SeedMenuCategory {
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  items: Array<{
    name: string;
    slug: string;
    price: number;
    description?: string;
    imageUrl?: string;
    isBestSeller?: boolean;
    displayOrder: number;
  }>;
}

const now = new Date();
const nextMonth = new Date(now);
nextMonth.setMonth(nextMonth.getMonth() + 1);

const menuCategories: SeedMenuCategory[] = [
  {
    name: 'CÀ PHÊ',
    slug: 'ca-phe',
    description: 'Những món cà phê thân thuộc của Góc.',
    displayOrder: 10,
    items: [
      { name: 'Cà đen', slug: 'ca-den', price: 20000, displayOrder: 10 },
      { name: 'Cà nâu', slug: 'ca-nau', price: 25000, displayOrder: 20 },
      { name: 'Muối mặn mà', slug: 'muoi-man-ma', price: 32000, isBestSeller: true, displayOrder: 30 },
    ],
  },
  {
    name: 'TRÀ SỮA',
    slug: 'tra-sua',
    description: 'Trà sữa nhẹ nhàng, ngọt vừa, nhiều topping.',
    displayOrder: 20,
    items: [
      {
        name: 'Trà sữa Đen Mật',
        slug: 'tra-sua-den-mat',
        price: 25000,
        isBestSeller: true,
        displayOrder: 10,
      },
      {
        name: 'Oolong Camellia',
        slug: 'oolong-camellia',
        price: 25000,
        description: 'Vị trà oolong nướng thơm, hợp với kem sữa muối biển.',
        imageUrl: '/images/landing/menu-oolong-camelia.jpg',
        isBestSeller: true,
        displayOrder: 20,
      },
    ],
  },
  {
    name: 'MATCHA',
    slug: 'matcha',
    description: 'Matcha mát lành cho những ngày cần chậm lại.',
    displayOrder: 30,
    items: [
      { name: 'Matcha latte', slug: 'matcha-latte', price: 35000, displayOrder: 10 },
      {
        name: 'Matcha mê dừa',
        slug: 'matcha-me-dua',
        price: 42000,
        imageUrl: '/images/landing/menu-matcha-coconut.jpg',
        isBestSeller: true,
        displayOrder: 20,
      },
    ],
  },
];

const banners = [
  {
    type: 'promo',
    title: 'Check-in là có quà',
    subtitle: 'ƯU ĐÃI',
    description: 'Chụp một bức ảnh tại quán, đăng lên Facebook kèm check-in và nhận topping miễn phí.',
    imageUrl: '/images/landing/promo-checkin.jpg',
    alt: 'Deal check-in free topping',
    ctaLabel: 'Ghé Ngay',
    ctaLink: '#location',
    badge: 'Ưu đãi',
    displayOrder: 10,
    isActive: true,
  },
  {
    type: 'menu',
    title: 'Trà Sữa Ô Long Camelia',
    description: 'Đậm vị trà nướng, sánh mịn kem mặn.',
    imageUrl: '/images/landing/menu-oolong-camelia.jpg',
    alt: 'Trà sữa Ô long Camelia',
    ctaLabel: 'Khám phá Menu',
    ctaLink: '#menu',
    badge: 'Best Seller',
    price: '25k',
    displayOrder: 20,
    isActive: true,
  },
];

const galleryImages = [
  {
    title: 'Bình yên trước hiên nhà',
    subtitle: 'Sáng sớm tinh mơ',
    description: 'Đón những tia nắng đầu tiên xuyên qua tán cây trong một sớm Long Khánh.',
    imageUrl: '/images/landing/gallery-front-morning.jpg',
    alt: 'Mặt tiền quán Góc Nhà Mình lúc sáng sớm',
    badge: 'Khởi đầu',
    displayOrder: 10,
    isActive: true,
  },
  {
    title: 'Mộc mạc & Thân thuộc',
    subtitle: 'Như trở về nhà',
    description: 'Bàn gỗ, ánh đèn vàng và không gian được chăm chút để giữ lại sự ấm áp.',
    imageUrl: '/images/landing/gallery-corner-light.jpg',
    alt: 'Góc phòng với ánh sáng tự nhiên',
    badge: 'Không gian',
    displayOrder: 20,
    isActive: true,
  },
  {
    title: 'Tĩnh lặng thả trôi',
    subtitle: 'Góc nhỏ của riêng bạn',
    description: 'Một ly trà, một cuốn sách, và thời gian như chậm lại.',
    imageUrl: '/images/landing/gallery-chill-drink.jpg',
    alt: 'Góc chill với nước uống',
    badge: 'Trải nghiệm',
    objectPosition: 'center 85%',
    displayOrder: 30,
    isActive: true,
  },
];

const vouchers = [
  {
    title: 'Free topping check-in',
    description: 'Nhận một phần topping miễn phí khi check-in tại quán.',
    type: 'FIXED_AMOUNT',
    value: 7000,
    minOrderAmount: 25000,
    startDate: now,
    endDate: nextMonth,
    quantity: 200,
    status: 'ACTIVE',
  },
];

const websiteContents = [
  {
    key: 'landing',
    value: {
      headline: 'Góc nhỏ bình yên',
      subheadline: 'Thả chậm nhịp sống và tận hưởng hương vị cà phê mộc mạc trong một không gian tựa như nhà.',
    },
    isActive: true,
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const connection = app.get<Connection>(getConnectionToken());

    const categoryCollection = connection.collection('menu_categories');
    const itemCollection = connection.collection('menu_items');

    for (const category of menuCategories) {
      await categoryCollection.updateOne(
        { slug: category.slug },
        {
          $set: {
            name: category.name,
            slug: category.slug,
            description: category.description,
            displayOrder: category.displayOrder,
            isActive: true,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true },
      );

      const savedCategory = await categoryCollection.findOne<{ _id: Types.ObjectId }>({ slug: category.slug });
      if (!savedCategory) continue;

      for (const item of category.items) {
        await itemCollection.updateOne(
          { slug: item.slug },
          {
            $set: {
              categoryId: savedCategory._id,
              name: item.name,
              slug: item.slug,
              price: item.price,
              description: item.description,
              imageUrl: item.imageUrl,
              isAvailable: true,
              isBestSeller: item.isBestSeller ?? false,
              displayOrder: item.displayOrder,
              updatedAt: new Date(),
            },
            $setOnInsert: { createdAt: new Date() },
          },
          { upsert: true },
        );
      }
    }

    await Promise.all([
      ...banners.map((banner) =>
        connection.collection('banners').updateOne(
          { title: banner.title },
          { $set: { ...banner, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
          { upsert: true },
        ),
      ),
      ...galleryImages.map((image) =>
        connection.collection('gallery_images').updateOne(
          { title: image.title },
          { $set: { ...image, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
          { upsert: true },
        ),
      ),
      ...vouchers.map((voucher) =>
        connection.collection('vouchers').updateOne(
          { title: voucher.title },
          { $set: { ...voucher, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
          { upsert: true },
        ),
      ),
      ...websiteContents.map((content) =>
        connection.collection('website_contents').updateOne(
          { key: content.key },
          { $set: { ...content, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
          { upsert: true },
        ),
      ),
    ]);

    const [categoryCount, itemCount, bannerCount, galleryCount, voucherCount, contentCount] =
      await Promise.all([
        categoryCollection.countDocuments({ isActive: true }),
        itemCollection.countDocuments({ isAvailable: true }),
        connection.collection('banners').countDocuments({ isActive: true }),
        connection.collection('gallery_images').countDocuments({ isActive: true }),
        connection.collection('vouchers').countDocuments({ status: 'ACTIVE' }),
        connection.collection('website_contents').countDocuments({ isActive: true }),
      ]);

    console.log(
      `Public content seed completed: categories=${categoryCount}, items=${itemCount}, banners=${bannerCount}, gallery=${galleryCount}, vouchers=${voucherCount}, websiteContent=${contentCount}`,
    );
  } finally {
    await app.close();
  }
}

void bootstrap().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

