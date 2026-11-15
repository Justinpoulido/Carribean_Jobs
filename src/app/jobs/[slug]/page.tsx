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
import { Motion } from "@/components/Motion";
import {
  ArrowLeft,
} from "lucide-react";
import {
  SunDoodle,
  SparkleDoodle,
  WaveDivider,
} from "@/components/Doodles";

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
      <main id="main">
        {open ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLdScript(jobPostingJsonLd(job, pageUrl)),
            }}
          />
        ) : null}
        <section className="relative overflow-hidden bg-ocean text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_400px_at_82%_8%,rgba(14,124,123,0.5),transparent_66%)]"
          />
          <SunDoodle
            className="pointer-events-none absolute right-[6%] top-[16%] hidden h-28 w-28 text-sun opacity-40 animate-spin-slow sm:block"
            strokeWidth={3}
          />
          <SparkleDoodle
            className="pointer-events-none absolute left-[4%] top-[22%] hidden h-7 w-7 text-turq opacity-50 animate-twinkle lg:block"
            strokeWidth={6}
          />
          <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pb-16">
            <Link
              href="/jobs"
              className="group inline-flex items-center gap-2 rounded-full py-2 text-[14.5px] font-bold text-sun transition-colors hover:text-white"
            >
              <ArrowLeft
                size={17}
                className="transition-transform duration-300 ease-brand group-hover:-translate-x-1"
                aria-hidden="true"
              />
              All jobs
            </Link>
            <p className="mt-5 font-display text-[19px] font-semibold text-turq">
              {job.companyName}
            </p>
            <h1 className="mt-2.5 max-w-[22ch] text-[clamp(2.1rem,5vw,3.5rem)] font-bold leading-[1.06]">
              {job.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-2 text-[14px] font-semibold">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                {job.city}, {job.country}
              </span>
              {job.jobType ? (
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  {job.jobType}
                </span>
              ) : null}
              {job.workMode ? (
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  {job.workMode}
                </span>
              ) : null}
              {salary ? (
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  {salary}
                </span>
              ) : null}
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                Posted {formatJobDate(job.postedAt)}
              </span>
              {job.closingSoon && job.closingDate ? (
                <span className="rounded-full bg-sun px-4 py-2 text-ocean">
                  Closing soon, {formatJobDate(job.closingDate)}
                </span>
              ) : null}
            </div>
          </div>
          <div className="relative w-full overflow-hidden">
            <WaveDivider topColor="text-cream" />
          </div>
        </section>

        {!open ? (
          <div className="bg-coral-soft">
            <p className="mx-auto max-w-7xl px-4 py-4 font-display text-[17px] font-bold text-coral sm:px-6 lg:px-8">
              This role is closed
            </p>
          </div>
        ) : null}

        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1fr_350px] lg:px-8">
          <div className="order-2 grid gap-6 lg:order-1">
            <section
              className="rounded-brand-lg border-2 border-ocean/10 bg-white p-7 sm:p-8"
              data-reveal
            >
              <h2 className="font-display text-[23px] font-bold text-ocean">
                Job description
              </h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-ink-soft">
                {job.description}
              </p>
            </section>
            {job.requirements.length > 0 ? (
              <section
                className="rounded-brand-lg border-2 border-ocean/10 bg-white p-7 sm:p-8"
                data-reveal
              >
                <h2 className="font-display text-[23px] font-bold text-ocean">
                  Requirements
                </h2>
                <ul className="mt-5 space-y-3.5 leading-7 text-ink-soft">
                  {job.requirements.map((item) => (
                    <li key={item} className="flex gap-3.5">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-turq"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
          <aside
            id="how-to-apply"
            className="order-1 h-fit rounded-brand-lg border-2 border-sun bg-white p-7 shadow-[0_18px_40px_rgb(6_48_58/0.1)] lg:sticky lg:top-24 lg:order-2"
          >
            <h2 className="font-display text-[23px] font-bold text-ocean">How to apply</h2>
            {open && href ? (
              <>
                <p className="mt-3 leading-7 text-ink-soft">
                  Apply with {job.companyName}. This opens the employer&apos;s{" "}
                  {external ? "application page" : "email"}.
                </p>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="mt-6 inline-flex min-h-13 w-full items-center justify-center rounded-full bg-sun px-6 text-center font-bold text-ocean shadow-[0_5px_0_var(--color-sun-deep)] transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--color-sun-deep)]"
                >
                  Apply now
                  {external ? (
                    <span className="sr-only"> (opens in a new tab)</span>
                  ) : null}
                </a>
                {job.applicationUrl ? (
                  <p className="mt-4 break-all text-[13.5px] text-ink-soft/80">
                    {job.applicationUrl}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-3 leading-7 text-ink-soft">This role is closed.</p>
            )}
          </aside>
        </section>
      </main>
      <Footer />
      <Motion />
    </>
  );
}
