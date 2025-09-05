create table if not exists public.google_sync_settings (
  user_id uuid primary key,
  sync_start_date timestamptz not null,
  updated_at timestamptz not null default now()
);
create index if not exists google_sync_settings_updated_idx on public.google_sync_settings(updated_at desc);

