import type { JobSource } from "@/lib/types";
import type { ConnectorResult, JobConnector } from "./types";
import { absoluteUrl, cleanText } from "./types";

function getGreenhouseEndpoint(baseUrl: string) {
  if (baseUrl.includes("boards-api.greenhouse.io")) {
    return baseUrl;
  }

  const parsed = new URL(baseUrl);
  const boardToken = parsed.pathname.split("/").filter(Boolean).pop();

  if (!boardToken) {
    throw new Error("Greenhouse source needs a board token or board API URL.");
  }

  return `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`;
}

export const greenhouseConnector: JobConnector = {
  type: "greenhouse",
  async fetchJobs(source: JobSource): Promise<ConnectorResult> {
    const errors: string[] = [];

    try {
      const endpoint = getGreenhouseEndpoint(source.base_url);
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Greenhouse responded with ${response.status}.`);
      }

      const data = (await response.json()) as {
        jobs?: Array<{
          id: number | string;
          title: string;
          absolute_url?: string;
          location?: { name?: string };
          content?: string;
          updated_at?: string;
        }>;
      };

      return {
        errors,
        jobs: (data.jobs || []).map((job) => ({
          external_id: String(job.id),
          title: job.title,
          company_name: source.name,
          country: source.country,
          city: job.location?.name || source.country,
          description: cleanText(job.content),
          source_url: absoluteUrl(source.base_url, job.absolute_url),
          apply_url: absoluteUrl(source.base_url, job.absolute_url),
          sector: source.sector,
          posted_at: job.updated_at || null,
        })),
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Greenhouse failed.");
      return { jobs: [], errors };
    }
  },
};
