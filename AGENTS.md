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

### Key details
- `process.env.NODE_ENV` is automatically `"production"` during `next build` / production deploy — no manual env var needed.
- `getLocalIP()` finds the first non-internal IPv4 address (e.g. `192.168.x.x`).
- Add new entries to this log as changes are made.
- Deploy
