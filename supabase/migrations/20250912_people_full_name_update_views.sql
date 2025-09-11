-- Update all views that depend on public.people.full_name to use full_name_new
-- This avoids hand-editing view SQL and mismatches with your live schema.

-- Ensure the generated column exists (idempotent); if already added, this will be a no-op.
alter table public.people
  add column if not exists full_name_new text
  generated always as (
    btrim(coalesce(nullif(nickname,''), nullif(first_name,''), '') || ' ' || coalesce(nullif(last_name,''), ''))
  ) stored;

-- Rewrite view definitions to reference people.full_name_new instead of people.full_name
do $$
declare
  r record;
  vdef text;
  newdef text;
begin
  for r in (
    select c.oid as view_oid, n.nspname as schemaname, c.relname as viewname
    from pg_attribute a
    join pg_depend d on d.refobjid = a.attrelid and d.refobjsubid = a.attnum
    join pg_class c on c.oid = d.objid
    join pg_namespace n on n.oid = c.relnamespace
    where a.attrelid = 'public.people'::regclass
      and a.attname = 'full_name'
      and c.relkind = 'v'
  ) loop
    vdef := pg_get_viewdef(r.view_oid, true);
    newdef := vdef;

    -- Replace fully-qualified and common alias references. Keep output aliases intact.
    newdef := regexp_replace(newdef, '"public"\."people"\.full_name', '"public"."people".full_name_new', 'gi');
    newdef := regexp_replace(newdef, '\bpeople\.full_name\b', 'people.full_name_new', 'gi');
    newdef := regexp_replace(newdef, '"p"\.full_name\b', '"p".full_name_new', 'gi');
    newdef := regexp_replace(newdef, '\bp\.full_name\b', 'p.full_name_new', 'gi');

    if newdef is distinct from vdef then
      execute format('create or replace view %I.%I as %s', r.schemaname, r.viewname, newdef);
    end if;
  end loop;
end$$;

-- At this point, all dependent views should no longer depend on people.full_name.
-- You can now (in a later migration) drop the trigger/function and swap columns.
