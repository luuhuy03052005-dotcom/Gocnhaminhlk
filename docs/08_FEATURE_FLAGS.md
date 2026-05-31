# 08 — Feature Flags

Feature flags are required because some modules are planned but not ready.

## Initial Flags

| Key | Initial | Meaning |
|---|---|---|
| CUSTOMER_LOGIN | ON | Customer can login on web |
| DYNAMIC_MENU | ON | Menu loads from backend |
| DYNAMIC_BANNER | ON | Banner/slider loads from backend |
| VOUCHER_WALLET | ON | Customer can view vouchers |
| IN_APP_NOTIFICATION | ON | Customer can view notifications |
| WEB_ORDERING | OFF | Ordering disabled until module complete |
| LOYALTY_SYSTEM | OFF | Loyalty disabled |
| INVOICE_UPLOAD | OFF | Invoice upload disabled |
| PUSH_NOTIFICATION | OFF | FCM disabled |
| ADMIN_AUDIT_LOG | ON | Admin changes are logged |

## Rules

- Frontend can hide/show UI based on flags.
- Backend must enforce flags for protected actions.
- Do not only hide buttons; backend must block disabled feature actions.
