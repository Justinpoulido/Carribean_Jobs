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
  created_at timestamptz not null default now(),
  constraint jobs_status_check check (status in ('published', 'draft', 'closed')),
  constraint jobs_work_mode_check check (work_mode in ('Remote', 'On-site', 'Hybrid'))
);

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
create index if not exists applications_job_id_idx on public.applications (job_id);

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
