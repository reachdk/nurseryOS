# Supabase setup for NurseryOS (beginner guide)

You already created the **nurseryOS** project. Follow these steps in order.

---

## What you are setting up

| Variable | What it is |
|----------|------------|
| `DATABASE_URL` | App talks to Postgres (pooled, port **6543**) |
| `DIRECT_URL` | Prisma runs migrations (direct, port **5432**) |
| `NEXT_PUBLIC_SUPABASE_URL` | Auth API base URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key for login in the browser |

All four go in a file named `.env` in the project root (copy from [`.env.example`](../.env.example)).

---

## Step 1 — Find your database password

When you created the project, Supabase asked for a **database password**. You need that password in every connection string.

**Forgot it?**

1. Open [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click project **nurseryOS**
3. Left sidebar: **Project Settings** (gear icon at bottom)
4. Click **Database**
5. Under **Database password** → **Reset database password**
6. Copy the new password somewhere safe (password manager)

You will paste this password into the connection strings in Step 2 (replace `[YOUR-PASSWORD]`).

---

## Step 2 — Copy database connection strings

Supabase moved this UI. Use the **Connect** button, not an old “Database → Prisma” menu.

1. On the **nurseryOS** project home, top of the page, click green **Connect**
2. A panel opens. You may see tabs like **App frameworks**, **ORMs**, **MCP**, etc.

### Option A — “Connect” panel (recommended)

1. In the Connect panel, look for **ORMs** or **Prisma** (wording varies)
2. Or choose **Connection string** / **Postgres**
3. You need **two** strings:

#### A) Transaction pooler → `DATABASE_URL`

- Label is often **Transaction pooler** or **Transaction mode**
- Port must be **6543**
- Host often looks like: `aws-0-ap-south-1.pooler.supabase.com` (region varies)
- User often looks like: `postgres.abcdefghijklmnop` (project ref after the dot)

Copy the URI. It should look similar to:

```text
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Important for Prisma:** add `?pgbouncer=true` at the end if it is not already there:

```text
...6543/postgres?pgbouncer=true
```

#### B) Direct connection → `DIRECT_URL`

- Label is **Direct connection** (not transaction pooler)
- Port must be **5432**
- Host often looks like: `db.abcdefghijklmnop.supabase.co`

Copy the URI. Example:

```text
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Replace `[YOUR-PASSWORD]` with the password from Step 1.

### Option B — Project Settings → Database

If you do not see Prisma in Connect:

1. **Project Settings** (gear) → **Database**
2. Scroll to **Connection string**
3. Use the same two modes: **Transaction** (6543) and **Direct** (5432)

### Quick check

| Variable | Port | Used for |
|----------|------|----------|
| `DATABASE_URL` | **6543** | Running the app (`npm run dev`, Vercel) |
| `DIRECT_URL` | **5432** | Migrations only (`npm run db:migrate:deploy`) |

Do **not** use the same URL for both.

---

## Step 3 — Copy Auth URL and anon key

1. **Project Settings** (gear) → **API** (sometimes listed as **Data API** / **API Keys**)
2. Copy:

| Dashboard label | Put in `.env` as |
|-----------------|------------------|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon** `public` key (long string starting with `eyJ...`) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

Use the **anon public** key, not the `service_role` key (that one must never go in the browser).

---

## Step 4 — Create your `.env` file

In the NurseryOS folder on your computer:

```bash
cd /Users/deepak.kumar/code/nurseryOS
cp .env.example .env
```

Open `.env` in your editor and paste your real values. Example shape:

```env
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxx:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxxxx.supabase.co:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Rules:

- Keep the quotes
- No spaces around `=`
- **No comments on the same line** as a value (e.g. don’t put `# anon key` after the JWT line — it can break parsing)
- After changing `.env`, **stop and restart** `npm run dev` (Ctrl+C, then run again). Hot reload does not pick up new env vars.
- Password special characters (`@`, `#`, `%`) — if login or migrate fails, reset DB password to letters and numbers only

---

## Step 5 — Turn on email login (staff only)

1. Left sidebar: **Authentication**
2. **Sign In / Providers** (or **Providers**)
3. **Email** → enable (toggle on)
4. Optional: turn off “Confirm email” for internal staff so they can log in immediately

### Block public sign-up (recommended)

1. **Authentication** → **Sign In / Providers** or **Settings**
2. Find **Allow new users to sign up** / **Enable sign ups**
3. Turn it **OFF** so only users you create can log in

---

## Step 6 — Create staff user accounts

1. **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email + password (e.g. your phone Gmail and a password you will remember)
4. Repeat for each staff member

These are the credentials you use on NurseryOS `/login`.

---

## Step 7 — Create tables in Supabase (run migrations)

Back in your terminal (project folder, with `.env` filled in):

```bash
npm install
npm run db:migrate:deploy
```

Expected: `Applying migration ... init_postgres` with no errors.

Optional demo plants:

```bash
npm run db:seed
```

Start the app:

```bash
npm run dev
```

Open http://localhost:3000 → you should see **Sign in** → use the email/password from Step 6.

---

## Step 8 — Confirm tables exist (optional)

1. Supabase dashboard → **Table Editor** (left sidebar)
2. You should see: `PlantType`, `PlantingBatch`, `InventoryLot`, `Sale`, `VyapaarProductMap`, `AuditLog`

If Table Editor is empty, Step 7 failed — check terminal errors and `.env` passwords/ports.

---

## Step 9 — Deploy to Vercel (when ready)

1. Push code to GitHub
2. [vercel.com](https://vercel.com) → Import **nurseryOS** repo
3. Add the **same four** env vars as in `.env`
4. Deploy (build runs migrations automatically)

Create staff users in Supabase before sharing the Vercel URL.

---

## Troubleshooting

### “Can’t reach database server” / migrate fails

- `DIRECT_URL` must be port **5432** (direct), not 6543
- `DATABASE_URL` must be port **6543** (transaction pooler)
- Password correct? Try reset in Project Settings → Database

### “URL and Key are required to create a Supabase client”

- Confirm `.env` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from **Project Settings → API**)
- Remove any `# comment` on the same line as the anon key
- **Restart** the dev server completely (kill the old terminal running `next dev`)
- In the terminal you should see: `Environments: .env` when Next starts

### Login works locally but not on Vercel

- All four env vars set on Vercel (Production)
- `NEXT_PUBLIC_*` vars must be set for Production, not only Preview

### “Invalid login credentials”

- User exists under Authentication → Users?
- Using the same email/password you created there (not your Supabase account password)

### Connect panel looks different

Supabase updates the UI often. Always pick:

- **6543** + transaction → `DATABASE_URL` + `?pgbouncer=true`
- **5432** + direct → `DIRECT_URL`

If stuck, open **Project Settings → Database** and use the connection string section there.

---

## Official references

- [Connect to Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Prisma + Supabase](https://supabase.com/docs/guides/database/prisma)
