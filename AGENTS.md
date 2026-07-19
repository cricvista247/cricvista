# Agent Changes Log

## 2026-07-18 — Puppeteer Chrome install & Server URL display

### Problem
- **Production**: `getBrowser()` used `NEXT_PUBLIC_NODE_ENV` to decide between local vs production browser. The `.env` had `NEXT_PUBLIC_NODE_ENV=development`, so on Render/Vercel it tried `puppeteer.launch()` (no Chrome installed) instead of `@sparticuz/chromium`.
- **Local**: Server only printed `http://0.0.0.0:3004`, not showing the local IP or localhost URLs.

### Changes

| File | Change |
|---|---|
| `lib/browser.ts:5` | `NEXT_PUBLIC_NODE_ENV` → `NODE_ENV` (auto-set by Node.js/Next.js) |
| `server.ts:4` | Added `os` import for local IP detection |
| `server.ts:8-16` | Added `getLocalIP()` helper using `os.networkInterfaces()` |
| `server.ts:105-112` | Console now prints both `http://localhost:PORT` and `http://IP:PORT` |

## 2026-07-18 — Removed temporary app download options

### Problem
- The header had 4 app download buttons/links pointing to a temporary APK (`/apps/sport-predict-android.apk`) and unused Google Drive links.

### Changes

| File | Change |
|---|---|
| `components/Layout/Header.tsx:130-134` | Removed `appDownloadLinks` object with Google Drive URLs |
| `components/Layout/Header.tsx:141-147` | Removed `handleAppDownload()` function |
| `components/Layout/Header.tsx:245-292` | Commented out Desktop App Download Dropdown in nav bar (entire button + menu) |
| `components/Layout/Header.tsx:266-290` | Commented out Android App dropdown item in nav menu |
| `components/Layout/Header.tsx:544-559` | Commented out Download App item in user dropdown |
| `components/Layout/Header.tsx:658-694` | Commented out App download button for non-authenticated users |
| `components/Layout/Header.tsx:803-839` | Commented out Mobile App Download section in mobile menu |

### Key details
- `handleAppDownload` and `appDownloadLinks` are completely removed (no active references remain).
- All 4 UI entry points are commented out with `{/* ... */}` JSX comments.
- Re-enable by uncommenting and swapping in real store links.

### Key details
- `process.env.NODE_ENV` is automatically `"production"` during `next build` / production deploy — no manual env var needed.
- `getLocalIP()` finds the first non-internal IPv4 address (e.g. `192.168.x.x`).
- Add new entries to this log as changes are made.

## 2026-07-19 — Email deliverability (OTP going to spam)

### Problem
- OTP emails for registration and password reset landing in users' spam folders
- Root causes: Gmail SMTP from free `@gmail.com` address, spam-trigger subject lines, missing auth headers

### Changes

| File | Change |
|---|---|
| `lib/MailSend.ts` | Rewritten with dual-provider support: SendGrid API (via `SENDGRID_API_KEY`) as primary, Gmail SMTP as fallback. Added `X-Priority`, `Feedback-ID` headers |
| `app/api/users/signup/route.ts:76` | Subject `"Unlock Predictions - CricVista Email Verification OTP"` → `"CricVista: Verify Your Email Address"` |
| `app/api/users/reset-password/route.ts:68` | Subject `"Unlock Predictions - CricVista Email Verification OTP"` → `"CricVista: Password Reset Code"` |
| `components/template/EmailLayout.ts:150` | Added physical address `"CricVista, India"` to footer (CAN-SPAM) |

### How to fix spam issue (3 options)

**Option 1 (Recommended) — Use SendGrid**
1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create API key with "Mail Send" permission
3. Add to Render env vars: `SENDGRID_API_KEY=your_key`
4. Emails auto-route through SendGrid. No code changes needed.

**Option 2 — Custom domain email**
1. Buy a domain and create email (e.g., `noreply@cricvista.com`)
2. Add SPF, DKIM, DMARC DNS records
3. Update `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_FROM_NAME` env vars

**Option 3 — Warm up Gmail account**
1. Send a few emails daily from `cricvista247@gmail.com`
2. Ask recipients to mark as "Not Spam"

### Key details
- `MailSend.ts` tries SendGrid first (if `SENDGRID_API_KEY` set), falls back to SMTP.
- SendGrid handles DKIM signing automatically.
- The word "Unlock" is a known spam trigger — all subjects now avoid marketing language.
