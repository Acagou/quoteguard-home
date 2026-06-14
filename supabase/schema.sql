-- QuoteGuard Home starter schema.
-- Run this in a Supabase SQL editor or convert it into a migration once a project is selected.

create table if not exists public.quote_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  quote_text text not null,
  repair_type text,
  location text,
  urgency text,
  sensitive_items text[] not null default '{}',
  report jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.quote_reports enable row level security;

create policy "Users can read their own quote reports"
on public.quote_reports
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own quote reports"
on public.quote_reports
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own quote reports"
on public.quote_reports
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own quote reports"
on public.quote_reports
for delete
to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete on public.quote_reports to authenticated;
grant all on public.quote_reports to service_role;
