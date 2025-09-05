-- Queue table to request historical catch-up to be handled server-side
create table if not exists public.sync_catchup_requests (
  user_id uuid primary key,
  status text not null default 'queued' check (status in ('queued','processing','done','error')),
  requested_at timestamptz not null default now(),
  processed_at timestamptz,
  last_error text
);

alter table if exists public.sync_catchup_requests enable row level security;

-- Allow users to insert/see their own request
do $$ begin
  create policy sync_catchup_requests_select_own
    on public.sync_catchup_requests
    for select
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy sync_catchup_requests_insert_own
    on public.sync_catchup_requests
    for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Allow users to mark as done on their own (optional); service_role can always update
do $$ begin
  create policy sync_catchup_requests_update_own
    on public.sync_catchup_requests
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

