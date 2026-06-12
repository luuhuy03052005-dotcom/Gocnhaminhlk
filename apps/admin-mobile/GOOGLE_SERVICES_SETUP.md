# Google Services Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → name it `goc-nha-minh` (or your choice)
3. Disable Google Analytics (not needed for MVP)
4. Click **Create project**

## 2. Register Android App

1. In Firebase Console, go to **Project Settings** → **Your apps** → **Android**
2. Enter:
   - **Android package name**: `com.gocnhaminh.admin` (check yours in `android/app/build.gradle`)
   - **App nickname**: `Góc Nhà Mình Admin`
3. Click **Register app**

## 3. Download `google-services.json`

1. Download the generated `google-services.json`
2. Place it at:
   ```
   apps/admin-mobile/android/app/google-services.json
   ```

> **Important:** Never commit `google-services.json` to a public repo. It contains sensitive API keys.

## 4. Enable Phone Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click **Phone** → Enable it
3. Add your Android app's SHA-256 fingerprint:
   ```bash
   cd apps/admin-mobile/android
   ./gradlew signingReport
   ```
   Copy the **SHA-256** fingerprint from the output and paste into Firebase Console.

## 5. Add Firebase Config to App

The `google-services.json` is automatically processed by the `google-services` Gradle plugin. Make sure `android/build.gradle` has:

```groovy
plugins {
    id "com.google.gms.google-services" version "4.4.2" apply false
}
```

And `android/app/build.gradle` has:

```groovy
plugins {
    id "com.google.gms.google-services"
}
```

## 6. Verify

```bash
cd apps/admin-mobile
flutter pub get
flutter build apk --debug
```

## 7. Environment Variables

When running with a real backend, pass the API base URL:

```bash
flutter run --dart-define=API_BASE_URL=https://your-backend.onrender.com/api/v1
```

Or set in `flutter run -d <device_id>` with the Release build targeting production.
