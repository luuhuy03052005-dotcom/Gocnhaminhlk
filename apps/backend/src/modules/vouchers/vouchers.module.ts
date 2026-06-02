import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserVoucher, UserVoucherSchema } from './schemas/user-voucher.schema';
import { Voucher, VoucherSchema } from './schemas/voucher.schema';
import { VouchersService } from './vouchers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Voucher.name, schema: VoucherSchema },
      { name: UserVoucher.name, schema: UserVoucherSchema },
    ]),
  ],
  providers: [VouchersService],
  exports: [VouchersService],
})
export class VouchersModule {}
