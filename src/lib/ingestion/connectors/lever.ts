import type { JobSource } from "@/lib/types";
import type { ConnectorResult, JobConnector } from "./types";
import { absoluteUrl, cleanText } from "./types";

function getLeverEndpoint(baseUrl: string) {
  if (baseUrl.includes("api.lever.co/v0/postings")) {
    return baseUrl;
  }

  const parsed = new URL(baseUrl);
  const company = parsed.pathname.split("/").filter(Boolean).pop();

  if (!company) {
    throw new Error("Lever source needs a company slug or postings API URL.");
  }

  return `https://api.lever.co/v0/postings/${company}?mode=json`;
}

export const leverConnector: JobConnector = {
  type: "lever",
  async fetchJobs(source: JobSource): Promise<ConnectorResult> {
    const errors: string[] = [];

    try {
      const endpoint = getLeverEndpoint(source.base_url);
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Lever responded with ${response.status}.`);
      }

      const jobs = (await response.json()) as Array<{
        id: string;
        text: string;
        hostedUrl?: string;
        applyUrl?: string;
        categories?: {
          location?: string;
          team?: string;
          commitment?: string;
        };
        descriptionPlain?: string;
        additionalPlain?: string;
        createdAt?: number;
      }>;

      return {
        errors,
        jobs: jobs.map((job) => ({
          external_id: job.id,
          title: job.text,
          company_name: source.name,
          country: source.country,
          city: job.categories?.location || source.country,
          category: job.categories?.team,
          job_type: job.categories?.commitment,
          description: cleanText(
            `${job.descriptionPlain || ""} ${job.additionalPlain || ""}`,
          ),
          source_url: absoluteUrl(source.base_url, job.hostedUrl),
          apply_url: absoluteUrl(source.base_url, job.applyUrl || job.hostedUrl),
          sector: source.sector,
          posted_at: job.createdAt
            ? new Date(job.createdAt).toISOString()
            : null,
        })),
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Lever failed.");
      return { jobs: [], errors };
    }
  },
};
