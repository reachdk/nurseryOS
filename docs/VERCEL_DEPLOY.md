# Deploy NurseryOS to Vercel

Prerequisites: [Supabase setup](SUPABASE_SETUP.md) working locally (`npm run dev` + login).

## 1. Push to GitHub

Repo: `https://github.com/reachdk/nurseryOS`

```bash
git add -A
git restore --staged .env 2>/dev/null || true
git commit -m "Phase 1: Supabase Postgres, auth, audit log, Vercel-ready build"
git push origin main
```

Never commit `.env`.

## 2. Import on Vercel

1. [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import **reachdk/nurseryOS**
3. Framework: **Next.js** (default)
4. Add environment variables **before** first deploy (Step 3)
5. Deploy

## 3. Environment variables

Vercel → Project → **Settings** → **Environment Variables**

Add for **Production** and **Preview** (copy from local `.env`):

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Transaction pooler, port **6543**, `?pgbouncer=true` |
| `DIRECT_URL` | Port **5432** |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://gfvihyroketlfzlsdmoo.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key from Supabase API settings |

Redeploy after adding or changing env vars.

## 4. Supabase Auth URLs (required for production login)

Supabase → **Authentication** → **URL Configuration**

**Production NurseryOS URL:** `https://nursery-os.vercel.app`

| Field | Value |
|-------|--------|
| **Site URL** | `https://nursery-os.vercel.app` |
| **Redirect URLs** | `https://nursery-os.vercel.app/**` |
| | `http://localhost:3000/**` |

Click **Save** after editing.

## 5. Smoke test (production)

- [ ] `/` → redirects to `/login`
- [ ] Staff sign-in works
- [ ] Home / Plants / batch / move / loss
- [ ] Sync: Vyapaar CSV preview + import
- [ ] Supabase **Table Editor** → `AuditLog` rows after changes

## 6. Staff rollout

- Share the Vercel URL (phone + desktop bookmarks)
- Each person needs a user in Supabase → **Authentication** → **Users**
- Keep **Enable sign ups** OFF

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build: migrate failed | Check `DIRECT_URL` (5432) on Vercel |
| Supabase client error on prod | All four env vars set; redeploy |
| Login works locally, not on Vercel | Update Supabase Site URL + Redirect URLs |
| `URL and Key are required` locally | Restart `npm run dev` after editing `.env` |
