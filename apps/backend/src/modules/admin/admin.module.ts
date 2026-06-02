import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AuthModule } from '../auth/auth.module';
import { CmsModule } from '../cms/cms.module';
import { FeatureFlagsModule } from '../feature-flags/feature-flags.module';
import { MenuModule } from '../menu/menu.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { OrdersModule } from '../orders/orders.module';
import { SystemSettingsModule } from '../system-settings/system-settings.module';
import { UploadModule } from '../upload/upload.module';
import { UsersModule } from '../users/users.module';
import { VouchersModule } from '../vouchers/vouchers.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    AuthModule,
    AuditLogsModule,
    CmsModule,
    FeatureFlagsModule,
    MenuModule,
    NotificationsModule,
    OrdersModule,
    SystemSettingsModule,
    UploadModule,
    UsersModule,
    VouchersModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
