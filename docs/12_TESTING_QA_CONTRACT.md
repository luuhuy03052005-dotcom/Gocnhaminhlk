# 12 — Testing & QA Contract

## Backend QA

Must check:

- App starts locally.
- MongoDB connection works.
- `/health` works.
- Firebase token verification path exists.
- Cloudinary upload path exists.
- DTO validation exists.
- Admin routes protected.
- Feature flags enforced.

## Web QA

Must check:

- Existing landing page not broken.
- Responsive desktop/tablet/mobile.
- API loading state.
- API error state.
- OTP login UI.
- Customer portal routes protected.
- No secret keys in frontend.

## Admin App QA

Must check:

- OTP login flow.
- Role-based screens.
- Menu CRUD UI.
- Voucher CRUD UI.
- Upload UI.
- Order status UI.
- Clear loading/error states.

## Integration QA

Must check:

- Web can call backend production URL.
- Backend CORS accepts Vercel domain.
- Admin app can call Render API.
- Uploaded Cloudinary image URL is stored in MongoDB.
- Dynamic menu appears on web after admin update.

## Regression Warning

Do not fix one module by breaking another. Always run the relevant contract check.
