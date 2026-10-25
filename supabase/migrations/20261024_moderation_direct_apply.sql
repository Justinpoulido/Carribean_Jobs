-- Caribbean Jobs: moderation, direct apply, currency/pay period, cleanup.
-- Run once in Supabase > SQL Editor (safe to re-run).

begin;

-- 1. New job fields --------------------------------------------------------
alter table public.jobs
  add column if not exists salary_currency text,
  add column if not exists salary_period text,
  add column if not exists featured_requested boolean not null default false;

alter table public.jobs drop constraint if exists jobs_salary_period_check;
alter table public.jobs
  add constraint jobs_salary_period_check
  check (salary_period is null or salary_period in ('Hour', 'Month', 'Year'));

-- Backfill currency for existing salaried jobs from their country.
update public.jobs
set salary_currency = case country
    when 'Trinidad & Tobago' then 'TTD'
    when 'Jamaica' then 'JMD'
    when 'Barbados' then 'BBD'
    when 'Guyana' then 'GYD'
    when 'Grenada' then 'XCD'
    when 'St. Lucia' then 'XCD'
    when 'Bahamas' then 'BSD'
    when 'Belize' then 'BZD'
    else 'USD'
  end,
  salary_period = coalesce(salary_period, 'Month')
where salary_currency is null
  and (coalesce(salary_min, 0) > 0 or coalesce(salary_max, 0) > 0);

-- Public submissions now default to the review queue.
alter table public.jobs alter column status set default 'draft';
alter table public.jobs alter column import_status set default 'pending';

-- Give live jobs without an expiry a 30-day window from today.
update public.jobs
set expires_at = now() + interval '30 days'
where status = 'published' and expires_at is null;

create index if not exists jobs_expires_at_idx on public.jobs (expires_at);
create index if not exists jobs_featured_requested_idx
  on public.jobs (featured_requested) where featured_requested = true;

-- 2. Row level security ----------------------------------------------------
-- All writes now go through the server with the service-role key, so the
-- public (anon) role only needs to READ live jobs.
drop policy if exists "Public can submit jobs" on public.jobs;
drop policy if exists "Public can submit applications" on public.applications;
drop policy if exists "Public can submit contact messages" on public.contacts;

drop policy if exists "Public can read published jobs" on public.jobs;
create policy "Public can read published jobs"
  on public.jobs for select
  using (status = 'published' and (expires_at is null or expires_at > now()));

-- 3. Resumes are no longer collected; make sure old uploads are not public.
update storage.buckets set public = false where id = 'resumes';

-- 4. Remove the two manually added listings (requested by owner).
delete from public.jobs
where id in (1, 2)
  and company_name in (
    'Americas Marketing Company Limited',
    'Service Link Construction Company'
  );

commit;
