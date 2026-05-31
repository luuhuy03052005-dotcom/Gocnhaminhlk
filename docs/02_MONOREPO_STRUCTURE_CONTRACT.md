# 02 — Monorepo Structure Contract

This file is mandatory. It defines how the repo must be structured so multiple AI IDEs can work safely.

## Core Decision

Use **one root repository** with **multiple clearly separated apps**.

Do **not** put all code in one messy folder.

Correct:

```txt
goc-nha-minh-ecosystem/
├── AGENTS.md
├── README.md
├── docs/
├── prompts/
├── templates/
├── config/
├── apps/
│   ├── web/
│   ├── backend/
│   └── admin-mobile/
└── packages/
    ├── shared-types/
    ├── api-contracts/
    └── shared-constants/
```

Wrong:

```txt
goc-nha-minh-ecosystem/
├── src/
├── controllers/
├── components/
├── flutter_screens/
├── backend_services/
└── random_files/
```

## Folder Ownership

| Folder | Owner AI | Purpose |
|---|---|---|
| `apps/web` | Frontend AI | React + Vite + Tailwind web |
| `apps/backend` | Backend AI | NestJS API |
| `apps/admin-mobile` | Flutter AI | Admin Android App |
| `docs` | Architect AI | Architecture contracts |
| `prompts` | Architect AI | AI prompts |
| `templates` | Architect AI | Task/handoff templates |
| `config` | Architect/Deployment AI | Env and deployment samples |
| `packages/shared-types` | Architect/Backend with coordination | Shared DTO/type definitions |
| `packages/api-contracts` | Architect/Backend with coordination | API contract/OpenAPI |
| `packages/shared-constants` | Architect/Frontend with coordination | Brand/status/feature constants |

## Required App Structures

### Web

```txt
apps/web/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── utils/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Backend

```txt
apps/backend/
├── src/
│   ├── common/
│   ├── config/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── admins/
│   │   ├── menu/
│   │   ├── vouchers/
│   │   ├── orders/
│   │   ├── cms/
│   │   ├── notifications/
│   │   ├── feature-flags/
│   │   ├── upload/
│   │   ├── loyalty/
│   │   └── audit-logs/
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── nest-cli.json
└── tsconfig.json
```

### Admin Mobile

```txt
apps/admin-mobile/
├── lib/
│   ├── app/
│   ├── core/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── menu/
│   │   ├── vouchers/
│   │   ├── cms/
│   │   ├── orders/
│   │   ├── notifications/
│   │   └── users/
│   ├── shared/
│   └── main.dart
├── pubspec.yaml
└── android/
```

## Deployment Root Directories

| Platform | Root Directory |
|---|---|
| Vercel | `apps/web` |
| Render | `apps/backend` |
| Flutter APK | `apps/admin-mobile` |

## AI Boundary Enforcement

### Frontend AI

Allowed:

```txt
apps/web/
packages/shared-types/
packages/shared-constants/
```

Only modify `docs/` or `packages/api-contracts/` if the task explicitly says so.

### Backend AI

Allowed:

```txt
apps/backend/
packages/shared-types/
packages/api-contracts/
```

Must update docs when API or database contract changes.

### Flutter AI

Allowed:

```txt
apps/admin-mobile/
```

Read shared contracts but do not change backend/web without explicit instruction.

## Migration From Current Repo

The existing landing page has been migrated into:

```txt
apps/web/
```

Do not rewrite the landing page from scratch. Move and adapt carefully.

## Shared Code Rule

MVP may use simple shared docs/contracts first.

Do not introduce Turborepo/Nx too early unless necessary.

Recommended MVP:

```txt
manual monorepo
```

Later optional:

```txt
pnpm workspace
Turborepo
Nx
```

## Contract Change Rule

If a change affects more than one app, update contracts first:

1. `docs/05_API_CONTRACT.md`
2. `docs/04_DATABASE_MONGODB_CONTRACT.md`
3. `packages/shared-types`
4. App implementation
5. Handoff report

## Forbidden

- Do not place backend secrets in `apps/web`.
- Do not import backend code into web.
- Do not import Flutter code into backend or web.
- Do not create duplicate API clients with different field names.
- Do not rename root folders without approval.
