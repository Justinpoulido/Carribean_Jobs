import { cache } from "react";
import { getSupabasePublicServerClient } from "@/lib/supabase";
import {
  canonicalSlug,
  isClosingSoon,
  isExpired,
  isOpenJob,
  type PayPeriod,
  type PublicJob,
} from "@/lib/public-jobs";

type JobRow = {
  id?: number | string | null;
  slug?: string | null;
  title?: string | null;
  company_name?: string | null;
  country?: string | null;
  city?: string | null;
  category?: string | null;
  job_type?: string | null;
  work_mode?: string | null;
  salary_min?: number | string | null;
  salary_max?: number | string | null;
  currency?: string | null;
  pay_period?: string | null;
  description?: string | null;
  requirements?: string | null;
  application_email?: string | null;
  application_link?: string | null;
  apply_url?: string | null;
  is_featured?: boolean | null;
  status?: string | null;
  posted_at?: string | null;
  created_at?: string | null;
  expires_at?: string | null;
};

const loadApprovedRows = cache(async () => {
  try {
    const supabase = getSupabasePublicServerClient();
    if (!supabase) {
      return [];
    }
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "approved");
    if (error) {
      console.error("Unable to load jobs", error.message);
      return [];
    }
    return (data || []) as JobRow[];
  } catch (error) {
    console.error("Unable to load jobs", error);
    return [];
  }
});

export async function getApprovedJobs(now = new Date()) {
  const rows = await loadApprovedRows();
  return rows
    .map((row) => toPublicJob(row, now))
    .filter((job): job is PublicJob => job !== null)
    .sort(byNewest);
}

export async function getListedJobs(now = new Date()) {
  const jobs = await getApprovedJobs(now);
  return jobs.filter((job) => isOpenJob(job));
}

export async function resolveJob(param: string, now = new Date()) {
  if (!/^[a-z0-9-]+$/i.test(param)) {
    return { job: null as PublicJob | null, redirectTo: null as string | null };
  }
  const jobs = await getApprovedJobs(now);
  const direct = jobs.find((job) => job.slug === param || job.id === param);
  const suffix = /-(\d+)$/.exec(param)?.[1];
  const job = direct ?? (suffix ? jobs.find((item) => item.id === suffix) : undefined);
  if (!job) {
    return { job: null, redirectTo: null };
  }
  if (param !== job.slug) {
    return { job, redirectTo: `/jobs/${job.slug}` };
  }
  return { job, redirectTo: null };
}

function toPublicJob(row: JobRow, now: Date): PublicJob | null {
  const id = row.id == null ? "" : String(row.id);
  const title = text(row.title);
  const companyName = text(row.company_name);
  const city = text(row.city);
  const country = text(row.country);
  const description = text(row.description);
  if (!id || !title || !companyName || !city || !country || !description) {
    return null;
  }

  const postedAt = text(row.posted_at) || text(row.created_at) || new Date(0).toISOString();
  const closingDate = text(row.expires_at) || null;
  const applicationEmail = text(row.application_email) || null;
  const applicationUrl = text(row.application_link) || text(row.apply_url) || null;
  const expired = isExpired({ postedAt, closingDate }, now);
  const job: PublicJob = {
    id,
    slug: canonicalSlug({
      id,
      title,
      city,
      slug: text(row.slug) || null,
    }),
    title,
    companyName,
    city,
    country,
    category: text(row.category),
    jobType: text(row.job_type),
    workMode: text(row.work_mode),
    salaryMin: numberOrNull(row.salary_min),
    salaryMax: numberOrNull(row.salary_max),
    currency: text(row.currency).toUpperCase() || null,
    payPeriod: payPeriod(row.pay_period),
    description,
    requirements: list(row.requirements),
    applicationEmail,
    applicationUrl,
    isFeatured: Boolean(row.is_featured),
    status: text(row.status) || "pending",
    postedAt,
    closingDate,
    expired,
    closingSoon: false,
  };
  job.closingSoon = isClosingSoon(job, now);
  return job;
}

function byNewest(a: PublicJob, b: PublicJob) {
  if (a.isFeatured !== b.isFeatured) {
    return a.isFeatured ? -1 : 1;
  }
  return Date.parse(b.postedAt) - Date.parse(a.postedAt);
}

function text(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function numberOrNull(value: number | string | null | undefined) {
  if (value == null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function payPeriod(value: string | null | undefined): PayPeriod | null {
  const period = text(value).toLowerCase();
  return period === "month" || period === "year" ? period : null;
}

function list(value: string | null | undefined) {
  return text(value)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}
