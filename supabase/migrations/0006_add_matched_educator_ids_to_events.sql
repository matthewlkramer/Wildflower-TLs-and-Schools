-- Add matched_educator_ids to g_events for linking to educator records
alter table if exists public.g_events
  add column if not exists matched_educator_ids text[];
