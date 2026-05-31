# 11 — Change Management

## Change Types

| Type | Example |
|---|---|
| UI-only | Adjust card spacing |
| API change | Rename response field |
| DB change | Add collection field |
| Auth change | Modify role handling |
| Deployment change | Update Render/Vercel config |

## Change Request Required When

- Changing API contract.
- Changing database schema.
- Changing folder structure.
- Adding a new dependency.
- Enabling a feature flag by default.
- Moving deployment root directories.

Use `templates/CHANGE_REQUEST_TEMPLATE.md`.

## Versioning

Contracts should be updated before implementation.

Major contract files:

- `docs/04_DATABASE_MONGODB_CONTRACT.md`
- `docs/05_API_CONTRACT.md`
- `docs/06_AUTH_SECURITY_CONTRACT.md`
- `docs/07_UI_DESIGN_SYSTEM.md`
- `docs/09_DEPLOYMENT_CONTRACT.md`
