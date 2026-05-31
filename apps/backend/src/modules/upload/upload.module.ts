import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileAsset, FileAssetSchema } from './schemas/file-asset.schema';
import { UploadService } from './upload.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: FileAsset.name, schema: FileAssetSchema }])],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
