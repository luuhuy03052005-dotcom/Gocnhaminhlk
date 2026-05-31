# AGENTS.md — Global Rules for All AI IDE Agents

File này là luật gốc. Mọi AI IDE phải đọc file này trước khi code.

## 1. Project Identity

Project: **Góc Nhà Mình Digital Ecosystem**

MVP gồm:

- `apps/web`: Landing Page + Customer Portal, React + Vite + Tailwind, deploy Vercel.
- `apps/backend`: NestJS API, MongoDB Atlas, Firebase Auth, Cloudinary, deploy Render.
- `apps/admin-mobile`: Flutter Android APK cho admin.
- `docs`: single source of truth về architecture, API, DB, UI, deployment.
- `prompts`: prompt riêng cho từng AI role.
- `packages`: shared contracts, types, constants.

## 2. Mandatory Reading Order

Before editing any file, every AI must read:

1. `docs/00_PROJECT_BRIEF.md`
2. `docs/01_MASTER_ARCHITECTURE_CONTRACT.md`
3. `docs/02_MONOREPO_STRUCTURE_CONTRACT.md`
4. `docs/03_TECH_STACK_LOCK.md`
5. `docs/05_API_CONTRACT.md`
6. The role-specific prompt in `prompts/`

If working on UI, also read:

- `docs/07_UI_DESIGN_SYSTEM.md`

If working on database/backend, also read:

- `docs/04_DATABASE_MONGODB_CONTRACT.md`
- `docs/06_AUTH_SECURITY_CONTRACT.md`

If working on deployment, also read:

- `docs/09_DEPLOYMENT_CONTRACT.md`

## 3. Boundary Rules

### Web AI

Allowed to edit:

```txt
apps/web/
packages/shared-types/
packages/api-contracts/ only if task explicitly requires it
docs/ only if task explicitly requires contract update
```

Forbidden:

```txt
apps/backend/
apps/admin-mobile/
```

### Backend AI

Allowed to edit:

```txt
apps/backend/
packages/shared-types/
packages/api-contracts/
docs/05_API_CONTRACT.md when API changes are required
docs/04_DATABASE_MONGODB_CONTRACT.md when schema changes are required
```

Forbidden:

```txt
apps/web/ UI code
apps/admin-mobile/
```

### Admin Flutter AI

Allowed to edit:

```txt
apps/admin-mobile/
packages/api-contracts/ read-only unless task says otherwise
```

Forbidden:

```txt
apps/web/
apps/backend/
```

### Architect AI

Allowed to edit:

```txt
docs/
prompts/
templates/
config/
packages/api-contracts/
packages/shared-types/
```

Architect AI should not implement production code unless explicitly asked.

## 4. Non-Negotiable Architecture

- Customer does **not** use a Flutter app in MVP.
- Customer uses the current web extended into Customer Portal.
- Admin uses Flutter Android APK.
- Backend is NestJS.
- Database is MongoDB Atlas.
- Auth is Firebase Authentication Phone OTP.
- File storage is Cloudinary.
- Notification MVP is in-app notification stored in MongoDB.
- Firebase Cloud Messaging is not used in MVP.
- Web deploys on Vercel.
- Backend deploys on Render.
- MongoDB must not store binary image files directly.

## 5. API Contract First

Do not invent response fields.

If API contract says:

```json
{
  "id": "string",
  "fullName": "string",
  "phoneNumber": "string"
}
```

Do not change it to:

```json
{
  "name": "string"
}
```

Any API shape change requires:

1. Update `docs/05_API_CONTRACT.md`
2. Update shared types
3. Update backend
4. Update frontend/admin consumers
5. Add note in handoff report

## 6. Database Contract First

Do not rename collection fields freely.

Example:

- Correct: `firebaseUid`
- Wrong: `firebaseUID`, `uid`, `firebaseUserId` unless contract changes.

Schema changes require updating:

- `docs/04_DATABASE_MONGODB_CONTRACT.md`
- migration/seed notes if relevant
- related DTOs/types

## 7. UI System Contract

The UI must inherit from the existing landing page style:

- Warm, cozy, boutique cafe.
- Brown / caramel / beige palette.
- Clear, friendly, not too colorful.
- Admin app must prioritize clarity over decoration.
- Do not introduce random new colors, icon systems, or typography.

## 8. Commit/Task Discipline

Every AI task should output:

1. Files changed
2. Why changed
3. Contract impact
4. How to test
5. Known risks

Use `templates/HANDOFF_REPORT_TEMPLATE.md`.

## 9. Never Do These

- Do not move app folders without explicit instruction.
- Do not place backend code inside web.
- Do not place Flutter code inside backend/web.
- Do not store Cloudinary secrets in frontend.
- Do not store Firebase Admin SDK secrets in frontend.
- Do not save images as base64 in MongoDB.
- Do not enable loyalty/invoice/upload/order if feature flag says OFF.
- Do not add Customer Flutter App in MVP.
- Do not use Firebase Cloud Messaging in MVP unless contract changes.

## 10. If Unsure

Stop and ask for clarification. Do not guess architecture.
