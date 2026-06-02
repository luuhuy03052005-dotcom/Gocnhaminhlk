import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FeatureFlagsModule } from '../feature-flags/feature-flags.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { VouchersModule } from '../vouchers/vouchers.module';
import { CustomerController } from './customer.controller';

@Module({
  imports: [
    AuthModule,
    FeatureFlagsModule,
    LoyaltyModule,
    NotificationsModule,
    OrdersModule,
    UsersModule,
    VouchersModule,
  ],
  controllers: [CustomerController],
})
export class CustomerModule {}
