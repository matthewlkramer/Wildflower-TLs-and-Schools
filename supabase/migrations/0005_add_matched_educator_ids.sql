-- Add matched_educator_ids to g_emails for linking to educator records
alter table if exists public.g_emails
  add column if not exists matched_educator_ids text[];
