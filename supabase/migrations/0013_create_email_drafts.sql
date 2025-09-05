create table if not exists public.email_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  to_emails text[] default '{}',
  cc_emails text[] default '{}',
  bcc_emails text[] default '{}',
  subject text,
  body text,
  updated_at timestamptz not null default now()
);
create index if not exists email_drafts_user_idx on public.email_drafts(user_id, updated_at desc);

