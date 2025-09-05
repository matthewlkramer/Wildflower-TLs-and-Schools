-- Update normalize_email(text) to align with cloud logic
-- Extract address inside angle brackets when present, else trim+lower raw input

create or replace function public.normalize_email(raw text)
returns text
language sql
immutable
strict
as $$
  select case
           when raw is null then null
           -- extract foo@bar.com if "Name <foo@bar.com>"
           when raw ~ '<[^>]+' then lower(trim(both ' ' from regexp_replace(raw, '.*<([^>]+)>.*', '\1')))
           else lower(trim(both ' ' from raw))
         end
$$;

