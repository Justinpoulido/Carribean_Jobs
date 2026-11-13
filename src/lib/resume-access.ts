import { getSupabaseAdminClient } from "@/lib/supabase";

/** Short-lived read link for a private CV. Server only; uses the service-role key. */
export async function createResumeSignedUrl(
  objectPath: string,
  expiresInSeconds = 60,
) {
  const path = objectPath.trim().replace(/^\/+/, "");
  if (!path || path.includes("..") || path.includes("://")) {
    return null;
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return null;
  }

  const { data, error } = await admin.storage
    .from("resumes")
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}
