import { Controller, Get } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('menu')
  getMenu() {
    return this.publicService.getMenu();
  }

  @Get('banners')
  getBanners() {
    return this.publicService.getBanners();
  }

  @Get('gallery')
  getGallery() {
    return this.publicService.getGallery();
  }

  @Get('vouchers')
  getVouchers() {
    return this.publicService.getVouchers();
  }

  @Get('website-content')
  getWebsiteContent() {
    return this.publicService.getWebsiteContent();
  }
}
