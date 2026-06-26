import type { ImportedJob } from "@/lib/types";
import type { ConnectorResult, JobConnector } from "./types";
import { absoluteUrl, cleanText } from "./types";

function findJobArray(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload as Record<string, unknown>[];
  }

  if (payload && typeof payload === "object") {
    const object = payload as Record<string, unknown>;
    for (const key of ["jobs", "data", "results", "items"]) {
      if (Array.isArray(object[key])) {
        return object[key] as Record<string, unknown>[];
      }
    }
  }

  return [];
}

function textField(item: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (typeof item[key] === "string" && item[key]) {
      return item[key] as string;
    }
  }

  return "";
}

export const apiConnector: JobConnector = {
  type: "api",
  async fetchJobs(source): Promise<ConnectorResult> {
    const errors: string[] = [];

    try {
      const response = await fetch(source.base_url, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}.`);
      }

      const jobs = findJobArray(await response.json());
      const normalized: ImportedJob[] = jobs
        .map((item, index) => {
          const sourceUrl = textField(item, ["source_url", "url", "job_url", "link"]);
          return {
            external_id:
              textField(item, ["id", "external_id", "job_id"]) ||
              `${source.id}-${index}`,
            title: textField(item, ["title", "job_title", "name"]),
            company_name:
              textField(item, ["company_name", "company", "employer"]) ||
              source.name,
            country: textField(item, ["country"]) || source.country,
            city: textField(item, ["city", "location"]) || source.country,
            category: textField(item, ["category"]),
            job_type: textField(item, ["job_type", "type", "employment_type"]),
            work_mode:
              (textField(item, ["work_mode"]) as ImportedJob["work_mode"]) ||
              undefined,
            description: cleanText(
              textField(item, ["description", "summary", "content"]),
            ),
            source_url: absoluteUrl(source.base_url, sourceUrl),
            apply_url: absoluteUrl(
              source.base_url,
              textField(item, ["apply_url", "application_link"]) || sourceUrl,
            ),
            sector: textField(item, ["sector"]) || source.sector,
            posted_at: textField(item, ["posted_at", "date_posted"]),
            expires_at: textField(item, ["expires_at"]),
          };
        })
        .filter((job) => job.title);

      return { jobs: normalized, errors };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "API import failed.");
      return { jobs: [], errors };
    }
  },
};
