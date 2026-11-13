import type { MetadataRoute } from "next";
import { getVisibleJobs } from "@/lib/load-board-jobs";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

const staticPaths = [
  "/",
  "/jobs",
  "/about",
  "/employers",
  "/resources",
  "/contact",
  "/post-job",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const jobs = getVisibleJobs();

  return [
    ...staticPaths.map((path) => ({
      url: new URL(path, siteUrl).toString(),
      changeFrequency: path === "/jobs" ? ("hourly" as const) : ("monthly" as const),
      priority: path === "/" || path === "/jobs" ? 1 : 0.6,
    })),
    ...jobs.map((job) => ({
      url: new URL(`/jobs/${job.id}`, siteUrl).toString(),
      lastModified: job.datePosted,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
