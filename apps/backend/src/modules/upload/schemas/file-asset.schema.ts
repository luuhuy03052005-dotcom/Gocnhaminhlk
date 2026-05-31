import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FileAssetDocument = HydratedDocument<FileAsset>;

@Schema({
  collection: 'file_assets',
  timestamps: { createdAt: true, updatedAt: false },
})
export class FileAsset {
  @Prop({ required: true, enum: ['CLOUDINARY'], default: 'CLOUDINARY' })
  provider: 'CLOUDINARY';

  @Prop({ required: true, trim: true, unique: true })
  publicId: string;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ required: true, trim: true })
  secureUrl: string;

  @Prop({ required: true, trim: true })
  folder: string;

  @Prop({ required: true, trim: true })
  fileName: string;

  @Prop({ required: true, trim: true })
  mimeType: string;

  @Prop({ required: true, min: 0 })
  size: number;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  uploadedByAdminId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  uploadedByUserId?: Types.ObjectId;
}

export const FileAssetSchema = SchemaFactory.createForClass(FileAsset);

