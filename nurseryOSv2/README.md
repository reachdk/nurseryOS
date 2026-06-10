# nurseryOSv2

Nursery inventory, advance order, and availability management MVP.

**Stack:** Next.js · TypeScript · Tailwind CSS · Supabase (Postgres, Auth, Storage)

## Prerequisites

- Node.js 20+
- npm
- [Supabase account](https://supabase.com) (remote project) **or** Docker (local Supabase via CLI)

## Quick start

```bash
cd nurseryOSv2
npm install
cp .env.example .env
# Fill in .env — see docs/SUPABASE_SETUP.md
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Vitest unit tests |
| `npm run supabase:start` | Start local Supabase (Docker) |
| `npm run supabase:status` | Print local Supabase URLs and keys |
| `npm run db:reset` | Reset local DB and re-apply migrations |

## Project structure

Matches [nurseryOSv2Architecture.md](./nurseryOSv2Architecture.md) §7:

```text
app/              Next.js routes (dashboard, counter, orders, …)
components/       Shared UI
server/
  services/       Domain business logic
  validators/     Zod/shared validation
  db/             Supabase clients + transactions
database/
  migrations/     Supabase SQL migrations
  views/          Postgres views
  seed/           Seed data
tests/            unit/ and integration/
docs/             Setup and workflow guides
```

## Linear

Engineering tickets live in the [nurseryOSv2 Linear project](https://linear.app/reachdk/project/nurseryosv2-198cf198f65f).

Wave 0 = **REA-34** (this scaffold).

## Spec docs

- [Product Specifications.md](./Product%20Specifications.md)
- [nurseryOSv2Architecture.md](./nurseryOSv2Architecture.md)
