import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './modules/admin/admin.module';
import { AdminsModule } from './modules/admins/admins.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { AuthModule } from './modules/auth/auth.module';
import { CmsModule } from './modules/cms/cms.module';
import { CustomerModule } from './modules/customer/customer.module';
import { FeatureFlagsModule } from './modules/feature-flags/feature-flags.module';
import { HealthModule } from './modules/health/health.module';
import { LoyaltyModule } from './modules/loyalty/loyalty.module';
import { MenuModule } from './modules/menu/menu.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PublicModule } from './modules/public/public.module';
import { RolesModule } from './modules/roles/roles.module';
import { SystemSettingsModule } from './modules/system-settings/system-settings.module';
import { UploadModule } from './modules/upload/upload.module';
import { UsersModule } from './modules/users/users.module';
import { VouchersModule } from './modules/vouchers/vouchers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGODB_URI')?.trim();
        return {
          uri: mongoUri || 'mongodb://127.0.0.1:27017/goc-nha-minh-dev',
          autoIndex: configService.get<string>('NODE_ENV') !== 'production',
          lazyConnection: !mongoUri,
          retryAttempts: mongoUri ? 3 : 0,
          retryDelay: 1000,
          serverSelectionTimeoutMS: 5000,
        };
      },
    }),
    HealthModule,
    PublicModule,
    CustomerModule,
    AdminModule,
    AuthModule,
    UsersModule,
    AdminsModule,
    RolesModule,
    MenuModule,
    VouchersModule,
    OrdersModule,
    CmsModule,
    NotificationsModule,
    FeatureFlagsModule,
    SystemSettingsModule,
    UploadModule,
    LoyaltyModule,
    AuditLogsModule,
  ],
})
export class AppModule {}
