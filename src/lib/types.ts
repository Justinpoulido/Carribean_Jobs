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
  source_id?: number | null;
  source_name?: string | null;
  source_url?: string | null;
  external_id?: string | null;
  apply_url?: string | null;
  sector?: string | null;
  import_status?: "pending" | "approved" | "published" | "rejected";
  duplicate_hash?: string | null;
  posted_at?: string | null;
  expires_at?: string | null;
};

export type SelectOption = {
  label: string;
  value: string;
};

export type JobSourceType = "api" | "ats" | "rss" | "scraper" | "manual";

export type JobSource = {
  id: number;
  name: string;
  source_type: JobSourceType;
  base_url: string;
  country: string;
  sector: string | null;
  is_active: boolean;
  trusted_auto_publish: boolean;
  created_at: string;
};

export type ImportRunStatus = "running" | "success" | "partial" | "failed";

export type JobImportRun = {
  id: number;
  source_id: number;
  status: ImportRunStatus;
  jobs_found: number;
  jobs_added: number;
  duplicates_skipped: number;
  errors: string[] | null;
  started_at: string;
  finished_at: string | null;
};

export type ImportedJob = {
  external_id: string;
  title: string;
  company_name: string;
  country: string;
  city: string;
  category?: string;
  job_type?: string;
  work_mode?: "Remote" | "On-site" | "Hybrid";
  salary_min?: number | null;
  salary_max?: number | null;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  source_url: string;
  apply_url?: string;
  sector?: string | null;
  posted_at?: string | null;
  expires_at?: string | null;
};
