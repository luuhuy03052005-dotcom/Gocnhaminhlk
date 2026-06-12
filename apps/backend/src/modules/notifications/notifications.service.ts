import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
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

    const targetUserIds = await this.resolveTargetUserIds(input);
    const notification = await this.notificationModel.create({
      title: input.title,
      content: input.content,
      type: input.type,
      targetType: input.targetType,
      createdByAdminId: this.toObjectId(input.createdByAdminId),
    });

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
      const targetUserIds = input.targetUserIds ?? [];
      if (targetUserIds.length === 0) {
        throw new BadRequestException({
          error: 'NOTIFICATION_TARGET_USERS_REQUIRED',
          message: 'targetUserIds is required when targetType is USER.',
        });
      }

      return this.uniqueObjectIds(targetUserIds.map((id) => this.toObjectId(id)));
    }

    throw new BadRequestException({
      error: 'NOTIFICATION_GROUP_TARGET_NOT_CONFIGURED',
      message: 'targetType GROUP is reserved until user groups are implemented.',
    });
  }

  private toObjectId(value: string | Types.ObjectId): Types.ObjectId {
    if (typeof value !== 'string') {
      return value;
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException({
        error: 'INVALID_MONGO_ID',
        message: 'Invalid MongoDB object id.',
        details: {
          value,
        },
      });
    }

    return new Types.ObjectId(value);
  }

  private uniqueObjectIds(values: Types.ObjectId[]): Types.ObjectId[] {
    return Array.from(
      new Map(values.map((value) => [value.toHexString(), value])).values(),
    );
  }
}
