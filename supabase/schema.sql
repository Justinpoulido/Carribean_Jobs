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
  title text not null,
  company_name text not null,
  contact_email text not null,
  country text not null,
  city text not null,
  category text not null,
  job_type text not null,
  work_mode text not null,
  salary_min numeric(12, 2),
  salary_max numeric(12, 2),
  description text not null,
  requirements text,
  responsibilities text,
  benefits text,
  application_email text,
  application_link text,
  is_featured boolean not null default false,
  status text not null default 'published',
  source_id bigint references public.job_sources(id) on delete set null,
  source_name text,
  source_url text,
  external_id text,
  apply_url text,
  sector text,
  import_status text not null default 'approved',
  duplicate_hash text,
  posted_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  constraint jobs_status_check check (status in ('published', 'draft', 'closed')),
  constraint jobs_work_mode_check check (work_mode in ('Remote', 'On-site', 'Hybrid')),
  constraint jobs_import_status_check check (
    import_status in ('pending', 'approved', 'published', 'rejected')
  )
);

alter table public.jobs
  add column if not exists source_id bigint references public.job_sources(id) on delete set null,
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists external_id text,
  add column if not exists apply_url text,
  add column if not exists sector text,
  add column if not exists import_status text not null default 'approved',
  add column if not exists duplicate_hash text,
  add column if not exists posted_at timestamptz,
  add column if not exists expires_at timestamptz;

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
create index if not exists job_sources_active_idx on public.job_sources (is_active);
create index if not exists job_import_runs_source_id_started_at_idx
  on public.job_import_runs (source_id, started_at desc);
create index if not exists applications_job_id_idx on public.applications (job_id);

alter table public.job_sources enable row level security;
alter table public.job_import_runs enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.contacts enable row level security;

create policy "Public can read published jobs"
  on public.jobs for select
  using (status = 'published');

create policy "Public can submit jobs"
  on public.jobs for insert
  with check (status in ('published', 'draft'));

create policy "Public can submit applications"
  on public.applications for insert
  with check (true);

create policy "Public can submit contact messages"
  on public.contacts for insert
  with check (true);

create policy "Service role can manage job sources"
  on public.job_sources for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role can manage import runs"
  on public.job_import_runs for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
