# 01 — Master Architecture Contract

## Architecture Overview

```txt
Customer / Guest
      |
      v
System 1: Web
Landing Page + Customer Portal
React + Vite + Tailwind
Hosted on Vercel
      |
      | REST API
      v
System 3: Backend API
NestJS
Hosted on Render
      |
      |----------------------|
      v                      v
System 4: MongoDB Atlas      System 5: Firebase Auth
Business data               Phone OTP / ID Token
      |
      v
System 6: Cloudinary
File storage

Admin
      |
      v
System 2: Admin Flutter App
Android APK
      |
      v
Backend API
```

## System Responsibilities

| System | Responsibility |
|---|---|
| Web | Marketing site + customer portal |
| Admin App | Admin operations |
| Backend | Business logic, authorization, API |
| MongoDB | Business data |
| Firebase Auth | OTP login only |
| Cloudinary | Media files |
| Notification MVP | In-app notification via MongoDB |

## Critical Rule

Clients never talk directly to MongoDB or Cloudinary with secrets.

Correct:

```txt
Client -> Backend -> MongoDB/Cloudinary
```

Wrong:

```txt
Client -> MongoDB
Client -> Cloudinary Secret API
```

## Authentication Flow

1. User/Admin enters phone number.
2. Firebase sends OTP.
3. Client receives Firebase ID Token.
4. Client sends token to backend.
5. Backend verifies token with Firebase Admin SDK.
6. Backend maps Firebase UID to user/admin record in MongoDB.
7. Backend returns app session response.

## Authorization Flow

Firebase authenticates identity only.

Role/permission is managed in MongoDB:

- `users`
- `admins`
- `roles`
- `permissions`

## File Upload Flow

1. Client selects file.
2. Client sends file to backend upload endpoint.
3. Backend uploads to Cloudinary.
4. Cloudinary returns URL/publicId.
5. Backend saves metadata to MongoDB `file_assets`.
6. Backend returns URL to client.

## Notification MVP Flow

1. Admin creates notification.
2. Backend saves `notifications`.
3. Backend creates `user_notifications` records.
4. Customer Portal fetches notifications.
5. Customer marks notification as read.
