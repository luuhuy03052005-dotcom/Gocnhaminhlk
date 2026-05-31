# Góc Nhà Mình Digital Ecosystem

Monorepo cho hệ sinh thái số **Góc Nhà Mình**. Repo này dùng chung một bộ contract để Web, Backend, Admin Mobile và các AI IDE làm việc cùng hướng, không lệch kiến trúc.

## Mục tiêu chính

- Khóa kiến trúc dự án trước khi AI code.
- Tách rõ ranh giới Web / Backend / Admin Mobile.
- Bắt buộc mọi AI dùng chung API Contract, Database Contract, Design System và Deployment Contract.
- Tránh tình trạng mỗi AI tự đặt tên field, tự đổi cấu trúc folder, tự tạo style riêng.

## Cấu trúc repo

```txt
AGENTS.md
README.md

apps/
  web/
  backend/
  admin-mobile/

docs/
  00_PROJECT_BRIEF.md
  01_MASTER_ARCHITECTURE_CONTRACT.md
  02_MONOREPO_STRUCTURE_CONTRACT.md
  03_TECH_STACK_LOCK.md
  04_DATABASE_MONGODB_CONTRACT.md
  05_API_CONTRACT.md
  06_AUTH_SECURITY_CONTRACT.md
  07_UI_DESIGN_SYSTEM.md
  08_FEATURE_FLAGS.md
  09_DEPLOYMENT_CONTRACT.md
  10_AI_WORKFLOW_CONTRACT.md
  11_CHANGE_MANAGEMENT.md
  12_TESTING_QA_CONTRACT.md
  13_MODULE_BOUNDARY_MATRIX.md

prompts/
  00_ARCHITECT_AI_PROMPT.md
  01_FRONTEND_WEB_AI_PROMPT.md
  02_BACKEND_NESTJS_AI_PROMPT.md
  03_ADMIN_FLUTTER_AI_PROMPT.md
  04_QA_REVIEW_AI_PROMPT.md
  05_INTEGRATION_FIX_AI_PROMPT.md
  06_DEPLOYMENT_AI_PROMPT.md

templates/
  TASK_BRIEF_TEMPLATE.md
  HANDOFF_REPORT_TEMPLATE.md
  CHANGE_REQUEST_TEMPLATE.md
  PULL_REQUEST_CHECKLIST.md

config/
  env.web.example
  env.backend.example
  env.admin-mobile.example
  render.yaml.example
  vercel.project-settings.md

packages/
  api-contracts/openapi-starter.yaml
  shared-types/README.md
  shared-constants/brand-tokens.json
```

## Cách dùng nhanh

1. Mọi AI IDE phải đọc `AGENTS.md` trước khi sửa code.
2. Đọc contract liên quan trong `docs/`.
3. Mỗi AI chỉ dùng prompt tương ứng:
   - Web AI: `prompts/01_FRONTEND_WEB_AI_PROMPT.md`
   - Backend AI: `prompts/02_BACKEND_NESTJS_AI_PROMPT.md`
   - Admin Flutter AI: `prompts/03_ADMIN_FLUTTER_AI_PROMPT.md`
   - QA AI: `prompts/04_QA_REVIEW_AI_PROMPT.md`
4. Không AI nào được sửa app khác nếu task không cho phép.

## Quy tắc vàng

```txt
Một repo.
Nhiều app.
Một bộ docs.
Một API contract.
Một design system.
Không code chung nồi.
```
