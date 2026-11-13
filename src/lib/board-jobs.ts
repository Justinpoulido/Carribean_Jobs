export const JOB_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "temporary",
  "internship",
  "freelance",
  "casual",
] as const;

export type JobType = (typeof JOB_TYPES)[number];
export type JobStatus = "open" | "closed";

export type BoardJob = {
  id: string;
  title: string;
  employer: string;
  location: string;
  country: string;
  jobType?: JobType;
  salary?: string;
  description: string;
  highlights?: string[];
  howToApply: string;
  applyUrl?: string;
  applyEmail?: string;
  sourceName: string;
  datePosted: string;
  closingDate?: string;
  status: JobStatus;
};

export type ListedJob = BoardJob & {
  closingSoon: boolean;
};

export const DEFAULT_COUNTRY = "Trinidad and Tobago";

/** Date-only values are interpreted in Trinidad and Tobago (Atlantic, no DST). */
export const BOARD_TIME_ZONE = "America/Port_of_Spain";
const BOARD_UTC_OFFSET = "-04:00";

export const UNDATED_JOB_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
export const CLOSING_SOON_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const JOB_KEYS = [
  "id",
  "title",
  "employer",
  "location",
  "country",
  "jobType",
  "salary",
  "description",
  "highlights",
  "howToApply",
  "applyUrl",
  "applyEmail",
  "sourceName",
  "datePosted",
  "closingDate",
  "status",
] as const;

const JOB_TYPE_LABELS: Record<JobType, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  temporary: "Temporary",
  internship: "Internship",
  freelance: "Freelance",
  casual: "Casual",
};

const EMPLOYMENT_TYPES: Record<JobType, string> = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  temporary: "TEMPORARY",
  internship: "INTERN",
  freelance: "CONTRACTOR",
  casual: "OTHER",
};

const COUNTRY_CODES: Record<string, string> = {
  "trinidad and tobago": "TT",
  jamaica: "JM",
  barbados: "BB",
  guyana: "GY",
  grenada: "GD",
  "saint lucia": "LC",
  "st lucia": "LC",
  bahamas: "BS",
  "the bahamas": "BS",
  belize: "BZ",
  suriname: "SR",
  haiti: "HT",
  dominica: "DM",
  "antigua and barbuda": "AG",
  "saint vincent and the grenadines": "VC",
  "st vincent and the grenadines": "VC",
  "saint kitts and nevis": "KN",
  "st kitts and nevis": "KN",
};

const ISO_DATE =
  /^(\d{4})-(\d{2})-(\d{2})(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/;

export class JobCatalogError extends Error {
  readonly fileLabel: string;
  readonly problems: string[];

  constructor(fileLabel: string, problems: string[]) {
    super(
      `Invalid job catalog ${fileLabel} (${problems.length} ${
        problems.length === 1 ? "problem" : "problems"
      }):\n${problems.map((problem) => `- ${problem}`).join("\n")}`,
    );
    this.name = "JobCatalogError";
    this.fileLabel = fileLabel;
    this.problems = problems;
  }
}

export function jobTypeLabel(jobType: JobType) {
  return JOB_TYPE_LABELS[jobType];
}

export function employmentType(jobType: JobType) {
  return EMPLOYMENT_TYPES[jobType];
}

export function normalizePlace(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function countryCode(country: string) {
  return COUNTRY_CODES[normalizePlace(country)];
}

export function formatJobDate(iso: string) {
  const date = parseBoardDate(iso);
  if (!date) {
    return iso;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function parseJobCatalog(input: unknown, fileLabel: string): BoardJob[] {
  const problems: string[] = [];

  if (!Array.isArray(input)) {
    throw new JobCatalogError(fileLabel, [
      "the file must be a JSON array of jobs (use [] when there are none)",
    ]);
  }

  const seen = new Map<string, number>();
  const jobs: BoardJob[] = [];

  input.forEach((entry, index) => {
    const label = `jobs[${index}]`;
    if (!isRecord(entry)) {
      problems.push(`${label} must be an object`);
      return;
    }

    for (const key of Object.keys(entry)) {
      if (!JOB_KEYS.includes(key as (typeof JOB_KEYS)[number])) {
        problems.push(`${label}.${key} is not a supported field`);
      }
    }

    const id = readSlug(entry.id, `${label}.id`, problems);
    if (id) {
      const first = seen.get(id);
      if (first !== undefined) {
        problems.push(
          `${label}.id duplicates jobs[${first}].id "${id}". Each id must be unique`,
        );
      } else {
        seen.set(id, index);
      }
    }

    const title = readText(entry.title, `${label}.title`, problems, {
      min: 2,
      max: 140,
    });
    const employer = readText(entry.employer, `${label}.employer`, problems, {
      min: 2,
      max: 140,
    });
    const location = readText(entry.location, `${label}.location`, problems, {
      min: 2,
      max: 140,
    });
    const country = readCountry(entry.country, `${label}.country`, problems);
    const jobType = readJobType(entry.jobType, `${label}.jobType`, problems);
    const salary = readOptionalText(entry.salary, `${label}.salary`, problems, 120);
    const description = readText(
      entry.description,
      `${label}.description`,
      problems,
      { min: 20, max: 5000 },
    );
    const highlights = readHighlights(
      entry.highlights,
      `${label}.highlights`,
      problems,
    );
    const howToApply = readText(
      entry.howToApply,
      `${label}.howToApply`,
      problems,
      { min: 10, max: 2000 },
    );
    const applyUrl = readUrl(entry.applyUrl, `${label}.applyUrl`, problems);
    const applyEmail = readEmail(
      entry.applyEmail,
      `${label}.applyEmail`,
      problems,
    );
    const sourceName = readText(
      entry.sourceName,
      `${label}.sourceName`,
      problems,
      { min: 2, max: 140 },
    );
    const datePosted = readDate(
      entry.datePosted,
      `${label}.datePosted`,
      problems,
      true,
    );
    const closingDate = readDate(
      entry.closingDate,
      `${label}.closingDate`,
      problems,
      false,
    );
    const status = readStatus(entry.status, `${label}.status`, problems);

    if (entry.applyUrl === undefined && entry.applyEmail === undefined) {
      problems.push(
        `${label} needs applyUrl or applyEmail so a visitor can apply`,
      );
    }

    if (datePosted && closingDate) {
      const posted = parseBoardDate(datePosted);
      const closing = parseBoardDate(closingDate);
      if (posted && closing && closing.getTime() < posted.getTime()) {
        problems.push(
          `${label}.closingDate must be on or after datePosted`,
        );
      }
    }

    if (
      !id ||
      !title ||
      !employer ||
      !location ||
      !description ||
      !howToApply ||
      !sourceName ||
      !datePosted ||
      !status ||
      (!applyUrl && !applyEmail)
    ) {
      return;
    }

    const job: BoardJob = {
      id,
      title,
      employer,
      location,
      country,
      description,
      howToApply,
      sourceName,
      datePosted,
      status,
    };

    if (jobType) {
      job.jobType = jobType;
    }
    if (salary) {
      job.salary = salary;
    }
    if (highlights && highlights.length > 0) {
      job.highlights = highlights;
    }
    if (applyUrl) {
      job.applyUrl = applyUrl;
    }
    if (applyEmail) {
      job.applyEmail = applyEmail;
    }
    if (closingDate) {
      job.closingDate = closingDate;
    }

    jobs.push(job);
  });

  if (problems.length > 0) {
    throw new JobCatalogError(fileLabel, problems.slice(0, 50));
  }

  return jobs;
}

export function isJobVisible(job: BoardJob, now: Date) {
  if (job.status !== "open") {
    return false;
  }

  if (job.closingDate) {
    const closing = closingInstant(job.closingDate);
    if (!closing) {
      return false;
    }
    return now.getTime() <= closing.getTime();
  }

  const posted = postedInstant(job.datePosted);
  if (!posted) {
    return false;
  }

  return now.getTime() - posted.getTime() <= UNDATED_JOB_MAX_AGE_MS;
}

export function isClosingSoon(job: BoardJob, now: Date) {
  if (!job.closingDate || !isJobVisible(job, now)) {
    return false;
  }

  const closing = closingInstant(job.closingDate);
  if (!closing) {
    return false;
  }

  const remaining = closing.getTime() - now.getTime();
  return remaining >= 0 && remaining <= CLOSING_SOON_WINDOW_MS;
}

export function compareJobsByNewest(a: BoardJob, b: BoardJob) {
  const posted =
    (postedInstant(b.datePosted)?.getTime() ?? 0) -
    (postedInstant(a.datePosted)?.getTime() ?? 0);
  if (posted !== 0) {
    return posted;
  }
  return a.id.localeCompare(b.id);
}

export function jobPostingJsonLd(job: BoardJob, pageUrl: string) {
  const description = [
    job.description,
    job.salary ? `Salary: ${job.salary}` : "",
    job.highlights?.length ? job.highlights.join("\n") : "",
    job.howToApply,
  ]
    .filter(Boolean)
    .join("\n\n");

  const posting: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted: job.datePosted,
    hiringOrganization: {
      "@type": "Organization",
      name: job.employer,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: countryCode(job.country) ?? job.country,
      },
    },
    identifier: {
      "@type": "PropertyValue",
      name: "Caribbean Jobs",
      value: job.id,
    },
    url: pageUrl,
    directApply: false,
  };

  if (job.closingDate) {
    posting.validThrough = job.closingDate;
  }
  if (job.jobType) {
    posting.employmentType = employmentType(job.jobType);
  }
  if (job.applyEmail) {
    posting.applicationContact = {
      "@type": "ContactPoint",
      email: job.applyEmail,
    };
  }

  return posting;
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(
  value: unknown,
  label: string,
  problems: string[],
  limits: { min: number; max: number },
) {
  if (typeof value !== "string") {
    problems.push(`${label} must be a string`);
    return;
  }

  const text = value.trim();
  if (text.length < limits.min || text.length > limits.max) {
    problems.push(
      `${label} must be ${limits.min}-${limits.max} characters after trimming`,
    );
    return;
  }

  return text;
}

function readOptionalText(
  value: unknown,
  label: string,
  problems: string[],
  max: number,
) {
  if (value === undefined) {
    return;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    problems.push(`${label} must be a non-empty string when it is set`);
    return;
  }
  if (value.trim().length > max) {
    problems.push(`${label} must be ${max} characters or fewer`);
    return;
  }
  return value.trim();
}

function readSlug(value: unknown, label: string, problems: string[]) {
  if (typeof value !== "string") {
    problems.push(`${label} must be a string`);
    return;
  }

  const id = value.trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || id.length > 80) {
    problems.push(
      `${label} must be a lowercase slug such as employer-title-yyyymmdd (letters, numbers, and single hyphens, 80 characters max)`,
    );
    return;
  }

  return id;
}

function readCountry(value: unknown, label: string, problems: string[]) {
  if (value === undefined || value === "") {
    return DEFAULT_COUNTRY;
  }
  if (typeof value !== "string" || value.trim().length < 2) {
    problems.push(
      `${label} must be a country name, or omit it to use ${DEFAULT_COUNTRY}`,
    );
    return DEFAULT_COUNTRY;
  }
  if (value.trim().length > 80) {
    problems.push(`${label} must be 80 characters or fewer`);
  }
  return value.trim();
}

function readJobType(value: unknown, label: string, problems: string[]) {
  if (value === undefined) {
    return;
  }
  if (typeof value !== "string") {
    problems.push(`${label} must be a string`);
    return;
  }

  const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
  if (!JOB_TYPES.includes(normalized as JobType)) {
    problems.push(
      `${label} must be one of ${JOB_TYPES.join(", ")}`,
    );
    return;
  }

  return normalized as JobType;
}

function readHighlights(value: unknown, label: string, problems: string[]) {
  if (value === undefined) {
    return;
  }
  if (!Array.isArray(value)) {
    problems.push(`${label} must be an array of strings`);
    return;
  }
  if (value.length > 20) {
    problems.push(`${label} can include at most 20 items`);
  }

  const highlights: string[] = [];
  value.forEach((item, index) => {
    if (typeof item !== "string" || item.trim().length === 0) {
      problems.push(`${label}[${index}] must be a non-empty string`);
      return;
    }
    if (item.trim().length > 240) {
      problems.push(`${label}[${index}] must be 240 characters or fewer`);
      return;
    }
    highlights.push(item.trim());
  });
  return highlights;
}

function readUrl(value: unknown, label: string, problems: string[]) {
  if (value === undefined) {
    return;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    problems.push(`${label} must be an http(s) URL when it is set`);
    return;
  }

  const urlText = value.trim();
  if (urlText.length > 500) {
    problems.push(`${label} must be 500 characters or fewer`);
    return;
  }

  try {
    const url = new URL(urlText);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      problems.push(`${label} must start with http:// or https://`);
      return;
    }
  } catch {
    problems.push(`${label} must be a valid http(s) URL`);
    return;
  }

  return urlText;
}

function readEmail(value: unknown, label: string, problems: string[]) {
  if (value === undefined) {
    return;
  }
  if (typeof value !== "string") {
    problems.push(`${label} must be an email address when it is set`);
    return;
  }

  const email = value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
    problems.push(`${label} must be a valid email address`);
    return;
  }

  return email;
}

function readDate(
  value: unknown,
  label: string,
  problems: string[],
  required: boolean,
) {
  if (value === undefined) {
    if (required) {
      problems.push(`${label} must be an ISO date (YYYY-MM-DD)`);
    }
    return;
  }
  if (typeof value !== "string" || !parseBoardDate(value.trim())) {
    problems.push(
      `${label} must be an ISO date (YYYY-MM-DD) or a full ISO date-time`,
    );
    return;
  }
  return value.trim();
}

function readStatus(value: unknown, label: string, problems: string[]) {
  if (typeof value !== "string") {
    problems.push(`${label} must be "open" or "closed"`);
    return;
  }

  const status = value.trim().toLowerCase();
  if (status !== "open" && status !== "closed") {
    problems.push(`${label} must be "open" or "closed"`);
    return;
  }

  return status;
}

export function parseBoardDate(value: string) {
  const match = ISO_DATE.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hasTime = value.length > 10;
  const date = new Date(hasTime ? value : `${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    if (!hasTime) {
      return null;
    }
  }

  if (!hasTime) {
    const check = new Date(Date.UTC(year, month - 1, day));
    if (
      check.getUTCFullYear() !== year ||
      check.getUTCMonth() + 1 !== month ||
      check.getUTCDate() !== day
    ) {
      return null;
    }
  }

  return date;
}

function postedInstant(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00.000${BOARD_UTC_OFFSET}`);
  }
  return parseBoardDate(value);
}

function closingInstant(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T23:59:59.999${BOARD_UTC_OFFSET}`);
  }
  return parseBoardDate(value);
}
