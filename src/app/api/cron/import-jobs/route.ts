import { NextResponse } from "next/server";
import { importJobsFromActiveSources } from "@/lib/ingestion/importer";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret) {
    return new NextResponse("CRON_SECRET is not configured", { status: 500 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await importJobsFromActiveSources();

  return NextResponse.json(result, {
    status: result.ok ? 200 : 500,
  });
}
