create or replace function public.normalize_email(raw text)
returns text
language sql
immutable
strict
as $$
  select lower(
    regexp_replace(
      regexp_replace(trim(raw), '^mailto:', '', 'i'),
      '[\s<>\"]', '', 'g'
    )
  );
$$;