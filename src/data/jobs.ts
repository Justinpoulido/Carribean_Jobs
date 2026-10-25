import type { Job, SalaryPeriod, SelectOption } from "@/lib/types";

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
  "Construction",
  "Marketing",
  "Sales",
  "Customer Service",
  "Administration",
  "Education",
  "Other",
];

export const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
export const workModes = ["Remote", "On-site", "Hybrid"];

// Local currency per country (ISO 4217). USD is always allowed as well.
export const countryCurrency: Record<string, string> = {
  "Trinidad & Tobago": "TTD",
  Jamaica: "JMD",
  Barbados: "BBD",
  Guyana: "GYD",
  Grenada: "XCD",
  "St. Lucia": "XCD",
  Bahamas: "BSD",
  Belize: "BZD",
};

export const currencies = ["TTD", "JMD", "BBD", "GYD", "XCD", "BSD", "BZD", "USD"];

export const salaryPeriods: SalaryPeriod[] = ["Hour", "Month", "Year"];

// ISO 3166-1 alpha-2, used for Google JobPosting structured data.
export const countryIsoCode: Record<string, string> = {
  "Trinidad & Tobago": "TT",
  Jamaica: "JM",
  Barbados: "BB",
  Guyana: "GY",
  Grenada: "GD",
  "St. Lucia": "LC",
  Bahamas: "BS",
  Belize: "BZ",
};

export const countryOptions: SelectOption[] = countries.map((country) => ({
  label: country,
  value: country,
}));

export const categoryOptions: SelectOption[] = categories.map((category) => ({
  label: category,
  value: category,
}));

export function currencyForCountry(country: string) {
  return countryCurrency[country] || "USD";
}

const periodLabel: Record<SalaryPeriod, string> = {
  Hour: "/ hour",
  Month: "/ month",
  Year: "/ year",
};

export function formatSalary(job: Pick<
  Job,
  "salary_min" | "salary_max" | "salary_currency" | "salary_period" | "country"
>) {
  const min = job.salary_min ?? 0;
  const max = job.salary_max ?? 0;

  if (!min && !max) {
    return "Salary not listed";
  }

  const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
  const currency = job.salary_currency || currencyForCountry(job.country);
  const period = job.salary_period ? ` ${periodLabel[job.salary_period]}` : "";
  const amount =
    min && max && min !== max
      ? `${formatter.format(min)} - ${formatter.format(max)}`
      : formatter.format(max || min);

  return `${currency} ${amount}${period}`;
}
