import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { importJobsFromActiveSources } from "@/lib/ingestion/importer";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

// Close published jobs whose expiry date has passed.
async function closeExpiredJobs() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { closed: 0, error: "Supabase admin client is not configured." };
  }

  const { data, error } = await supabase
    .from("jobs")
    .update({ status: "closed", is_featured: false })
    .eq("status", "published")
    .lt("expires_at", new Date().toISOString())
    .select("id");

  return { closed: data?.length || 0, error: error?.message || null };
}

// Vercel Cron calls this daily (see vercel.json) with
// "Authorization: Bearer $CRON_SECRET".
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret) {
    return new NextResponse("CRON_SECRET is not configured", { status: 500 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const expiry = await closeExpiredJobs();
  const result = await importJobsFromActiveSources();

  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath("/sitemap.xml");

  return NextResponse.json(
    { ...result, expired_closed: expiry.closed, expiry_error: expiry.error },
    { status: result.ok ? 200 : 500 },
  );
}
