-- Jobs board for a brand-new Supabase project and for a database that
-- already has the earlier tables. Every statement is safe to run again.
-- This file does not delete rows.

create table if not exists public.job_sources (
  id bigint generated always as identity primary key,
  name text not null,
  source_type text not null,
  base_url text not null,
  country text not null,
  sector text,
  is_active boolean not null default true,
  trusted_auto_publish boolean not null default false,
  created_at timestamptz not null default now(),
  constraint job_sources_source_type_check check (
    source_type in ('api', 'ats', 'rss', 'scraper', 'manual')
  )
);

create table if not exists public.job_import_runs (
  id bigint generated always as identity primary key,
  source_id bigint not null references public.job_sources(id) on delete cascade,
  status text not null default 'running',
  jobs_found integer not null default 0,
  jobs_added integer not null default 0,
  duplicates_skipped integer not null default 0,
  errors text[] not null default '{}',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  constraint job_import_runs_status_check check (
    status in ('running', 'success', 'partial', 'failed')
  )
);

create table if not exists public.jobs (
  id bigint generated always as identity primary key,
  slug text,
  title text not null,
  company_name text not null,
  contact_email text not null,
  poster_name text,
  country text not null,
  city text not null,
  category text not null,
  job_type text not null,
  work_mode text not null,
  salary_min numeric(12, 2),
  salary_max numeric(12, 2),
  currency text,
  pay_period text,
  description text not null,
  requirements text,
  responsibilities text,
  benefits text,
  application_email text,
  application_link text,
  is_featured boolean not null default false,
  status text not null default 'pending',
  source_id bigint references public.job_sources(id) on delete set null,
  source_name text,
  source_url text,
  external_id text,
  apply_url text,
  sector text,
  import_status text not null default 'pending',
  duplicate_hash text,
  posted_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.jobs
  add column if not exists slug text,
  add column if not exists poster_name text,
  add column if not exists currency text,
  add column if not exists pay_period text,
  add column if not exists source_id bigint references public.job_sources(id) on delete set null,
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists external_id text,
  add column if not exists apply_url text,
  add column if not exists sector text,
  add column if not exists import_status text not null default 'pending',
  add column if not exists duplicate_hash text,
  add column if not exists posted_at timestamptz,
  add column if not exists expires_at timestamptz;

alter table public.jobs alter column status set default 'pending';

alter table public.jobs drop constraint if exists jobs_status_check;
alter table public.jobs
  add constraint jobs_status_check
  check (status in ('pending', 'approved', 'published', 'draft', 'closed', 'rejected'));

alter table public.jobs drop constraint if exists jobs_work_mode_check;
alter table public.jobs
  add constraint jobs_work_mode_check
  check (work_mode in ('Remote', 'On-site', 'Hybrid'));

alter table public.jobs drop constraint if exists jobs_pay_period_check;
alter table public.jobs
  add constraint jobs_pay_period_check
  check (pay_period is null or pay_period in ('month', 'year'));

alter table public.jobs drop constraint if exists jobs_import_status_check;
alter table public.jobs
  add constraint jobs_import_status_check
  check (import_status in ('pending', 'approved', 'published', 'rejected'));

create table if not exists public.applications (
  id bigint generated always as identity primary key,
  job_id bigint references public.jobs(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  country text,
  resume_url text,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists jobs_country_idx on public.jobs (country);
create index if not exists jobs_category_idx on public.jobs (category);
create index if not exists jobs_job_type_idx on public.jobs (job_type);
create index if not exists jobs_work_mode_idx on public.jobs (work_mode);
create index if not exists jobs_status_created_at_idx on public.jobs (status, created_at desc);
create index if not exists jobs_featured_idx on public.jobs (is_featured) where is_featured = true;
create index if not exists jobs_source_id_idx on public.jobs (source_id);
create index if not exists jobs_import_status_idx on public.jobs (import_status);
create index if not exists jobs_duplicate_hash_idx on public.jobs (duplicate_hash);
create unique index if not exists jobs_duplicate_hash_unique_idx
  on public.jobs (duplicate_hash)
  where duplicate_hash is not null;
create unique index if not exists jobs_slug_unique_idx
  on public.jobs (slug)
  where slug is not null;
create index if not exists jobs_expires_at_idx on public.jobs (expires_at);
create index if not exists job_sources_active_idx on public.job_sources (is_active);
create index if not exists job_import_runs_source_id_started_at_idx
  on public.job_import_runs (source_id, started_at desc);
create index if not exists applications_job_id_idx on public.applications (job_id);

create or replace function public.assign_job_slug()
returns trigger
language plpgsql
as $$
declare
  base text;
begin
  if new.slug is null or btrim(new.slug) = '' then
    base := trim(both '-' from regexp_replace(
      lower(coalesce(new.title, 'job') || '-' || coalesce(new.city, '')),
      '[^a-z0-9]+',
      '-',
      'g'
    ));
    if base = '' then
      base := 'job';
    end if;
    if new.id is not null then
      new.slug := base || '-' || new.id::text;
    else
      new.slug := base || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 6);
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists jobs_assign_slug on public.jobs;
create trigger jobs_assign_slug
before insert on public.jobs
for each row
execute function public.assign_job_slug();

alter table public.job_sources enable row level security;
alter table public.job_import_runs enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.contacts enable row level security;

grant select, insert on table public.jobs to anon, authenticated;
revoke update, delete on table public.jobs from anon;

do $$
begin
  if exists (select 1 from pg_class where relkind = 'S' and relname = 'jobs_id_seq') then
    execute 'grant usage, select on sequence public.jobs_id_seq to anon, authenticated';
  end if;
end $$;

drop policy if exists "Public can read published jobs" on public.jobs;
drop policy if exists "Public can read approved jobs" on public.jobs;
create policy "Public can read approved jobs"
  on public.jobs
  for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "Public can submit jobs" on public.jobs;
drop policy if exists "Public can submit pending jobs" on public.jobs;
create policy "Public can submit pending jobs"
  on public.jobs
  for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Public can submit applications" on public.applications;
create policy "Public can submit applications"
  on public.applications
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public can submit contact messages" on public.contacts;
create policy "Public can submit contact messages"
  on public.contacts
  for insert
  to anon, authenticated
  with check (true);

-- Unpublish the two early rows after Justin confirmed. No-op when they
-- are not in the table. This is an update, not a delete.
update public.jobs
set status = 'closed'
where id in (1, 2);
