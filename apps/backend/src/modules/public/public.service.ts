import { Injectable } from '@nestjs/common';
import { CmsService } from '../cms/cms.service';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { MenuService } from '../menu/menu.service';
import { VouchersService } from '../vouchers/vouchers.service';

@Injectable()
export class PublicService {
  constructor(
    private readonly menuService: MenuService,
    private readonly cmsService: CmsService,
    private readonly vouchersService: VouchersService,
    private readonly featureFlagsService: FeatureFlagsService,
  ) {}

  async getMenu() {
    if (!(await this.featureFlagsService.isEnabled('DYNAMIC_MENU'))) {
      return [];
    }

    return this.menuService.getPublicMenu();
  }

  async getBanners() {
    if (!(await this.featureFlagsService.isEnabled('DYNAMIC_BANNER'))) {
      return [];
    }

    return this.cmsService.getPublicBanners();
  }

  getGallery() {
    return this.cmsService.getPublicGallery();
  }

  async getVouchers() {
    if (!(await this.featureFlagsService.isEnabled('VOUCHER_WALLET'))) {
      return [];
    }

    return this.vouchersService.getPublicVouchers();
  }

  getWebsiteContent() {
    return this.cmsService.getPublicWebsiteContent();
  }
}
