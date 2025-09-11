-- Keep people.full_name in sync with nickname/first_name + last_name
-- Logic: use nickname if present/non-empty, else first_name; append last_name if present/non-empty

-- Backfill existing rows
update public.people p
set full_name = coalesce(nullif(p.nickname, ''), p.first_name)
                 || case when p.last_name is not null and p.last_name <> '' then ' ' || p.last_name else '' end;

-- Create or replace helper function
create or replace function public.people_set_full_name()
returns trigger
language plpgsql
as $$
begin
  new.full_name := coalesce(nullif(new.nickname, ''), new.first_name)
                   || case when new.last_name is not null and new.last_name <> '' then ' ' || new.last_name else '' end;
  return new;
end;
$$;

-- Drop existing trigger if present (idempotent)
drop trigger if exists trg_people_set_full_name on public.people;

-- Create trigger to maintain full_name on insert/update of relevant fields
create trigger trg_people_set_full_name
before insert or update of nickname, first_name, last_name on public.people
for each row execute function public.people_set_full_name();

