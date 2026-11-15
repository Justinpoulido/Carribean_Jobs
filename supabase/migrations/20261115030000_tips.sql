-- Career tips for /tips and the /resources page.
-- Every statement is safe to run again. This file does not delete rows.

create table if not exists public.tips (
  id bigint generated always as identity primary key,
  slug text not null,
  title text not null,
  body text not null,
  category text,
  status text not null default 'draft',
  source text not null default 'facebook',
  source_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tips_status_check check (status in ('draft', 'published', 'archived')),
  constraint tips_source_check check (source in ('facebook', 'site'))
);

create unique index if not exists tips_slug_key on public.tips (slug);
create index if not exists tips_published_idx
  on public.tips (published_at desc)
  where status = 'published';

-- Fill the slug from the title when it is left blank, and keep
-- published_at and updated_at current.
create or replace function public.prepare_tip()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  base text;
begin
  if new.slug is null or btrim(new.slug) = '' then
    base := trim(both '-' from regexp_replace(
      lower(replace(coalesce(new.title, 'tip'), '''', '')),
      '[^a-z0-9]+',
      '-',
      'g'
    ));
    if base = '' then
      base := 'tip';
    end if;
    new.slug := base;
  end if;
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists tips_prepare on public.tips;
create trigger tips_prepare
before insert or update on public.tips
for each row
execute function public.prepare_tip();

alter table public.tips enable row level security;

-- Visitors can only read. Tips are added and edited in the Supabase
-- dashboard or with the service role.
grant select on table public.tips to anon, authenticated;
revoke insert, update, delete, truncate on table public.tips from anon, authenticated;

drop policy if exists "Public can read published tips" on public.tips;
create policy "Public can read published tips"
  on public.tips
  for select
  to anon, authenticated
  using (status = 'published');
