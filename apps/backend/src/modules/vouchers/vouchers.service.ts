import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

@Injectable()
export class VouchersService {
  constructor(
    @InjectModel(Voucher.name)
    private readonly voucherModel: Model<VoucherDocument>,
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
}

