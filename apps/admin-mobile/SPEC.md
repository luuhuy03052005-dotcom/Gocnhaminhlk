# SPEC.md — Admin Flutter App

## 1. Project Overview

**Project Name:** Góc Nhà Mình Admin
**Type:** Flutter Android Application
**Core Functionality:** Android APK for admin staff to manage menu, vouchers, banners, gallery, orders, notifications, and system settings for the Góc Nhà Mình digital ecosystem.

## 2. Technology Stack & Choices

### Framework & Language
- Flutter 3.24+ / Dart 3.5+
- Android target SDK 34

### Key Libraries
| Purpose | Library | Version |
|---|---|---|
| State management | flutter_bloc | 8.1.6 |
| Routing | go_router | 14.2.7 |
| Firebase Auth | firebase_auth | 5.2.0 |
| HTTP client | dio | 5.7.0 |
| DI | get_it | 8.0.0 |
| Local storage | shared_preferences | 2.3.2 |
| Secure storage | flutter_secure_storage | 9.2.2 |
| Image picker | image_picker | 1.1.2 |
| Date formatting | intl | 0.19.0 |

### Architecture
- **Clean Architecture** with 3 layers:
  - `presentation` — BLoC, pages, widgets
  - `domain` — entities, repositories (abstract), use cases
  - `data` — models, repositories (impl), data sources
- **BLoC pattern** for state management
- **Repository pattern** for data access
- **GoRouter** for navigation

### No Backend Secrets in App
- Firebase config is public-only (apiKey, authDomain, projectId, appId)
- Admin API calls authenticated via Firebase Bearer token
- No MongoDB or Cloudinary secrets in app

## 3. Feature List

### Authentication
- [x] Firebase Phone OTP login
- [x] Session persistence
- [x] Role-based access (guards per feature)
- [x] Logout

### Dashboard
- [x] Overview stats: users, orders, content counts
- [x] Quick-access cards to each management section

### Menu Management
- [x] List categories + items
- [x] Create/Edit/Delete categories
- [x] Create/Edit/Delete menu items
- [x] Image upload per item

### Voucher Management
- [x] List all vouchers
- [x] Create/Edit/Delete vouchers
- [x] Lock voucher (soft delete)

### CMS (Banners, Gallery, Website Content)
- [x] List/Create/Edit/Delete banners
- [x] List/Create/Edit/Delete gallery images
- [x] View/Edit website content by key

### Order Management
- [x] List orders with status filter
- [x] Update order status

### Notification Management
- [x] List all notifications
- [x] Create notification (ALL/USER target)

### Settings
- [x] View/Update feature flags
- [x] View/Update system settings

### Audit Logs
- [x] Read-only audit log viewer

### Profile
- [x] Admin info display (name, phone, role, Firebase UID)

## 4. Implementation Status

**Status:** ✅ Fully implemented (2026-06-12)
**Flutter Analyze:** 0 errors, 0 warnings
**Total Dart files:** 83

### Repository & File Structure
```
lib/
├── core/
│   ├── data/
│   │   ├── api_service.dart          # Central HTTP client, auto Firebase token inject
│   │   └── upload_service.dart       # Multipart image upload → /admin/upload
│   └── theme/
│       └── app_theme.dart           # AppColors + AppTextStyles
└── features/
    ├── auth/                         # Firebase Phone OTP, session persistence
    ├── dashboard/                    # Stats overview + quick actions
    ├── menu/                         # Clean: data/domain/presentation (3 layers)
    ├── vouchers/                     # Clean: data/domain/presentation (3 layers)
    ├── orders/                       # Clean: data/domain/presentation (3 layers)
    ├── notifications/                 # Clean: data/domain/presentation (3 layers)
    ├── cms/                          # Banners + Gallery + Content
    ├── settings/                     # Feature Flags + System Settings + Audit Logs
    ├── profile/                      # Admin profile page
    └── shared/widgets/               # CommonWidgets, StatusBadges, AppScaffold
```

### Build Configuration
- **minSdk:** 21 (required by Firebase / image_picker)
- **Google Services:** `com.google.gms.google-services` plugin configured
- **Android Queries:** Firebase reCAPTCHA (VIEW, BROWSER, http/https)

## 4. UI/UX Design Direction

### Visual Style
- **Clean, functional, not decorative** — per UI Design System contract
- **Material Design 3** base with custom brand color overrides
- No animations beyond minimal feedback transitions

### Color Scheme
```
Primary:      #C8873A  (caramel)
Primary Dark: #A06828  (warmBrown)
Background:   #FDF6EE  (cream)
Surface:      #FFFFFF
Surface Alt:   #F5EDE0
Border:       #EDE4D8
Text Dark:    #2C2017
Text Muted:   #7A6A55
Error:        #D32F2F
Success:      #388E3C
```

### Layout Approach
- **Bottom navigation bar** with 5 tabs: Dashboard, Menu, Vouchers, Orders, Settings
- **Drawer** for Notifications, Audit Logs, Profile, Logout
- Cards-based lists for data items
- Pull-to-refresh on all list screens
- Loading shimmer while fetching
- Snackbar for success/error feedback

### Typography
- Sans-serif (Roboto) for admin data density
- Serif only for brand logo/header

### Navigation Structure
```
/login                    → OTP login
/dashboard                → Stats overview (bottom tab 0)
/menu                    → Menu management  (bottom tab 1)
/menu/categories         → Category list
/menu/categories/new     → Create category
/menu/categories/:id     → Edit category
/menu/items              → Items list
/menu/items/new          → Create item
/menu/items/:id          → Edit item
/vouchers                → Voucher management (bottom tab 2)
/vouchers/new            → Create voucher
/vouchers/:id            → Edit voucher
/orders                  → Order management  (bottom tab 3)
/orders/:id              → Order detail + status update
/cms/banners             → Banner management
/cms/banners/new         → Create banner
/cms/banners/:id         → Edit banner
/cms/gallery             → Gallery management
/cms/website-content     → Website content editor
/notifications           → Notification management (drawer)
/notifications/new       → Create notification
/feature-flags           → Feature flags (settings sub)
/system-settings         → System settings (settings sub)
/audit-logs             → Audit logs (drawer)
/profile                 → Admin profile (drawer)
```

### Permissions & Access Control
Each feature screen checks permissions loaded from session:

| Tab | Required Permission |
|---|---|
| Dashboard | authenticated |
| Menu CRUD | menu.write |
| Voucher CRUD | voucher.write |
| Orders list | orders.read |
| Orders update | orders.update |
| Banner CRUD | banner.write |
| Gallery CRUD | gallery.write |
| Website Content | website_content.write |
| Notifications CRUD | notification.write |
| Feature Flags read | feature_flag.read |
| Feature Flags write | feature_flag.write |
| System Settings read | system_settings.read |
| System Settings write | system_settings.write |
| Audit Logs | audit_log.read |
| User list | user.read |
| User status update | user.write |
| Upload | upload.write |
