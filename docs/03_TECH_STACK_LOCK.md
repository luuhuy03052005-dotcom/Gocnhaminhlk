# 03 — Tech Stack Lock

## Final Tech Stack

| Area | Technology |
|---|---|
| Web | React + Vite + Tailwind |
| Web Hosting | Vercel |
| Admin App | Flutter / Dart Android APK |
| Backend | NestJS |
| Backend Hosting | Render |
| Database | MongoDB Atlas |
| Authentication | Firebase Authentication Phone OTP |
| File Storage | Cloudinary |
| Notification MVP | MongoDB In-app Notification |
| Push Notification | Not in MVP |

## Not Allowed in MVP

- Customer Flutter App.
- Firebase Cloud Messaging.
- Storing images directly in MongoDB.
- Online payment.
- OCR invoice automation.
- Chat realtime.
- AI recommendation.
- Custom shipper system.

## Backend Notes

NestJS must use modular structure.

Recommended modules:

```txt
auth
users
admins
roles
menu
vouchers
orders
cms
notifications
feature-flags
upload
loyalty
audit-logs
health
```

## Web Notes

Existing landing page must be preserved and extended. Do not destroy current layout.

## Admin Flutter Notes

Admin UI must be simple, fast, clear, not decorative.
