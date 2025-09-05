-- Core tables for Google OAuth, sync progress, console logs, emails and events
create extension if not exists pgcrypto;

-- Stores user OAuth tokens for Google
create table if not exists public.google_auth_tokens (
  user_id uuid primary key,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

-- Console/messages stream for the dashboard
create table if not exists public.google_sync_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  run_id text,
  sync_type text not null check (sync_type in ('gmail','calendar')),
  level text default 'info',
  message text not null,
  created_at timestamptz not null default now()
);
create index if not exists google_sync_messages_user_created_idx on public.google_sync_messages(user_id, created_at desc);

-- Gmail per-week progress
create table if not exists public.g_email_sync_progress (
  user_id uuid not null,
  year int not null,
  week int not null,
  sync_status text check (sync_status in ('not_started','running','paused','completed','partial','error')) default 'not_started',
  error_message text,
  total_messages int,
  processed_messages int,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz default now(),
  current_run_id text,
  primary key (user_id, year, week)
);

-- Stored Gmail messages (subset of fields)
create table if not exists public.g_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  gmail_message_id text unique not null,
  thread_id text,
  from_email text,
  to_emails text[],
  cc_emails text[],
  bcc_emails text[],
  subject text,
  body_text text,
  body_html text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists g_emails_user_sent_idx on public.g_emails(user_id, sent_at desc nulls last);

-- Calendar per-month progress
create table if not exists public.g_event_sync_progress (
  user_id uuid not null,
  calendar_id text not null,
  year int not null,
  month int not null,
  sync_status text check (sync_status in ('not_started','running','paused','completed','partial','error')) default 'not_started',
  error_message text,
  total_events int,
  processed_events int,
  last_sync_token text,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz default now(),
  current_run_id text,
  primary key (user_id, calendar_id, year, month)
);

-- Stored Calendar events (subset of fields)
create table if not exists public.g_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  google_calendar_id text not null,
  google_event_id text not null,
  summary text,
  description text,
  start_time timestamptz,
  end_time timestamptz,
  organizer_email text,
  attendees jsonb,
  location text,
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, google_calendar_id, google_event_id)
);
create index if not exists g_events_user_start_idx on public.g_events(user_id, start_time desc nulls last);

-- Optional: list of emails to match against (to be populated from Airtable)
create table if not exists public.email_filter_addresses (
  email text primary key,
  last_synced_at timestamptz default now()
);

