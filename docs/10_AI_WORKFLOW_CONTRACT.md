# 10 — AI Workflow Contract

## Goal

Allow multiple AI IDEs to work together without architecture drift.

## Recommended Roles

| AI Role | Responsibility |
|---|---|
| Architect AI | Docs, contracts, system design |
| Frontend AI | `apps/web` |
| Backend AI | `apps/backend` |
| Flutter AI | `apps/admin-mobile` |
| QA AI | Review contract compliance |

## Task Flow

1. Architect defines or confirms contract.
2. Assigned AI implements inside its folder only.
3. AI outputs handoff report.
4. QA AI reviews against contracts.
5. Integration fixes happen only after contract verification.

## Required Handoff

Every completed task must include:

- Files changed
- Summary
- Contract impact
- How to test
- Risks
- Next steps

Use `templates/HANDOFF_REPORT_TEMPLATE.md`.

## Conflict Rule

If two AIs need to modify the same contract file, stop and let Architect AI resolve it first.

## API Change Rule

Backend AI cannot silently change API response shapes.

## UI Change Rule

Frontend AI cannot redesign landing page unless task explicitly says redesign.
