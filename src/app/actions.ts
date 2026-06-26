"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase";

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

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const resume = formData.get("resume");
  let resumeUrl = "";

  if (resume instanceof File && resume.size > 0) {
    const extension = resume.name.split(".").pop() || "pdf";
    const path = `applications/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from("resumes")
      .upload(path, resume, { upsert: false });

    if (error) {
      return { ok: false, message: error.message };
    }

    const { data } = supabase.storage.from("resumes").getPublicUrl(path);
    resumeUrl = data.publicUrl;
  }

  const { error } = await supabase.from("applications").insert({
    job_id: formData.get("job_id"),
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    resume_url: resumeUrl,
    message: formData.get("message"),
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Application submitted. Good luck!" };
}

export async function createJobPost(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!hasSupabaseConfig()) {
    return {
      ok: true,
      message: "Job saved in demo mode. Connect Supabase to persist new posts.",
    };
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { error } = await supabase.from("jobs").insert({
    title: formData.get("title"),
    company_name: formData.get("company_name"),
    contact_email: formData.get("contact_email"),
    country: formData.get("country"),
    city: formData.get("city"),
    category: formData.get("category"),
    job_type: formData.get("job_type"),
    work_mode: formData.get("work_mode"),
    salary_min: numberFromForm(formData.get("salary_min")),
    salary_max: numberFromForm(formData.get("salary_max")),
    description: formData.get("description"),
    requirements: formData.get("requirements"),
    responsibilities: formData.get("responsibilities"),
    benefits: formData.get("benefits"),
    application_email: formData.get("application_email"),
    application_link: formData.get("application_link"),
    is_featured: formData.get("is_featured") === "on",
    status: "published",
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/jobs");
  return { ok: true, message: "Job posted successfully." };
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
