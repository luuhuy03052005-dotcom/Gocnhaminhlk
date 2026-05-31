# Pull Request Checklist

## Scope

- [ ] I only changed allowed folders.
- [ ] I did not break monorepo structure.
- [ ] I did not introduce forbidden MVP scope.

## Contracts

- [ ] API contract followed.
- [ ] Database contract followed.
- [ ] UI design system followed.
- [ ] Deployment contract followed.

## Security

- [ ] No secrets in frontend.
- [ ] Firebase token verification handled server-side.
- [ ] Admin routes protected.
- [ ] File upload uses Cloudinary, not MongoDB binary.

## Quality

- [ ] Loading state exists.
- [ ] Error state exists.
- [ ] Responsive behavior checked.
- [ ] Feature flags respected.
- [ ] Handoff report completed.
