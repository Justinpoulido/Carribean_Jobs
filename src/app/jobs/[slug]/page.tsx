import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { resolveJob } from "@/lib/load-public-jobs";
import {
  applyHref,
  formatJobDate,
  formatSalary,
  isOpenJob,
  jobPostingJsonLd,
  jsonLdScript,
  shareDescription,
} from "@/lib/public-jobs";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { job } = await resolveJob(slug);
  if (!job) {
    return { title: "Job not listed" };
  }

  const title = `${job.title} at ${job.companyName}`;
  const description = shareDescription(job);
  const canonical = `/jobs/${job.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { job, redirectTo } = await resolveJob(slug);
  if (!job) {
    notFound();
  }
  if (redirectTo) {
    redirect(redirectTo);
  }

  const open = isOpenJob(job);
  const href = applyHref(job);
  const external = Boolean(href?.startsWith("http"));
  const salary = formatSalary(job);
  const pageUrl = `${siteUrl}/jobs/${job.slug}`;

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        {open ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLdScript(jobPostingJsonLd(job, pageUrl)),
            }}
          />
        ) : null}
        <section className="bg-[linear-gradient(135deg,#06283d,#0077b6)] text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <Link href="/jobs" className="text-sm font-bold text-[#fbbf24]">
              All jobs
            </Link>
            <p className="mt-4 font-bold">{job.companyName}</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black sm:text-5xl">
              {job.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
              <span className="rounded-full bg-white/15 px-4 py-2">
                {job.city}, {job.country}
              </span>
              {job.jobType ? (
                <span className="rounded-full bg-white/15 px-4 py-2">{job.jobType}</span>
              ) : null}
              {job.workMode ? (
                <span className="rounded-full bg-white/15 px-4 py-2">{job.workMode}</span>
              ) : null}
              {salary ? (
                <span className="rounded-full bg-white/15 px-4 py-2">{salary}</span>
              ) : null}
              <span className="rounded-full bg-white/15 px-4 py-2">
                Posted {formatJobDate(job.postedAt)}
              </span>
              {job.closingSoon && job.closingDate ? (
                <span className="rounded-full bg-[#f59e0b] px-4 py-2 text-slate-950">
                  Closing soon, {formatJobDate(job.closingDate)}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        {!open ? (
          <div className="border-b border-amber-200 bg-amber-50">
            <p className="mx-auto max-w-7xl px-4 py-4 text-lg font-bold text-amber-950 sm:px-6 lg:px-8">
              This role is closed
            </p>
          </div>
        ) : null}

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
          <div className="order-2 grid gap-6 lg:order-1">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">Job description</h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                {job.description}
              </p>
            </section>
            {job.requirements.length > 0 ? (
              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">Requirements</h2>
                <ul className="mt-4 space-y-3 text-slate-600">
                  {job.requirements.map((item) => (
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
            {open && href ? (
              <>
                <p className="mt-3 leading-7 text-slate-600">
                  Apply with {job.companyName}. This opens the employer&apos;s{" "}
                  {external ? "application page" : "email"}.
                </p>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#f59e0b] px-5 py-3 text-center font-bold text-slate-950 shadow-sm transition hover:bg-[#fbbf24]"
                >
                  Apply now
                  {external ? (
                    <span className="sr-only"> (opens in a new tab)</span>
                  ) : null}
                </a>
                {job.applicationUrl ? (
                  <p className="mt-4 break-all text-sm text-slate-500">
                    {job.applicationUrl}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-3 leading-7 text-slate-600">This role is closed.</p>
            )}
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
