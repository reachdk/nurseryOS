# Migrations

Supabase CLI applies SQL from [`supabase/migrations/`](../supabase/migrations/).

This folder mirrors the architecture layout (`database/migrations/`). New migration files should be created with:

```bash
npx supabase migration new descriptive_name
```

That writes to `supabase/migrations/` — the canonical path for the CLI.
