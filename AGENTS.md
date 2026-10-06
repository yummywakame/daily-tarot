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
├── middleware/
│   └── requireAdmin.js    # 403 unless req.user.isAdmin (from JWT)
├── models/
│   ├── Card.js
│   ├── Deck.js            # Per-deck "use Biddy Tarot meanings" setting
│   ├── DeckCard.js        # A deck's own text for one card
│   ├── Reading.js
│   └── User.js
├── routes/
│   ├── adminRouter.js     # /api/admin/* — stats, user roles/deletion, all readings, card edits
│   ├── authRouter.js
│   ├── cardRouter.js
│   ├── readingRouter.js
│   └── userRouter.js
├── client/                # React/Vite frontend (its own package.json)
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.development   # VITE_SITE_URL for local builds — committed, not secret
│   ├── .env.production    # Sets VITE_BASE_PATH and VITE_SITE_URL for prod builds — committed, not secret
│   ├── public/
│   │   └── decks/                  # Tarot card images, one folder per deck (prisma-visions/, stained-glass/)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── apiSetup.js            # Sets axios baseURL from Vite BASE_URL
│       ├── publicUrl.js           # Helper for public asset paths with base prefix
│       ├── decks.js               # Deck registry + cardImage()/cardBack() URL helpers
│       ├── context/
│       │   ├── UserProvider.jsx
│       │   ├── ReadingProvider.jsx
│       │   └── CardProvider.jsx
│       ├── components/
│       │   ├── Card.jsx
│       │   ├── Nav.jsx
│       │   ├── NavInfo.jsx    # top-right deck picker shortcut (to /profile#deck) + admin shortcut (admins) / login button (logged out)
│       │   ├── Footer.jsx     # site-wide credits footer linking to /about
│       │   ├── Spread1.jsx
│       │   ├── Spread1Desc.jsx
│       │   ├── PasswordFields.jsx
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
- Node.js >= 20.19 (required by Mongoose 9)
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

> **Procfile gotcha — no spaces in `pwd`:** Laragon's parser doesn't reliably handle quoted paths. The Procfile uses the junction path (`C:/laragon/www/daily-tarot`) rather than the OneDrive path (`C:/Users/olivi/OneDrive/www/vschool/Daily Tarot App/daily-tarot-main`) because the latter has a space and caused silent startup failures. Both point to the same files.

> **"Service Unavailable" (503) at `daily-tarot.test`:** Apache is up but nothing is listening on port 7000. The Procfile `autorun` only fires when the Laragon *program* launches — **Start All** does not re-run it. Start Node via Laragon menu → **Procfile → Daily Tarot**, or fully exit and reopen Laragon. Node does not hot-reload: after backend changes (routes, models, `npm install`), restart it — while it runs it appears as **Daily Tarot - Autorun** at the top of the Laragon menu and is *not* listed under Procfile, so use **Procfile → Close all** to stop it, then **Procfile → Daily Tarot** to start it again.

### Local build

The client must be built with `build:local` so assets use `/` as the base path (not the Mochahost subpath):

```bash
cd client && npm run build:local
# Uses `vite build --mode development` → skips .env.production → base = /
# Social preview: index.html's Open Graph/Twitter tags need absolute URLs, built from %VITE_SITE_URL%
# (.env.development locally, .env.production on prod). Image: client/public/social-preview.jpg (1200×630).
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

`client/build/` is gitignored (`client/.gitignore`) — it is never committed. Whichever build you ran last is what's on disk: run `build:local` for `daily-tarot.test`, and `build` right before deploying.

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

### Styling
- Plain CSS in `client/src/styles/`. Design tokens (colours, fonts, radii, shadows) are CSS custom properties on `:root` in `main.css`; use them instead of hard-coded values. `formstyles.css` holds inputs, buttons (`.secondary`, `.danger`, `.link-button` variants) and the auth screen; `admin.css` is admin-only.
- Fonts: Cormorant Garamond (display) + Inter (body) from Google Fonts (allowed by the CSP in `server.js`).
- `react-burger-menu` clones menu children and string-concatenates `className`, so **don't pass a function `className` to `NavLink`s inside `<Menu>`** — it gets stringified. React Router adds the `active` class itself.

### Authentication
- JWT stored in `localStorage`, managed by `UserProvider`
- All `/api/*` endpoints require `Authorization: Bearer <token>` header
- Passwords hashed with bcryptjs
- **Minimum password length: 8 characters** (enforced by Joi in `authRouter.js`)
- **Authorization** (all enforced server-side):
  - Users can only read/update their own profile; `PUT /api/users/:_id` accepts only `email`, `firstName`, `lastName`, `allowRev`, `deck` (Joi, unknown keys stripped). Password/isAdmin cannot be changed there. `password` is never returned.
  - Password changes go through `PUT /api/users/:_id/password` (self only, rate limited) with `{ newPassword }` (8–128 chars); no current password is asked for, being logged in is enough. The pre-save hook hashes it. On the Profile page, `PasswordFields.jsx` sits among the autosaving profile fields but belongs to its own `#password-form` (via the inputs' `form` attribute), so it only saves on its button and doesn't block the profile autosave's validity check.
  - Readings are owned by `req.user._id` (never from the request body); users can only read/edit/delete their own.
  - Admin-only: everything under `/api/admin/*` (`routes/adminRouter.js`), plus `GET /api/users`, `GET /api/readings`, and card create/update/delete.
  - `requireAuth` (server.js) re-reads `isAdmin` from the DB on every `/api` request, so promotions/demotions apply immediately and tokens of deleted users get 401. The first admin must be set by hand (`isAdmin: true` in the DB); after that, admins manage roles from the Admin page. Admins cannot demote or delete themselves.

### Admin page (`/admin`)
- Reached from the top-right shield button (`NavInfo.jsx`), shown only when `user.isAdmin` (it is not in the burger menu); `UserProvider` refreshes the stored user from `GET /api/users/:_id` on load so the button appears without re-login. The client check only hides UI — all enforcement is server-side.
- Tabs (`client/src/components/admin/`): **Overview** (`GET /api/admin/stats`), **Users** (`GET /api/admin/users`, `PATCH /api/admin/users/:_id/role`, `DELETE /api/admin/users/:_id` — also deletes their readings; sortable by last reading or A–Z by email; clicking a user opens `AdminUserReadings`: `GET /api/admin/users/:_id/readings?page=&limit=`, `DELETE /api/admin/readings/:_id`), **Cards** — a “Content for” picker chooses **Biddy Tarot (default text)**, which edits the shared `Card` documents (`PUT /api/admin/cards/:_id` — text fields only; `name_short`/`value_int` are not editable), or a deck. For a deck: the “Use Biddy Tarot meanings” checkbox (`GET`/`PUT /api/admin/decks/:deck`), and per-card name, keywords, meanings and description (`PUT`/`DELETE /api/admin/decks/:deck/cards/:_id`). Element and astrology are shared by all decks.
- Card `desc` / `meaning_*_long` are rendered as raw HTML (`dangerouslySetInnerHTML`). The CSP (no `unsafe-inline` scripts) blocks injected scripts, but keep edits to simple markup like `<p>`.

### Card lightbox
- `components/shared/CardLightbox.jsx` shows a full-size card image (closes on click or Escape). Used on Today (clicking an already revealed card), Past Dailies, a user's readings in the admin Users tab and the admin card editor. It renders through a portal into `<body>` so transformed ancestors can't clip the fixed overlay.
- Auth errors are cleared before each new login/signup attempt so the error animation always replays

### Tarot Decks
- Users pick a deck on the Profile page; it's stored as `user.deck` (default **Prisma Visions**). All decks share the card meanings in the DB.
- Each reading stores the deck it was drawn with (`reading.deck`, set server-side from `user.deck` on `POST /api/readings`), so Past Dailies and the admin's per-user readings keep showing that deck after the user switches. Readings from before decks existed have no `deck` and show Prisma Visions.
- **Per-deck card text:** `models/Deck.js` holds `useDefaultContent` per deck (no document = `true`, which is how every deck starts). `models/DeckCard.js` holds a deck's own text for one card (`name`, `meaning_up`, `meaning_rev`, `meaning_up_long`, `meaning_rev_long`, `desc`). `DeckCard.applyTo(card, deck)` lays that text over the card when the deck's checkbox is off; empty fields and cards without saved text fall back to the default. `routes/cardRouter.js` applies it for the user's deck on the random, by-value and by-id routes; `GET /api/cards` stays default text (the admin editor uses it). Saved text is kept while the checkbox is on, just not shown. Readings store the name and keywords at the time they were saved.
- **Removed decks fall back to Prisma Visions:** `getDeck()` maps unknown ids to the default, the Profile form preselects the default if the saved deck no longer exists, `POST /api/readings` leaves `deck` unset if the user's saved deck is no longer in the enum, and `fallBackToDefaultDeck()` (installed in `main.jsx`) swaps any `/decks/<id>/` image that fails to load for the same file in `prisma-visions/`.
- Decks live in `client/public/decks/<id>/`. **Prisma Visions** (`prisma-visions`) is the default; the rest (Stained Glass, Romantic, Sambucus, Tranquil Dog, Papercut, Kashima, Voice and Vision) come from marytcusack.com's galleries. Image URLs there are `Decks/Images/Tarot/<letter>/<Deck>/`: majors `NN Name.jpg`, minors `<suit prefix>01–10.jpg` and `<prefix>C1P/C2K/C3Q/C4K.jpg` (Page/Knight/Queen/King), back `zback.jpg`. The gallery HTML's suit prefixes don't always match the files: Romantic Wands are `R`, Kashima Pentacles are `Co`.
- Sambucus has two Chariots; `ar07` is `07a`.
- Card sizes differ per deck, but within a deck every face and the back are the same size, or the flip animation jumps. Off-size cards were resized to match, and Sambucus is landscape (800×450, back rotated). Mark landscape decks with `landscape: true` in `DECKS` so Today widens the card column.
- Every deck uses the same filenames: `ar00.jpg`–`ar21.jpg` (Major Arcana, RWS order: 08 Strength, 11 Justice), `cu02.jpg`–`cu10.jpg` plus `cuac`/`cupa`/`cukn`/`cuqu`/`cuki.jpg` (Ace/Page/Knight/Queen/King) for Cups, likewise `pe`, `sw`, `wa`. `cardback.jpg` is the back.
- Always build image URLs with `cardImage(deck, name_short)` / `cardBack(deck)` from `client/src/decks.js` (unknown ids fall back to the default). Readings use `reading.deck`; the admin Overview and Cards tabs show the admin's own deck via `useUser()`.
- **Adding a deck:** add the image folder, an entry in `DECKS` (`client/src/decks.js`) and its id in the `deck` enum in `models/User.js` (the profile route validates against that enum). The About page lists credits from `DECKS` entries that have a `source`.

---

## Deployment (Mochahost)

1. Build the client for production:
   ```bash
   cd client && npm run build
   # client/.env.production auto-sets VITE_BASE_PATH=/demos/daily-tarot/
   ```
2. Upload the files to the server. `client/build/` is not in git, so if you pull on the server, upload `client/build/` separately (or build there)
3. Ensure the server `.env` has `NODE_ENV=production` — this auto-sets `APP_BASE=/demos/daily-tarot` and re-enables HSTS + `upgrade-insecure-requests`
4. If `package.json` dependencies changed, run `npm install` on the server (cPanel → **Setup Node.js App** → **Run NPM Install**). The app's Node version is set on that page too — it must be ≥ 20.19 (prod runs 22.x)
5. Restart the Node process

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
- `client/build/` is gitignored — build output is never committed; run the appropriate build before testing or deploying
- `.claude/` and `.env` are gitignored
- Prefer `npm` over `yarn` or `pnpm`
- Auth error messages use a CSS fade-out animation (`fadeMessage`, 5s) — they disappear after 5s by design
- Console warnings about Font Awesome CDN, `interest-cohort`, and `Cross-Origin-Opener-Policy` are expected in local HTTP dev and are harmless
