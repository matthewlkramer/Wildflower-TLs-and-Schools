-- RLS policies for per-user upsert/select on google_sync_settings
alter table if exists public.google_sync_settings enable row level security;

do $$ begin
  create policy google_sync_settings_select_own
    on public.google_sync_settings
    for select
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy google_sync_settings_insert_own
    on public.google_sync_settings
    for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy google_sync_settings_update_own
    on public.google_sync_settings
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

