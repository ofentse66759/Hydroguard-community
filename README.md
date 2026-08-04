# HydroGuard Backend

A small Node.js/Express API that powers the HydroGuard Community frontend:
accounts, sessions, flood reports, and community alerts, all stored in a
local JSON file (no database server to install).

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set `JWT_SECRET` to a real random value, e.g.:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Then start it:

```bash
npm start
```

The API listens on `http://localhost:3001/api` by default — the same
address the frontend already points to (`API_BASE` in `index.html`). Open
`index.html` in a browser with the server running and it'll use the real
backend instead of its local-storage fallback.

## How accounts & roles work

- Anyone can log in from the app. If the contact (phone/email) doesn't
  exist yet, an account is created automatically on first login — always
  with role `"user"`.
- There's no role picker in the UI anymore, and the server never trusts a
  role sent from the client.
- To make someone a moderator or admin (so they can review/approve
  community reports), run, on the server:

  ```bash
  npm run promote -- resident@example.com moderator
  # or
  node scripts/promote-user.js resident@example.com admin
  ```

  They need to have logged in at least once already so the account exists.

## API

| Method | Path                | Auth              | Description                              |
|--------|---------------------|-------------------|-------------------------------------------|
| POST   | `/api/auth/session`  | —                 | Log in, or register on first use          |
| GET    | `/api/auth/me`       | required          | Get the current session's user            |
| POST   | `/api/auth/logout`   | —                 | No-op (stateless tokens)                  |
| GET    | `/api/reports`       | optional          | List reports (filtered by role)           |
| POST   | `/api/reports`       | required          | Submit a new report (starts "pending")    |
| PATCH  | `/api/reports/:id`   | moderator/admin   | Approve or reject a report                |
| GET    | `/api/alerts`        | —                 | List community alerts                     |

Sessions are JSON Web Tokens sent as `Authorization: Bearer <token>`.
Passwords are hashed with bcrypt and never stored or returned in plain text.

## Data

Everything is stored in `data/db.json` (created automatically, git-ignored).
It's fine for a demo or small deployment; swap `src/db.js` for a real
database (Postgres, etc.) later without touching the routes much, since
they only talk to `db.get(...)`.

## Notes

- `CORS_ORIGIN` in `.env` defaults to `*` for local development — lock this
  down to your real frontend origin before deploying.
- Login attempts are rate-limited (20 per 15 minutes per IP) to slow down
  brute-force guessing.
