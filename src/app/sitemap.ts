import type { MetadataRoute } from "next";
import { getListedJobs } from "@/lib/load-public-jobs";
import { getPublishedTips } from "@/lib/load-tips";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

const staticPaths = [
  "/",
  "/jobs",
  "/about",
  "/employers",
  "/resources",
  "/tips",
  "/contact",
  "/post-job",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [jobs, tips] = await Promise.all([getListedJobs(), getPublishedTips()]);

  return [
    ...staticPaths.map((path) => ({
      url: new URL(path, siteUrl).toString(),
      changeFrequency: path === "/jobs" ? ("hourly" as const) : ("monthly" as const),
      priority: path === "/" || path === "/jobs" ? 1 : 0.6,
    })),
    ...jobs.map((job) => ({
      url: new URL(`/jobs/${job.slug}`, siteUrl).toString(),
      lastModified: job.postedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...tips.map((tip) => ({
      url: new URL(`/tips/${tip.slug}`, siteUrl).toString(),
      lastModified: tip.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
