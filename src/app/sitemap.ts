import type { MetadataRoute } from "next";
import { getPublishedJobs } from "@/lib/jobs";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const staticPaths = ["", "/jobs", "/employers", "/post-job", "/resources", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getPublishedJobs();

  return [
    ...staticPaths.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
    ...jobs.map((job) => ({
      url: `${SITE_URL}/jobs/${job.id}`,
      lastModified: job.posted_at || job.created_at,
      changeFrequency: "daily" as const,
      priority: job.is_featured ? 0.9 : 0.8,
    })),
  ];
}
