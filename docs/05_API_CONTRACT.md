# 05 — API Contract

Backend base URL:

```txt
Local: http://localhost:3000/api/v1
Production: https://<render-service>.onrender.com/api/v1
```

## Common Response Format

Success:

```json
{
  "success": true,
  "data": {},
  "message": "OK"
}
```

List:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {}
  }
}
```

Invalid MongoDB ObjectId path parameters must return `INVALID_MONGO_ID`.

## Authentication Header

```txt
Authorization: Bearer <Firebase ID Token>
```

Backend must verify the Firebase token.

## Health

```txt
GET /health
GET /health/db
GET /health/storage
GET /health/auth
```

## Auth API

```txt
POST /auth/session
GET /auth/me
```

### POST /auth/session

Request:

```json
{
  "firebaseIdToken": "string",
  "clientType": "WEB_CUSTOMER | ADMIN_APP"
}
```

Response:

```json
{
  "id": "string",
  "firebaseUid": "string",
  "phoneNumber": "string",
  "fullName": "string",
  "role": "CUSTOMER | STAFF | MANAGER | SUPER_ADMIN | CONTENT_EDITOR | ORDER_MANAGER"
}
```

## Public Web APIs

```txt
GET /public/menu
GET /public/banners
GET /public/gallery
GET /public/vouchers
GET /public/website-content
```

### GET /public/menu

Response data:

```json
[
  {
    "id": "string",
    "name": "string",
    "items": [
      {
        "name": "string",
        "price": "string",
        "desc": "string",
        "isBestSeller": true
      }
    ]
  }
]
```

### GET /public/banners

Response data:

```json
[
  {
    "id": "string",
    "type": "promo | menu",
    "title": "string",
    "image": "string",
    "alt": "string",
    "subtitle": "string",
    "description": "string",
    "ctaLabel": "string",
    "ctaLink": "string",
    "badge": "string",
    "price": "string"
  }
]
```

### GET /public/gallery

Response data:

```json
[
  {
    "id": "string",
    "title": "string",
    "image": "string",
    "alt": "string",
    "subtitle": "string",
    "description": "string",
    "badge": "string",
    "ctaLabel": "string",
    "ctaLink": "string",
    "objectPosition": "string"
  }
]
```

### GET /public/vouchers

Response data:

```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "type": "PERCENT | FIXED_AMOUNT",
    "value": 10,
    "minOrderAmount": 50000,
    "maxDiscountAmount": 20000,
    "startDate": "ISO_DATE",
    "endDate": "ISO_DATE",
    "status": "ACTIVE"
  }
]
```

### GET /public/website-content

Response data:

```json
{
  "key": {}
}
```

## Customer APIs

```txt
GET /customer/profile
PATCH /customer/profile
GET /customer/vouchers
GET /customer/notifications
PATCH /customer/notifications/:id/read
GET /customer/points
POST /customer/orders
GET /customer/orders
GET /customer/orders/:id
POST /customer/invoices
```

Invoice upload endpoints may exist but must respect `INVOICE_UPLOAD` feature flag.

All customer APIs require:

```txt
Authorization: Bearer <Firebase ID Token>
```

Customer feature flag rules:

| Endpoint | Feature flag |
|---|---|
| GET /customer/profile | CUSTOMER_LOGIN |
| PATCH /customer/profile | CUSTOMER_LOGIN |
| GET /customer/vouchers | VOUCHER_WALLET |
| GET /customer/notifications | IN_APP_NOTIFICATION |
| PATCH /customer/notifications/:id/read | IN_APP_NOTIFICATION |
| GET /customer/points | LOYALTY_SYSTEM |
| GET /customer/orders | WEB_ORDERING |
| GET /customer/orders/:id | WEB_ORDERING |
| POST /customer/orders | WEB_ORDERING |
| POST /customer/invoices | INVOICE_UPLOAD |

### PATCH /customer/profile

Request:

```json
{
  "fullName": "string",
  "avatarUrl": "string"
}
```

Response data:

```json
{
  "id": "string",
  "firebaseUid": "string",
  "phoneNumber": "string",
  "fullName": "string",
  "avatarUrl": "string",
  "status": "ACTIVE"
}
```

### GET /customer/vouchers

Response data:

```json
[
  {
    "id": "string",
    "userId": "string",
    "voucherId": "string",
    "status": "UNUSED | USED | EXPIRED | LOCKED",
    "assignedAt": "ISO_DATE",
    "usedAt": "ISO_DATE",
    "voucher": {}
  }
]
```

### GET /customer/notifications

Response data:

```json
[
  {
    "id": "string",
    "notificationId": "string",
    "isRead": false,
    "readAt": "ISO_DATE",
    "createdAt": "ISO_DATE",
    "notification": {
      "id": "string",
      "title": "string",
      "content": "string",
      "type": "SYSTEM | PROMOTION | ORDER | VOUCHER",
      "targetType": "ALL | USER | GROUP",
      "createdAt": "ISO_DATE"
    }
  }
]
```

### GET /customer/points

`LOYALTY_SYSTEM` is OFF by default. When disabled, backend returns `FEATURE_DISABLED`.

Response data when enabled:

```json
{
  "balance": 0,
  "transactions": []
}
```

### POST /customer/orders

`WEB_ORDERING` is OFF by default. Current backend blocks this endpoint until the ordering phase is implemented.

### POST /customer/invoices

`INVOICE_UPLOAD` is OFF by default. Current backend blocks this endpoint until the invoice upload phase is implemented.

## Admin APIs

```txt
GET /admin/dashboard
GET /admin/users
PATCH /admin/users/:id/status

GET /admin/menu/categories
POST /admin/menu/categories
PATCH /admin/menu/categories/:id
DELETE /admin/menu/categories/:id

GET /admin/menu/items
POST /admin/menu/items
PATCH /admin/menu/items/:id
DELETE /admin/menu/items/:id

GET /admin/vouchers
POST /admin/vouchers
PATCH /admin/vouchers/:id
DELETE /admin/vouchers/:id

GET /admin/banners
POST /admin/banners
PATCH /admin/banners/:id
DELETE /admin/banners/:id

GET /admin/gallery
POST /admin/gallery
PATCH /admin/gallery/:id
DELETE /admin/gallery/:id

GET /admin/website-content
PATCH /admin/website-content/:key

POST /admin/upload

GET /admin/orders
PATCH /admin/orders/:id/status

GET /admin/notifications
POST /admin/notifications

GET /admin/feature-flags
PATCH /admin/feature-flags/:key

GET /admin/system-settings
PATCH /admin/system-settings/:key

GET /admin/audit-logs
```

All admin APIs require:

```txt
Authorization: Bearer <Firebase ID Token>
```

Admin permission rules:

| Endpoint | Permission |
|---|---|
| GET /admin/dashboard | authenticated admin |
| GET /admin/users | user.read |
| PATCH /admin/users/:id/status | user.write |
| GET /admin/menu/categories | menu.read |
| POST /admin/menu/categories | menu.write |
| PATCH /admin/menu/categories/:id | menu.write |
| DELETE /admin/menu/categories/:id | menu.write |
| GET /admin/menu/items | menu.read |
| POST /admin/menu/items | menu.write |
| PATCH /admin/menu/items/:id | menu.write |
| DELETE /admin/menu/items/:id | menu.write |
| GET /admin/vouchers | voucher.read |
| POST /admin/vouchers | voucher.write |
| PATCH /admin/vouchers/:id | voucher.write |
| DELETE /admin/vouchers/:id | voucher.write |
| GET /admin/banners | banner.read |
| POST /admin/banners | banner.write |
| PATCH /admin/banners/:id | banner.write |
| DELETE /admin/banners/:id | banner.write |
| GET /admin/gallery | gallery.read |
| POST /admin/gallery | gallery.write |
| PATCH /admin/gallery/:id | gallery.write |
| DELETE /admin/gallery/:id | gallery.write |
| GET /admin/website-content | website_content.read |
| PATCH /admin/website-content/:key | website_content.write |
| GET /admin/feature-flags | feature_flag.read |
| PATCH /admin/feature-flags/:key | feature_flag.write |
| GET /admin/system-settings | system_settings.read |
| PATCH /admin/system-settings/:key | system_settings.write |
| POST /admin/upload | upload.write |
| GET /admin/orders | orders.read |
| PATCH /admin/orders/:id/status | orders.update |
| GET /admin/notifications | notification.read |
| POST /admin/notifications | notification.write |
| GET /admin/audit-logs | audit_log.read |

Admin write APIs must create audit logs.

### GET /admin/dashboard

Response data:

```json
{
  "users": {
    "total": 0,
    "active": 0,
    "blocked": 0
  },
  "orders": {
    "total": 0,
    "pending": 0,
    "completed": 0
  },
  "content": {
    "menuCategories": 0,
    "menuItems": 0,
    "vouchersTotal": 0,
    "vouchersActive": 0,
    "banners": 0,
    "galleryImages": 0,
    "notifications": 0
  }
}
```

### PATCH /admin/users/:id/status

Request:

```json
{
  "status": "ACTIVE | BLOCKED"
}
```

### PATCH /admin/orders/:id/status

Request:

```json
{
  "status": "PENDING | CONFIRMED | PREPARING | READY | COMPLETED | CANCELLED | REJECTED"
}
```

### POST /admin/notifications

Request:

```json
{
  "title": "string",
  "content": "string",
  "type": "SYSTEM | PROMOTION | ORDER | VOUCHER",
  "targetType": "ALL | USER | GROUP",
  "targetUserIds": ["string"]
}
```

Rules:

```txt
IN_APP_NOTIFICATION feature flag must be ON.
targetUserIds is required when targetType=USER.
targetType=GROUP is reserved for a future user-group module and currently returns NOTIFICATION_GROUP_TARGET_NOT_CONFIGURED.
No Firebase Cloud Messaging is used in MVP.
```

### PATCH /admin/website-content/:key

Request:

```json
{
  "value": {},
  "isActive": true
}
```

Admin delete APIs are soft delete operations:

```txt
menu categories -> isActive=false
menu items -> isAvailable=false
banners -> isActive=false
gallery images -> isActive=false
vouchers -> status=LOCKED
```

### PATCH /admin/feature-flags/:key

Request:

```json
{
  "enabled": true
}
```

Response data:

```json
{
  "id": "string",
  "key": "WEB_ORDERING",
  "enabled": false,
  "description": "string",
  "updatedByAdminId": "string",
  "createdAt": "ISO_DATE",
  "updatedAt": "ISO_DATE"
}
```

### PATCH /admin/system-settings/:key

Request:

```json
{
  "value": {
    "shopOpen": true,
    "allowOrdering": false,
    "allowVoucherClaim": true,
    "deliveryRadiusKm": 5,
    "minimumOrderAmount": 50000
  },
  "description": "Core shop and ordering switches."
}
```

Response data:

```json
{
  "id": "string",
  "key": "commerce",
  "value": {},
  "description": "string",
  "updatedByAdminId": "string",
  "createdAt": "ISO_DATE",
  "updatedAt": "ISO_DATE"
}
```

### POST /admin/upload

Request:

```txt
multipart/form-data
file=<image file>
folder=banners | gallery | menu | vouchers | website-content | admins | users
```

Rules:

```txt
Allowed MIME: image/jpeg, image/png, image/webp
Max size: 5MB
```

Response data:

```json
{
  "id": "string",
  "provider": "CLOUDINARY",
  "publicId": "string",
  "url": "string",
  "secureUrl": "string",
  "folder": "banners",
  "fileName": "string",
  "mimeType": "image/webp",
  "size": 12345,
  "uploadedByAdminId": "string",
  "createdAt": "ISO_DATE"
}
```

## Naming Rules

Use these names exactly:

| Concept | Field |
|---|---|
| User ID | `id` |
| Firebase UID | `firebaseUid` |
| Phone | `phoneNumber` |
| Full name | `fullName` |
| Avatar URL | `avatarUrl` |
| Image URL | `imageUrl` |
| Created time | `createdAt` |
| Updated time | `updatedAt` |

Do not invent alternatives such as `name`, `userName`, `uid`, `img`, `created_date`.
