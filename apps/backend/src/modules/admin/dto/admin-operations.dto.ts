import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatus } from '../../orders/schemas/order.schema';
import {
  NotificationTargetType,
  NotificationType,
} from '../../notifications/schemas/notification.schema';
import { UserStatus } from '../../users/schemas/user.schema';

export class UpdateUserStatusDto {
  @IsIn(['ACTIVE', 'BLOCKED'])
  status: UserStatus;
}

export class UpdateOrderStatusDto {
  @IsIn([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'COMPLETED',
    'CANCELLED',
    'REJECTED',
  ])
  status: OrderStatus;
}

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsIn(['SYSTEM', 'PROMOTION', 'ORDER', 'VOUCHER'])
  type: NotificationType;

  @IsIn(['ALL', 'USER', 'GROUP'])
  targetType: NotificationTargetType;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Type(() => String)
  targetUserIds?: string[];
}
