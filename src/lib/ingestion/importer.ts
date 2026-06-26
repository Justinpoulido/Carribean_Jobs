import type { ImportedJob, JobSource } from "@/lib/types";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { categorizeSector, sectorToCategory } from "./categorize";
import { createDuplicateHash } from "./hash";
import { getConnector } from "./connectors";

type ImportSummary = {
  source_id: number;
  source_name: string;
  jobs_found: number;
  jobs_added: number;
  duplicates_skipped: number;
  errors: string[];
};

function normalizeJob(source: JobSource, job: ImportedJob) {
  const sector = categorizeSector({
    title: job.title,
    description: job.description,
    sector: job.sector || source.sector,
  });
  const city = job.city || source.country;
  const country = job.country || source.country;
  const duplicate_hash = createDuplicateHash({
    title: job.title,
    company_name: job.company_name || source.name,
    country,
    city,
  });

  return {
    title: job.title,
    company_name: job.company_name || source.name,
    contact_email: "",
    country,
    city,
    category: job.category || sectorToCategory(sector),
    job_type: job.job_type || "Full-time",
    work_mode: job.work_mode || "On-site",
    salary_min: job.salary_min || null,
    salary_max: job.salary_max || null,
    description:
      job.description ||
      "Imported job listing. Review the original source URL before publishing.",
    requirements: job.requirements || "",
    responsibilities: job.responsibilities || "",
    benefits: job.benefits || "",
    application_email: "",
    application_link: job.apply_url || job.source_url,
    is_featured: false,
    status: source.trusted_auto_publish ? "published" : "draft",
    source_id: source.id,
    source_name: source.name,
    source_url: job.source_url,
    external_id: job.external_id,
    apply_url: job.apply_url || job.source_url,
    sector,
    import_status: source.trusted_auto_publish ? "published" : "pending",
    duplicate_hash,
    posted_at: job.posted_at || null,
    expires_at: job.expires_at || null,
  };
}

export async function importJobsForSource(
  source: JobSource,
): Promise<ImportSummary> {
  const supabase = getSupabaseAdminClient();
  const connector = getConnector(source);
  const startedAt = new Date().toISOString();
  const errors: string[] = [];

  if (!supabase) {
    return {
      source_id: source.id,
      source_name: source.name,
      jobs_found: 0,
      jobs_added: 0,
      duplicates_skipped: 0,
      errors: ["Supabase admin client is not configured."],
    };
  }

  const runInsert = await supabase
    .from("job_import_runs")
    .insert({
      source_id: source.id,
      status: "running",
      started_at: startedAt,
    })
    .select("id")
    .single();

  const runId = runInsert.data?.id as number | undefined;

  if (!connector) {
    errors.push(`No connector available for ${source.source_type}.`);
  }

  const result = connector
    ? await connector.fetchJobs(source)
    : { jobs: [], errors };
  errors.push(...result.errors);

  let jobsAdded = 0;
  let duplicatesSkipped = 0;

  for (const importedJob of result.jobs) {
    if (!importedJob.title || !importedJob.source_url) {
      errors.push("Skipped job missing title or source URL.");
      continue;
    }

    const normalized = normalizeJob(source, importedJob);
    const duplicateCheck = await supabase
      .from("jobs")
      .select("id")
      .eq("duplicate_hash", normalized.duplicate_hash)
      .maybeSingle();

    if (duplicateCheck.data) {
      duplicatesSkipped += 1;
      continue;
    }

    const insert = await supabase.from("jobs").insert(normalized);

    if (insert.error) {
      errors.push(insert.error.message);
    } else {
      jobsAdded += 1;
    }
  }

  const status =
    errors.length && jobsAdded > 0 ? "partial" : errors.length ? "failed" : "success";

  if (runId) {
    await supabase
      .from("job_import_runs")
      .update({
        status,
        jobs_found: result.jobs.length,
        jobs_added: jobsAdded,
        duplicates_skipped: duplicatesSkipped,
        errors,
        finished_at: new Date().toISOString(),
      })
      .eq("id", runId);
  }

  return {
    source_id: source.id,
    source_name: source.name,
    jobs_found: result.jobs.length,
    jobs_added: jobsAdded,
    duplicates_skipped: duplicatesSkipped,
    errors,
  };
}

export async function importJobsFromActiveSources() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      ok: false,
      summaries: [],
      message: "Supabase admin client is not configured.",
    };
  }

  const { data, error } = await supabase
    .from("job_sources")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    return { ok: false, summaries: [], message: error.message };
  }

  const sources = (data || []) as JobSource[];
  const summaries: ImportSummary[] = [];

  for (const source of sources) {
    summaries.push(await importJobsForSource(source));
  }

  return { ok: true, summaries, message: `Processed ${sources.length} sources.` };
}
