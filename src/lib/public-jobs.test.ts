import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canonicalSlug,
  cityProblem,
  formatJobDate,
  formatSalary,
  isExpired,
  isOpenJob,
  validateJobSubmission,
  type PublicJob,
} from "./public-jobs.ts";

const now = new Date("2026-11-13T12:00:00.000-04:00");

function job(overrides: Partial<PublicJob> = {}): PublicJob {
  return {
    id: "1",
    slug: "sales-representative-penal-1",
    title: "Sales Representative",
    companyName: "Americas Marketing Company Limited",
    city: "Penal",
    country: "Trinidad & Tobago",
    category: "Sales",
    jobType: "Full-time",
    workMode: "On-site",
    salaryMin: 7700,
    salaryMax: 8000,
    currency: "TTD",
    payPeriod: "month",
    description: "Sell products to shops across south Trinidad.",
    requirements: ["Driver's permit"],
    applicationEmail: "jobs@example.com",
    applicationUrl: null,
    isFeatured: false,
    status: "approved",
    postedAt: "2026-11-01T12:00:00.000Z",
    closingDate: "2026-11-30",
    expired: false,
    closingSoon: false,
    ...overrides,
  };
}

test("formats salary with currency and period", () => {
  assert.equal(formatSalary(job()), "TTD 7,700 – 8,000 / month");
});

test("hides closed, expired, pending, and apply-less jobs", () => {
  assert.equal(isOpenJob(job()), true);
  assert.equal(isOpenJob(job({ status: "closed" })), false);
  assert.equal(isOpenJob(job({ status: "pending" })), false);
  assert.equal(isOpenJob(job({ expired: true })), false);
  assert.equal(
    isOpenJob(job({ applicationEmail: null, applicationUrl: null })),
    false,
  );
});

test("expires a passed closing date and an undated job older than 30 days", () => {
  assert.equal(
    isExpired({ postedAt: "2026-10-01", closingDate: "2026-11-12" }, now),
    true,
  );
  assert.equal(
    isExpired({ postedAt: "2026-11-01", closingDate: "2026-11-13" }, now),
    false,
  );
  assert.equal(
    isExpired({ postedAt: "2026-11-01T00:00:00.000-04:00", closingDate: null }, now),
    false,
  );
  assert.equal(
    isExpired({ postedAt: "2026-09-01T00:00:00.000-04:00", closingDate: null }, now),
    true,
  );
});

test("builds a readable slug and keeps a stored one", () => {
  assert.equal(
    canonicalSlug({ id: "1", title: "Sales Representative", city: "Penal" }),
    "sales-representative-penal-1",
  );
  assert.equal(
    canonicalSlug({
      id: "1",
      title: "Sales Representative",
      city: "Penal",
      slug: "custom-slug",
    }),
    "custom-slug",
  );
});

test("rejects a foreign city and a submission with no way to apply", () => {
  assert.match(cityProblem("London", "Trinidad & Tobago") ?? "", /London/);
  assert.equal(cityProblem("Penal", "Trinidad & Tobago"), null);
  const result = validateJobSubmission({
    title: "Cashier",
    companyName: "Example Stores",
    city: "London",
    country: "Trinidad & Tobago",
    category: "Retail",
    jobType: "Full-time",
    workMode: "On-site",
    description: "Serve customers at the checkout during shop hours.",
    requirements: "Weekend availability",
    salaryMin: null,
    salaryMax: null,
    currency: "",
    payPeriod: "",
    applicationEmail: "",
    applicationUrl: "",
    closingDate: "2099-06-01",
    posterName: "A. Poster",
    posterEmail: "poster@example.com",
    featured: false,
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.message, /London/);
    assert.match(result.message, /email or an application URL/);
  }
});

test("accepts a complete pending submission", () => {
  const result = validateJobSubmission({
    title: "Cashier",
    companyName: "Example Stores",
    city: "San Fernando",
    country: "Trinidad & Tobago",
    category: "Retail",
    jobType: "Part-time",
    workMode: "On-site",
    description: "Serve customers at the checkout during shop hours.",
    requirements: "Weekend availability",
    salaryMin: 20,
    salaryMax: 25,
    currency: "ttd",
    payPeriod: "month",
    applicationEmail: "",
    applicationUrl: "https://example.com/apply",
    closingDate: "2099-06-01",
    posterName: "A. Poster",
    posterEmail: "poster@example.com",
    featured: true,
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.status, "pending");
    assert.equal(result.value.currency, "TTD");
    assert.equal(result.value.pay_period, "month");
    assert.equal(result.value.is_featured, true);
  }
});

test("formats a timestamp in Trinidad and Tobago", () => {
  assert.equal(formatJobDate("2026-11-13T23:00:00-04:00"), "13 Nov 2026");
  assert.equal(formatJobDate("2026-11-13"), "13 Nov 2026");
});
