# 00 — Project Brief

## Project Name

**Góc Nhà Mình Digital Ecosystem**

## MVP Vision

Mở rộng landing page hiện tại thành một hệ sinh thái gồm:

1. **Landing Page + Customer Portal** trên web hiện tại.
2. **Admin Flutter Android App**.
3. **NestJS Backend API**.
4. **MongoDB Atlas Database**.
5. **Firebase Authentication OTP**.
6. **Cloudinary File Storage**.
7. **MongoDB In-app Notification**.

## Important Scope Decisions

| Decision | Status |
|---|---|
| Customer Flutter App | Not in MVP |
| Customer Portal | Built on existing web |
| Admin App | Flutter Android APK |
| Backend | NestJS |
| Database | MongoDB Atlas |
| Web Hosting | Vercel |
| Backend Hosting | Render |
| Auth | Firebase Authentication Phone OTP |
| File Storage | Cloudinary |
| Push Notification | Not in MVP |
| In-app Notification | MongoDB-based |

## MVP Goals

- Keep the existing landing page brand and layout.
- Add dynamic data from backend: menu, banner, gallery, voucher.
- Add customer login via OTP on web.
- Add customer portal: profile, voucher wallet, notification center.
- Add admin app for content/menu/voucher/order management.
- Prepare loyalty UI but keep loyalty/invoice features behind feature flags.

## Non-Goals for MVP

- No Customer Flutter App.
- No online payment.
- No OCR invoice recognition.
- No membership tiers.
- No AI recommendation.
- No Firebase Cloud Messaging.
- No custom shipper system.
- No direct image storage inside MongoDB.
