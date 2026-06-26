import type { Job, SelectOption } from "@/lib/types";

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
];

export const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
export const workModes = ["Remote", "On-site", "Hybrid"];

export const countryOptions: SelectOption[] = countries.map((country) => ({
  label: country,
  value: country,
}));

export const categoryOptions: SelectOption[] = categories.map((category) => ({
  label: category,
  value: category,
}));

export const sampleJobs: Job[] = [
  {
    id: "tt-product-manager",
    title: "Digital Product Manager",
    company_name: "BlueWave Fintech",
    contact_email: "talent@bluewave.example",
    country: "Trinidad & Tobago",
    city: "Port of Spain",
    category: "Technology",
    job_type: "Full-time",
    work_mode: "Hybrid",
    salary_min: 180000,
    salary_max: 240000,
    description:
      "Lead the roadmap for digital banking products serving customers across the Southern Caribbean.",
    requirements: [
      "5+ years managing web or mobile products",
      "Strong stakeholder and analytics skills",
      "Experience in fintech, banking, or SaaS preferred",
    ],
    responsibilities: [
      "Own discovery, prioritization, and launch planning",
      "Partner with engineering, design, compliance, and operations",
      "Track adoption, conversion, and customer success metrics",
    ],
    benefits: ["Hybrid schedule", "Health coverage", "Performance bonus"],
    application_email: "talent@bluewave.example",
    is_featured: true,
    status: "published",
    created_at: "2026-06-18T09:00:00.000Z",
  },
  {
    id: "jm-resort-operations",
    title: "Resort Operations Supervisor",
    company_name: "Island Vista Resorts",
    contact_email: "careers@islandvista.example",
    country: "Jamaica",
    city: "Montego Bay",
    category: "Hospitality",
    job_type: "Full-time",
    work_mode: "On-site",
    salary_min: 3200000,
    salary_max: 4200000,
    description:
      "Coordinate front office, guest services, and housekeeping operations for a growing resort group.",
    requirements: [
      "Hospitality leadership experience",
      "Excellent guest recovery and scheduling skills",
      "Weekend and holiday availability",
    ],
    responsibilities: [
      "Lead daily shift briefings and service standards",
      "Resolve guest escalations quickly and professionally",
      "Monitor staffing, inventory, and operational reporting",
    ],
    benefits: ["Meal allowance", "Training program", "Travel discounts"],
    application_email: "careers@islandvista.example",
    is_featured: true,
    status: "published",
    created_at: "2026-06-16T11:30:00.000Z",
  },
  {
    id: "bb-finance-analyst",
    title: "Senior Financial Analyst",
    company_name: "Coral Capital Partners",
    contact_email: "jobs@coralcapital.example",
    country: "Barbados",
    city: "Bridgetown",
    category: "Finance",
    job_type: "Full-time",
    work_mode: "Hybrid",
    salary_min: 95000,
    salary_max: 125000,
    description:
      "Build financial models, market reports, and investment dashboards for regional clients.",
    requirements: [
      "CPA, CFA track, or equivalent finance background",
      "Advanced Excel and presentation skills",
      "Comfortable analyzing multi-country revenue data",
    ],
    responsibilities: [
      "Prepare monthly board reporting packages",
      "Maintain forecasting and scenario models",
      "Support diligence for new investment opportunities",
    ],
    benefits: ["Private medical", "Study support", "Flexible Fridays"],
    application_email: "jobs@coralcapital.example",
    is_featured: false,
    status: "published",
    created_at: "2026-06-14T08:20:00.000Z",
  },
  {
    id: "gy-field-engineer",
    title: "Field HSE Engineer",
    company_name: "Kaieteur Energy Services",
    contact_email: "recruiting@kaieteurenergy.example",
    country: "Guyana",
    city: "Georgetown",
    category: "Energy",
    job_type: "Contract",
    work_mode: "On-site",
    salary_min: 7200000,
    salary_max: 9600000,
    description:
      "Support health, safety, and environment programs for energy infrastructure projects.",
    requirements: [
      "NEBOSH, OSHA, or equivalent certification",
      "Field experience in energy, construction, or logistics",
      "Strong incident reporting and training capability",
    ],
    responsibilities: [
      "Run site inspections and toolbox talks",
      "Maintain compliance documentation",
      "Coordinate corrective actions with project leaders",
    ],
    benefits: ["Project completion bonus", "Transport allowance", "PPE provided"],
    application_email: "recruiting@kaieteurenergy.example",
    is_featured: true,
    status: "published",
    created_at: "2026-06-12T10:45:00.000Z",
  },
  {
    id: "remote-customer-success",
    title: "Customer Success Specialist",
    company_name: "CaribCloud",
    contact_email: "people@caribcloud.example",
    country: "Trinidad & Tobago",
    city: "Remote",
    category: "Customer Service",
    job_type: "Full-time",
    work_mode: "Remote",
    salary_min: 110000,
    salary_max: 150000,
    description:
      "Help Caribbean small businesses onboard and grow with cloud productivity tools.",
    requirements: [
      "2+ years in support, success, or account management",
      "Clear written communication",
      "Comfort using CRM and ticketing tools",
    ],
    responsibilities: [
      "Guide new customers through onboarding",
      "Answer product questions and triage issues",
      "Identify expansion and retention opportunities",
    ],
    benefits: ["Remote-first culture", "Learning budget", "Home office stipend"],
    application_email: "people@caribcloud.example",
    is_featured: false,
    status: "published",
    created_at: "2026-06-10T14:15:00.000Z",
  },
];

export function formatSalary(job: Job) {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  });

  return `${formatter.format(job.salary_min)} - ${formatter.format(
    job.salary_max,
  )}`;
}

export function getJobById(id: string) {
  return sampleJobs.find((job) => job.id === id);
}
