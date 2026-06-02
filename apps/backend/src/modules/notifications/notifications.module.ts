import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeatureFlagsModule } from '../feature-flags/feature-flags.module';
import { UsersModule } from '../users/users.module';
import { NotificationsService } from './notifications.service';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import {
  UserNotification,
  UserNotificationSchema,
} from './schemas/user-notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: UserNotification.name, schema: UserNotificationSchema },
    ]),
    FeatureFlagsModule,
    UsersModule,
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
