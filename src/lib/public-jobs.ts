export const countries = [
  "Trinidad & Tobago",
  "Jamaica",
  "Barbados",
  "Guyana",
  "Grenada",
  "St. Lucia",
  "Bahamas",
  "Belize",
];

export const categories = [
  "Technology",
  "Finance",
  "Hospitality",
  "Healthcare",
  "Energy",
  "Marketing",
  "Customer Service",
  "Education",
  "Construction & Engineering",
  "Sales",
  "Retail",
  "Admin & Office",
  "Skilled Trades",
  "Driving & Logistics",
];

export const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
];

export const workModes = ["Remote", "On-site", "Hybrid"];

export const currencies = ["TTD", "JMD", "BBD", "GYD", "XCD", "BSD", "BZD", "USD"];

export const payPeriods = [
  { value: "month", label: "Per month" },
  { value: "year", label: "Per year" },
] as const;

export const LIVE_STATUS = "approved";
export const CLOSED_STATUS = "closed";
export const PENDING_STATUS = "pending";

export const BOARD_TIME_ZONE = "America/Port_of_Spain";
const BOARD_UTC_OFFSET = "-04:00";
export const UNDATED_JOB_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
export const CLOSING_SOON_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const ISO_DATE =
  /^(\d{4})-(\d{2})-(\d{2})(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/;

const FOREIGN_CITIES = new Set([
  "london",
  "new york",
  "nyc",
  "toronto",
  "miami",
  "paris",
  "dubai",
  "manchester",
  "birmingham",
  "sydney",
  "auckland",
  "lagos",
  "johannesburg",
  "mumbai",
  "delhi",
  "houston",
  "atlanta",
  "chicago",
  "los angeles",
  "vancouver",
  "calgary",
]);

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
};

const EMPLOYMENT_TYPES: Record<string, string> = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  temporary: "TEMPORARY",
  internship: "INTERN",
};

export type PayPeriod = "month" | "year";

export type PublicJob = {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  city: string;
  country: string;
  category: string;
  jobType: string;
  workMode: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  payPeriod: PayPeriod | null;
  description: string;
  requirements: string[];
  applicationEmail: string | null;
  applicationUrl: string | null;
  isFeatured: boolean;
  status: string;
  postedAt: string;
  closingDate: string | null;
  expired: boolean;
  closingSoon: boolean;
};

export type JobSubmission = {
  title: string;
  companyName: string;
  city: string;
  country: string;
  category: string;
  jobType: string;
  workMode: string;
  description: string;
  requirements: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  payPeriod: string;
  applicationEmail: string;
  applicationUrl: string;
  closingDate: string;
  posterName: string;
  posterEmail: string;
  featured: boolean;
};

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

export function countriesMatch(left: string, right: string) {
  const leftCode = countryCode(left);
  const rightCode = countryCode(right);
  if (leftCode && rightCode) {
    return leftCode === rightCode;
  }
  return normalizePlace(left) === normalizePlace(right);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function canonicalSlug(job: {
  id: string;
  title: string;
  city: string;
  slug?: string | null;
}) {
  const stored = job.slug?.trim();
  if (stored) {
    return stored;
  }
  const base = slugify(`${job.title}-${job.city}`) || "job";
  return `${base}-${job.id}`;
}

export function formatJobDate(iso: string) {
  const hasTime = iso.length > 10;
  const date = parseBoardDate(hasTime ? iso : iso.slice(0, 10));
  if (!date) {
    return iso;
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: hasTime ? BOARD_TIME_ZONE : "UTC",
  }).format(date);
}

export function formatSalary(job: {
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  payPeriod: PayPeriod | null;
}) {
  if (job.salaryMin == null && job.salaryMax == null) {
    return null;
  }
  const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
  const amount =
    job.salaryMin != null &&
    job.salaryMax != null &&
    job.salaryMin !== job.salaryMax
      ? `${formatter.format(job.salaryMin)} – ${formatter.format(job.salaryMax)}`
      : formatter.format((job.salaryMin ?? job.salaryMax) as number);
  const currency = job.currency ? `${job.currency} ` : "";
  const period =
    job.payPeriod === "month" ? " / month" : job.payPeriod === "year" ? " / year" : "";
  return `${currency}${amount}${period}`;
}

export function hasApplyMethod(job: {
  applicationEmail: string | null;
  applicationUrl: string | null;
}) {
  return Boolean(job.applicationEmail || job.applicationUrl);
}

export function isExpired(job: { postedAt: string; closingDate: string | null }, now: Date) {
  if (job.closingDate) {
    const closing = closingInstant(job.closingDate);
    return !closing || now.getTime() > closing.getTime();
  }
  const posted = postedInstant(job.postedAt);
  if (!posted) {
    return true;
  }
  return now.getTime() - posted.getTime() > UNDATED_JOB_MAX_AGE_MS;
}

export function isClosingSoon(
  job: { postedAt: string; closingDate: string | null; expired: boolean },
  now: Date,
) {
  if (job.expired || !job.closingDate) {
    return false;
  }
  const closing = closingInstant(job.closingDate);
  if (!closing) {
    return false;
  }
  const remaining = closing.getTime() - now.getTime();
  return remaining >= 0 && remaining <= CLOSING_SOON_WINDOW_MS;
}

export function isOpenJob(job: PublicJob) {
  return job.status === LIVE_STATUS && !job.expired && hasApplyMethod(job);
}

export function applyHref(job: {
  title: string;
  applicationEmail: string | null;
  applicationUrl: string | null;
}) {
  if (job.applicationUrl) {
    return job.applicationUrl;
  }
  if (job.applicationEmail) {
    return `mailto:${job.applicationEmail}?subject=${encodeURIComponent(job.title)}`;
  }
  return null;
}

export function shareDescription(job: PublicJob) {
  const line =
    job.description
      .split(/\r?\n/)
      .map((part) => part.trim())
      .find(Boolean) ?? "";
  const brief = line.length > 140 ? `${line.slice(0, 137).trimEnd()}...` : line;
  return `${job.city}, ${job.country} · ${job.jobType}. ${brief}`.trim();
}

export function employmentType(jobType: string) {
  return EMPLOYMENT_TYPES[jobType.trim().toLowerCase()] ?? "OTHER";
}

export function jobPostingJsonLd(job: PublicJob, pageUrl: string) {
  const posting: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [job.description, ...job.requirements].filter(Boolean).join("\n\n"),
    datePosted: job.postedAt.slice(0, 10),
    employmentType: employmentType(job.jobType),
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.city,
        addressCountry: countryCode(job.country) ?? job.country,
      },
    },
    url: pageUrl,
    directApply: false,
  };

  const validThrough = job.closingDate ?? plusDays(job.postedAt, 30);
  if (validThrough) {
    posting.validThrough = validThrough;
  }

  if (
    job.currency &&
    (job.salaryMin != null || job.salaryMax != null)
  ) {
    posting.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.currency,
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin ?? job.salaryMax,
        maxValue: job.salaryMax ?? job.salaryMin,
        unitText: job.payPeriod === "year" ? "YEAR" : "MONTH",
      },
    };
  }

  return posting;
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function cityProblem(city: string, country: string) {
  const normalized = city.trim().toLowerCase().replace(/\./g, "");
  if (FOREIGN_CITIES.has(normalized)) {
    return `${city.trim()} does not look like a town in ${country}. Enter the town where the role is based.`;
  }
  return null;
}

export function validateJobSubmission(input: JobSubmission) {
  const problems: string[] = [];
  const title = required(input.title, "Job title", problems);
  const companyName = required(input.companyName, "Company name", problems);
  const city = required(input.city, "Town or city", problems);
  const country = oneOf(input.country, "Country", countries, problems);
  const category = oneOf(input.category, "Category", categories, problems);
  const jobType = oneOf(input.jobType, "Job type", jobTypes, problems);
  const workMode = oneOf(input.workMode, "Work mode", workModes, problems);
  const description = required(input.description, "Description", problems, 20);
  const requirements = required(input.requirements, "Requirements", problems, 2);
  const posterName = required(input.posterName, "Your name", problems);
  const posterEmail = email(input.posterEmail, "Your email", problems);
  const applicationEmail = input.applicationEmail.trim();
  const applicationUrl = input.applicationUrl.trim();

  if (!applicationEmail && !applicationUrl) {
    problems.push("Add an employer email or an application URL.");
  }
  if (applicationEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationEmail)) {
    problems.push("Application email must be a valid email address.");
  }
  if (applicationUrl && !isHttpUrl(applicationUrl)) {
    problems.push("Application URL must start with http:// or https://.");
  }
  if (city && country) {
    const place = cityProblem(city, country);
    if (place) {
      problems.push(place);
    }
  }

  const salaryMin = input.salaryMin;
  const salaryMax = input.salaryMax;
  const hasSalary = salaryMin != null || salaryMax != null;
  let currency = input.currency.trim().toUpperCase();
  let payPeriod = input.payPeriod.trim().toLowerCase();
  if (hasSalary) {
    if (!currencies.includes(currency)) {
      problems.push("Choose a currency for the salary.");
      currency = "";
    }
    if (payPeriod !== "month" && payPeriod !== "year") {
      problems.push("Choose whether the salary is per month or per year.");
      payPeriod = "";
    }
    if (salaryMin != null && salaryMax != null && salaryMin > salaryMax) {
      problems.push("Salary minimum cannot be higher than the maximum.");
    }
  } else {
    currency = "";
    payPeriod = "";
  }

  const closingDate = input.closingDate.trim();
  if (!parseBoardDate(closingDate) || closingDate.length !== 10) {
    problems.push("Closing date must be a real date.");
  } else if (isExpired({ postedAt: new Date().toISOString(), closingDate }, new Date())) {
    problems.push("Closing date must be today or later.");
  }

  if (problems.length > 0 || !title || !companyName || !city || !country || !category || !jobType || !workMode || !description || !requirements || !posterName || !posterEmail) {
    return { ok: false as const, message: problems.join(" ") };
  }

  return {
    ok: true as const,
    value: {
      title,
      company_name: companyName,
      city,
      country,
      category,
      job_type: jobType,
      work_mode: workMode,
      description,
      requirements,
      salary_min: salaryMin,
      salary_max: salaryMax,
      currency: currency || null,
      pay_period: payPeriod || null,
      application_email: applicationEmail || null,
      application_link: applicationUrl || null,
      apply_url: applicationUrl || null,
      poster_name: posterName,
      contact_email: posterEmail,
      is_featured: input.featured,
      status: PENDING_STATUS,
      expires_at: `${closingDate}T23:59:59.999${BOARD_UTC_OFFSET}`,
      posted_at: new Date().toISOString(),
    },
  };
}

export function parseBoardDate(value: string) {
  const match = ISO_DATE.exec(value);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!isRealCalendarDate(year, month, day)) {
    return null;
  }
  const hasTime = value.length > 10;
  const date = new Date(hasTime ? value : `${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function isRealCalendarDate(year: number, month: number, day: number) {
  const check = new Date(Date.UTC(year, month - 1, day));
  return (
    check.getUTCFullYear() === year &&
    check.getUTCMonth() + 1 === month &&
    check.getUTCDate() === day
  );
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

function plusDays(iso: string, days: number) {
  const posted = postedInstant(iso);
  if (!posted) {
    return null;
  }
  return new Date(posted.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}

function required(
  value: string,
  label: string,
  problems: string[],
  min = 2,
) {
  const text = value.trim();
  if (text.length < min) {
    problems.push(`${label} is required.`);
    return "";
  }
  return text;
}

function oneOf(value: string, label: string, allowed: readonly string[], problems: string[]) {
  const text = value.trim();
  if (!allowed.includes(text)) {
    problems.push(`Choose a ${label.toLowerCase()}.`);
    return "";
  }
  return text;
}

function email(value: string, label: string, problems: string[]) {
  const text = value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
    problems.push(`${label} must be a valid email address.`);
    return "";
  }
  return text;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
