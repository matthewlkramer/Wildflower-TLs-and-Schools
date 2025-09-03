-- Queue for Gmail backfill of bodies for emails that were previously header-only
create table if not exists public.g_email_backfill_queue (
  user_id uuid not null,
  gmail_message_id text not null,
  enqueued_at timestamptz not null default now(),
  status text check (status in ('queued','done','error')) default 'queued',
  attempts int not null default 0,
  last_attempt_at timestamptz,
  error_message text,
  primary key (user_id, gmail_message_id)
);
create index if not exists g_email_backfill_queue_user_enqueued_idx on public.g_email_backfill_queue(user_id, enqueued_at asc);

