# Góc Nhà Mình Admin App

Android APK quản trị cho hệ thống **Góc Nhà Mình Digital Ecosystem**.

## Features

| Module | Description |
|---|---|
| **Auth** | Firebase Phone OTP login |
| **Dashboard** | Stats overview + quick actions |
| **Menu** | Category & item CRUD, availability toggle |
| **Vouchers** | Full CRUD, date range, type (PERCENT/FIXED) |
| **Orders** | List by status, status transitions |
| **Notifications** | Create + broadcast to ALL/USER |
| **Banners** | CRUD with image upload, promo/menu types |
| **Gallery** | CRUD with image upload, grid view |
| **Website Content** | Edit about, social links, contact info |
| **Feature Flags** | Toggle features ON/OFF |
| **System Settings** | Shop open, delivery, min order |
| **Audit Logs** | Read-only action history |
| **Profile** | Admin info display |

## Prerequisites

- Flutter 3.24+ / Dart 3.5+
- Android SDK 34
- Firebase project (Phone Auth enabled)
- Backend NestJS API running

## Setup

### 1. Firebase Configuration

1. Create project at [Firebase Console](https://console.firebase.google.com)
2. Register Android app with package: `com.gocnhaminh.goc_nha_minh_admin`
3. Download `google-services.json`
4. Place it at: `android/app/google-services.json`
5. Enable **Phone** authentication in Firebase Console
6. Add your **SHA-256 fingerprint** (run `cd android && ./gradlew signingReport`)

### 2. Backend URL

Edit `lib/core/data/api_service.dart` or pass at runtime:

```bash
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000/api/v1
```

### 3. Install & Build

```bash
# Get dependencies
flutter pub get

# Debug build
flutter build apk --debug

# Release build (requires signing config)
flutter build apk --release
```

## Architecture

```
lib/
├── core/
│   ├── data/          # ApiService, UploadService
│   └── theme/          # AppColors, AppTextStyles
└── features/
    ├── auth/           # Firebase OTP, session
    ├── dashboard/     # Stats overview
    ├── menu/          # Clean Architecture: data/domain/presentation
    ├── vouchers/
    ├── orders/
    ├── notifications/
    ├── cms/           # Banners, Gallery, Content
    ├── settings/      # Flags, System Settings, Audit Logs
    ├── profile/
    └── shared/widgets/ # Common components
```

## API Integration

All calls authenticated via Firebase Bearer token. Backend verifies token server-side.

Base URL: `http://10.0.2.2:3000/api/v1` (Android emulator)

See `docs/05_API_CONTRACT.md` for full API spec.

## Development

```bash
# Analyze
flutter analyze

# Run on device
flutter run

# Run with backend
flutter run --dart-define=API_BASE_URL=https://your-backend.onrender.com/api/v1
```
