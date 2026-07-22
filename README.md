# Running the App — Demo / Presentation Guide

Repo: `https://github.com/totnotvin/FishFerries.git`

Two things worth knowing before you start, both because of what's in
`.gitignore`:

1. **`.env` is not committed.** You must create it by hand on every new
   machine (instructions below).
2. **`dev.db` (the SQLite database) *is* committed**, already seeded with 5
   demo accounts and sample bookings/hotels/events. So a fresh clone already
   has working demo data — you don't strictly need to run migrations/seed
   again unless you want a clean slate.

Also not committed: `node_modules/`, `.next/`, and the generated Prisma
client at `src/generated/prisma/` — all three get created by the install/
generate steps below.

---

## Linux

```bash
# 1. Get the code
git clone https://github.com/totnotvin/FishFerries.git picnic-island-booking
cd picnic-island-booking

# 2. Install dependencies (Node 20+ required — check with `node -v`)
npm install

# 3. Create the .env file (values below are fine for a local demo)
cat > .env <<'EOF'
DATABASE_URL="file:./dev.db"
AUTH_SECRET="local-demo-secret-change-me"
EOF

# 4. Generate the Prisma client (not committed, must run once after install)
npx prisma generate

# 5. Run it
npm run dev
```

Open **http://localhost:3000**.

If `npm install` fails while compiling `better-sqlite3` (a native module),
install build tools first: `sudo apt install build-essential python3` (Debian/
Ubuntu) or the equivalent for your distro, then re-run `npm install`. This is
rare — most Linux setups get a prebuilt binary and skip compilation entirely.

## Windows

Same steps, just adjust how you create `.env` (PowerShell doesn't understand
heredocs the same way) and use PowerShell or CMD instead of bash:

```powershell
# 1. Get the code
git clone https://github.com/totnotvin/FishFerries.git picnic-island-booking
cd picnic-island-booking

# 2. Install dependencies (Node 20+ required — check with `node -v`)
npm install

# 3. Create the .env file
@"
DATABASE_URL="file:./dev.db"
AUTH_SECRET="local-demo-secret-change-me"
"@ | Out-File -Encoding utf8 .env

# 4. Generate the Prisma client
npx prisma generate

# 5. Run it
npm run dev
```

Open **http://localhost:3000** in a browser.

Notes for Windows:
- Windows Defender/Firewall may pop up asking to allow Node.js to accept
  connections the first time you run `npm run dev` — click **Allow**.
- If `npm install` fails compiling `better-sqlite3`, install the
  "Desktop development with C++" workload via the [Visual Studio Build
  Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/), then
  re-run `npm install`. Again, this is uncommon — a prebuilt binary usually
  covers standard Windows/Node combinations.
- If you don't have Git installed and were just handed a zipped folder
  instead, skip step 1 and `cd` into the extracted folder — everything else
  is identical.

---

## Demo login credentials

The seed data (already in the committed `dev.db`) includes one account per
role, password `password123` for all of them:

| Role | Email |
|---|---|
| Visitor | `visitor@picnicisland.test` |
| Hotel Staff | `hotel@picnicisland.test` |
| Ferry Staff | `ferry@picnicisland.test` |
| Theme Park Staff | `park@picnicisland.test` |
| Admin | `admin@picnicisland.test` |

The `/login` page also has one-click **demo quick login** buttons for each
role, so you don't need to type these during the actual presentation.

## Optional: reset the database to a clean state

If you want booking counts/revenue to look freshly-seeded right before you
present (rather than whatever state it's in after testing), delete and
re-seed:

```bash
# from the project root, either OS
rm dev.db          # Windows: del dev.db
npx prisma migrate deploy
npx prisma db seed
```

## Optional: demo in production mode

`npm run dev` is fine for a demo, but if you want to avoid the first-load
compile flicker Turbopack does on each new route, build once and run the
production server instead:

```bash
npm run build
npm run start
```

Same URL (`http://localhost:3000`), just faster/steadier for a live audience.

## Before you actually present

Do one full run-through beforehand: quick-login as each of the 5 roles and
click through their dashboard, and walk the visitor golden path once
(register/login → book a hotel → book a ferry ticket → book a park
event/beach event → view it under "My Bookings"). That's the fastest way to
catch anything that looks off before you're doing it live.
