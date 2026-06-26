import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock, Database } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { JobImportRun, JobSource } from "@/lib/types";
import { AddSourceForm } from "./AddSourceForm";
import { updateImportedJobStatus, updateSourceStatus } from "./actions";

export const metadata: Metadata = {
  title: "Import Admin",
  description: "Review imported jobs, import runs, errors, and job sources.",
};

type AdminJob = {
  id: number;
  title: string;
  company_name: string;
  country: string;
  city: string;
  sector: string | null;
  import_status: string | null;
  source_name: string | null;
  source_url: string | null;
  created_at: string;
};

async function getAdminData() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      configured: false,
      jobs: [] as AdminJob[],
      sources: [] as JobSource[],
      runs: [] as JobImportRun[],
      error: null,
    };
  }

  const [jobs, sources, runs] = await Promise.all([
    supabase
      .from("jobs")
      .select(
        "id,title,company_name,country,city,sector,import_status,source_name,source_url,created_at",
      )
      .not("source_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("job_sources")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("job_import_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(10),
  ]);

  return {
    configured: true,
    jobs: (jobs.data || []) as AdminJob[],
    sources: (sources.data || []) as JobSource[],
    runs: (runs.data || []) as JobImportRun[],
    error: jobs.error?.message || sources.error?.message || runs.error?.message,
  };
}

function StatusBadge({ status }: { status?: string | null }) {
  const color =
    status === "published"
      ? "bg-green-50 text-green-700"
      : status === "rejected"
        ? "bg-red-50 text-red-700"
        : "bg-amber-50 text-amber-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>
      {status || "pending"}
    </span>
  );
}

export default async function ImportsAdminPage() {
  const { configured, jobs, sources, runs, error } = await getAdminData();

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-black text-slate-950">
              Job imports
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              Review imported jobs, approve or reject listings, inspect import
              errors, and manage approved sources.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
          <div className="grid gap-8">
            {!configured ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-800">
                <h2 className="font-bold">Supabase admin client not configured</h2>
                <p className="mt-2 text-sm">
                  Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
                  to load live imports.
                </p>
              </div>
            ) : null}
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
                {error}
              </div>
            ) : null}

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <h2 className="text-xl font-bold text-slate-950">
                  Imported jobs
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <article key={job.id} className="grid gap-4 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={job.import_status} />
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                            {job.sector || "General"}
                          </span>
                        </div>
                        <h3 className="mt-3 text-lg font-bold text-slate-950">
                          {job.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {job.company_name} - {job.city}, {job.country}
                        </p>
                        {job.source_url ? (
                          <Link
                            href={job.source_url}
                            className="mt-2 inline-flex text-sm font-bold text-[#0077b6]"
                          >
                            Original source
                          </Link>
                        ) : null}
                      </div>
                      <div className="grid gap-2 sm:w-52">
                        {["approved", "published", "rejected"].map((status) => (
                          <form key={status} action={updateImportedJobStatus}>
                            <input type="hidden" name="job_id" value={job.id} />
                            <input
                              type="hidden"
                              name="import_status"
                              value={status}
                            />
                            <input
                              name="admin_secret"
                              type="password"
                              placeholder="Admin secret"
                              className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            />
                            <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold capitalize text-slate-700 hover:bg-slate-50">
                              {status}
                            </button>
                          </form>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
                {jobs.length === 0 ? (
                  <p className="p-5 text-slate-500">No imported jobs yet.</p>
                ) : null}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">Import runs</h2>
              <div className="mt-5 grid gap-4">
                {runs.map((run) => (
                  <div key={run.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {run.status === "success" ? (
                        <CheckCircle2 className="text-green-600" size={18} />
                      ) : run.status === "running" ? (
                        <Clock className="text-amber-600" size={18} />
                      ) : (
                        <AlertTriangle className="text-red-600" size={18} />
                      )}
                      <strong className="capitalize text-slate-950">
                        {run.status}
                      </strong>
                      <span className="text-sm text-slate-500">
                        Found {run.jobs_found}, added {run.jobs_added}, skipped{" "}
                        {run.duplicates_skipped}
                      </span>
                    </div>
                    {run.errors?.length ? (
                      <ul className="mt-3 space-y-1 text-sm text-red-700">
                        {run.errors.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
                {runs.length === 0 ? (
                  <p className="text-slate-500">No import runs yet.</p>
                ) : null}
              </div>
            </section>
          </div>

          <aside className="grid h-fit gap-6">
            <AddSourceForm />
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Database className="text-[#0077b6]" size={18} />
                <h2 className="text-lg font-bold text-slate-950">Sources</h2>
              </div>
              <div className="mt-5 grid gap-4">
                {sources.map((source) => (
                  <div key={source.id} className="rounded-lg border border-slate-200 p-4">
                    <h3 className="font-bold text-slate-950">{source.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                      {source.source_type} - {source.country}
                    </p>
                    <p className="mt-2 break-all text-sm text-slate-600">
                      {source.base_url}
                    </p>
                    <form action={updateSourceStatus} className="mt-3 grid gap-2">
                      <input type="hidden" name="source_id" value={source.id} />
                      <input
                        name="admin_secret"
                        type="password"
                        placeholder="Admin secret"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />
                      <button
                        name="is_active"
                        value={String(!source.is_active)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold"
                      >
                        {source.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        name="trusted_auto_publish"
                        value={String(!source.trusted_auto_publish)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold"
                      >
                        {source.trusted_auto_publish
                          ? "Disable auto publish"
                          : "Trust auto publish"}
                      </button>
                    </form>
                  </div>
                ))}
                {sources.length === 0 ? (
                  <p className="text-sm text-slate-500">No sources yet.</p>
                ) : null}
              </div>
            </section>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
