import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from './schemas/voucher.schema';
import { VouchersService } from './vouchers.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Voucher.name, schema: VoucherSchema }])],
  providers: [VouchersService],
  exports: [VouchersService],
})
export class VouchersModule {}
