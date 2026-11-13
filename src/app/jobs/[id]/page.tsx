import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  formatJobDate,
  isClosingSoon,
  jobPostingJsonLd,
  jobTypeLabel,
  jsonLdScript,
} from "@/lib/board-jobs";
import { getVisibleJob, getVisibleJobs } from "@/lib/load-board-jobs";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return getVisibleJobs().map((job) => ({ id: job.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = getVisibleJob(id);
  if (!job) {
    notFound();
  }

  const title = `${job.title} at ${job.employer}`;
  const description = metaDescription(job.description);

  return {
    title,
    description,
    alternates: { canonical: `/jobs/${job.id}` },
    openGraph: {
      title,
      description,
      url: `/jobs/${job.id}`,
      type: "article",
    },
  };
}

function metaDescription(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 155) {
    return clean;
  }
  return `${clean.slice(0, 152).trimEnd()}...`;
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getVisibleJob(id);
  if (!job) {
    notFound();
  }

  const pageUrl = `${siteUrl}/jobs/${job.id}`;
  const jsonLd = jobPostingJsonLd(job, pageUrl);
  const closingSoon = isClosingSoon(job, new Date());

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
        <section className="bg-[linear-gradient(135deg,#06283d,#0077b6)] text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <Link href="/jobs" className="text-sm font-bold text-[#fbbf24]">
              All jobs
            </Link>
            <p className="mt-4 font-bold text-white">{job.employer}</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black sm:text-5xl">
              {job.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full bg-white/15 px-4 py-2">
                {job.location}, {job.country}
              </span>
              {job.jobType ? (
                <span className="rounded-full bg-white/15 px-4 py-2">
                  {jobTypeLabel(job.jobType)}
                </span>
              ) : null}
              {job.salary ? (
                <span className="rounded-full bg-white/15 px-4 py-2">
                  {job.salary}
                </span>
              ) : null}
              <span className="rounded-full bg-white/15 px-4 py-2">
                Posted {formatJobDate(job.datePosted)}
              </span>
              {closingSoon && job.closingDate ? (
                <span className="rounded-full bg-[#f59e0b] px-4 py-2 text-slate-950">
                  Closing soon, {formatJobDate(job.closingDate)}
                </span>
              ) : job.closingDate ? (
                <span className="rounded-full bg-white/15 px-4 py-2">
                  Closes {formatJobDate(job.closingDate)}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
          <div className="order-2 grid gap-6 lg:order-1">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Job description
              </h2>
              <p className="mt-4 leading-8 text-slate-600">{job.description}</p>
            </section>
            {job.highlights && job.highlights.length > 0 ? (
              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">
                  Requirements and highlights
                </h2>
                <ul className="mt-4 space-y-3 text-slate-600">
                  {job.highlights.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#10b981]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
          <aside
            id="how-to-apply"
            className="order-1 h-fit rounded-lg border border-[#f59e0b] bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:order-2"
          >
            <h2 className="text-xl font-bold text-slate-950">How to apply</h2>
            <p className="mt-3 leading-7 text-slate-600">{job.howToApply}</p>
            <div className="mt-6 grid gap-3">
              {job.applyUrl ? (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-[#f59e0b] px-5 py-3 text-center font-bold text-slate-950 shadow-sm transition hover:bg-[#fbbf24]"
                >
                  Apply on {job.sourceName}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
              {job.applyEmail ? (
                <a
                  href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                  className="inline-flex items-center justify-center rounded-lg border border-[#0077b6] px-5 py-3 text-center font-bold text-[#0077b6] transition hover:bg-[#e0f2fe]"
                >
                  Email {job.applyEmail}
                </a>
              ) : null}
            </div>
            <dl className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm text-slate-600">
              <div>
                <dt className="font-semibold text-slate-800">Source</dt>
                <dd className="mt-1">{job.sourceName}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-800">Posted</dt>
                <dd className="mt-1">{formatJobDate(job.datePosted)}</dd>
              </div>
              {job.closingDate ? (
                <div>
                  <dt className="font-semibold text-slate-800">Closing date</dt>
                  <dd className="mt-1">{formatJobDate(job.closingDate)}</dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
