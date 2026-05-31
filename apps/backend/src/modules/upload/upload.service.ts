import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Model, Types } from 'mongoose';
import { FileAsset, FileAssetDocument } from './schemas/file-asset.schema';

export interface UploadBufferInput {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  size: number;
  folder: string;
  uploadedByAdminId?: string | Types.ObjectId;
  uploadedByUserId?: string | Types.ObjectId;
}

@Injectable()
export class UploadService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(FileAsset.name)
    private readonly fileAssetModel: Model<FileAssetDocument>,
  ) {}

  async uploadBuffer(input: UploadBufferInput) {
    this.configureCloudinary();

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: input.folder,
          resource_type: 'image',
          use_filename: true,
          unique_filename: true,
        },
        (error, response) => {
          if (error) {
            reject(error);
            return;
          }

          if (!response) {
            reject(new Error('Cloudinary did not return an upload response.'));
            return;
          }

          resolve(response);
        },
      );

      stream.end(input.buffer);
    });

    return this.fileAssetModel.create({
      provider: 'CLOUDINARY',
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      folder: input.folder,
      fileName: input.fileName,
      mimeType: input.mimeType,
      size: input.size,
      uploadedByAdminId: input.uploadedByAdminId
        ? this.toObjectId(input.uploadedByAdminId)
        : undefined,
      uploadedByUserId: input.uploadedByUserId
        ? this.toObjectId(input.uploadedByUserId)
        : undefined,
    });
  }

  private configureCloudinary() {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new ServiceUnavailableException({
        error: 'STORAGE_PROVIDER_NOT_CONFIGURED',
        message: 'Cloudinary environment variables are not fully configured.',
        details: {
          missing: [
            !cloudName ? 'CLOUDINARY_CLOUD_NAME' : null,
            !apiKey ? 'CLOUDINARY_API_KEY' : null,
            !apiSecret ? 'CLOUDINARY_API_SECRET' : null,
          ].filter(Boolean),
        },
      });
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  private toObjectId(value: string | Types.ObjectId): Types.ObjectId {
    return typeof value === 'string' ? new Types.ObjectId(value) : value;
  }
}

