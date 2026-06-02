import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SystemSetting, SystemSettingDocument } from './schemas/system-setting.schema';

export const initialSystemSettings = [
  {
    key: 'commerce',
    value: {
      shopOpen: true,
      allowOrdering: false,
      allowVoucherClaim: true,
      deliveryRadiusKm: 5,
      minimumOrderAmount: 50000,
    },
    description: 'Core shop and ordering switches.',
  },
] as const;

@Injectable()
export class SystemSettingsService {
  constructor(
    @InjectModel(SystemSetting.name)
    private readonly systemSettingModel: Model<SystemSettingDocument>,
  ) {}

  findAll() {
    return this.systemSettingModel.find().sort({ key: 1 }).exec();
  }

  findByKey(key: string) {
    return this.systemSettingModel.findOne({ key }).exec();
  }

  updateByKey(
    key: string,
    input: {
      value: Record<string, unknown>;
      description?: string;
      updatedByAdminId: string | Types.ObjectId;
    },
  ) {
    return this.systemSettingModel
      .findOneAndUpdate(
        { key },
        {
          $set: {
            value: input.value,
            description: input.description,
            updatedByAdminId: this.toObjectId(input.updatedByAdminId),
          },
        },
        { new: true },
      )
      .exec();
  }

  async ensureInitialSettings() {
    await Promise.all(
      initialSystemSettings.map((setting) =>
        this.systemSettingModel.updateOne(
          { key: setting.key },
          {
            $setOnInsert: {
              key: setting.key,
              value: setting.value,
              description: setting.description,
            },
          },
          { upsert: true },
        ).exec(),
      ),
    );
  }

  private toObjectId(value: string | Types.ObjectId): Types.ObjectId {
    return typeof value === 'string' ? new Types.ObjectId(value) : value;
  }
}
