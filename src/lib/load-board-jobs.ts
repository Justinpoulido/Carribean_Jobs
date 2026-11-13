import { readFileSync } from "node:fs";
import catalogJson from "../../data/jobs.json";
import {
  compareJobsByNewest,
  isClosingSoon,
  isJobVisible,
  parseJobCatalog,
  type BoardJob,
  type ListedJob,
} from "@/lib/board-jobs";

/**
 * Live jobs come from the committed catalog. A dev-only BOARD_JOBS_FILE
 * override exists so the populated board can be previewed without changing
 * the file that production deploys.
 */
function readCatalog() {
  const override = process.env.BOARD_JOBS_FILE;
  if (override && process.env.NODE_ENV !== "production") {
    return {
      label: override,
      data: JSON.parse(readFileSync(override, "utf8")) as unknown,
    };
  }

  return {
    label: "data/jobs.json",
    data: catalogJson as unknown,
  };
}

export function getBoardJobs(): BoardJob[] {
  const catalog = readCatalog();
  return parseJobCatalog(catalog.data, catalog.label).sort((a, b) =>
    compareJobsByNewest(a, b),
  );
}

export function getVisibleJobs(now = new Date()) {
  return getBoardJobs().filter((job) => isJobVisible(job, now));
}

export function getListedJobs(now = new Date()): ListedJob[] {
  return getVisibleJobs(now).map((job) => ({
    ...job,
    closingSoon: isClosingSoon(job, now),
  }));
}

export function getVisibleJob(id: string, now = new Date()) {
  return getVisibleJobs(now).find((job) => job.id === id);
}
