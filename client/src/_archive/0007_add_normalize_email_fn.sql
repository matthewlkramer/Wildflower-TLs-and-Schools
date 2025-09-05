-- Define normalize_email(text) locally so remote schema snapshots can
-- create indexes that reference it during `supabase db pull`.
-- Idempotent: create or replace; immutable + strict.

create or replace function public.normalize_email(p text)
returns text
language sql
immutable
strict
as $$
  select lower(
    regexp_replace(
      regexp_replace(trim(p), '^mailto:', '', 'i'),
      '[\s<>\"]', '', 'g'
    )
  );
$$;

