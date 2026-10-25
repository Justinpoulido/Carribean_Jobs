"use server";

import { revalidatePath } from "next/cache";
import {
  categories,
  countries,
  currencies,
  currencyForCountry,
  jobTypes,
  salaryPeriods,
  workModes,
} from "@/data/jobs";
import { getSupabaseAdminClient } from "@/lib/supabase";

export type ActionState = {
  ok: boolean;
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, key: string, maxLength: number) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

function positiveNumber(formData: FormData, key: string) {
  const raw = text(formData, key, 20);
  if (!raw) {
    return null;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function oneOf<T extends string>(value: string, allowed: readonly T[]) {
  return (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

// Bots fill every field; humans never see this one.
function isSpam(formData: FormData) {
  return text(formData, "company_website", 200) !== "";
}

export async function createJobPost(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (isSpam(formData)) {
    return { ok: true, message: "Thanks. Your job was submitted for review." };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return {
      ok: false,
      message: "Job posting is temporarily unavailable. Please try again later.",
    };
  }

  const job = {
    title: text(formData, "title", 140),
    company_name: text(formData, "company_name", 140),
    contact_email: text(formData, "contact_email", 200).toLowerCase(),
    country: text(formData, "country", 60),
    city: text(formData, "city", 80),
    category: text(formData, "category", 60),
    job_type: text(formData, "job_type", 40),
    work_mode: text(formData, "work_mode", 20),
    salary_min: positiveNumber(formData, "salary_min"),
    salary_max: positiveNumber(formData, "salary_max"),
    salary_currency: text(formData, "salary_currency", 3).toUpperCase(),
    salary_period: text(formData, "salary_period", 10),
    description: text(formData, "description", 8000),
    requirements: text(formData, "requirements", 4000),
    responsibilities: text(formData, "responsibilities", 4000),
    benefits: text(formData, "benefits", 2000),
    application_email: text(formData, "application_email", 200).toLowerCase(),
    application_link: text(formData, "application_link", 500),
    featured_requested: formData.get("featured_requested") === "on",
  };

  const errors: string[] = [];

  if (!job.title) errors.push("Job title is required.");
  if (!job.company_name) errors.push("Company name is required.");
  if (!EMAIL_PATTERN.test(job.contact_email)) {
    errors.push("A valid contact email is required.");
  }
  if (!oneOf(job.country, countries)) errors.push("Choose a country.");
  if (!job.city) errors.push("City is required.");
  if (!oneOf(job.category, categories)) errors.push("Choose a category.");
  if (!oneOf(job.job_type, jobTypes)) errors.push("Choose a job type.");
  if (!oneOf(job.work_mode, workModes)) errors.push("Choose a work mode.");
  if (job.description.length < 50) {
    errors.push("Description should be at least 50 characters.");
  }
  if (!job.application_email && !job.application_link) {
    errors.push("Add an application email or an application link (or both).");
  }
  if (job.application_email && !EMAIL_PATTERN.test(job.application_email)) {
    errors.push("Application email is not valid.");
  }
  if (job.application_link && !isHttpUrl(job.application_link)) {
    errors.push("Application link must start with http:// or https://.");
  }
  if (job.salary_min && job.salary_max && job.salary_min > job.salary_max) {
    errors.push("Salary minimum cannot be higher than the maximum.");
  }

  if (errors.length > 0) {
    return { ok: false, message: errors.join(" ") };
  }

  const hasSalary = Boolean(job.salary_min || job.salary_max);

  const { error } = await supabase.from("jobs").insert({
    ...job,
    salary_currency: hasSalary
      ? oneOf(job.salary_currency, currencies) || currencyForCountry(job.country)
      : null,
    salary_period: hasSalary ? oneOf(job.salary_period, salaryPeriods) || "Month" : null,
    application_email: job.application_email || null,
    application_link: job.application_link || null,
    // Every public submission waits for review. Featured status is only
    // granted by an admin after the featured fee is paid.
    status: "draft",
    import_status: "pending",
    is_featured: false,
  });

  if (error) {
    console.error("Job submission failed", error.message);
    return {
      ok: false,
      message: "We couldn't save your job. Please try again in a few minutes.",
    };
  }

  revalidatePath("/admin/imports");

  return {
    ok: true,
    message: job.featured_requested
      ? "Thanks. Your job was submitted for review. We'll contact you about the Featured listing fee before it goes live as Featured."
      : "Thanks. Your job was submitted for review and will appear once approved.",
  };
}

export async function submitContact(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (isSpam(formData)) {
    return { ok: true, message: "Thanks. We will be in touch soon." };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return {
      ok: false,
      message: "Messaging is temporarily unavailable. Please email us instead.",
    };
  }

  const contact = {
    name: text(formData, "name", 120),
    email: text(formData, "email", 200).toLowerCase(),
    message: text(formData, "message", 4000),
  };

  if (!contact.name || !EMAIL_PATTERN.test(contact.email) || !contact.message) {
    return { ok: false, message: "Please add your name, a valid email and a message." };
  }

  const { error } = await supabase.from("contacts").insert(contact);

  if (error) {
    console.error("Contact submission failed", error.message);
    return { ok: false, message: "We couldn't send your message. Please try again." };
  }

  return { ok: true, message: "Thanks. We will be in touch soon." };
}
