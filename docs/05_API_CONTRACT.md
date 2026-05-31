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

POST /admin/upload

GET /admin/orders
PATCH /admin/orders/:id/status

GET /admin/notifications
POST /admin/notifications

GET /admin/feature-flags
PATCH /admin/feature-flags/:key

GET /admin/audit-logs
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
