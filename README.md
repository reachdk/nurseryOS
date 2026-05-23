# NurseryOS

Mobile-first nursery **inventory** tracker. All sales and orders happen in **Vyapaar**; NurseryOS tracks stock in the nursery and office and updates from end-of-day Vyapaar exports.

Hosted on **Vercel** with **Supabase Postgres** and **Supabase Auth** (email + password, invite-only staff).

## Quick start (local)

1. Complete [Supabase setup (step-by-step)](docs/SUPABASE_SETUP.md) — connection strings, auth, staff users.
2. Copy [`.env.example`](.env.example) to `.env` and fill in values.
3. Run:

```bash
npm install
npm run db:migrate:deploy   # or db:migrate for dev (creates migration history)
npm run db:seed             # optional demo data
npm run dev
```

Open http://localhost:3000 — you will be redirected to **Sign in**.

## Deploy (Vercel)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Set environment variables (Production + Preview):

   | Variable | Source |
   |----------|--------|
   | `DATABASE_URL` | Supabase → Transaction pooler (port 6543) |
   | `DIRECT_URL` | Supabase → Direct connection (port 5432) |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → anon public key |

3. Deploy. The build runs `prisma migrate deploy` then `next build`.
4. Create staff users in Supabase → Authentication → Users (sign-ups disabled).
5. Set Supabase Auth URLs for production — see [docs/VERCEL_DEPLOY.md](docs/VERCEL_DEPLOY.md#4-supabase-auth-urls-required-for-production-login).

**Live app:** https://nursery-os.vercel.app

See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for details.

## Daily workflow

### During the day (Vyapaar)

- Record all sales and advance orders in **Vyapaar** (party names, quantities, invoices).

### In NurseryOS

1. **Plants** — Add crop types (unique name, required typical days to ready).
2. **Plant** — Record planting batches (planted date + expected ready date).
3. **Plant detail** — Move partial quantities to office; record nursery loss if needed.
4. **Sync** (end of day) — Export today’s sales from Vyapaar (CSV or Excel), upload → preview → import. Office stock goes down.

### Vyapaar export

1. Vyapaar app → **Reports** → **Sales** (or Transaction report).
2. Filter today’s date → export **CSV** (preferred) or Excel.
3. NurseryOS → **Sync** → upload file.

### Keeping names in sync

- Best: use the **same item name** in Vyapaar and NurseryOS.
- When names differ: **Sync** → **Vyapaar product name mappings** — link Vyapaar item text to your plant.

## What each screen shows

| Field | Meaning |
|-------|---------|
| In nursery | Still in poly house (batches) |
| In office | Moved to sales area |
| Free to sell | Office + nursery batches ready today or earlier (EOD sync deducts from this total) |
| Ready in nursery | Past/today ready date, still in poly house (included in free to sell) |
| Coming soon | Nursery batches with a future ready date |

## Nav

| Tab | Purpose |
|-----|---------|
| Home | Stock overview |
| Plants | List + add plant |
| Plant | New batch |
| Sync | Vyapaar EOD import + mappings link |

## Tests

```bash
npm test          # run once
npm run test:watch
```

Unit tests cover availability (ready vs upcoming nursery), sellable stock merge, and Vyapaar CSV parsing.

## Auth

- All routes require sign-in except `/login` and `/auth/callback`.
- Staff accounts are created in the Supabase dashboard (public sign-up should be disabled).
- Mutations are recorded in `AuditLog` (who did what).

## Desktop

The layout widens on large screens (`lg` / `xl`). Use any desktop browser; no separate app.
