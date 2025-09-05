-- Store Google Calendar event attachment metadata (Drive links)
create table if not exists public.g_event_attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  google_calendar_id text not null,
  google_event_id text not null,
  title text,
  mime_type text,
  file_url text,
  file_id text,
  icon_link text,
  identity_key text generated always as (coalesce(file_id, file_url)) stored,
  created_at timestamptz not null default now(),
  unique (user_id, google_calendar_id, google_event_id, identity_key)
);
create index if not exists g_event_attachments_evt_idx on public.g_event_attachments(user_id, google_calendar_id, google_event_id);
