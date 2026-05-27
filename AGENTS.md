# Daily Tarot — Agent Guide

> This is the primary documentation file for AI agents and human contributors.
> Claude reads this via `CLAUDE.md`. Keep this file up to date.

## Project Overview

**Daily Tarot** is a full-stack tarot card reading web app. Users log in, draw a daily tarot card, write notes on their reading, and review past dailies.

- **GitHub**: https://github.com/yummywakame/daily-tarot
- **Git user**: `yummywakame` (`yummywakame@users.noreply.github.com`)
- **Stack**: Node.js/Express (backend) + React 18 + Vite (frontend) + MongoDB Atlas (Mongoose)

---

## Repository Structure

```
daily-tarot-main/
├── server.js              # Express server entry point
├── package.json           # Root package (backend dependencies + scripts)
├── .env                   # Not committed — copy from .env.example
├── .env.example           # Documents required env vars
├── models/
│   ├── Card.js
│   ├── Reading.js
│   └── User.js
├── routes/
│   ├── authRouter.js
│   ├── cardRouter.js
│   ├── readingRouter.js
│   └── userRouter.js
├── client/                # React/Vite frontend (its own package.json)
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.production    # Sets VITE_BASE_PATH for prod builds — committed, not secret
│   ├── public/
│   │   └── decks/prisma-visions/   # Tarot card images
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── apiSetup.js            # Sets axios baseURL from Vite BASE_URL
│       ├── publicUrl.js           # Helper for public asset paths with base prefix
│       ├── context/
│       │   ├── UserProvider.jsx
│       │   ├── ReadingProvider.jsx
│       │   └── CardProvider.jsx
│       ├── components/
│       │   ├── Card.jsx
│       │   ├── Nav.jsx
│       │   ├── NavInfo.jsx
│       │   ├── Spread1.jsx
│       │   ├── Spread1Desc.jsx
│       │   ├── EditProfileForm.jsx
│       │   ├── NotesForm.jsx
│       │   ├── auth/
│       │   │   ├── AuthContainer.jsx
│       │   │   └── AuthForm.jsx
│       │   ├── pages/
│       │   │   ├── Today.jsx
│       │   │   ├── PastDailies.jsx
│       │   │   ├── Profile.jsx
│       │   │   ├── About.jsx
│       │   │   └── NotFound.jsx
│       │   └── shared/
│       │       └── Toggle.jsx
│       ├── shared/
│       │   ├── ErrorBoundary.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── withNavigate.jsx
│       └── styles/
│           ├── main.css
│           ├── formstyles.css
│           └── burger-menu.css
└── db-backup/             # MongoDB backup metadata (not restored automatically)
```

---

## Dev Setup

### Prerequisites
- Node.js >= 20
- Laragon (Windows local dev) — see **Local Dev with Laragon** section below

### Environment Variables

Create a `.env` file in the root (never commit it). See `.env.example` for the full template.

```
MONGODB_URI=<Atlas connection string>
SECRET=<long random JWT signing secret>
PORT=7000           # optional, defaults to 7000
NODE_ENV=development
# APP_BASE is intentionally absent — it is auto-derived from NODE_ENV (see below)
```

#### APP_BASE auto-detection (server.js)
`APP_BASE` no longer needs to be set manually. `server.js` derives it from `NODE_ENV`:

| `NODE_ENV` | `APP_BASE` |
|---|---|
| `production` | `/demos/daily-tarot` |
| anything else | `` (root) |

Override at any time by explicitly setting `APP_BASE=<value>` in `.env`.

### Install

```bash
# Backend
npm install

# Frontend
cd client && npm install && cd ..
```

---

## Local Dev with Laragon

The app runs locally at **http://daily-tarot.test** via Laragon on Windows.

### How it's wired up

| Component | Detail |
|---|---|
| Apache vhost | `C:\laragon\etc\apache2\sites-enabled\daily-tarot.test.conf` |
| Proxy | `daily-tarot.test:80` → `127.0.0.1:7000` (Express) |
| Apache modules | `mod_proxy` + `mod_proxy_http` enabled in `httpd.conf` |
| Hosts entry | `127.0.0.1 daily-tarot.test` in `C:\Windows\System32\drivers\etc\hosts` |
| Laragon Procfile | `C:\laragon\usr\Procfile` — auto-starts `node server.js` when Laragon starts |

### Local build

The client must be built with `build:local` so assets use `/` as the base path (not the Mochahost subpath):

```bash
cd client && npm run build:local
# Uses `vite build --mode development` → skips .env.production → base = /
```

Rebuild whenever you change frontend code and want to see it at `daily-tarot.test`.

### Starting the server manually (if not using Procfile)

```bash
# From project root
npm start   # starts node server.js on port 7000
```

### Vite dev server (hot reload alternative)

If actively developing the frontend and you want instant hot reload, run Vite's dev server instead of a built copy:

```bash
cd client && npm run dev   # port 3000, proxies /auth and /api to localhost:7000
# Browse to http://localhost:3000 (not daily-tarot.test in this mode)
```

---

## Builds: Local vs Production

Two build scripts exist — **always use the right one**:

| Command | Mode | `VITE_BASE_PATH` | Asset base | Use for |
|---|---|---|---|---|
| `cd client && npm run build:local` | development | not set | `/` | Local testing at `daily-tarot.test` |
| `cd client && npm run build` | production | `/demos/daily-tarot/` (from `client/.env.production`) | `/demos/daily-tarot/` | Mochahost deploy |

`client/build/` is committed to git. Always run `build` (production) before committing if deploying, or `build:local` if you only need local testing and don't want to dirty the tracked build.

---

## Architecture Notes

### Backend (`server.js`)
- Express + Helmet (CSP configured for Font Awesome & Google Fonts)
- **`upgrade-insecure-requests` CSP directive and HSTS are disabled when `NODE_ENV !== production`** — they break plain-HTTP local domains like `*.test`
- CORS enabled globally
- Morgan request logging
- JWT authentication middleware protecting all `/api/*` routes
- Routes: `/auth` (public) and `/api/*` (protected), prefixed with `APP_BASE` in production
- Serves the React SPA build as static files; all unmatched routes fall through to `index.html`

### Frontend (`client/src/`)
- React 18, React Router v6, Axios
- Context API for state: `UserProvider`, `ReadingProvider`, `CardProvider`
- `withUser` HOC wraps `App` with `user`, `token`, `logout` from `UserProvider`
- `ProtectedRoute` wraps authenticated pages
- `ErrorBoundary` wraps each page-level component
- `apiSetup.js` sets `axios.defaults.baseURL` from Vite's `import.meta.env.BASE_URL` — this is how API calls find the right subpath in production
- `publicUrl.js` helper prefixes `BASE_URL` onto public asset paths (card images, etc.)

### Authentication
- JWT stored in `localStorage`, managed by `UserProvider`
- All `/api/*` endpoints require `Authorization: Bearer <token>` header
- Passwords hashed with bcryptjs
- **Minimum password length: 8 characters** (enforced by Joi in `authRouter.js`)
- Auth errors are cleared before each new login/signup attempt so the error animation always replays

### Tarot Deck
- Deck: **Prisma Visions** (card images in `client/public/decks/prisma-visions/`)
- Filename convention: `ar00.jpg`–`ar21.jpg` (Major Arcana), `cu02.jpg`–`cuqu.jpg` (Cups), `pe02.jpg`–`pequ.jpg` (Pentacles), etc.
- `cardback.jpg` is the card back image

---

## Deployment (Mochahost)

1. Build the client for production:
   ```bash
   cd client && npm run build
   # client/.env.production auto-sets VITE_BASE_PATH=/demos/daily-tarot/
   ```
2. Upload all files to the server (or push to git and pull on server)
3. Ensure the server `.env` has `NODE_ENV=production` — this auto-sets `APP_BASE=/demos/daily-tarot` and re-enables HSTS + `upgrade-insecure-requests`
4. Restart the Node process

Live at: `https://<domain>/demos/daily-tarot`

---

## Git Workflow

- **Always** use git as user `yummywakame`
- Main branch: `master`
- GitHub remote: `https://github.com/yummywakame/daily-tarot.git`
- Dependabot is configured for weekly npm updates (`.github/dependabot.yml`)

```bash
# Verify correct git user before committing
git config user.name   # should be: yummywakame
git config user.email  # should be: yummywakame@users.noreply.github.com
```

---

## Notes & Conventions

- No test suite currently configured (both root and client `npm test` exit 0 with a notice)
- `client/build/` is committed — keep it in sync; run the appropriate build before committing
- `.claude/` and `.env` are gitignored
- Prefer `npm` over `yarn` or `pnpm`
- Auth error messages use a CSS fade-out animation (`fadeMessage`, 5s) — they disappear after 5s by design
- Console warnings about Font Awesome CDN, `interest-cohort`, and `Cross-Origin-Opener-Policy` are expected in local HTTP dev and are harmless
