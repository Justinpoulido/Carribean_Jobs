import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  DEFAULT_COUNTRY,
  countryCode,
  formatJobDate,
  isClosingSoon,
  isJobVisible,
  normalizePlace,
  parseJobCatalog,
  type BoardJob,
} from "./board-jobs.ts";

const postedOn = new Date("2026-11-13T12:00:00.000-04:00");

function entry(overrides: Record<string, unknown> = {}) {
  return {
    id: "massy-stores-sales-associate-20261101",
    title: "Sales Associate",
    employer: "Massy Stores",
    location: "Trincity",
    description:
      "Help customers on the shop floor and keep the shelves stocked during each shift.",
    howToApply: "Apply on the employer website and mention this role.",
    applyUrl: "https://www.massystores.com/",
    sourceName: "Massy Stores",
    datePosted: "2026-11-01",
    status: "open",
    ...overrides,
  };
}

function one(overrides: Record<string, unknown> = {}) {
  const [job] = parseJobCatalog([entry(overrides)], "test");
  return job;
}

test("live catalog and fixtures parse", () => {
  const live = parseJobCatalog(
    JSON.parse(readFileSync("data/jobs.json", "utf8")),
    "data/jobs.json",
  );
  assert.ok(Array.isArray(live));

  const fixtures = parseJobCatalog(
    JSON.parse(readFileSync("data/jobs.fixtures.json", "utf8")),
    "data/jobs.fixtures.json",
  );
  assert.equal(fixtures.length, 3);
  assert.equal(fixtures[2]?.country, DEFAULT_COUNTRY);
  assert.ok(fixtures.every((job) => !isJobVisible(job, postedOn)));
});

test("defaults country, accepts a spaced job type, and sorts nothing into the result", () => {
  const job = one({ country: undefined, jobType: "Full Time" });
  assert.equal(job?.country, DEFAULT_COUNTRY);
  assert.equal(job?.jobType, "full-time");
});

test("rejects a bad entry with a file label", () => {
  assert.throws(
    () =>
      parseJobCatalog(
        [entry({ id: "Massy Job", status: "live", applyUrl: "javascript:alert(1)" })],
        "data/jobs.json",
      ),
    /Invalid job catalog data\/jobs\.json/,
  );
});

test("rejects duplicate ids", () => {
  assert.throws(
    () => parseJobCatalog([entry(), entry()], "data/jobs.json"),
    /duplicates/,
  );
});

test("requires a way to apply", () => {
  const withoutLink = entry();
  delete withoutLink.applyUrl;
  assert.throws(
    () => parseJobCatalog([withoutLink], "data/jobs.json"),
    /applyUrl or applyEmail/,
  );
});

test("rejects an impossible calendar date and a closing date before posting", () => {
  assert.throws(
    () => parseJobCatalog([entry({ datePosted: "2026-02-31" })], "test"),
    /datePosted/,
  );
  assert.throws(
    () =>
      parseJobCatalog(
        [entry({ datePosted: "2026-11-10", closingDate: "2026-11-01" })],
        "test",
      ),
    /closingDate must be on or after/,
  );
});

test("hides closed jobs, passed closing dates, and undated jobs older than 30 days", () => {
  const open = one({ closingDate: "2026-11-20" });
  assert.equal(isJobVisible(open as BoardJob, postedOn), true);

  const closed = one({ status: "closed", closingDate: "2026-12-01" });
  assert.equal(isJobVisible(closed as BoardJob, postedOn), false);

  const expired = one({ closingDate: "2026-11-12" });
  assert.equal(isJobVisible(expired as BoardJob, postedOn), false);

  const stillOpenToday = one({ closingDate: "2026-11-13" });
  assert.equal(
    isJobVisible(
      stillOpenToday as BoardJob,
      new Date("2026-11-13T22:00:00.000-04:00"),
    ),
    true,
  );
  assert.equal(
    isJobVisible(
      stillOpenToday as BoardJob,
      new Date("2026-11-14T00:30:00.000-04:00"),
    ),
    false,
  );

  const undatedFresh = one({ datePosted: "2026-10-14" });
  assert.equal(
    isJobVisible(
      undatedFresh as BoardJob,
      new Date("2026-11-13T00:00:00.000-04:00"),
    ),
    true,
  );
  assert.equal(
    isJobVisible(
      undatedFresh as BoardJob,
      new Date("2026-11-13T00:00:01.000-04:00"),
    ),
    false,
  );
});

test("accepts an empty catalog", () => {
  assert.deepEqual(parseJobCatalog([], "test"), []);
});

test("treats equivalent country names as the same place", () => {
  assert.equal(
    normalizePlace("Trinidad & Tobago"),
    normalizePlace("Trinidad and Tobago"),
  );
  assert.equal(countryCode("St. Lucia"), countryCode("Saint Lucia"));
  assert.equal(countryCode("The Bahamas"), countryCode("Bahamas"));
});

test("accepts a same-day deadline and rejects an impossible timestamp", () => {
  const job = one({
    datePosted: "2026-11-13T12:00:00-04:00",
    closingDate: "2026-11-13",
  });
  assert.equal(job?.closingDate, "2026-11-13");
  assert.throws(
    () => parseJobCatalog([entry({ datePosted: "2026-02-31T12:00:00Z" })], "test"),
    /datePosted/,
  );
});

test("formats a timestamp in Trinidad and Tobago and a date-only value as written", () => {
  assert.equal(formatJobDate("2026-11-13T23:00:00-04:00"), "13 Nov 2026");
  assert.equal(formatJobDate("2026-11-13"), "13 Nov 2026");
});

test("marks a job closing within 7 days", () => {
  const soon = one({ closingDate: "2026-11-18" });
  const later = one({ closingDate: "2026-12-20" });
  assert.equal(isClosingSoon(soon as BoardJob, postedOn), true);
  assert.equal(isClosingSoon(later as BoardJob, postedOn), false);
});
