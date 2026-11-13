"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { notifyNewJob } from "@/lib/notify";
import { validateJobSubmission } from "@/lib/public-jobs";
import { recordPost, tooManyPosts } from "@/lib/rate-limit";
import {
  resumeContentType,
  resumeFileProblem,
  resumeObjectName,
} from "@/lib/resume-file";
import { getSupabaseBrowserClient, getSupabasePublicServerClient, hasSupabaseConfig } from "@/lib/supabase";

type ActionState = {
  ok: boolean;
  message: string;
};

function numberFromForm(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function submitApplication(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!hasSupabaseConfig()) {
    return {
      ok: true,
      message:
        "Application captured in demo mode. Add Supabase env vars to store submissions.",
    };
  }

  const supabase = getSupabasePublicServerClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const resume = formData.get("resume");
  let resumePath = "";

  if (resume instanceof File && resume.size > 0) {
    const problem = resumeFileProblem(resume);
    if (problem) {
      return { ok: false, message: problem };
    }
    const contentType = resumeContentType(resume.name, resume.type);
    if (!contentType) {
      return { ok: false, message: "CV must be a PDF, DOC, or DOCX file." };
    }

    resumePath = resumeObjectName(resume.name);
    const { error } = await supabase.storage.from("resumes").upload(resumePath, resume, {
      upsert: false,
      contentType,
    });

    if (error) {
      return {
        ok: false,
        message:
          "The CV could not be uploaded. Use a PDF, DOC, or DOCX under 5 MB and try again.",
      };
    }
  }

  const { error } = await supabase.from("applications").insert({
    job_id: formData.get("job_id"),
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    resume_url: resumePath,
    message: formData.get("message"),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Application submitted. Good luck!" };
}

const pendingMessage =
  "Thanks. This vacancy is pending review and is not on the public board yet.";

export async function createJobPost(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (String(formData.get("company_website") || "").trim()) {
    return { ok: true, message: pendingMessage };
  }

  const salaryMin = numberFromForm(formData.get("salary_min"));
  const salaryMax = numberFromForm(formData.get("salary_max"));
  const validated = validateJobSubmission({
    title: String(formData.get("title") || ""),
    companyName: String(formData.get("company_name") || ""),
    city: String(formData.get("city") || ""),
    country: String(formData.get("country") || ""),
    category: String(formData.get("category") || ""),
    jobType: String(formData.get("job_type") || ""),
    workMode: String(formData.get("work_mode") || ""),
    description: String(formData.get("description") || ""),
    requirements: String(formData.get("requirements") || ""),
    salaryMin: formData.get("salary_min") ? salaryMin : null,
    salaryMax: formData.get("salary_max") ? salaryMax : null,
    currency: String(formData.get("currency") || ""),
    payPeriod: String(formData.get("pay_period") || ""),
    applicationEmail: String(formData.get("application_email") || ""),
    applicationUrl: String(formData.get("application_link") || ""),
    closingDate: String(formData.get("closing_date") || ""),
    posterName: String(formData.get("poster_name") || ""),
    posterEmail: String(formData.get("contact_email") || ""),
    featured: formData.get("is_featured") === "on",
  });

  if (!validated.ok) {
    return { ok: false, message: validated.message };
  }

  if (!hasSupabaseConfig()) {
    return {
      ok: false,
      message: "The jobs board is not connected yet, so this vacancy was not saved.",
    };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooManyPosts(ip)) {
    return {
      ok: false,
      message: "Please wait a little while before posting another vacancy.",
    };
  }

  const supabase = getSupabasePublicServerClient();
  if (!supabase) {
    return { ok: false, message: "The jobs board is not connected yet." };
  }

  const { error } = await supabase.from("jobs").insert(validated.value);
  if (error) {
    return { ok: false, message: error.message };
  }

  recordPost(ip);
  await notifyNewJob({
    title: validated.value.title,
    company: validated.value.company_name,
    city: validated.value.city,
    country: validated.value.country,
    posterEmail: validated.value.contact_email,
  });
  revalidatePath("/");
  revalidatePath("/jobs");
  return { ok: true, message: pendingMessage };
}

export async function submitContact(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!hasSupabaseConfig()) {
    return {
      ok: true,
      message: "Message received in demo mode. Connect Supabase to store it.",
    };
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { error } = await supabase.from("contacts").insert({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Thanks. We will be in touch soon." };
}
