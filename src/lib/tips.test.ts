import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  categoryAnchor,
  isTipSlug,
  parseTipBody,
  sortTipsNewestFirst,
  tipCategories,
  tipExcerpt,
  toTip,
  type Tip,
} from "./tips.ts";

const sample = `Landing the interview is the hard part. Here's how to make it count:

1. Research the employer.
2. Prepare 3 STAR stories.

Before the call:
- Keep your CV nearby
- Pick a quiet spot

Bonus: Send a short thank-you email within 24 hours.`;

test("parseTipBody splits paragraphs, headings, lists and the bonus callout", () => {
  assert.deepEqual(parseTipBody(sample), [
    { type: "paragraph", text: "Landing the interview is the hard part. Here's how to make it count:" },
    { type: "list", ordered: true, items: ["Research the employer.", "Prepare 3 STAR stories."] },
    { type: "heading", text: "Before the call" },
    { type: "list", ordered: false, items: ["Keep your CV nearby", "Pick a quiet spot"] },
    { type: "bonus", text: "Send a short thank-you email within 24 hours." },
  ]);
});

test("a heading line directly before a list still splits from it", () => {
  const blocks = parseTipBody("Why it works:\n- It shows interest\n1. First");
  assert.equal(blocks[0].type, "heading");
  assert.deepEqual(blocks[1], { type: "list", ordered: false, items: ["It shows interest"] });
  assert.deepEqual(blocks[2], { type: "list", ordered: true, items: ["First"] });
});

test("tipExcerpt uses the first paragraph and shortens long text", () => {
  assert.equal(
    tipExcerpt(sample),
    "Landing the interview is the hard part. Here's how to make it count.",
  );
  const long = tipExcerpt("word ".repeat(80));
  assert.ok(long.length <= 160);
  assert.ok(long.endsWith("…"));
});

test("toTip keeps only complete published rows", () => {
  const row = {
    id: 7,
    slug: "send-a-thank-you-note",
    title: "Send a thank-you note",
    body: "Most candidates skip this.",
    category: "Interviews",
    status: "published",
    published_at: "2026-11-04T16:08:00-04:00",
  };
  const tip = toTip(row);
  assert.equal(tip?.id, "7");
  assert.equal(tip?.category, "Interviews");
  assert.equal(toTip({ ...row, status: "draft" }), null);
  assert.equal(toTip({ ...row, body: "  " }), null);
  assert.equal(toTip({ ...row, slug: "Bad Slug" }), null);
  assert.equal(toTip({ ...row, category: null })?.category, "Career tips");
});

test("sorting and categories follow the newest tip first", () => {
  const tip = (slug: string, category: string, publishedAt: string): Tip => ({
    id: slug,
    slug,
    title: slug,
    body: slug,
    category,
    excerpt: slug,
    publishedAt,
  });
  const sorted = sortTipsNewestFirst([
    tip("a", "Interviews", "2026-10-25T10:00:00-04:00"),
    tip("b", "New job", "2026-11-14T10:00:00-04:00"),
    tip("c", "Interviews", "2026-11-01T10:00:00-04:00"),
  ]);
  assert.deepEqual(sorted.map((item) => item.slug), ["b", "c", "a"]);
  assert.deepEqual(tipCategories(sorted), ["New job", "Interviews"]);
  assert.equal(categoryAnchor("Offers & pay"), "offers-and-pay");
});

test("isTipSlug accepts URL slugs only", () => {
  assert.ok(isTipSlug("ace-the-panel-interview"));
  assert.ok(!isTipSlug("../admin"));
  assert.ok(!isTipSlug("Ace-The-Panel"));
});

test("the Facebook seed has clean, unique, parseable tips", () => {
  const sql = readFileSync(
    new URL("../../supabase/migrations/20261115030100_tips_seed.sql", import.meta.url),
    "utf8",
  );
  const bodies = [...sql.matchAll(/\$tip\$([\s\S]*?)\$tip\$/g)].map((match) => match[1]);
  const slugs = [...sql.matchAll(/^ {2}\(\n {4}'([^']+)',$/gm)].map((match) => match[1]);
  assert.equal(bodies.length, 31);
  assert.equal(slugs.length, 31);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) {
    assert.ok(isTipSlug(slug), slug);
  }
  for (const body of bodies) {
    assert.doesNotMatch(body, /#\w|carribeanjobs\.online|https?:\/\/|👇/);
    assert.ok(parseTipBody(body).length >= 2);
  }
});
