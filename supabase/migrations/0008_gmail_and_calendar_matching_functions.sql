-- 0.a  Normalize a single email ("Name <email>" -> "email"; lower/trim)
create or replace function public.normalize_email(raw text)
returns text
language sql
immutable
strict
as $$
  select case
           when raw is null then null
           when raw ~ '<[^>]+>' then lower(trim(regexp_replace(raw, '.*<([^>]+)>.*', '\1')))
           else lower(trim(raw))
         end
$$;

-- 0.b  Expand a text[] that may contain:
--      - simple emails ("a@x")
--      - comma/semicolon lists ("a@x, b@y")
--      - JSON array strings ('["a@x","b@y"]')
--   …and emit a DISTINCT normalized set.
create or replace function public.extract_emails_from_text_array(arr text[])
returns table(email text)
language sql
immutable
as $$
  with raw as (
    select nullif(trim(x),'') as r
    from unnest(coalesce(arr,'{}')) as x
  )
  , expanded as (
    -- Case 1: JSON array strings
    select jsonb_array_elements_text(r::jsonb) as e
    from raw
    where r is not null and r ~ '^\s*\[.*\]\s*$'
    union all
    -- Case 2: split by comma/semicolon (covers simple emails too)
    select unnest(regexp_split_to_array(r, '\s*[,;]\s*')) as e
    from raw
    where r is not null and not (r ~ '^\s*\[.*\]\s*$')
  )
  select distinct public.normalize_email(e)
  from expanded
  where e is not null and public.normalize_email(e) <> ''
$$;

create index if not exists email_filter_addresses_email_norm_idx on public.email_filter_addresses (public.normalize_email(email));

create or replace function public.refresh_g_emails_matches(
  p_user_id uuid default null,                 -- Only this user (NULL = all)
  p_since   timestamptz default null,          -- Only sent_at >= p_since (NULL = all)
  p_merge   boolean default false              -- false = REPLACE, true = MERGE/UNION
)
returns integer
language plpgsql
security definer
set search_path = public
as $func$
declare
  updated_count integer := 0;
begin
  -- Ensure target columns
  alter table public.g_emails
    add column if not exists matched_emails text[],
    add column if not exists matched_educator_ids text[];

  with scope as (
    select g.*
    from public.g_emails g
    where (p_user_id is null or g.user_id = p_user_id)
      and (p_since   is null or g.sent_at >= p_since)
  ),
  participants as (
    -- Build one set of normalized emails per message
    select
      s.id as email_id,
      -- Collect FROM + TO/CC/BCC in one go, expanding mixed forms
      (
        select array_agg(distinct e.email)
        from (
          -- from_email (could contain commas, so wrap as single-element array)
          select email from public.extract_emails_from_text_array(array[coalesce(s.from_email,'')])
          union all
          -- to/cc/bcc arrays (may contain JSON array strings or comma lists)
          select email from public.extract_emails_from_text_array(s.to_emails)
          union all
          select email from public.extract_emails_from_text_array(s.cc_emails)
          union all
          select email from public.extract_emails_from_text_array(s.bcc_emails)
        ) e
        where e.email is not null and e.email <> ''
      ) as parties
    from scope s
  ),
  matches as (
    select
      p.email_id,
      -- matched addresses (only those present in filtered list)
      array_agg(distinct p2.email)                                         as matched_addrs,
      array_agg(distinct efa.educator_id) filter (where efa.educator_id is not null) as matched_ids
    from participants p
    left join lateral unnest(coalesce(p.parties,'{}')) as p2(email) on true
    join public.email_filter_addresses_filtered efa
      on public.normalize_email(efa.email) = p2.email
    group by p.email_id
  )
  update public.g_emails g
  set
    matched_emails = case
      when p_merge then
        (select array(
           select distinct v
           from unnest(coalesce(g.matched_emails,'{}') || coalesce(m.matched_addrs,'{}')) as v
         ))
      else coalesce(m.matched_addrs,'{}')
    end,
    matched_educator_ids = case
      when p_merge then
        (select array(
           select distinct v
           from unnest(coalesce(g.matched_educator_ids,'{}') || coalesce(m.matched_ids,'{}')) as v
         ))
      else coalesce(m.matched_ids,'{}')
    end,
    updated_at = now()
  from matches m
  where g.id = m.email_id;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  return updated_count;
end;
$func$;

-- Allow your app role(s) to call it:
grant execute on function public.refresh_g_emails_matches(uuid,timestamptz,boolean) to authenticated, service_role;

create or replace function public.refresh_g_events_matches(
  p_user_id uuid default null,                 -- Only this user (NULL = all)
  p_since   timestamptz default null,          -- Only start_time >= p_since (NULL = all)
  p_merge   boolean default false              -- false = REPLACE, true = MERGE/UNION
)
returns integer
language plpgsql
security definer
set search_path = public
as $func$
declare
  updated_count integer := 0;
begin
  -- Ensure target columns
  alter table public.g_events
    add column if not exists matched_emails text[],
    add column if not exists matched_educator_ids text[];

  with scope as (
    select g.*
    from public.g_events g
    where (p_user_id is null or g.user_id = p_user_id)
      and (p_since   is null or g.start_time >= p_since)
  ),
  participants as (
    select
      s.id as event_id,
      (
        select array_agg(distinct e.email)
        from (
          -- organizer (wrap to reuse the same extractor)
          select email from public.extract_emails_from_text_array(array[coalesce(s.organizer_email,'')])
          union all
          -- attendees[]
          select email from public.extract_emails_from_text_array(s.attendees)
        ) e
        where e.email is not null and e.email <> ''
      ) as parties
    from scope s
  ),
  matches as (
    select
      p.event_id,
      array_agg(distinct p2.email)                                         as matched_addrs,
      array_agg(distinct efa.educator_id) filter (where efa.educator_id is not null) as matched_ids
    from participants p
    left join lateral unnest(coalesce(p.parties,'{}')) as p2(email) on true
    join public.email_filter_addresses_filtered efa
      on public.normalize_email(efa.email) = p2.email
    group by p.event_id
  )
  update public.g_events g
  set
    matched_emails = case
      when p_merge then
        (select array(
           select distinct v
           from unnest(coalesce(g.matched_emails,'{}') || coalesce(m.matched_addrs,'{}')) as v
         ))
      else coalesce(m.matched_addrs,'{}')
    end,
    matched_educator_ids = case
      when p_merge then
        (select array(
           select distinct v
           from unnest(coalesce(g.matched_educator_ids,'{}') || coalesce(m.matched_ids,'{}')) as v
         ))
      else coalesce(m.matched_ids,'{}')
    end,
    updated_at = now()
  from matches m
  where g.id = m.event_id;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  return updated_count;
end;
$func$;

-- grant execute on function public.refresh_g_events_matches(uuid,timestamptz,boolean) to authenticated, service_role;
