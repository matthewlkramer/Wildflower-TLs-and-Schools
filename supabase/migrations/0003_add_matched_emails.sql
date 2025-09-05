-- Add matched_emails arrays to link messages/events to known contacts
alter table if exists public.g_emails
  add column if not exists matched_emails text[];
alter table if exists public.g_events
  add column if not exists matched_emails text[];
