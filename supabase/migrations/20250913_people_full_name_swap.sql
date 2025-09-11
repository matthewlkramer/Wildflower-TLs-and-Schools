-- Finalize swap to generated column named full_name
-- Pre-req: 20250912 migration moved all dependent views to reference people.full_name_new

-- 0) Ensure the generated column exists (idempotent)
alter table public.people
  add column if not exists full_name_new text
  generated always as (
    btrim(coalesce(nullif(nickname,''), nullif(first_name,''), '') || ' ' || coalesce(nullif(last_name,''), ''))
  ) stored;

-- 1) Proactively rewrite any remaining dependent views to use full_name_new
do $$
declare
  r record;
  vdef text;
  newdef text;
  rewrites int := 1;
  cols_p text;
  cols_people text;
begin
  -- Repeat until no dependent views remain or no further textual changes occur
  while rewrites > 0 loop
    rewrites := 0;
    for r in (
      select distinct c.oid as view_oid, n.nspname as schemaname, c.relname as viewname
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

      -- Replace a broad set of reference patterns (quoted/unquoted, with casts)
      newdef := regexp_replace(newdef, '"public"\."people"\."full_name"(\s*::[a-zA-Z_][a-zA-Z0-9_]*)?', '"public"."people"."full_name_new"\1', 'gi');
      newdef := regexp_replace(newdef, '"public"\."people"\.full_name(\s*::[a-zA-Z_][a-zA-Z0-9_]*)?', '"public"."people".full_name_new\1', 'gi');
      newdef := regexp_replace(newdef, 'public\.people\."full_name"(\s*::[a-zA-Z_][a-zA-Z0-9_]*)?', 'public.people."full_name_new"\1', 'gi');
      newdef := regexp_replace(newdef, 'public\.people\.full_name(\s*::[a-zA-Z_][a-zA-Z0-9_]*)?', 'public.people.full_name_new\1', 'gi');
      newdef := regexp_replace(newdef, '"people"\."full_name"(\s*::[a-zA-Z_][a-zA-Z0-9_]*)?', '"people"."full_name_new"\1', 'gi');
      newdef := regexp_replace(newdef, '\bpeople\."full_name"(\s*::[a-zA-Z_][a-zA-Z0-9_]*)?', 'people."full_name_new"\1', 'gi');
      newdef := regexp_replace(newdef, '\bpeople\.full_name(\s*::[a-zA-Z_][a-zA-Z0-9_]*)?', 'people.full_name_new\1', 'gi');
      newdef := regexp_replace(newdef, '"p"\."full_name"(\s*::[a-zA-Z_][a-zA-Z0-9_]*)?', '"p"."full_name_new"\1', 'gi');
      newdef := regexp_replace(newdef, '\bp\."full_name"(\s*::[a-zA-Z_][a-zA-Z0-9_]*)?', 'p."full_name_new"\1', 'gi');
      newdef := regexp_replace(newdef, '\bp\.full_name(\s*::[a-zA-Z_][a-zA-Z0-9_]*)?', 'p.full_name_new\1', 'gi');

      -- Expand star selections for alias p and for unaliased people
      select string_agg(format('%I.%I', 'p', c.column_name), ', ' order by c.ordinal_position)
        into cols_p
      from information_schema.columns c
      where c.table_schema = 'public' and c.table_name = 'people' and c.column_name not in ('full_name','full_name_new');

      if cols_p is null then cols_p := ''; end if;

      newdef := regexp_replace(
        newdef,
        '"p"\.\*',
        format('"p"."full_name_new" as full_name%s%s', case when cols_p <> '' then ', ' else '' end, cols_p),
        'gi'
      );
      newdef := regexp_replace(
        newdef,
        '\bp\.\*',
        format('p."full_name_new" as full_name%s%s', case when cols_p <> '' then ', ' else '' end, cols_p),
        'gi'
      );

      select string_agg(format('%I.%I', 'people', c.column_name), ', ' order by c.ordinal_position)
        into cols_people
      from information_schema.columns c
      where c.table_schema = 'public' and c.table_name = 'people' and c.column_name not in ('full_name','full_name_new');
      if cols_people is null then cols_people := ''; end if;

      newdef := regexp_replace(
        newdef,
        '"people"\.\*',
        format('"people"."full_name_new" as full_name%s%s', case when cols_people <> '' then ', ' else '' end, cols_people),
        'gi'
      );
      newdef := regexp_replace(
        newdef,
        '\bpeople\.\*',
        format('people."full_name_new" as full_name%s%s', case when cols_people <> '' then ', ' else '' end, cols_people),
        'gi'
      );

      if newdef is distinct from vdef then
        execute format('create or replace view %I.%I as %s', r.schemaname, r.viewname, newdef);
        rewrites := rewrites + 1;
      end if;
    end loop;

    -- Exit if nothing changed this pass
    exit when rewrites = 0;
  end loop;
end$$;

-- Drop trigger/function from the earlier trigger-based approach (idempotent)
drop trigger if exists trg_people_set_full_name on public.people;
drop function if exists public.people_set_full_name();

-- Drop the old full_name column if it still exists
alter table public.people drop column if exists full_name;

-- Rename generated column into place if needed
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'people' and column_name = 'full_name_new'
  ) then
    alter table public.people rename column full_name_new to full_name;
  end if;
end$$;

-- Optional: Views that previously referenced full_name_new will now reference the renamed column.
-- If any textual occurrences remain (rare), they can be refreshed separately.
