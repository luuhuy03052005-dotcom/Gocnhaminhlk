import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from './schemas/banner.schema';
import { GalleryImage, GalleryImageSchema } from './schemas/gallery-image.schema';
import { WebsiteContent, WebsiteContentSchema } from './schemas/website-content.schema';
import { CmsService } from './cms.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banner.name, schema: BannerSchema },
      { name: GalleryImage.name, schema: GalleryImageSchema },
      { name: WebsiteContent.name, schema: WebsiteContentSchema },
    ]),
  ],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
