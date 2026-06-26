import type { ImportedJob, JobSource } from "@/lib/types";

export type ConnectorResult = {
  jobs: ImportedJob[];
  errors: string[];
};

export type JobConnector = {
  type: string;
  fetchJobs(source: JobSource): Promise<ConnectorResult>;
};

export function cleanText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function absoluteUrl(baseUrl: string, href?: string | null) {
  if (!href) {
    return baseUrl;
  }

  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return baseUrl;
  }
}
