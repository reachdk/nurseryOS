-- REA-33: users and roles foundation

create type public.user_status as enum ('active', 'inactive');

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  role_name text not null,
  permissions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  constraint roles_role_name_unique unique (role_name),
  constraint roles_permissions_is_array check (jsonb_typeof(permissions) = 'array')
);

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  mobile text,
  email text,
  role_id uuid not null references public.roles (id),
  status public.user_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index users_mobile_unique on public.users (mobile) where mobile is not null;
create unique index users_email_unique on public.users (email) where email is not null;
create index users_role_id_idx on public.users (role_id);
create index users_status_idx on public.users (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

-- Default roles (permissions align with architecture §11; REA-32 will enforce in app code)
insert into public.roles (role_name, permissions) values
  (
    'Admin',
    '[
      "view_dashboard","manage_users","manage_plant_master","create_batch",
      "record_batch_loss","mark_batch_ready","create_customer","create_advance_order",
      "reserve_stock","override_overbooking","release_reservation","fulfill_order",
      "import_vyapar","view_reports","export_data","view_audit_logs"
    ]'::jsonb
  ),
  (
    'Nursery Supervisor',
    '[
      "view_dashboard","create_batch","record_batch_loss","mark_batch_ready",
      "create_customer","view_reports"
    ]'::jsonb
  ),
  (
    'Counter Staff',
    '[
      "view_dashboard","create_customer","create_advance_order","reserve_stock",
      "fulfill_order","view_reports"
    ]'::jsonb
  ),
  (
    'Order Taker',
    '[
      "view_dashboard","create_customer","create_advance_order","reserve_stock",
      "view_reports"
    ]'::jsonb
  ),
  (
    'Planning User',
    '[
      "view_dashboard","manage_plant_master","create_customer","create_advance_order",
      "reserve_stock","release_reservation","fulfill_order","import_vyapar",
      "view_reports","export_data","view_audit_logs"
    ]'::jsonb
  ),
  (
    'Viewer',
    '["view_dashboard","view_reports"]'::jsonb
  );

-- RLS
alter table public.roles enable row level security;
alter table public.users enable row level security;

create policy "Authenticated users can read roles"
on public.roles
for select
to authenticated
using (true);

create policy "Users can read own profile"
on public.users
for select
to authenticated
using (auth.uid() = id);

create policy "Admins can manage users"
on public.users
for all
to authenticated
using (
  exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and u.status = 'active'
      and r.permissions @> '["manage_users"]'::jsonb
  )
)
with check (
  exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and u.status = 'active'
      and r.permissions @> '["manage_users"]'::jsonb
  )
);

create policy "Service role full access to roles"
on public.roles
for all
to service_role
using (true)
with check (true);

create policy "Service role full access to users"
on public.users
for all
to service_role
using (true)
with check (true);
