import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeatureFlagsService } from './feature-flags.service';
import { FeatureFlag, FeatureFlagSchema } from './schemas/feature-flag.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: FeatureFlag.name, schema: FeatureFlagSchema }])],
  providers: [FeatureFlagsService],
  exports: [FeatureFlagsService],
})
export class FeatureFlagsModule {}
