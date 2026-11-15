/** Career tips, read from the Supabase `tips` table. Pure helpers only. */

export const PUBLISHED_TIP_STATUS = "published";

export type Tip = {
  id: string;
  slug: string;
  title: string;
  body: string;
  category: string;
  excerpt: string;
  publishedAt: string;
};

export type TipRow = {
  id?: number | string | null;
  slug?: string | null;
  title?: string | null;
  body?: string | null;
  category?: string | null;
  status?: string | null;
  published_at?: string | null;
  created_at?: string | null;
};

export type TipBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "bonus"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

const ORDERED_ITEM = /^\d+[.)]\s+/;
const BULLET_ITEM = /^[-*•]\s+/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isTipSlug(value: string) {
  return value.length <= 120 && SLUG.test(value);
}

export function toTip(row: TipRow): Tip | null {
  if ((row.status ?? "").trim() !== PUBLISHED_TIP_STATUS) {
    return null;
  }
  const id = row.id == null ? "" : String(row.id);
  const slug = text(row.slug);
  const title = text(row.title);
  const body = text(row.body);
  if (!id || !slug || !title || !body || !isTipSlug(slug)) {
    return null;
  }
  return {
    id,
    slug,
    title,
    body,
    category: text(row.category) || "Career tips",
    excerpt: tipExcerpt(body),
    publishedAt: text(row.published_at) || text(row.created_at) || new Date(0).toISOString(),
  };
}

export function sortTipsNewestFirst(tips: Tip[]) {
  return [...tips].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

/** Category names in order of first appearance, newest tips first. */
export function tipCategories(tips: Tip[]) {
  const seen: string[] = [];
  for (const tip of tips) {
    if (!seen.includes(tip.category)) {
      seen.push(tip.category);
    }
  }
  return seen;
}

export function categoryAnchor(category: string) {
  return (
    category
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "tips"
  );
}

/** First paragraph of the tip, trimmed to a short summary. */
export function tipExcerpt(body: string, max = 160) {
  const first = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !ORDERED_ITEM.test(line) && !BULLET_ITEM.test(line));
  const source = (first || body.trim()).replace(/\s+/g, " ").replace(/:$/, ".");
  if (source.length <= max) {
    return source;
  }
  const cut = source.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > 60 ? cut.slice(0, space) : cut).replace(/[\s,;:.]+$/, "")}…`;
}

/**
 * Turns the stored plain text into blocks: paragraphs, short "Heading:"
 * lines, "Bonus:" callouts, and numbered or bulleted lists.
 */
export function parseTipBody(body: string): TipBlock[] {
  const blocks: TipBlock[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (list) {
      blocks.push({ type: "list", ordered: list.ordered, items: list.items });
      list = null;
    }
  };

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    const ordered = ORDERED_ITEM.test(line);
    const bullet = BULLET_ITEM.test(line);
    if (ordered || bullet) {
      const item = line.replace(ordered ? ORDERED_ITEM : BULLET_ITEM, "");
      if (!list || list.ordered !== ordered) {
        flush();
        list = { ordered, items: [] };
      }
      list.items.push(item);
      continue;
    }
    flush();
    if (/^bonus:\s*/i.test(line)) {
      blocks.push({ type: "bonus", text: line.replace(/^bonus:\s*/i, "") });
    } else if (line.endsWith(":") && line.length <= 40) {
      blocks.push({ type: "heading", text: line.slice(0, -1) });
    } else {
      blocks.push({ type: "paragraph", text: line });
    }
  }
  flush();
  return blocks;
}

export function tipArticleJsonLd(tip: Tip, pageUrl: string, publisher: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: tip.title,
    description: tip.excerpt,
    articleSection: tip.category,
    datePublished: tip.publishedAt,
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    author: { "@type": "Organization", name: publisher },
    publisher: { "@type": "Organization", name: publisher },
  };
}

function text(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}
