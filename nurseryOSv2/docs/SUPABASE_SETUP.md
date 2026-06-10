# Supabase setup — nurseryOSv2

Use a **dedicated Supabase project** for v2 (recommended name: `nurseryOSv2`). Do not share the v1 `nurseryOS` database — v2 uses Supabase migrations, not Prisma.

---

## Option A — Remote Supabase project (recommended)

### 1. Create the project

1. Open [supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → name `nurseryOSv2` (or similar)
3. Choose region close to your nursery (e.g. South Asia)
4. Save the **database password** in a password manager

### 2. Copy API keys

**Project Settings → API**

| Dashboard | `.env` variable |
|-----------|-----------------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| anon public key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| service_role key | `SUPABASE_SERVICE_ROLE_KEY` |

The service role key is **server-only**. Never prefix it with `NEXT_PUBLIC_`.

### 3. Copy database URL (migrations)

**Connect → Direct connection** (port **5432**):

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[project-ref].supabase.co:5432/postgres"
```

Use this for `supabase db push` / linked remote migrations in later waves.

### 4. Configure Auth (Wave 1+)

When REA-35 lands:

1. **Authentication → Providers** → enable Email
2. Disable public sign-up (staff-only)
3. Create staff users under **Authentication → Users**

### 5. Link CLI to remote project

From `nurseryOSv2/`:

```bash
npx supabase login
npx supabase link --project-ref [your-project-ref]
```

Project ref is the subdomain in your URL: `https://[project-ref].supabase.co`

### 6. Verify connection

```bash
cp .env.example .env
# paste keys from steps 2–3
npm run dev
curl http://localhost:3000/api/health
```

Expected when configured:

```json
{"ok":true,"app":"nurseryosv2","supabase":"connected","timestamp":"..."}
```

---

## Option B — Local Supabase (Docker)

For offline development without a remote project.

### 1. Requirements

- Docker Desktop running

### 2. Start local stack

```bash
npm install
npx supabase init   # already done if supabase/ exists
npm run supabase:start
npm run supabase:status
```

Copy **API URL**, **anon key**, and **service_role key** from status output into `.env`.

Local defaults:

```env
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
```

### 3. Stop local stack

```bash
npm run supabase:stop
```

---

## Migrations (Wave 1+)

SQL migrations live in `database/migrations/`. Apply with:

```bash
# Local
npm run db:reset

# Remote (after supabase link)
npx supabase db push
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `/api/health` → `not_configured` | Fill `NEXT_PUBLIC_*` vars in `.env`, restart dev server |
| `/api/health` → `error` | Check URL/key; ensure project is not paused |
| `supabase start` fails | Start Docker Desktop |
| Special chars in DB password | Reset password to alphanumeric in dashboard |

---

## Security checklist (v2)

- Enable RLS on every `public` table (REA-33+)
- Never commit `.env`
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- Do not use `user_metadata` for authorization in RLS policies

Official docs: [Supabase + Next.js SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)
