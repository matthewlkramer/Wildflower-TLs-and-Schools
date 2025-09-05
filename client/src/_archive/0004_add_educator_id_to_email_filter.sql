-- Add educator_id to email_filter_addresses for linking emails to educators
alter table if exists public.email_filter_addresses
  add column if not exists educator_id text;

-- Optional: index for lookups by educator
create index if not exists email_filter_addresses_educator_idx on public.email_filter_addresses(educator_id);

