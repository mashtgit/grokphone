# VoxHub Frontend

Next.js 16 application — the VoxHub SaaS platform UI. Deployed on **Cloudflare Workers** via `@opennextjs/cloudflare`.

**Live:** `https://voxhub-frontend.mashtmsc.workers.dev`

---

## Stack

| Component | Technology |
|-----------|-----------|
| Framework | [Next.js](https://nextjs.org) 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 |
| Fonts | Geist (via `next/font`) |
| Icons | [lucide-react](https://lucide.dev) |
| Auth | Custom `AuthContext` + `useAuth()` hook |
| HTTP | Native `fetch` with `credentials: "include"` |
| Deployment | [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) v1.20 + Wrangler |

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout — Navbar, Footer, AuthProvider
│   │   ├── page.tsx              # Landing page (5 sections)
│   │   ├── globals.css           # Design system — Tailwind theme + CSS variables
│   │   ├── login/page.tsx        # Login form — email/password + Google OAuth
│   │   ├── register/page.tsx     # Registration form
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Dashboard — auth check, profile, stats
│   │   │   └── ProfileCard.tsx   # User profile card (avatar/initials, name, email)
│   │   ├── solutions/page.tsx    # Solutions overview page
│   │   └── favicon.ico
│   ├── components/
│   │   ├── Navbar.tsx            # Sticky, responsive — auth-aware (login/signup/dashboard)
│   │   ├── Footer.tsx            # Footer with links
│   │   └── ClientLayout.tsx      # "use client" wrapper — AuthProvider boundary
│   └── lib/
│       ├── api.ts                # Typed fetch wrapper — GET/POST with credentials
│       └── auth.tsx              # AuthContext — user state, login/register/logout/google
├── public/                       # Static assets (minimal — favicon only)
├── next.config.ts                # Turbopack config
├── wrangler.toml                 # Cloudflare Workers config
└── package.json
```

---

## Routes (5 pages)

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Landing page — Hero, Features, How It Works, SEO Content, CTA |
| `/solutions` | Static | Solutions overview |
| `/login` | Client | Login form (email/password) + Google OAuth button |
| `/register` | Client | Registration form (name, email, password) |
| `/dashboard` | Client | Profile card, account status, quick links — requires auth |

All pages use the shared layout: `Navbar` (sticky, responsive, auth-aware) + `Footer`.

---

## Auth Architecture

```
AuthProvider (ClientLayout)
├── Reads /api/auth/me on mount → sets user or null
├── Provides: user, loading, error, login(), register(), logout(), loginWithGoogle()
└── Navbar consumes user state → shows Login/Signup or Dashboard/Logout
```

- **Session:** httpOnly cookie (`voxhub_token`) set by backend
- **API client:** `api.ts` — all requests use `credentials: "include"`
- **Google OAuth:** `loginWithGoogle()` redirects to `backend/api/auth/google`, callback sets cookie and redirects back

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | **Yes** | Backend API base URL (set in `wrangler.toml` for production, `.env.local` for dev) |

**Production value:** `https://grokphone-production.up.railway.app`

For local dev, create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Development

```bash
cd frontend

# Install
npm install

# Dev server (localhost:3001 to avoid port conflict with backend)
npm run dev
# Or: npx next dev -p 3001

# Build
npm run build

# TypeScript check
npx tsc --noEmit --skipLibCheck

# Lint
npm run lint
```

> Backend must be running on port 3000 for auth flows to work locally.

---

## Deployment

### Cloudflare Workers

```bash
cd frontend

# Build + deploy
npm run deploy:cf
# Which runs: opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

### How it works

1. `opennextjs-cloudflare build` — runs `next build`, then bundles output for Workers
2. `opennextjs-cloudflare deploy` — uploads static assets + Worker script to Cloudflare

### Wrangler config (`wrangler.toml`)

```toml
name = "voxhub-frontend"
main = ".open-next/worker.js"
compatibility_date = "2026-07-29"
compatibility_flags = ["nodejs_compat"]

assets = { directory = ".open-next/assets", binding = "ASSETS" }

[vars]
NEXT_PUBLIC_API_URL = "https://grokphone-production.up.railway.app"
```

### Local preview (after build)

```bash
npx wrangler dev
```

### Rollback

```bash
# List versions
npx wrangler versions list

# Rollback
npx wrangler rollback
```

---

## Design System

Defined in `globals.css` as CSS variables + Tailwind theme:

```css
:root {
  --color-surface: #fafafa;
  --color-surface-alt: #f3f4f6;
  --color-border: #e5e7eb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-primary: #7c3aed;
  --color-primary-light: #ede9fe;
  --color-accent: #2563eb;
}
```

Uses Tailwind v4's `@theme` directive. All components use these semantic tokens — no hardcoded colors.
