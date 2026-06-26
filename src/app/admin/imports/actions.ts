"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase";

type AdminState = {
  ok: boolean;
  message: string;
};

function requireAdmin(formData: FormData) {
  const configuredSecret = process.env.ADMIN_SECRET;

  if (!configuredSecret) {
    return true;
  }

  return formData.get("admin_secret") === configuredSecret;
}

export async function addJobSource(
  _previousState: AdminState,
  formData: FormData,
): Promise<AdminState> {
  if (!requireAdmin(formData)) {
    return { ok: false, message: "Invalid admin secret." };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, message: "Supabase admin client is not configured." };
  }

  const { error } = await supabase.from("job_sources").insert({
    name: formData.get("name"),
    source_type: formData.get("source_type"),
    base_url: formData.get("base_url"),
    country: formData.get("country"),
    sector: formData.get("sector") || null,
    is_active: formData.get("is_active") === "on",
    trusted_auto_publish: formData.get("trusted_auto_publish") === "on",
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/imports");
  return { ok: true, message: "Job source added." };
}

export async function updateSourceStatus(formData: FormData) {
  if (!requireAdmin(formData)) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const updates: Record<string, boolean> = {};

  if (formData.has("is_active")) {
    updates.is_active = formData.get("is_active") === "true";
  }

  if (formData.has("trusted_auto_publish")) {
    updates.trusted_auto_publish =
      formData.get("trusted_auto_publish") === "true";
  }

  if (Object.keys(updates).length === 0) {
    return;
  }

  await supabase
    .from("job_sources")
    .update(updates)
    .eq("id", formData.get("source_id"));

  revalidatePath("/admin/imports");
}

export async function updateImportedJobStatus(formData: FormData) {
  if (!requireAdmin(formData)) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const importStatus = String(formData.get("import_status"));
  const jobStatus = importStatus === "published" ? "published" : "draft";

  await supabase
    .from("jobs")
    .update({
      import_status: importStatus,
      status: jobStatus,
    })
    .eq("id", formData.get("job_id"));

  revalidatePath("/admin/imports");
  revalidatePath("/jobs");
}
