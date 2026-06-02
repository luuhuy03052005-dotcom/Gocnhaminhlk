import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { CurrentCustomer } from '../auth/auth.service';
import { CurrentCustomerUser } from '../auth/decorators/current-customer.decorator';
import { CustomerAuthGuard } from '../auth/guards/customer-auth.guard';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { NotificationsService } from '../notifications/notifications.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { VouchersService } from '../vouchers/vouchers.service';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';

@Controller('customer')
@UseGuards(CustomerAuthGuard)
export class CustomerController {
  constructor(
    private readonly featureFlagsService: FeatureFlagsService,
    private readonly loyaltyService: LoyaltyService,
    private readonly notificationsService: NotificationsService,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
    private readonly vouchersService: VouchersService,
  ) {}

  @Get('profile')
  getProfile(@CurrentCustomerUser() customer: CurrentCustomer) {
    return this.serializePlain(customer as unknown as Record<string, unknown>);
  }

  @Patch('profile')
  async updateProfile(
    @Body() dto: UpdateCustomerProfileDto,
    @CurrentCustomerUser() customer: CurrentCustomer,
  ) {
    const user = await this.usersService.updateProfile(customer.id, dto);
    return this.serializeFoundDocument(
      user,
      'USER_NOT_FOUND',
      'Customer account does not exist.',
    );
  }

  @Get('vouchers')
  async listVouchers(@CurrentCustomerUser() customer: CurrentCustomer) {
    await this.assertFeatureEnabled('VOUCHER_WALLET', 'Voucher wallet is disabled.');

    const vouchers = await this.vouchersService.findWalletByUserId(customer.id);
    return vouchers.map((voucher) => this.serializePlain(voucher));
  }

  @Get('notifications')
  async listNotifications(@CurrentCustomerUser() customer: CurrentCustomer) {
    await this.assertFeatureEnabled(
      'IN_APP_NOTIFICATION',
      'In-app notification is disabled.',
    );

    const notifications = await this.notificationsService.findForUser(customer.id);
    return notifications.map((notification) => this.serializePlain(notification));
  }

  @Patch('notifications/:id/read')
  async markNotificationRead(
    @Param('id') id: string,
    @CurrentCustomerUser() customer: CurrentCustomer,
  ) {
    await this.assertFeatureEnabled(
      'IN_APP_NOTIFICATION',
      'In-app notification is disabled.',
    );

    const notification = await this.notificationsService.markUserNotificationRead(
      id,
      customer.id,
    );
    return this.serializeFoundDocument(
      notification,
      'USER_NOTIFICATION_NOT_FOUND',
      'Notification does not exist for this customer.',
    );
  }

  @Get('points')
  async getPoints(@CurrentCustomerUser() customer: CurrentCustomer) {
    await this.assertFeatureEnabled('LOYALTY_SYSTEM', 'Loyalty system is disabled.');

    return this.serializePlain(await this.loyaltyService.getPointSummary(customer.id));
  }

  @Get('orders')
  async listOrders(@CurrentCustomerUser() customer: CurrentCustomer) {
    await this.assertFeatureEnabled('WEB_ORDERING', 'Web ordering is disabled.');

    const orders = await this.ordersService.findByUserId(customer.id);
    return orders.map((order) => this.serializeDocument(order));
  }

  @Get('orders/:id')
  async getOrder(
    @Param('id') id: string,
    @CurrentCustomerUser() customer: CurrentCustomer,
  ) {
    await this.assertFeatureEnabled('WEB_ORDERING', 'Web ordering is disabled.');

    const order = await this.ordersService.findByIdForUser(id, customer.id);
    return this.serializeFoundDocument(
      order,
      'ORDER_NOT_FOUND',
      'Order does not exist for this customer.',
    );
  }

  @Post('orders')
  async createOrder() {
    await this.assertFeatureEnabled('WEB_ORDERING', 'Web ordering is disabled.');

    throw new ServiceUnavailableException({
      error: 'ORDERING_NOT_IMPLEMENTED',
      message: 'Customer ordering is not implemented in this phase.',
    });
  }

  @Post('invoices')
  async uploadInvoice() {
    await this.assertFeatureEnabled('INVOICE_UPLOAD', 'Invoice upload is disabled.');

    throw new ServiceUnavailableException({
      error: 'INVOICE_UPLOAD_NOT_IMPLEMENTED',
      message: 'Invoice upload is not implemented in this phase.',
    });
  }

  private async assertFeatureEnabled(key: string, message: string) {
    const isEnabled = await this.featureFlagsService.isEnabled(key);
    if (!isEnabled) {
      throw new ForbiddenException({
        error: 'FEATURE_DISABLED',
        message,
        details: {
          featureFlag: key,
        },
      });
    }
  }

  private serializeFoundDocument(
    document: unknown,
    error: string,
    message: string,
  ): Record<string, unknown> {
    if (!document) {
      throw new NotFoundException({ error, message });
    }

    return this.serializeDocument(document);
  }

  private serializeDocument(document: unknown): Record<string, unknown> {
    const maybeDocument = document as {
      id?: string;
      toObject?: (options?: { virtuals?: boolean }) => Record<string, unknown>;
    };
    const plain =
      typeof maybeDocument.toObject === 'function'
        ? maybeDocument.toObject({ virtuals: true })
        : (document as Record<string, unknown>);
    const id =
      typeof maybeDocument.id === 'string'
        ? maybeDocument.id
        : this.stringifyValue(plain._id);
    const { _id, __v, id: _plainId, ...rest } = plain;

    return {
      id,
      ...this.stringifyObjectValues(rest),
    };
  }

  private serializePlain(value: Record<string, unknown>): Record<string, unknown> {
    return this.stringifyObjectValues(value);
  }

  private stringifyObjectValues(value: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, this.stringifyValue(item)]),
    );
  }

  private stringifyValue(value: unknown): unknown {
    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.stringifyValue(item));
    }

    if (!value || typeof value !== 'object') {
      return value;
    }

    if (
      'toHexString' in value &&
      typeof (value as { toHexString: () => string }).toHexString === 'function'
    ) {
      return (value as { toHexString: () => string }).toHexString();
    }

    return this.stringifyObjectValues(value as Record<string, unknown>);
  }
}
