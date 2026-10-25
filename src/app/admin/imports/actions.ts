"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { isAdminAuthorization } from "@/lib/admin-auth";
import { DEFAULT_LISTING_DAYS } from "@/lib/site";
import { getSupabaseAdminClient } from "@/lib/supabase";

type AdminState = {
  ok: boolean;
  message: string;
};

// Server actions can be invoked from any route, so every action re-checks the
// admin credentials itself instead of relying only on the /admin proxy.
async function requireAdmin() {
  const headerList = await headers();
  return isAdminAuthorization(headerList.get("authorization"));
}

function refreshPublicPages(jobId?: FormDataEntryValue | null) {
  revalidatePath("/admin/imports");
  revalidatePath("/jobs");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (jobId) {
    revalidatePath(`/jobs/${jobId}`);
  }
}

export async function addJobSource(
  _previousState: AdminState,
  formData: FormData,
): Promise<AdminState> {
  if (!(await requireAdmin())) {
    return { ok: false, message: "Not authorized." };
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
  if (!(await requireAdmin())) {
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

type ModerationAction =
  | "publish"
  | "reject"
  | "close"
  | "feature"
  | "unfeature"
  | "extend";

// One entry point for every moderation button on the admin page.
export async function moderateJob(formData: FormData) {
  if (!(await requireAdmin())) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  const jobId = formData.get("job_id");
  const action = String(formData.get("action")) as ModerationAction;
  const freshExpiry = new Date(
    Date.now() + DEFAULT_LISTING_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const updates: Record<string, Record<string, unknown>> = {
    publish: {
      status: "published",
      import_status: "published",
      posted_at: new Date().toISOString(),
      expires_at: freshExpiry,
    },
    reject: { status: "draft", import_status: "rejected", is_featured: false },
    close: { status: "closed", is_featured: false },
    feature: { is_featured: true, featured_requested: false },
    unfeature: { is_featured: false },
    extend: { expires_at: freshExpiry },
  };

  const update = updates[action];
  if (!update || !jobId) {
    return;
  }

  // Imported jobs keep their original posted_at / expiry when published.
  if (action === "publish") {
    const { data } = await supabase
      .from("jobs")
      .select("posted_at,expires_at,source_id")
      .eq("id", jobId)
      .maybeSingle();

    if (data?.source_id) {
      update.posted_at = data.posted_at || update.posted_at;
      update.expires_at =
        data.expires_at && new Date(data.expires_at) > new Date()
          ? data.expires_at
          : freshExpiry;
    }
  }

  await supabase.from("jobs").update(update).eq("id", jobId);
  refreshPublicPages(jobId);
}
