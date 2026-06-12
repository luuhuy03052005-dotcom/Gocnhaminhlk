# 06 — Auth & Security Contract

## Authentication

Use Firebase Authentication Phone OTP.

Clients:

- Web Customer Portal
- Admin Flutter App

## Backend Verification

Backend must verify Firebase ID Token using Firebase Admin SDK.

Never trust client-side role claims.

## Role Source

Roles are stored in MongoDB.

- Customer role is derived from `users`.
- Admin roles are derived from `admins`, `roles`, `permissions`.

## Permissions

Recommended permissions:

```txt
menu.read
menu.write
voucher.read
voucher.write
banner.read
banner.write
gallery.read
gallery.write
website_content.read
website_content.write
user.read
user.write
orders.read
orders.update
notification.read
notification.write
feature_flag.read
feature_flag.write
audit_log.read
admin.read
admin.write
upload.write
system_settings.read
system_settings.write
```

## Admin Role Examples

| Role | Permissions |
|---|---|
| Staff | orders.read, orders.update |
| Content Editor | banner.write, gallery.write, website_content.write, upload.write |
| Order Manager | orders.read, orders.update |
| Manager | menu.write, voucher.write, banner.write, gallery.write, website_content.write, orders.update, user.read |
| SuperAdmin | All permissions |

## RBAC Source

Admin authorization must use:

```txt
roles
permissions
role_permissions
```

Do not rely on Firebase custom claims for app permissions.

## Admin Guards

Admin endpoints must use backend guards in this order:

```txt
AdminAuthGuard
PermissionGuard
```

`AdminAuthGuard` verifies the Firebase bearer token, maps the Firebase UID to an active admin in MongoDB, loads the active role, and attaches admin permissions to the request.

`PermissionGuard` must read required permissions from endpoint metadata and block requests missing any required permission.

## Customer Guard

Customer endpoints must use:

```txt
CustomerAuthGuard
```

`CustomerAuthGuard` verifies the Firebase bearer token, maps the Firebase UID to an active customer in MongoDB, blocks blocked users, and enforces the `CUSTOMER_LOGIN` feature flag.

## Audit Logging

Every admin write endpoint must declare an audit action and write to `audit_logs` after the operation succeeds.

Required audit fields:

```txt
actorAdminId
action
targetType
targetId when available
before when available
after when available
ipAddress
userAgent
```

## Security Rules

- Firebase Admin SDK secrets must exist only in backend environment.
- Cloudinary API secret must exist only in backend environment.
- Frontend may only contain public Firebase config.
- Admin app must not contain backend secrets.
- Every admin write operation must create an audit log.
- Delete operations should be soft delete when possible.
- Feature flags must be checked by backend for protected features.

## Cloudflare Security Layer

Cloudflare is used as the primary edge protection layer for all public-facing traffic. This adds a second security perimeter outside the application layer.

### What Cloudflare Protects

| Threat | Cloudflare Feature | Plan |
|--------|-------------------|------|
| DDoS attacks (L3-L7) | Always-on DDoS Protection | Free+ |
| Bad bots / scrapers | Bot Fight Mode → Bot Management | Free → Pro+ |
| SQL injection, XSS, RCE | Web Application Firewall (WAF) | Free+ |
| Rate limiting abuse | Rate Limiting Rules | Free+ |
| Exposing origin IP | Orange-cloud DNS, no direct IP | Free+ |
| Vulnerable API endpoints | API Shield | Enterprise |
| Sensitive paths | Cloudflare Access (Zero Trust) | Enterprise |

### Setup Steps

#### 1. Add Domain to Cloudflare

```
1. Go to dash.cloudflare.com → Add a site
2. Point domain DNS to Cloudflare nameservers
3. Set all relevant DNS records to "Proxied" (orange cloud)
   — NOT "DNS only" — so Cloudflare sits in front
4. SSL/TLS mode: Full (strict)
```

#### 2. Enable WAF Rules

In Cloudflare Dashboard → Security → WAF:

```
OWASP Ruleset:               ON  (default sensitivity: Medium)
Cloudflare Managed Rules:    ON
Rate Limiting:               Configure per-endpoint
```

Recommended custom WAF rules:

```
Rule 1 — Block known bad ASNs / countries (optional):
  cf.ASN != good_asns AND ip.country in ["XX"]
  → Block

Rule 2 — Challenge suspicious user agents:
  (not cf.bot_management.verified_bot)
  AND (ua contains patterns indicating scanner)
  → Challenge

Rule 3 — Rate limit API endpoints:
  (http.request.uri.path contains "/api/")
  AND (cf.threat_score > 10)
  → JS Challenge
```

#### 3. Enable Bot Fight Mode (Free)

```
Security → Bots → Bot Fight Mode: ON
```

This blocks many automated attacks without any configuration.

#### 4. Enable Rate Limiting (Free)

```
Security → Tools → Rate Limiting:
  Endpoint: /api/v1/* (auth endpoints)
  Rule: 5 requests per minute per IP
  Action: Block for 5 minutes
```

#### 5. Protect Render Backend (Origin)

Render is the origin server. Never expose Render's public IP directly.

```
Option A — Cloudflare Tunnel (recommended for private services):
  - Run cloudflared on a lightweight VM beside Render service
  - Tunnel creates outbound-only connection to Cloudflare edge
  - No inbound ports needed on firewall
  - Backend stays hidden behind tunnel

Option B — Hide origin IP:
  - Render: do not share public IP in documentation
  - Cloudflare: enable "Under Attack" mode if targeted
  - Block direct IP access at firewall level
```

Render already provides some DDoS protection. Cloudflare adds edge filtering on top.

#### 6. Protect MongoDB Atlas

MongoDB Atlas already has built-in IP access lists. Use both:

```
Atlas Network Access:
  - IP Access List: allow only Render server IPs + developer IPs
  - Delete 0.0.0.0/0 (allow all) rule if it exists
  - Enable VPC/Peering if available

Atlas Database Access:
  - Use database-specific users with least privilege
  - Never use admin database credentials in application code
  - Enable Audit Log in Atlas
```

Cloudflare Tunnel is NOT needed for MongoDB Atlas since Atlas provides its own network security.

#### 7. CORS Configuration (Backend)

Backend must accept only Cloudflare IPs as origin:

```
CORS_ORIGIN=https://your-domain.com
CORS_ORIGIN_ALLOWLIST=your-domain.com, your-vercel-app.vercel.app
```

Cloudflare forwards the real `Origin` header. Validate it in NestJS CORS config.

#### 8. Security Headers (Cloudflare)

Add via Cloudflare Dashboard → Rules → Response Headers:

```txt
Strict-Transport-Security:  max-age=31536000; includeSubDomains; preload
X-Content-Type-Options:     nosniff
X-Frame-Options:            DENY
Referrer-Policy:            strict-origin-when-cross-origin
Permissions-Policy:         camera=(), microphone=(), geolocation=()
X-XSS-Protection:           1; mode=block
```

#### 9. Monitoring & Alerts

```
Cloudflare Analytics:
  - Review Security Events daily (Security → Overview)
  - Set up Cloudflare Alerting for:
    • Traffic spikes
    • DDoS attacks
    • New-origin IP exposure

MongoDB Atlas:
  - Enable Atlas alerts for:
    • Unusual query volume
    • Failed authentication attempts
    • Database performance degradation
```

### Security Checklist

```txt
DNS:
  [ ] Domain proxied through Cloudflare (orange cloud)
  [ ] SSL/TLS mode: Full (strict)
  [ ] No direct IP exposure

Edge Protection:
  [ ] Bot Fight Mode ON
  [ ] WAF Managed Rules ON
  [ ] Rate Limiting configured for /api/*
  [ ] Security headers set on Cloudflare edge

Database:
  [ ] MongoDB Atlas IP whitelist configured
  [ ] Database users have least privilege
  [ ] No 0.0.0.0/0 access in Atlas
  [ ] Atlas Audit Log enabled

Backend:
  [ ] CORS_ORIGIN set to actual domain only
  [ ] Firebase secrets only in backend env
  [ ] Cloudinary secret only in backend env
  [ ] No backend secrets in frontend

Monitoring:
  [ ] Cloudflare security alerts configured
  [ ] MongoDB Atlas alerts configured
  [ ] Audit logs in MongoDB working
```

### Enterprise Upgrades (Future)

When ready, upgrade to:

| Feature | Benefit | Requirement |
|---------|---------|-------------|
| API Shield | Schema validation, mTLS, API discovery | Enterprise plan |
| Bot Management | ML-based bot scoring, verify bots | Pro+ ($20/mo) |
| Cloudflare Access | Zero Trust for admin endpoints | Enterprise |
| Advanced DDoS | ML adaptive protection | Advanced DDoS add-on |
