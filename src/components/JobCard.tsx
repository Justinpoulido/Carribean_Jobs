import Link from "next/link";
import { Briefcase, CalendarDays, MapPin, Wallet } from "lucide-react";
import type { Job } from "@/lib/types";
import { formatSalary } from "@/data/jobs";

export function JobCard({ job }: { job: Job }) {
  const posted = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(job.created_at));

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {job.is_featured ? (
              <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-bold text-[#c2410c]">
                Featured
              </span>
            ) : null}
            <span className="rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-bold text-[#0369a1]">
              {job.category}
            </span>
          </div>
          <Link
            href={`/jobs/${job.id}`}
            className="mt-3 block text-xl font-bold text-slate-950 hover:text-[#0077b6]"
          >
            {job.title}
          </Link>
          <p className="mt-1 font-semibold text-slate-700">{job.company_name}</p>
        </div>
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center justify-center rounded-lg bg-[#0077b6] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#005f8f]"
        >
          Apply
        </Link>
      </div>
      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
        <span className="inline-flex items-center gap-2">
          <MapPin size={16} className="text-[#10b981]" aria-hidden="true" />
          {job.city}, {job.country}
        </span>
        <span className="inline-flex items-center gap-2">
          <Wallet size={16} className="text-[#f59e0b]" aria-hidden="true" />
          {formatSalary(job)}
        </span>
        <span className="inline-flex items-center gap-2">
          <Briefcase size={16} className="text-[#0077b6]" aria-hidden="true" />
          {job.job_type} / {job.work_mode}
        </span>
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={16} className="text-slate-400" aria-hidden="true" />
          {posted}
        </span>
      </div>
    </article>
  );
}
