import type { ConnectorResult, JobConnector } from "./types";
import { absoluteUrl, cleanText } from "./types";
import { canScrapeUrl } from "../safety";

export const scraperConnector: JobConnector = {
  type: "scraper",
  async fetchJobs(source): Promise<ConnectorResult> {
    const errors: string[] = [];
    const safety = await canScrapeUrl(source.base_url);

    if (!safety.allowed) {
      return { jobs: [], errors: [safety.reason || "Scraping not allowed."] };
    }

    try {
      const response = await fetch(source.base_url, {
        headers: { "User-Agent": "CaribbeanJobsBot/1.0" },
      });

      if (!response.ok) {
        throw new Error(`Career page responded with ${response.status}.`);
      }

      const html = await response.text();
      const links = Array.from(
        html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi),
      )
        .map((match) => ({
          href: absoluteUrl(source.base_url, match[1]),
          label: cleanText(match[2]),
        }))
        .filter((link) =>
          /\b(job|career|vacanc|position|opening|opportunit)/i.test(
            `${link.href} ${link.label}`,
          ),
        )
        .slice(0, 25);

      return {
        errors,
        jobs: links.map((link, index) => ({
          external_id: link.href || `${source.id}-${index}`,
          title: link.label || "Open position",
          company_name: source.name,
          country: source.country,
          city: source.country,
          description:
            "Imported from an approved public company career page. Review the source link before publishing.",
          source_url: link.href,
          apply_url: link.href,
          sector: source.sector,
        })),
      };
    } catch (error) {
      errors.push(
        error instanceof Error ? error.message : "Career page scrape failed.",
      );
      return { jobs: [], errors };
    }
  },
};
