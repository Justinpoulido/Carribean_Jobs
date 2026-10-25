import { getSupabasePublicServerClient } from "@/lib/supabase";
import type { Job } from "@/lib/types";

type JobRow = Omit<
  Job,
  "id" | "requirements" | "responsibilities" | "benefits"
> & {
  id: number | string;
  requirements: string | string[] | null;
  responsibilities: string | string[] | null;
  benefits: string | string[] | null;
};

// One item per line. Commas are NOT separators: they appear inside normal
// sentences, and splitting on them mangled descriptions into fake bullets.
export function listFromValue(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((item) => item.replace(/^\s*(?:[-*•▪◦]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

function toNumberOrNull(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function normalizeJob(row: JobRow): Job {
  return {
    ...row,
    id: String(row.id),
    salary_min: toNumberOrNull(row.salary_min),
    salary_max: toNumberOrNull(row.salary_max),
    requirements: listFromValue(row.requirements),
    responsibilities: listFromValue(row.responsibilities),
    benefits: listFromValue(row.benefits),
  };
}

// A job is live when it is published and not past its expiry date.
function liveFilter() {
  return `expires_at.is.null,expires_at.gt.${new Date().toISOString()}`;
}

export async function getPublishedJobs(): Promise<Job[]> {
  const supabase = getSupabasePublicServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .or(liveFilter())
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load jobs", error.message);
    return [];
  }

  return ((data || []) as JobRow[]).map(normalizeJob);
}

// Featured jobs first, topped up with the newest jobs so the homepage is never
// empty while there are live listings.
export async function getHomepageJobs(limit = 3): Promise<Job[]> {
  const jobs = await getPublishedJobs();
  return jobs.slice(0, limit);
}

export async function getPublishedJobById(id: string): Promise<Job | null> {
  if (!/^\d+$/.test(id)) {
    return null;
  }

  const supabase = getSupabasePublicServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .or(liveFilter())
    .maybeSingle();

  if (error) {
    console.error("Unable to load job", error.message);
    return null;
  }

  return data ? normalizeJob(data as JobRow) : null;
}
