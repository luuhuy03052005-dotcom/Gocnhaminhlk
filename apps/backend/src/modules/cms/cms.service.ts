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

export interface UpsertBannerInput {
  type?: 'promo' | 'menu';
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  alt?: string;
  ctaLabel?: string;
  ctaLink?: string;
  badge?: string;
  price?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpsertGalleryImageInput {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  alt?: string;
  badge?: string;
  ctaLabel?: string;
  ctaLink?: string;
  objectPosition?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpsertWebsiteContentInput {
  value?: Record<string, unknown>;
  isActive?: boolean;
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

  findAllWebsiteContent() {
    return this.websiteContentModel.find().sort({ key: 1 }).exec();
  }

  findWebsiteContentByKey(key: string) {
    return this.websiteContentModel.findOne({ key }).exec();
  }

  countWebsiteContent() {
    return this.websiteContentModel.countDocuments().exec();
  }

  updateWebsiteContent(key: string, input: UpsertWebsiteContentInput) {
    return this.websiteContentModel
      .findOneAndUpdate(
        { key },
        { $set: this.compact(input) },
        { new: true },
      )
      .exec();
  }

  findAllBanners() {
    return this.bannerModel.find().sort({ displayOrder: 1, createdAt: -1 }).exec();
  }

  countBanners() {
    return this.bannerModel.countDocuments().exec();
  }

  findBannerById(id: string) {
    return this.bannerModel.findById(id).exec();
  }

  createBanner(input: Required<Pick<UpsertBannerInput, 'title' | 'imageUrl' | 'alt'>> & UpsertBannerInput) {
    return this.bannerModel.create(input);
  }

  updateBanner(id: string, input: UpsertBannerInput) {
    return this.bannerModel
      .findByIdAndUpdate(id, { $set: this.compact(input) }, { new: true })
      .exec();
  }

  deactivateBanner(id: string) {
    return this.updateBanner(id, { isActive: false });
  }

  findAllGalleryImages() {
    return this.galleryImageModel
      .find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .exec();
  }

  countGalleryImages() {
    return this.galleryImageModel.countDocuments().exec();
  }

  findGalleryImageById(id: string) {
    return this.galleryImageModel.findById(id).exec();
  }

  createGalleryImage(
    input: Required<Pick<UpsertGalleryImageInput, 'title' | 'imageUrl' | 'alt'>> &
      UpsertGalleryImageInput,
  ) {
    return this.galleryImageModel.create(input);
  }

  updateGalleryImage(id: string, input: UpsertGalleryImageInput) {
    return this.galleryImageModel
      .findByIdAndUpdate(id, { $set: this.compact(input) }, { new: true })
      .exec();
  }

  deactivateGalleryImage(id: string) {
    return this.updateGalleryImage(id, { isActive: false });
  }

  private compact<T extends object>(value: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).filter(
        ([, item]) => item !== undefined,
      ),
    ) as Partial<T>;
  }
}
