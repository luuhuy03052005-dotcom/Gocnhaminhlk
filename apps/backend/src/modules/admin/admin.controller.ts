import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/decorators/audit-action.decorator';
import {
  AuditLogInterceptor,
  AuditRequestContext,
} from '../audit-logs/interceptors/audit-log.interceptor';
import { CurrentAdmin } from '../auth/auth.service';
import {
  AdminRequest,
  CurrentAdminUser,
} from '../auth/decorators/current-admin.decorator';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { CmsService } from '../cms/cms.service';
import { MenuService } from '../menu/menu.service';
import { NotificationsService } from '../notifications/notifications.service';
import { OrdersService } from '../orders/orders.service';
import { SystemSettingsService } from '../system-settings/system-settings.service';
import { maxUploadSizeBytes, UploadService } from '../upload/upload.service';
import { UsersService } from '../users/users.service';
import { VouchersService } from '../vouchers/vouchers.service';
import {
  CreateBannerDto,
  CreateGalleryImageDto,
  CreateMenuCategoryDto,
  CreateMenuItemDto,
  CreateVoucherDto,
  UpdateBannerDto,
  UpdateGalleryImageDto,
  UpdateMenuCategoryDto,
  UpdateMenuItemDto,
  UpdateVoucherDto,
  UpdateWebsiteContentDto,
} from './dto/admin-cms.dto';
import {
  CreateNotificationDto,
  UpdateOrderStatusDto,
  UpdateUserStatusDto,
} from './dto/admin-operations.dto';
import { AdminUploadDto } from './dto/admin-upload.dto';
import { ListAuditLogsQueryDto } from './dto/list-audit-logs-query.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';
import { UploadedImageFile } from './interfaces/uploaded-image-file.interface';

@Controller('admin')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class AdminController {
  constructor(
    private readonly auditLogsService: AuditLogsService,
    private readonly cmsService: CmsService,
    private readonly featureFlagsService: FeatureFlagsService,
    private readonly menuService: MenuService,
    private readonly notificationsService: NotificationsService,
    private readonly ordersService: OrdersService,
    private readonly systemSettingsService: SystemSettingsService,
    private readonly uploadService: UploadService,
    private readonly usersService: UsersService,
    private readonly vouchersService: VouchersService,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    const [
      usersTotal,
      usersActive,
      usersBlocked,
      ordersTotal,
      ordersPending,
      ordersCompleted,
      menuCategories,
      menuItems,
      vouchersTotal,
      vouchersActive,
      banners,
      galleryImages,
      websiteContent,
      notifications,
    ] = await Promise.all([
      this.usersService.countAll(),
      this.usersService.countByStatus('ACTIVE'),
      this.usersService.countByStatus('BLOCKED'),
      this.ordersService.countAll(),
      this.ordersService.countByStatus('PENDING'),
      this.ordersService.countByStatus('COMPLETED'),
      this.menuService.countCategories(),
      this.menuService.countItems(),
      this.vouchersService.countAll(),
      this.vouchersService.countActive(),
      this.cmsService.countBanners(),
      this.cmsService.countGalleryImages(),
      this.cmsService.countWebsiteContent(),
      this.notificationsService.countAll(),
    ]);

    return {
      users: {
        total: usersTotal,
        active: usersActive,
        blocked: usersBlocked,
      },
      orders: {
        total: ordersTotal,
        pending: ordersPending,
        completed: ordersCompleted,
      },
      content: {
        menuCategories,
        menuItems,
        vouchersTotal,
        vouchersActive,
        banners,
        galleryImages,
        websiteContent,
        notifications,
      },
    };
  }

  @Get('users')
  @RequirePermissions('user.read')
  async listUsers() {
    const users = await this.usersService.findAll();
    return users.map((user) => this.serializeDocument(user));
  }

  @Patch('users/:id/status')
  @RequirePermissions('user.write')
  @AuditAction({ action: 'user.status.update', targetType: 'user' })
  @UseInterceptors(AuditLogInterceptor)
  async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.usersService.findById(id),
      'USER_NOT_FOUND',
      'User does not exist.',
    );

    const user = await this.usersService.updateStatus(id, dto.status);
    return this.serializeFoundDocument(
      user,
      'USER_NOT_FOUND',
      'User does not exist.',
    );
  }

  @Get('menu/categories')
  @RequirePermissions('menu.read')
  async listMenuCategories() {
    const categories = await this.menuService.findAllCategories();
    return categories.map((category) => this.serializeDocument(category));
  }

  @Post('menu/categories')
  @RequirePermissions('menu.write')
  @AuditAction({ action: 'menu_category.create', targetType: 'menu_category' })
  @UseInterceptors(AuditLogInterceptor)
  async createMenuCategory(@Body() dto: CreateMenuCategoryDto) {
    const category = await this.menuService.createCategory(dto);
    return this.serializeDocument(category);
  }

  @Patch('menu/categories/:id')
  @RequirePermissions('menu.write')
  @AuditAction({ action: 'menu_category.update', targetType: 'menu_category' })
  @UseInterceptors(AuditLogInterceptor)
  async updateMenuCategory(
    @Param('id') id: string,
    @Body() dto: UpdateMenuCategoryDto,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.menuService.findCategoryById(id),
      'MENU_CATEGORY_NOT_FOUND',
      'Menu category does not exist.',
    );

    const category = await this.menuService.updateCategory(id, dto);
    return this.serializeFoundDocument(
      category,
      'MENU_CATEGORY_NOT_FOUND',
      'Menu category does not exist.',
    );
  }

  @Delete('menu/categories/:id')
  @RequirePermissions('menu.write')
  @AuditAction({ action: 'menu_category.delete', targetType: 'menu_category' })
  @UseInterceptors(AuditLogInterceptor)
  async deleteMenuCategory(
    @Param('id') id: string,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.menuService.findCategoryById(id),
      'MENU_CATEGORY_NOT_FOUND',
      'Menu category does not exist.',
    );

    const category = await this.menuService.deactivateCategory(id);
    return this.serializeFoundDocument(
      category,
      'MENU_CATEGORY_NOT_FOUND',
      'Menu category does not exist.',
    );
  }

  @Get('menu/items')
  @RequirePermissions('menu.read')
  async listMenuItems() {
    const items = await this.menuService.findAllItems();
    return items.map((item) => this.serializeDocument(item));
  }

  @Post('menu/items')
  @RequirePermissions('menu.write')
  @AuditAction({ action: 'menu_item.create', targetType: 'menu_item' })
  @UseInterceptors(AuditLogInterceptor)
  async createMenuItem(@Body() dto: CreateMenuItemDto) {
    const item = await this.menuService.createItem(dto);
    return this.serializeDocument(item);
  }

  @Patch('menu/items/:id')
  @RequirePermissions('menu.write')
  @AuditAction({ action: 'menu_item.update', targetType: 'menu_item' })
  @UseInterceptors(AuditLogInterceptor)
  async updateMenuItem(
    @Param('id') id: string,
    @Body() dto: UpdateMenuItemDto,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.menuService.findItemById(id),
      'MENU_ITEM_NOT_FOUND',
      'Menu item does not exist.',
    );

    const item = await this.menuService.updateItem(id, dto);
    return this.serializeFoundDocument(
      item,
      'MENU_ITEM_NOT_FOUND',
      'Menu item does not exist.',
    );
  }

  @Delete('menu/items/:id')
  @RequirePermissions('menu.write')
  @AuditAction({ action: 'menu_item.delete', targetType: 'menu_item' })
  @UseInterceptors(AuditLogInterceptor)
  async deleteMenuItem(
    @Param('id') id: string,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.menuService.findItemById(id),
      'MENU_ITEM_NOT_FOUND',
      'Menu item does not exist.',
    );

    const item = await this.menuService.deactivateItem(id);
    return this.serializeFoundDocument(
      item,
      'MENU_ITEM_NOT_FOUND',
      'Menu item does not exist.',
    );
  }

  @Get('vouchers')
  @RequirePermissions('voucher.read')
  async listVouchers() {
    const vouchers = await this.vouchersService.findAll();
    return vouchers.map((voucher) => this.serializeDocument(voucher));
  }

  @Post('vouchers')
  @RequirePermissions('voucher.write')
  @AuditAction({ action: 'voucher.create', targetType: 'voucher' })
  @UseInterceptors(AuditLogInterceptor)
  async createVoucher(@Body() dto: CreateVoucherDto) {
    const voucher = await this.vouchersService.create(this.toCreateVoucherInput(dto));
    return this.serializeDocument(voucher);
  }

  @Patch('vouchers/:id')
  @RequirePermissions('voucher.write')
  @AuditAction({ action: 'voucher.update', targetType: 'voucher' })
  @UseInterceptors(AuditLogInterceptor)
  async updateVoucher(
    @Param('id') id: string,
    @Body() dto: UpdateVoucherDto,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.vouchersService.findById(id),
      'VOUCHER_NOT_FOUND',
      'Voucher does not exist.',
    );

    const voucher = await this.vouchersService.update(id, this.toUpdateVoucherInput(dto));
    return this.serializeFoundDocument(
      voucher,
      'VOUCHER_NOT_FOUND',
      'Voucher does not exist.',
    );
  }

  @Delete('vouchers/:id')
  @RequirePermissions('voucher.write')
  @AuditAction({ action: 'voucher.delete', targetType: 'voucher' })
  @UseInterceptors(AuditLogInterceptor)
  async deleteVoucher(
    @Param('id') id: string,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.vouchersService.findById(id),
      'VOUCHER_NOT_FOUND',
      'Voucher does not exist.',
    );

    const voucher = await this.vouchersService.lock(id);
    return this.serializeFoundDocument(
      voucher,
      'VOUCHER_NOT_FOUND',
      'Voucher does not exist.',
    );
  }

  @Get('banners')
  @RequirePermissions('banner.read')
  async listBanners() {
    const banners = await this.cmsService.findAllBanners();
    return banners.map((banner) => this.serializeDocument(banner));
  }

  @Post('banners')
  @RequirePermissions('banner.write')
  @AuditAction({ action: 'banner.create', targetType: 'banner' })
  @UseInterceptors(AuditLogInterceptor)
  async createBanner(@Body() dto: CreateBannerDto) {
    const banner = await this.cmsService.createBanner(dto);
    return this.serializeDocument(banner);
  }

  @Patch('banners/:id')
  @RequirePermissions('banner.write')
  @AuditAction({ action: 'banner.update', targetType: 'banner' })
  @UseInterceptors(AuditLogInterceptor)
  async updateBanner(
    @Param('id') id: string,
    @Body() dto: UpdateBannerDto,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.cmsService.findBannerById(id),
      'BANNER_NOT_FOUND',
      'Banner does not exist.',
    );

    const banner = await this.cmsService.updateBanner(id, dto);
    return this.serializeFoundDocument(
      banner,
      'BANNER_NOT_FOUND',
      'Banner does not exist.',
    );
  }

  @Delete('banners/:id')
  @RequirePermissions('banner.write')
  @AuditAction({ action: 'banner.delete', targetType: 'banner' })
  @UseInterceptors(AuditLogInterceptor)
  async deleteBanner(
    @Param('id') id: string,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.cmsService.findBannerById(id),
      'BANNER_NOT_FOUND',
      'Banner does not exist.',
    );

    const banner = await this.cmsService.deactivateBanner(id);
    return this.serializeFoundDocument(
      banner,
      'BANNER_NOT_FOUND',
      'Banner does not exist.',
    );
  }

  @Get('gallery')
  @RequirePermissions('gallery.read')
  async listGallery() {
    const images = await this.cmsService.findAllGalleryImages();
    return images.map((image) => this.serializeDocument(image));
  }

  @Post('gallery')
  @RequirePermissions('gallery.write')
  @AuditAction({ action: 'gallery_image.create', targetType: 'gallery_image' })
  @UseInterceptors(AuditLogInterceptor)
  async createGalleryImage(@Body() dto: CreateGalleryImageDto) {
    const image = await this.cmsService.createGalleryImage(dto);
    return this.serializeDocument(image);
  }

  @Patch('gallery/:id')
  @RequirePermissions('gallery.write')
  @AuditAction({ action: 'gallery_image.update', targetType: 'gallery_image' })
  @UseInterceptors(AuditLogInterceptor)
  async updateGalleryImage(
    @Param('id') id: string,
    @Body() dto: UpdateGalleryImageDto,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.cmsService.findGalleryImageById(id),
      'GALLERY_IMAGE_NOT_FOUND',
      'Gallery image does not exist.',
    );

    const image = await this.cmsService.updateGalleryImage(id, dto);
    return this.serializeFoundDocument(
      image,
      'GALLERY_IMAGE_NOT_FOUND',
      'Gallery image does not exist.',
    );
  }

  @Delete('gallery/:id')
  @RequirePermissions('gallery.write')
  @AuditAction({ action: 'gallery_image.delete', targetType: 'gallery_image' })
  @UseInterceptors(AuditLogInterceptor)
  async deleteGalleryImage(
    @Param('id') id: string,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.cmsService.findGalleryImageById(id),
      'GALLERY_IMAGE_NOT_FOUND',
      'Gallery image does not exist.',
    );

    const image = await this.cmsService.deactivateGalleryImage(id);
    return this.serializeFoundDocument(
      image,
      'GALLERY_IMAGE_NOT_FOUND',
      'Gallery image does not exist.',
    );
  }

  @Get('website-content')
  @RequirePermissions('website_content.read')
  async listWebsiteContent() {
    const content = await this.cmsService.findAllWebsiteContent();
    return content.map((item) => this.serializeDocument(item));
  }

  @Patch('website-content/:key')
  @RequirePermissions('website_content.write')
  @AuditAction({ action: 'website_content.update', targetType: 'website_content' })
  @UseInterceptors(AuditLogInterceptor)
  async updateWebsiteContent(
    @Param('key') key: string,
    @Body() dto: UpdateWebsiteContentDto,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.cmsService.findWebsiteContentByKey(key),
      'WEBSITE_CONTENT_NOT_FOUND',
      'Website content does not exist.',
    );

    const content = await this.cmsService.updateWebsiteContent(key, dto);
    return this.serializeFoundDocument(
      content,
      'WEBSITE_CONTENT_NOT_FOUND',
      'Website content does not exist.',
    );
  }

  @Get('feature-flags')
  @RequirePermissions('feature_flag.read')
  async listFeatureFlags() {
    const flags = await this.featureFlagsService.findAll();
    return flags.map((flag) => this.serializeDocument(flag));
  }

  @Patch('feature-flags/:key')
  @RequirePermissions('feature_flag.write')
  @AuditAction({ action: 'feature_flag.update', targetType: 'feature_flag' })
  @UseInterceptors(AuditLogInterceptor)
  async updateFeatureFlag(
    @Param('key') key: string,
    @Body() dto: UpdateFeatureFlagDto,
    @CurrentAdminUser() admin: CurrentAdmin,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    const before = await this.featureFlagsService.findByKey(key);
    if (!before) {
      throw new NotFoundException({
        error: 'FEATURE_FLAG_NOT_FOUND',
        message: 'Feature flag does not exist.',
      });
    }

    const serializedBefore = this.serializeDocument(before);
    request.auditBefore = serializedBefore;
    request.auditTargetId = String(serializedBefore.id);

    const flag = await this.featureFlagsService.updateByKey(key, {
      enabled: dto.enabled,
      updatedByAdminId: admin.id,
    });

    if (!flag) {
      throw new NotFoundException({
        error: 'FEATURE_FLAG_NOT_FOUND',
        message: 'Feature flag does not exist.',
      });
    }

    return this.serializeDocument(flag);
  }

  @Get('system-settings')
  @RequirePermissions('system_settings.read')
  async listSystemSettings() {
    const settings = await this.systemSettingsService.findAll();
    return settings.map((setting) => this.serializeDocument(setting));
  }

  @Patch('system-settings/:key')
  @RequirePermissions('system_settings.write')
  @AuditAction({ action: 'system_setting.update', targetType: 'system_setting' })
  @UseInterceptors(AuditLogInterceptor)
  async updateSystemSetting(
    @Param('key') key: string,
    @Body() dto: UpdateSystemSettingDto,
    @CurrentAdminUser() admin: CurrentAdmin,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    const before = await this.systemSettingsService.findByKey(key);
    if (!before) {
      throw new NotFoundException({
        error: 'SYSTEM_SETTING_NOT_FOUND',
        message: 'System setting does not exist.',
      });
    }

    const serializedBefore = this.serializeDocument(before);
    request.auditBefore = serializedBefore;
    request.auditTargetId = String(serializedBefore.id);

    const setting = await this.systemSettingsService.updateByKey(key, {
      value: dto.value,
      description: dto.description,
      updatedByAdminId: admin.id,
    });

    if (!setting) {
      throw new NotFoundException({
        error: 'SYSTEM_SETTING_NOT_FOUND',
        message: 'System setting does not exist.',
      });
    }

    return this.serializeDocument(setting);
  }

  @Post('upload')
  @RequirePermissions('upload.write')
  @AuditAction({ action: 'file.upload', targetType: 'file_asset' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: maxUploadSizeBytes },
    }),
    AuditLogInterceptor,
  )
  async uploadImage(
    @Body() dto: AdminUploadDto,
    @UploadedFile() file: UploadedImageFile | undefined,
    @CurrentAdminUser() admin: CurrentAdmin,
  ) {
    if (!file) {
      throw new BadRequestException({
        error: 'UPLOAD_FILE_REQUIRED',
        message: 'Upload file is required.',
      });
    }

    const asset = await this.uploadService.uploadBuffer({
      buffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      folder: dto.folder,
      uploadedByAdminId: admin.id,
    });

    return this.serializeDocument(asset);
  }

  @Get('orders')
  @RequirePermissions('orders.read')
  async listOrders() {
    const orders = await this.ordersService.findAll();
    return orders.map((order) => this.serializeDocument(order));
  }

  @Patch('orders/:id/status')
  @RequirePermissions('orders.update')
  @AuditAction({ action: 'order.status.update', targetType: 'order' })
  @UseInterceptors(AuditLogInterceptor)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Req() request: AdminRequest & AuditRequestContext,
  ) {
    await this.captureAuditBefore(
      request,
      this.ordersService.findById(id),
      'ORDER_NOT_FOUND',
      'Order does not exist.',
    );

    const order = await this.ordersService.updateStatus(id, dto.status);
    return this.serializeFoundDocument(
      order,
      'ORDER_NOT_FOUND',
      'Order does not exist.',
    );
  }

  @Get('notifications')
  @RequirePermissions('notification.read')
  async listNotifications() {
    const notifications = await this.notificationsService.findAll();
    return notifications.map((notification) => this.serializeDocument(notification));
  }

  @Post('notifications')
  @RequirePermissions('notification.write')
  @AuditAction({ action: 'notification.create', targetType: 'notification' })
  @UseInterceptors(AuditLogInterceptor)
  async createNotification(
    @Body() dto: CreateNotificationDto,
    @CurrentAdminUser() admin: CurrentAdmin,
  ) {
    this.validateNotificationTarget(dto);

    const notification = await this.notificationsService.create({
      title: dto.title,
      content: dto.content,
      type: dto.type,
      targetType: dto.targetType,
      targetUserIds: dto.targetUserIds,
      createdByAdminId: admin.id,
    });

    return this.serializeDocument(notification);
  }

  @Get('audit-logs')
  @RequirePermissions('audit_log.read')
  async listAuditLogs(@Query() query: ListAuditLogsQueryDto) {
    const logs = await this.auditLogsService.findLatest(query.limit);
    return logs.map((log) => this.serializeDocument(log));
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
      ...this.stringifyObjectIds(rest),
    };
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

  private async captureAuditBefore(
    request: AdminRequest & AuditRequestContext,
    documentPromise: Promise<unknown>,
    error: string,
    message: string,
  ) {
    const before = await documentPromise;
    const serializedBefore = this.serializeFoundDocument(before, error, message);
    request.auditBefore = serializedBefore;
    request.auditTargetId = String(serializedBefore.id);
  }

  private toCreateVoucherInput(dto: CreateVoucherDto) {
    return {
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    };
  }

  private toUpdateVoucherInput(dto: UpdateVoucherDto) {
    return {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    };
  }

  private validateNotificationTarget(dto: CreateNotificationDto) {
    if (dto.targetType === 'USER' && (!dto.targetUserIds || dto.targetUserIds.length === 0)) {
      throw new BadRequestException({
        error: 'NOTIFICATION_TARGET_USERS_REQUIRED',
        message: 'targetUserIds is required when targetType is USER.',
      });
    }
  }

  private stringifyObjectIds(value: Record<string, unknown>): Record<string, unknown> {
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

    return this.stringifyObjectIds(value as Record<string, unknown>);
  }
}
