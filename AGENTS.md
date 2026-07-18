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
- Deploy
