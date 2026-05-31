# 04 — MongoDB Database Contract

MongoDB stores business data only.

Files are stored in Cloudinary. MongoDB stores URLs and metadata.

## Collections

| Collection | Purpose |
|---|---|
| users | Customer accounts |
| admins | Admin accounts |
| roles | Admin roles |
| permissions | Permission list |
| role_permissions | Role-permission assignments |
| menu_categories | Menu categories |
| menu_items | Menu items |
| vouchers | Voucher master data |
| user_vouchers | Voucher assignment to users |
| discount_codes | Discount codes |
| orders | Orders with embedded order items |
| notifications | In-app notification content |
| user_notifications | Notification read/unread per user |
| banners | Web banner/slider/promo |
| gallery_images | Gallery images |
| website_contents | Dynamic web text/content |
| file_assets | Cloudinary file metadata |
| feature_flags | Feature toggles |
| system_settings | Runtime operational settings |
| point_accounts | Current user points |
| point_transactions | Point history |
| invoices | Uploaded invoice metadata |
| audit_logs | Admin action logs |

## Global Document Rules

Every major document should include:

```ts
createdAt: Date
updatedAt: Date
isDeleted?: boolean
```

Soft delete preferred for important business data.

## users

```ts
{
  _id: ObjectId,
  firebaseUid: string,
  phoneNumber: string,
  fullName?: string,
  avatarUrl?: string,
  status: 'ACTIVE' | 'BLOCKED',
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

```txt
firebaseUid unique
phoneNumber unique
status
```

## admins

```ts
{
  _id: ObjectId,
  firebaseUid: string,
  phoneNumber: string,
  fullName: string,
  roleId: ObjectId,
  status: 'ACTIVE' | 'BLOCKED',
  createdAt: Date,
  updatedAt: Date
}
```

## roles

```ts
{
  _id: ObjectId,
  code: 'STAFF' | 'MANAGER' | 'SUPER_ADMIN' | 'CONTENT_EDITOR' | 'ORDER_MANAGER',
  name: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## permissions

```ts
{
  _id: ObjectId,
  code: string,
  name: string,
  description?: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

Permission code examples:

```txt
menu.read
menu.write
voucher.write
banner.write
gallery.write
website_content.write
orders.read
orders.update
admin.write
audit_log.read
upload.write
system_settings.write
```

## role_permissions

```ts
{
  _id: ObjectId,
  roleId: ObjectId,
  permissionId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## menu_categories

```ts
{
  _id: ObjectId,
  name: string,
  slug: string,
  description?: string,
  displayOrder: number,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## menu_items

```ts
{
  _id: ObjectId,
  categoryId: ObjectId,
  name: string,
  slug: string,
  price: number,
  description?: string,
  imageUrl?: string,
  isAvailable: boolean,
  isBestSeller?: boolean,
  displayOrder: number,
  createdAt: Date,
  updatedAt: Date
}
```

## vouchers

```ts
{
  _id: ObjectId,
  title: string,
  description?: string,
  type: 'PERCENT' | 'FIXED_AMOUNT',
  value: number,
  minOrderAmount?: number,
  maxDiscountAmount?: number,
  startDate: Date,
  endDate: Date,
  quantity?: number,
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'LOCKED',
  createdAt: Date,
  updatedAt: Date
}
```

## user_vouchers

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  voucherId: ObjectId,
  status: 'UNUSED' | 'USED' | 'EXPIRED' | 'LOCKED',
  assignedAt: Date,
  usedAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## orders

Order items should be embedded inside the order.

```ts
{
  _id: ObjectId,
  orderNumber: string,
  userId: ObjectId,
  orderType: 'DINE_IN' | 'TAKE_AWAY' | 'DELIVERY',
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED' | 'REJECTED',
  items: [
    {
      menuItemId: ObjectId,
      name: string,
      price: number,
      quantity: number,
      note?: string
    }
  ],
  subtotal: number,
  discountAmount: number,
  totalAmount: number,
  note?: string,
  createdAt: Date,
  updatedAt: Date
}
```

## notifications

```ts
{
  _id: ObjectId,
  title: string,
  content: string,
  type: 'SYSTEM' | 'PROMOTION' | 'ORDER' | 'VOUCHER',
  targetType: 'ALL' | 'USER' | 'GROUP',
  createdByAdminId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## banners

```ts
{
  _id: ObjectId,
  type: 'promo' | 'menu',
  title: string,
  subtitle?: string,
  description?: string,
  imageUrl: string,
  alt: string,
  ctaLabel?: string,
  ctaLink?: string,
  badge?: string,
  price?: string,
  displayOrder: number,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## gallery_images

```ts
{
  _id: ObjectId,
  title: string,
  subtitle?: string,
  description?: string,
  imageUrl: string,
  alt: string,
  badge?: string,
  ctaLabel?: string,
  ctaLink?: string,
  objectPosition?: string,
  displayOrder: number,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## website_contents

```ts
{
  _id: ObjectId,
  key: string,
  value: object,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## user_notifications

```ts
{
  _id: ObjectId,
  userId: ObjectId,
  notificationId: ObjectId,
  isRead: boolean,
  readAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## file_assets

```ts
{
  _id: ObjectId,
  provider: 'CLOUDINARY',
  publicId: string,
  url: string,
  secureUrl: string,
  folder: string,
  fileName: string,
  mimeType: string,
  size: number,
  uploadedByAdminId?: ObjectId,
  uploadedByUserId?: ObjectId,
  createdAt: Date
}
```

Rules:

```txt
file_assets stores Cloudinary metadata only.
Never store binary files or base64 payloads in MongoDB.
Upload endpoints must require admin/customer authentication before calling Cloudinary.
```

## feature_flags

```ts
{
  _id: ObjectId,
  key: string,
  enabled: boolean,
  description?: string,
  updatedByAdminId?: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## system_settings

```ts
{
  _id: ObjectId,
  key: string,
  value: object,
  description?: string,
  updatedByAdminId?: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

Initial setting:

```json
{
  "key": "commerce",
  "value": {
    "shopOpen": true,
    "allowOrdering": false,
    "allowVoucherClaim": true,
    "deliveryRadiusKm": 5,
    "minimumOrderAmount": 50000
  }
}
```

Required initial flags:

```txt
CUSTOMER_LOGIN=ON
DYNAMIC_MENU=ON
DYNAMIC_BANNER=ON
VOUCHER_WALLET=ON
IN_APP_NOTIFICATION=ON
WEB_ORDERING=OFF
LOYALTY_SYSTEM=OFF
INVOICE_UPLOAD=OFF
PUSH_NOTIFICATION=OFF
ADMIN_AUDIT_LOG=ON
```

## audit_logs

```ts
{
  _id: ObjectId,
  actorAdminId: ObjectId,
  action: string,
  targetType: string,
  targetId?: ObjectId,
  before?: object,
  after?: object,
  ipAddress?: string,
  userAgent?: string,
  createdAt: Date
}
```

## Image Storage Rule

Never store base64 images inside MongoDB.

Correct:

```ts
imageUrl: 'https://res.cloudinary.com/...'
```

Wrong:

```ts
imageBase64: 'data:image/jpeg;base64,...'
```
