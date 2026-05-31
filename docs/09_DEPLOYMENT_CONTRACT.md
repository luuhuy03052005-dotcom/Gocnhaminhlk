# 09 — Deployment Contract

## Web Deployment — Vercel

Repository:

```txt
goc-nha-minh-ecosystem
```

Root Directory:

```txt
apps/web
```

Build Command:

```bash
npm run build
```

Output Directory:

```txt
dist
```

Environment Variables:

```env
VITE_API_BASE_URL=https://<render-service>.onrender.com/api/v1
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

Do not put secrets in Vercel frontend env.

## Backend Deployment — Render

Repository:

```txt
goc-nha-minh-ecosystem
```

Root Directory:

```txt
apps/backend
```

Build Command:

```bash
npm install && npm run build
```

Start Command:

```bash
npm run start:prod
```

Health Check Path:

```txt
/health
```

Environment Variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CORS_ORIGIN=https://<vercel-app>.vercel.app
```

## Render Cold Start

Render free may sleep after inactivity.

Required mitigation:

- Create `GET /health`.
- Use UptimeRobot or cron-job.org to ping every 10–12 minutes.
- Web must show friendly loading message if API takes too long:

```txt
Hệ thống đang khởi động, vui lòng đợi trong giây lát...
```

## Admin Mobile

Flutter app is built from:

```txt
apps/admin-mobile
```

APK build:

```bash
flutter build apk --release
```
