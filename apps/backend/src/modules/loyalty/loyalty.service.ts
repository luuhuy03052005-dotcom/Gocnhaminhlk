import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PointAccount, PointAccountDocument } from './schemas/point-account.schema';
import {
  PointTransaction,
  PointTransactionDocument,
} from './schemas/point-transaction.schema';

@Injectable()
export class LoyaltyService {
  constructor(
    @InjectModel(PointAccount.name)
    private readonly pointAccountModel: Model<PointAccountDocument>,
    @InjectModel(PointTransaction.name)
    private readonly pointTransactionModel: Model<PointTransactionDocument>,
  ) {}

  async getPointSummary(userId: string | Types.ObjectId) {
    const userObjectId = this.toObjectId(userId);
    const [account, transactions] = await Promise.all([
      this.pointAccountModel.findOne({ userId: userObjectId }).exec(),
      this.pointTransactionModel
        .find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(20)
        .exec(),
    ]);

    return {
      balance: account?.balance ?? 0,
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        type: transaction.type,
        points: transaction.points,
        reason: transaction.reason,
        createdAt: transaction.createdAt,
      })),
    };
  }

  private toObjectId(value: string | Types.ObjectId): Types.ObjectId {
    return typeof value === 'string' ? new Types.ObjectId(value) : value;
  }
}
