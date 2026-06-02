import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { UsersService } from '../users/users.service';
import {
  Notification,
  NotificationDocument,
  NotificationTargetType,
  NotificationType,
} from './schemas/notification.schema';
import {
  UserNotification,
  UserNotificationDocument,
} from './schemas/user-notification.schema';

export interface CreateNotificationInput {
  title: string;
  content: string;
  type: NotificationType;
  targetType: NotificationTargetType;
  createdByAdminId: string | Types.ObjectId;
  targetUserIds?: Array<string | Types.ObjectId>;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(UserNotification.name)
    private readonly userNotificationModel: Model<UserNotificationDocument>,
    private readonly featureFlagsService: FeatureFlagsService,
    private readonly usersService: UsersService,
  ) {}

  findAll() {
    return this.notificationModel.find().sort({ createdAt: -1 }).exec();
  }

  countAll() {
    return this.notificationModel.countDocuments().exec();
  }

  async create(input: CreateNotificationInput) {
    const isEnabled = await this.featureFlagsService.isEnabled('IN_APP_NOTIFICATION');
    if (!isEnabled) {
      throw new ForbiddenException({
        error: 'FEATURE_DISABLED',
        message: 'In-app notification feature is disabled.',
        details: {
          featureFlag: 'IN_APP_NOTIFICATION',
        },
      });
    }

    const notification = await this.notificationModel.create({
      title: input.title,
      content: input.content,
      type: input.type,
      targetType: input.targetType,
      createdByAdminId: this.toObjectId(input.createdByAdminId),
    });

    const targetUserIds = await this.resolveTargetUserIds(input);
    if (targetUserIds.length > 0) {
      await this.userNotificationModel.bulkWrite(
        targetUserIds.map((userId) => ({
          updateOne: {
            filter: {
              userId,
              notificationId: notification._id,
            },
            update: {
              $setOnInsert: {
                userId,
                notificationId: notification._id,
                isRead: false,
              },
            },
            upsert: true,
          },
        })),
      );
    }

    return notification;
  }

  async findForUser(userId: string | Types.ObjectId) {
    const userNotifications = await this.userNotificationModel
      .find({ userId: this.toObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
    const notificationIds = userNotifications.map((item) => item.notificationId);
    const notifications = await this.notificationModel
      .find({ _id: { $in: notificationIds } })
      .exec();

    return userNotifications.map((userNotification) => {
      const notification = notifications.find(
        (item) => item.id === userNotification.notificationId.toString(),
      );

      return {
        id: userNotification.id,
        notificationId: userNotification.notificationId.toString(),
        isRead: userNotification.isRead,
        readAt: userNotification.readAt,
        createdAt: userNotification.createdAt,
        notification: notification
          ? {
              id: notification.id,
              title: notification.title,
              content: notification.content,
              type: notification.type,
              targetType: notification.targetType,
              createdAt: notification.createdAt,
            }
          : undefined,
      };
    });
  }

  markUserNotificationRead(id: string, userId: string | Types.ObjectId) {
    return this.userNotificationModel
      .findOneAndUpdate(
        {
          _id: id,
          userId: this.toObjectId(userId),
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        },
        { new: true },
      )
      .exec();
  }

  private async resolveTargetUserIds(
    input: CreateNotificationInput,
  ): Promise<Types.ObjectId[]> {
    if (input.targetType === 'ALL') {
      const users = await this.usersService.findActiveUserIds();
      return users.map((user) => user._id as Types.ObjectId);
    }

    if (input.targetType === 'USER') {
      return (input.targetUserIds ?? []).map((id) => this.toObjectId(id));
    }

    return [];
  }

  private toObjectId(value: string | Types.ObjectId): Types.ObjectId {
    return typeof value === 'string' ? new Types.ObjectId(value) : value;
  }
}
