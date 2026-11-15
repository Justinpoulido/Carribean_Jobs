import Link from "next/link";
import { CalendarDays, Clock3, MapPin, Wallet } from "lucide-react";
import {
  applyHref,
  formatJobDate,
  formatSalary,
  type PublicJob,
} from "@/lib/public-jobs";

const pill =
  "inline-flex items-center rounded-full px-3 py-1 text-[11.5px] font-bold tracking-[0.02em]";

export function JobCard({ job }: { job: PublicJob }) {
  const salary = formatSalary(job);
  const href = applyHref(job);
  const external = href?.startsWith("http") ?? false;

  return (
    <article className="group relative overflow-hidden rounded-brand border-2 border-ocean/10 bg-white p-6 transition-all duration-300 ease-brand hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_20px_44px_rgb(6_48_58/0.13)]">
      {/* accent rail that grows on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1.5 origin-top scale-y-0 bg-gradient-to-b from-turq to-teal transition-transform duration-500 ease-brand group-hover:scale-y-100"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {job.isFeatured ? (
              <span className={`${pill} bg-sun text-ocean`}>★ Featured</span>
            ) : null}
            {job.closingSoon ? (
              <span className={`${pill} bg-coral-soft text-coral`}>
                Closing soon
              </span>
            ) : null}
            {job.category ? (
              <span className={`${pill} bg-turq-soft text-teal-deep`}>
                {job.category}
              </span>
            ) : null}
            {job.jobType ? (
              <span className={`${pill} bg-cream text-ink-soft`}>
                {job.jobType}
              </span>
            ) : null}
          </div>

          <h3 className="mt-3">
            <Link
              href={`/jobs/${job.slug}`}
              className="font-display text-[22px] font-bold leading-snug text-ocean transition-colors hover:text-teal-deep"
            >
              {job.title}
            </Link>
          </h3>
          <p className="mt-1 font-semibold text-ink-soft">{job.companyName}</p>
        </div>

        {href ? (
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-ocean px-6 text-[15px] font-bold text-white transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:bg-teal hover:shadow-[0_10px_24px_rgb(14_124_123/0.3)]"
          >
            Apply now
            {external ? (
              <span className="sr-only"> (opens in a new tab)</span>
            ) : null}
          </a>
        ) : null}
      </div>

      <p className="mt-4 line-clamp-2 leading-7 text-ink-soft">
        {job.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[14.5px] font-medium text-ink-soft">
        <span className="inline-flex items-center gap-2">
          <MapPin size={16} className="text-turq" aria-hidden="true" />
          {job.city}, {job.country}
        </span>
        {salary ? (
          <span className="inline-flex items-center gap-2">
            <Wallet size={16} className="text-sun-deep" aria-hidden="true" />
            {salary}
          </span>
        ) : null}
        {job.workMode ? (
          <span className="inline-flex items-center gap-2">
            <Clock3 size={16} className="text-teal" aria-hidden="true" />
            {job.workMode}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={16} className="text-ocean/40" aria-hidden="true" />
          Posted {formatJobDate(job.postedAt)}
        </span>
      </div>

      {job.closingDate ? (
        <p
          className={`mt-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold ${
            job.closingSoon
              ? "bg-coral-soft text-coral"
              : "bg-cream text-ink-soft"
          }`}
        >
          {job.closingSoon ? "Closing soon" : "Closes"}{" "}
          {formatJobDate(job.closingDate)}
        </p>
      ) : null}
    </article>
  );
}
