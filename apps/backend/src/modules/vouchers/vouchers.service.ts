import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserVoucher, UserVoucherDocument } from './schemas/user-voucher.schema';
import { Voucher, VoucherDocument } from './schemas/voucher.schema';

export interface PublicVoucher {
  id: string;
  title: string;
  description?: string;
  type: string;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface UpsertVoucherInput {
  title?: string;
  description?: string;
  type?: 'PERCENT' | 'FIXED_AMOUNT';
  value?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: Date;
  endDate?: Date;
  quantity?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'LOCKED';
}

@Injectable()
export class VouchersService {
  constructor(
    @InjectModel(Voucher.name)
    private readonly voucherModel: Model<VoucherDocument>,
    @InjectModel(UserVoucher.name)
    private readonly userVoucherModel: Model<UserVoucherDocument>,
  ) {}

  async getPublicVouchers(): Promise<PublicVoucher[]> {
    const now = new Date();
    const vouchers = await this.voucherModel
      .find({
        status: 'ACTIVE',
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .sort({ endDate: 1, createdAt: -1 })
      .exec();

    return vouchers.map((voucher) => ({
      id: voucher.id,
      title: voucher.title,
      description: voucher.description,
      type: voucher.type,
      value: voucher.value,
      minOrderAmount: voucher.minOrderAmount,
      maxDiscountAmount: voucher.maxDiscountAmount,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      status: voucher.status,
    }));
  }

  findAll() {
    return this.voucherModel.find().sort({ endDate: 1, createdAt: -1 }).exec();
  }

  countAll() {
    return this.voucherModel.countDocuments().exec();
  }

  countActive() {
    const now = new Date();
    return this.voucherModel
      .countDocuments({
        status: 'ACTIVE',
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .exec();
  }

  findById(id: string) {
    return this.voucherModel.findById(id).exec();
  }

  async findWalletByUserId(userId: string | Types.ObjectId) {
    const assignments = await this.userVoucherModel
      .find({ userId: this.toObjectId(userId) })
      .sort({ assignedAt: -1 })
      .exec();
    const voucherIds = assignments.map((assignment) => assignment.voucherId);
    const vouchers = await this.voucherModel
      .find({ _id: { $in: voucherIds } })
      .exec();

    return assignments.map((assignment) => {
      const voucher = vouchers.find(
        (item) => item.id === assignment.voucherId.toString(),
      );

      return {
        id: assignment.id,
        userId: assignment.userId.toString(),
        voucherId: assignment.voucherId.toString(),
        status: assignment.status,
        assignedAt: assignment.assignedAt,
        usedAt: assignment.usedAt,
        voucher: voucher
          ? {
              id: voucher.id,
              title: voucher.title,
              description: voucher.description,
              type: voucher.type,
              value: voucher.value,
              minOrderAmount: voucher.minOrderAmount,
              maxDiscountAmount: voucher.maxDiscountAmount,
              startDate: voucher.startDate,
              endDate: voucher.endDate,
              status: voucher.status,
            }
          : undefined,
      };
    });
  }

  create(input: Required<Pick<UpsertVoucherInput, 'title' | 'type' | 'value' | 'startDate' | 'endDate'>> & UpsertVoucherInput) {
    return this.voucherModel.create(input);
  }

  update(id: string, input: UpsertVoucherInput) {
    return this.voucherModel
      .findByIdAndUpdate(id, { $set: this.compact(input) }, { new: true })
      .exec();
  }

  lock(id: string) {
    return this.update(id, { status: 'LOCKED' });
  }

  private compact<T extends object>(value: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).filter(
        ([, item]) => item !== undefined,
      ),
    ) as Partial<T>;
  }

  private toObjectId(value: string | Types.ObjectId): Types.ObjectId {
    return typeof value === 'string' ? new Types.ObjectId(value) : value;
  }
}
