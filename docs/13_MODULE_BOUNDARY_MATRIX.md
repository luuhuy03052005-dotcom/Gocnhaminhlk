# 13 — Module Boundary Matrix

| Module | Web | Backend | Admin App | MongoDB | Cloudinary | Firebase |
|---|---|---|---|---|---|---|
| Auth | Login UI | Verify token | Login UI | users/admins | No | OTP |
| Menu | Display | CRUD API | CRUD UI | menu_items/categories | menu images | No |
| Voucher | Wallet/display | CRUD/assign API | CRUD UI | vouchers/user_vouchers | Optional image | No |
| CMS Banner | Display | CRUD API | CRUD UI | banners | banner images | No |
| Gallery | Display | CRUD API | CRUD UI | gallery_images | gallery images | No |
| Notification | Center | CRUD/read API | Create UI | notifications/user_notifications | No | Not MVP |
| Order | Create/view | Order API | Manage status | orders | No | No |
| Loyalty | Display placeholder | Disabled unless flag ON | Review later | points/invoices | invoice images | No |
| Audit | No | Write logs | View logs | audit_logs | No | No |
