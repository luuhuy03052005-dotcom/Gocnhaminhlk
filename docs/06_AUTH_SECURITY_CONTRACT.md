# 06 — Auth & Security Contract

## Authentication

Use Firebase Authentication Phone OTP.

Clients:

- Web Customer Portal
- Admin Flutter App

## Backend Verification

Backend must verify Firebase ID Token using Firebase Admin SDK.

Never trust client-side role claims.

## Role Source

Roles are stored in MongoDB.

- Customer role is derived from `users`.
- Admin roles are derived from `admins`, `roles`, `permissions`.

## Permissions

Recommended permissions:

```txt
menu.read
menu.write
voucher.read
voucher.write
banner.read
banner.write
gallery.read
gallery.write
website_content.read
website_content.write
user.read
user.write
orders.read
orders.update
notification.read
notification.write
feature_flag.read
feature_flag.write
audit_log.read
admin.read
admin.write
upload.write
system_settings.read
system_settings.write
```

## Admin Role Examples

| Role | Permissions |
|---|---|
| Staff | orders.read, orders.update |
| Content Editor | banner.write, gallery.write, website_content.write, upload.write |
| Order Manager | orders.read, orders.update |
| Manager | menu.write, voucher.write, banner.write, gallery.write, website_content.write, orders.update, user.read |
| SuperAdmin | All permissions |

## RBAC Source

Admin authorization must use:

```txt
roles
permissions
role_permissions
```

Do not rely on Firebase custom claims for app permissions.

## Security Rules

- Firebase Admin SDK secrets must exist only in backend environment.
- Cloudinary API secret must exist only in backend environment.
- Frontend may only contain public Firebase config.
- Admin app must not contain backend secrets.
- Every admin write operation must create an audit log.
- Delete operations should be soft delete when possible.
- Feature flags must be checked by backend for protected features.
