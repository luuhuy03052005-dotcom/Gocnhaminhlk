import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FeatureFlag, FeatureFlagDocument } from './schemas/feature-flag.schema';

export const initialFeatureFlags = [
  { key: 'CUSTOMER_LOGIN', enabled: true, description: 'Customer can login on web' },
  { key: 'DYNAMIC_MENU', enabled: true, description: 'Menu loads from backend' },
  { key: 'DYNAMIC_BANNER', enabled: true, description: 'Banner/slider loads from backend' },
  { key: 'VOUCHER_WALLET', enabled: true, description: 'Customer can view vouchers' },
  { key: 'IN_APP_NOTIFICATION', enabled: true, description: 'Customer can view notifications' },
  { key: 'WEB_ORDERING', enabled: false, description: 'Ordering disabled until module complete' },
  { key: 'LOYALTY_SYSTEM', enabled: false, description: 'Loyalty disabled' },
  { key: 'INVOICE_UPLOAD', enabled: false, description: 'Invoice upload disabled' },
  { key: 'PUSH_NOTIFICATION', enabled: false, description: 'FCM disabled' },
  { key: 'ADMIN_AUDIT_LOG', enabled: true, description: 'Admin changes are logged' },
] as const;

@Injectable()
export class FeatureFlagsService {
  constructor(
    @InjectModel(FeatureFlag.name)
    private readonly featureFlagModel: Model<FeatureFlagDocument>,
  ) {}

  findAll() {
    return this.featureFlagModel.find().sort({ key: 1 }).exec();
  }

  findByKey(key: string) {
    return this.featureFlagModel.findOne({ key }).exec();
  }

  async isEnabled(key: string): Promise<boolean> {
    const flag = await this.findByKey(key);
    return flag?.enabled ?? false;
  }

  updateByKey(
    key: string,
    input: { enabled: boolean; updatedByAdminId: string | Types.ObjectId },
  ) {
    return this.featureFlagModel
      .findOneAndUpdate(
        { key },
        {
          $set: {
            enabled: input.enabled,
            updatedByAdminId: this.toObjectId(input.updatedByAdminId),
          },
        },
        { new: true },
      )
      .exec();
  }

  async ensureInitialFlags() {
    await Promise.all(
      initialFeatureFlags.map((flag) =>
        this.featureFlagModel.updateOne(
          { key: flag.key },
          { $setOnInsert: flag },
          { upsert: true },
        ).exec(),
      ),
    );
  }

  private toObjectId(value: string | Types.ObjectId): Types.ObjectId {
    return typeof value === 'string' ? new Types.ObjectId(value) : value;
  }
}
