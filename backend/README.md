# VoxHub API — Backend

REST API for VoxHub — AI-powered voice agent platform. Handles user authentication (email/password + Google OAuth) and serves as backend for the frontend dashboard.

**Deployed on:** Railway → `https://grokphone-production.up.railway.app`

---

## Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 22 (ESM) |
| Framework | [Hono.js](https://hono.dev) v4 |
| Server | [`@hono/node-server`](https://hono.dev/docs/getting-started/nodejs) |
| Database | PostgreSQL via Railway |
| DB Driver | [`postgres.js`](https://github.com/porsager/postgres) |
| Auth | JWT (`hono/jwt`), bcryptjs |
| Deployment | Railway (Nixpacks, auto-deploy from GitHub) |

---

## Project Structure

```
backend/
├── src/
│   ├── index.js              # Entry point — starts Hono server
│   ├── app.js                # Hono app instance — CORS, logger, routes
│   ├── routes/
│   │   ├── index.js          # Route aggregator (/, /health, /api/auth)
│   │   ├── auth.js           # POST /register, /login, /logout, GET /me
│   │   └── oauth.js          # GET /google, /google/callback
│   ├── middleware/
│   │   ├── auth.js           # Reads voxhub_token cookie, validates JWT
│   │   └── requireAuth.js    # Guard — returns 401 if no userId in context
│   ├── lib/
│   │   └── jwt.js            # sign/verify helpers, COOKIE_NAME, COOKIE_OPTIONS
│   └── db/
│       ├── index.js          # Postgres connection singleton (getDb)
│       └── migrate.js        # One-shot migration — creates users table
├── .env.example
├── .gitignore
└── package.json              # (in monorepo root, alongside voximplant tooling)
```

---

## API Endpoints

### Public

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Service info |
| `GET` | `/health` | Health check (returns timestamp) |
| `POST` | `/api/auth/register` | Create account — body: `{ email, password, name }` |
| `POST` | `/api/auth/login` | Sign in — body: `{ email, password }` |
| `POST` | `/api/auth/logout` | Clear session cookie |
| `GET` | `/api/auth/google` | Redirect to Google OAuth consent |
| `GET` | `/api/auth/google/callback` | OAuth callback — exchange code, upsert user, set cookie, redirect |

### Authenticated

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/auth/me` | Current user — requires valid `voxhub_token` cookie |

### Auth Flow

1. **Register** → sets `voxhub_token` cookie (httpOnly, Secure, SameSite=Lax, 7 days)
2. **Login** → same cookie
3. **Google OAuth** → `/api/auth/google` redirects to Google → callback upserts user → sets cookie → redirects to FRONTEND_URL
4. **Logout** → clears cookie
5. **/me** → reads cookie, verifies JWT, returns `{ user }` or 401

### Response Format

```json
// Success
{ "user": { "id": "uuid", "email": "...", "name": "...", "avatar_url": null, "created_at": "..." } }

// Error
{ "error": "message" }
```

---

## Database

### Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,          -- NULL for Google-only accounts
  name TEXT NOT NULL,
  google_id TEXT UNIQUE,       -- NULL for email-only accounts
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Run Migration

```bash
node src/db/migrate.js
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3000) |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | Secret for signing/verifying JWTs (min 32 chars) |
| `FRONTEND_URL` | No | Allowed CORS origin + OAuth redirect target (default: `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | For OAuth | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | For OAuth | Google OAuth client secret |

Railway automatically sets `RAILWAY_PUBLIC_DOMAIN` which is used to construct the OAuth redirect URI.

---

## Local Development

```bash
# From the monorepo root (backend/package.json is in root)
# Database
export DATABASE_URL=postgres://localhost:5432/voxhub
node backend/src/db/migrate.js

# Start dev server (with --watch via nodemon or similar)
node backend/src/index.js

# Or from root package.json scripts:
npm run dev        # start backend with hot-reload
npm start          # production start
```

---

## Deployment (Railway)

**Auto-deploy:** Push to `main` → Railway detects changes and deploys automatically.

**Manual deploy:**
```bash
# From backend/ directory
railway up --service grokphone
```

**Railway config** (`railway.json` at project root):
- Builder: Nixpacks
- Start command: `npm start`
- Restart: ON_FAILURE, 3 retries

Required Railway variables set via dashboard or CLI:
- `DATABASE_URL` — provisioned Postgres
- `JWT_SECRET`
- `FRONTEND_URL` — must match the deployed frontend origin
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

---

## CORS

Configured in `src/app.js`:
- Allowed origin: `FRONTEND_URL` env var (or `http://localhost:3000` fallback)
- Credentials: `true` (required for httpOnly cookies)
- Vary: Origin header set on auth routes
