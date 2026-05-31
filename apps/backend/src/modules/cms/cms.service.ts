import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { GalleryImage, GalleryImageDocument } from './schemas/gallery-image.schema';
import { WebsiteContent, WebsiteContentDocument } from './schemas/website-content.schema';

export interface PublicBanner {
  id: string;
  type: 'promo' | 'menu';
  title: string;
  image: string;
  alt: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: string;
  badge?: string;
  price?: string;
}

export interface PublicGalleryImage {
  id: string;
  title: string;
  image: string;
  alt: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  ctaLabel?: string;
  ctaLink?: string;
  objectPosition?: string;
}

@Injectable()
export class CmsService {
  constructor(
    @InjectModel(Banner.name)
    private readonly bannerModel: Model<BannerDocument>,
    @InjectModel(GalleryImage.name)
    private readonly galleryImageModel: Model<GalleryImageDocument>,
    @InjectModel(WebsiteContent.name)
    private readonly websiteContentModel: Model<WebsiteContentDocument>,
  ) {}

  async getPublicBanners(): Promise<PublicBanner[]> {
    const banners = await this.bannerModel
      .find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .exec();

    return banners.map((banner) => ({
      id: banner.id,
      type: banner.type,
      title: banner.title,
      image: banner.imageUrl,
      alt: banner.alt,
      subtitle: banner.subtitle,
      description: banner.description,
      ctaLabel: banner.ctaLabel,
      ctaLink: banner.ctaLink,
      badge: banner.badge,
      price: banner.price,
    }));
  }

  async getPublicGallery(): Promise<PublicGalleryImage[]> {
    const images = await this.galleryImageModel
      .find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .exec();

    return images.map((image) => ({
      id: image.id,
      title: image.title,
      image: image.imageUrl,
      alt: image.alt,
      subtitle: image.subtitle,
      description: image.description,
      badge: image.badge,
      ctaLabel: image.ctaLabel,
      ctaLink: image.ctaLink,
      objectPosition: image.objectPosition,
    }));
  }

  async getPublicWebsiteContent(): Promise<Record<string, unknown>> {
    const contentItems = await this.websiteContentModel.find({ isActive: true }).exec();

    return contentItems.reduce<Record<string, unknown>>((content, item) => {
      content[item.key] = item.value;
      return content;
    }, {});
  }
}

