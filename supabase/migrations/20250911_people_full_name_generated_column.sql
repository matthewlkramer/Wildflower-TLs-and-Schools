-- SAFER MIGRATION: Add a parallel generated column without touching dependent views
-- Rationale: many existing views depend on people.full_name; dropping/renaming breaks them.
-- This migration adds people.full_name_new as a generated column matching the desired rule.
-- The trigger from 20250910_add_people_full_name_trigger.sql already keeps full_name in sync.

-- Add a new generated column (immutable expression)
alter table public.people
  add column if not exists full_name_new text
  generated always as (
    btrim(
      coalesce(nullif(nickname,''), nullif(first_name,''), '') || ' ' || coalesce(nullif(last_name,''), '')
    )
  ) stored;

-- Note: We are intentionally not dropping or renaming columns here due to
-- dependencies. Applications and views can migrate to use full_name_new
-- opportunistically; once all dependencies are updated, a later migration can
-- rename full_name_new -> full_name.
