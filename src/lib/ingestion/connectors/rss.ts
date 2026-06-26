import type { ConnectorResult, JobConnector } from "./types";
import { cleanText } from "./types";

function extractTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return cleanText(match?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "") || "");
}

export const rssConnector: JobConnector = {
  type: "rss",
  async fetchJobs(source): Promise<ConnectorResult> {
    const errors: string[] = [];

    try {
      const response = await fetch(source.base_url, {
        headers: { Accept: "application/rss+xml, application/xml, text/xml" },
      });

      if (!response.ok) {
        throw new Error(`RSS responded with ${response.status}.`);
      }

      const xml = await response.text();
      const items = Array.from(xml.matchAll(/<item[\s\S]*?<\/item>/gi)).map(
        (match) => match[0],
      );

      return {
        errors,
        jobs: items.map((item, index) => {
          const link = extractTag(item, "link");
          return {
            external_id: extractTag(item, "guid") || link || `${source.id}-${index}`,
            title: extractTag(item, "title"),
            company_name: source.name,
            country: source.country,
            city: source.country,
            description: extractTag(item, "description"),
            source_url: link || source.base_url,
            apply_url: link || source.base_url,
            sector: source.sector,
            posted_at: extractTag(item, "pubDate")
              ? new Date(extractTag(item, "pubDate")).toISOString()
              : null,
          };
        }),
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "RSS import failed.");
      return { jobs: [], errors };
    }
  },
};
