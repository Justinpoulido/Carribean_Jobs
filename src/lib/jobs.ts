import { sampleJobs } from "@/data/jobs";
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

function listFromValue(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeJob(row: JobRow): Job {
  return {
    ...row,
    id: String(row.id),
    salary_min: Number(row.salary_min || 0),
    salary_max: Number(row.salary_max || 0),
    requirements: listFromValue(row.requirements),
    responsibilities: listFromValue(row.responsibilities),
    benefits: listFromValue(row.benefits),
  };
}

export async function getPublishedJobs() {
  const supabase = getSupabasePublicServerClient();

  if (!supabase) {
    return sampleJobs;
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load Supabase jobs", error.message);
    return sampleJobs;
  }

  const jobs = ((data || []) as JobRow[]).map(normalizeJob);
  return jobs.length > 0 ? jobs : sampleJobs;
}

export async function getPublishedJobById(id: string) {
  const sampleJob = sampleJobs.find((job) => job.id === id);
  const supabase = getSupabasePublicServerClient();

  if (!supabase) {
    return sampleJob;
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Unable to load Supabase job", error.message);
    return sampleJob;
  }

  return data ? normalizeJob(data as JobRow) : sampleJob;
}
