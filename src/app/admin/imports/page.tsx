import type { Metadata } from "next";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  Inbox,
  Star,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatSalary } from "@/data/jobs";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { JobImportRun, JobSource, SalaryPeriod } from "@/lib/types";
import { AddSourceForm } from "./AddSourceForm";
import { moderateJob, updateSourceStatus } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  description: "Review submitted and imported jobs, featured requests and sources.",
  robots: { index: false, follow: false },
};

// Always read fresh data for the admin view.
export const dynamic = "force-dynamic";

type AdminJob = {
  id: number;
  title: string;
  company_name: string;
  contact_email: string | null;
  country: string;
  city: string;
  category: string;
  job_type: string;
  work_mode: string;
  description: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_period: SalaryPeriod | null;
  application_email: string | null;
  application_link: string | null;
  apply_url: string | null;
  status: string;
  import_status: string | null;
  is_featured: boolean;
  featured_requested: boolean | null;
  source_id: number | null;
  source_name: string | null;
  source_url: string | null;
  expires_at: string | null;
  created_at: string;
};

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

const jobColumns =
  "id,title,company_name,contact_email,country,city,category,job_type,work_mode,description,salary_min,salary_max,salary_currency,salary_period,application_email,application_link,apply_url,status,import_status,is_featured,featured_requested,source_id,source_name,source_url,expires_at,created_at";

async function getAdminData() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      configured: false,
      pending: [] as AdminJob[],
      live: [] as AdminJob[],
      sources: [] as JobSource[],
      runs: [] as JobImportRun[],
      contacts: [] as ContactMessage[],
      error: null as string | null,
    };
  }

  const [pending, live, sources, runs, contacts] = await Promise.all([
    supabase
      .from("jobs")
      .select(jobColumns)
      .eq("import_status", "pending")
      .order("featured_requested", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(50),
    supabase
      .from("jobs")
      .select(jobColumns)
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("job_sources")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("job_import_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(10),
    supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    configured: true,
    pending: (pending.data || []) as AdminJob[],
    live: (live.data || []) as AdminJob[],
    sources: (sources.data || []) as JobSource[],
    runs: (runs.data || []) as JobImportRun[],
    contacts: (contacts.data || []) as ContactMessage[],
    error:
      pending.error?.message ||
      live.error?.message ||
      sources.error?.message ||
      runs.error?.message ||
      contacts.error?.message ||
      null,
  };
}

const dateFormat = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string | null) {
  return value ? dateFormat.format(new Date(value)) : "-";
}

function ActionButton({
  jobId,
  action,
  label,
  tone = "neutral",
}: {
  jobId: number;
  action: string;
  label: string;
  tone?: "neutral" | "good" | "bad" | "star";
}) {
  const tones = {
    neutral: "border border-slate-200 text-slate-700 hover:bg-slate-50",
    good: "bg-green-600 text-white hover:bg-green-700",
    bad: "border border-red-200 text-red-700 hover:bg-red-50",
    star: "bg-amber-500 text-slate-950 hover:bg-amber-400",
  };

  return (
    <form action={moderateJob}>
      <input type="hidden" name="job_id" value={jobId} />
      <input type="hidden" name="action" value={action} />
      <button
        className={`w-full rounded-lg px-3 py-2 text-sm font-bold ${tones[tone]}`}
      >
        {label}
      </button>
    </form>
  );
}

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {children}
    </span>
  );
}

function PendingJob({ job }: { job: AdminJob }) {
  const applyLink = job.application_link || job.apply_url;

  return (
    <article className="grid gap-4 p-5 lg:grid-cols-[1fr_180px]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Pill className={job.source_id ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"}>
            {job.source_id ? `Imported: ${job.source_name}` : "Employer submission"}
          </Pill>
          {job.featured_requested ? (
            <Pill className="bg-amber-100 text-amber-800">Featured requested (fee)</Pill>
          ) : null}
          <Pill className="bg-slate-100 text-slate-600">{job.category}</Pill>
        </div>
        <h3 className="mt-3 text-lg font-bold text-slate-950">{job.title}</h3>
        <p className="mt-1 text-sm text-slate-600">
          {job.company_name} - {job.city}, {job.country} - {job.job_type} / {job.work_mode}
        </p>
        <p className="mt-1 text-sm text-slate-600">{formatSalary(job)}</p>
        <details className="mt-3 text-sm text-slate-600">
          <summary className="cursor-pointer font-semibold text-slate-800">
            Description
          </summary>
          <p className="mt-2 whitespace-pre-line">{job.description}</p>
        </details>
        <dl className="mt-3 grid gap-1 text-sm text-slate-600">
          {job.contact_email ? (
            <div>
              <dt className="inline font-semibold">Contact: </dt>
              <dd className="inline break-all">
                <a className="text-[#0077b6] underline" href={`mailto:${job.contact_email}`}>
                  {job.contact_email}
                </a>
              </dd>
            </div>
          ) : null}
          {job.application_email ? (
            <div>
              <dt className="inline font-semibold">Apply email: </dt>
              <dd className="inline break-all">{job.application_email}</dd>
            </div>
          ) : null}
          {applyLink ? (
            <div>
              <dt className="inline font-semibold">Apply link: </dt>
              <dd className="inline break-all">
                <a className="text-[#0077b6] underline" href={applyLink} target="_blank" rel="noopener noreferrer nofollow">
                  {applyLink}
                </a>
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="inline font-semibold">Submitted: </dt>
            <dd className="inline">{formatDate(job.created_at)}</dd>
          </div>
        </dl>
      </div>
      <div className="grid h-fit gap-2">
        <ActionButton jobId={job.id} action="publish" label="Publish" tone="good" />
        <ActionButton jobId={job.id} action="reject" label="Reject" tone="bad" />
      </div>
    </article>
  );
}

function LiveJob({ job }: { job: AdminJob }) {
  return (
    <article className="grid gap-3 p-5 sm:grid-cols-[1fr_180px]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {job.is_featured ? (
            <Pill className="bg-amber-100 text-amber-800">Featured</Pill>
          ) : null}
          {job.featured_requested && !job.is_featured ? (
            <Pill className="bg-amber-50 text-amber-700">Featured requested (fee)</Pill>
          ) : null}
        </div>
        <a
          href={`/jobs/${job.id}`}
          className="mt-2 block font-bold text-slate-950 hover:text-[#0077b6]"
        >
          {job.title}
        </a>
        <p className="text-sm text-slate-600">
          {job.company_name} - {job.city}, {job.country}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Expires {formatDate(job.expires_at)}
        </p>
      </div>
      <div className="grid h-fit gap-2">
        {job.is_featured ? (
          <ActionButton jobId={job.id} action="unfeature" label="Remove featured" />
        ) : (
          <ActionButton jobId={job.id} action="feature" label="Mark featured (paid)" tone="star" />
        )}
        <ActionButton jobId={job.id} action="extend" label="Extend 30 days" />
        <ActionButton jobId={job.id} action="close" label="Close listing" tone="bad" />
      </div>
    </article>
  );
}

export default async function AdminPage() {
  const { configured, pending, live, sources, runs, contacts, error } =
    await getAdminData();

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
              Job review
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              {pending.length} waiting for review - {live.length} live. Nothing
              submitted by the public goes live until you publish it.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
          <div className="grid h-fit gap-8">
            {!configured ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-800">
                <h2 className="font-bold">Supabase admin client not configured</h2>
                <p className="mt-2 text-sm">
                  Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
                </p>
              </div>
            ) : null}
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
                {error}
              </div>
            ) : null}

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 p-5">
                <Inbox className="text-[#0077b6]" size={20} />
                <h2 className="text-xl font-bold text-slate-950">
                  Review queue ({pending.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {pending.map((job) => (
                  <PendingJob key={job.id} job={job} />
                ))}
                {pending.length === 0 ? (
                  <p className="p-5 text-slate-500">Nothing waiting for review.</p>
                ) : null}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 p-5">
                <Star className="text-amber-500" size={20} />
                <h2 className="text-xl font-bold text-slate-950">
                  Live jobs ({live.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {live.map((job) => (
                  <LiveJob key={job.id} job={job} />
                ))}
                {live.length === 0 ? (
                  <p className="p-5 text-slate-500">No live jobs.</p>
                ) : null}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">Contact messages</h2>
              <div className="mt-5 grid gap-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="rounded-lg border border-slate-200 p-4">
                    <p className="text-sm font-bold text-slate-950">
                      {contact.name}{" "}
                      <a className="font-normal text-[#0077b6] underline" href={`mailto:${contact.email}`}>
                        {contact.email}
                      </a>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(contact.created_at)}</p>
                    <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                      {contact.message}
                    </p>
                  </div>
                ))}
                {contacts.length === 0 ? (
                  <p className="text-slate-500">No messages yet.</p>
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
                      <strong className="capitalize text-slate-950">{run.status}</strong>
                      <span className="text-sm text-slate-500">
                        {formatDate(run.started_at)} - found {run.jobs_found}, added{" "}
                        {run.jobs_added}, skipped {run.duplicates_skipped}
                      </span>
                    </div>
                    {run.errors?.length ? (
                      <ul className="mt-3 space-y-1 text-sm text-red-700">
                        {run.errors.map((item, index) => (
                          <li key={`${index}-${item}`}>{item}</li>
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
                    <p className="mt-2 break-all text-sm text-slate-600">{source.base_url}</p>
                    <form action={updateSourceStatus} className="mt-3 grid gap-2">
                      <input type="hidden" name="source_id" value={source.id} />
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
