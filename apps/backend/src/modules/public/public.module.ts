import { Module } from '@nestjs/common';
import { CmsModule } from '../cms/cms.module';
import { FeatureFlagsModule } from '../feature-flags/feature-flags.module';
import { MenuModule } from '../menu/menu.module';
import { VouchersModule } from '../vouchers/vouchers.module';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

@Module({
  imports: [MenuModule, CmsModule, VouchersModule, FeatureFlagsModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
