export type Job = {
  id: string;
  title: string;
  company_name: string;
  contact_email: string;
  country: string;
  city: string;
  category: string;
  job_type: string;
  work_mode: "Remote" | "On-site" | "Hybrid";
  salary_min: number;
  salary_max: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  application_email?: string;
  application_link?: string;
  is_featured: boolean;
  status: "published" | "draft" | "closed";
  created_at: string;
};

export type SelectOption = {
  label: string;
  value: string;
};
