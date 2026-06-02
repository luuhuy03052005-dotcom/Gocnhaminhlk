import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoyaltyService } from './loyalty.service';
import { PointAccount, PointAccountSchema } from './schemas/point-account.schema';
import {
  PointTransaction,
  PointTransactionSchema,
} from './schemas/point-transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PointAccount.name, schema: PointAccountSchema },
      { name: PointTransaction.name, schema: PointTransactionSchema },
    ]),
  ],
  providers: [LoyaltyService],
  exports: [LoyaltyService],
})
export class LoyaltyModule {}
