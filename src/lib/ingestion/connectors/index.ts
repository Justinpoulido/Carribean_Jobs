import type { JobSource } from "@/lib/types";
import type { JobConnector } from "./types";
import { apiConnector } from "./api";
import { greenhouseConnector } from "./greenhouse";
import { leverConnector } from "./lever";
import { rssConnector } from "./rss";
import { scraperConnector } from "./scraper";

function isGreenhouse(source: JobSource) {
  return /greenhouse/i.test(source.name) || /greenhouse/i.test(source.base_url);
}

function isLever(source: JobSource) {
  return /lever/i.test(source.name) || /lever/i.test(source.base_url);
}

export function getConnector(source: JobSource): JobConnector | null {
  if (source.source_type === "api") {
    return apiConnector;
  }

  if (source.source_type === "rss") {
    return rssConnector;
  }

  if (source.source_type === "scraper") {
    return scraperConnector;
  }

  if (source.source_type === "ats") {
    if (isGreenhouse(source)) {
      return greenhouseConnector;
    }

    if (isLever(source)) {
      return leverConnector;
    }
  }

  return null;
}
