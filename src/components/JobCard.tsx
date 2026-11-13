import Link from "next/link";
import { Briefcase, CalendarDays, MapPin, Wallet } from "lucide-react";
import {
  applyHref,
  formatJobDate,
  formatSalary,
  type PublicJob,
} from "@/lib/public-jobs";

export function JobCard({ job }: { job: PublicJob }) {
  const salary = formatSalary(job);
  const href = applyHref(job);
  const external = href?.startsWith("http") ?? false;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {job.isFeatured ? (
              <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-bold text-[#c2410c]">
                Featured
              </span>
            ) : null}
            {job.closingSoon ? (
              <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-bold text-[#c2410c]">
                Closing soon
              </span>
            ) : null}
            {job.category ? (
              <span className="rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-bold text-[#0369a1]">
                {job.category}
              </span>
            ) : null}
            {job.jobType ? (
              <span className="rounded-full bg-[#f0fdf4] px-3 py-1 text-xs font-bold text-[#047857]">
                {job.jobType}
              </span>
            ) : null}
          </div>
          <Link
            href={`/jobs/${job.slug}`}
            className="mt-3 block text-xl font-bold text-slate-950 hover:text-[#0077b6]"
          >
            {job.title}
          </Link>
          <p className="mt-1 font-semibold text-slate-700">{job.companyName}</p>
        </div>
        {href ? (
          <a
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-flex items-center justify-center rounded-lg bg-[#0077b6] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#005f8f]"
          >
            Apply now
            {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </a>
        ) : null}
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
        {job.description}
      </p>
      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
        <span className="inline-flex items-center gap-2">
          <MapPin size={16} className="text-[#10b981]" aria-hidden="true" />
          {job.city}, {job.country}
        </span>
        {salary ? (
          <span className="inline-flex items-center gap-2">
            <Wallet size={16} className="text-[#f59e0b]" aria-hidden="true" />
            {salary}
          </span>
        ) : null}
        {job.workMode ? (
          <span className="inline-flex items-center gap-2">
            <Briefcase size={16} className="text-[#0077b6]" aria-hidden="true" />
            {job.jobType ? `${job.jobType} / ` : ""}
            {job.workMode}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={16} className="text-slate-400" aria-hidden="true" />
          Posted {formatJobDate(job.postedAt)}
        </span>
      </div>
      {job.closingDate ? (
        <p className="mt-3 text-sm font-semibold text-slate-700">
          {job.closingSoon ? "Closing soon" : "Closes"} {formatJobDate(job.closingDate)}
        </p>
      ) : null}
    </article>
  );
}
