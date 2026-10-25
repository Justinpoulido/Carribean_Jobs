import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink, Flag, Mail, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { countryIsoCode, currencyForCountry, formatSalary } from "@/data/jobs";
import { getPublishedJobById } from "@/lib/jobs";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import type { Job } from "@/lib/types";

// Re-check the database at most every 5 minutes; admin actions also revalidate.
export const revalidate = 300;

function summary(text: string, length = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > length ? `${clean.slice(0, length - 1).trimEnd()}…` : clean;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getPublishedJobById(id);
  if (!job) {
    return { title: "Job not found", robots: { index: false } };
  }

  const title = `${job.title} at ${job.company_name}`;
  const description = summary(
    `${job.title} in ${job.city}, ${job.country}. ${job.description}`,
  );

  return {
    title,
    description,
    alternates: { canonical: `/jobs/${job.id}` },
    openGraph: {
      title,
      description,
      url: `/jobs/${job.id}`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}

const employmentType: Record<string, string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
  Internship: "INTERN",
};

function jobPostingSchema(job: Job) {
  const countryCode = countryIsoCode[job.country] || job.country;
  const hasSalary = Boolean(job.salary_min || job.salary_max);

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.posted_at || job.created_at,
    ...(job.expires_at ? { validThrough: job.expires_at } : {}),
    employmentType: employmentType[job.job_type] || "OTHER",
    directApply: false,
    url: `${SITE_URL}/jobs/${job.id}`,
    hiringOrganization: { "@type": "Organization", name: job.company_name },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.city,
        addressCountry: countryCode,
      },
    },
    ...(job.work_mode === "Remote"
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: { "@type": "Country", name: job.country },
        }
      : {}),
    ...(hasSalary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.salary_currency || currencyForCountry(job.country),
            value: {
              "@type": "QuantitativeValue",
              ...(job.salary_min ? { minValue: job.salary_min } : {}),
              ...(job.salary_max ? { maxValue: job.salary_max } : {}),
              unitText: (job.salary_period || "Month").toUpperCase(),
            },
          },
        }
      : {}),
  };
}

// JSON-LD sits inside a <script> tag; escape "<" so user-submitted text
// can never close the tag and inject markup.
function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <ul className="mt-4 space-y-3 text-slate-600">
        {items.map((item, index) => (
          <li key={`${index}-${item}`} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#10b981]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ApplyOptions({ job }: { job: Job }) {
  const link = job.application_link || job.apply_url;
  const subject = encodeURIComponent(`Application: ${job.title} (via ${SITE_NAME})`);

  if (!link && !job.application_email) {
    return (
      <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        Follow the application instructions in the job description.
      </p>
    );
  }

  return (
    <div className="mt-6 grid gap-3">
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 font-bold text-slate-950 shadow-sm transition hover:bg-[#fbbf24]"
        >
          Apply on company site
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      ) : null}
      {job.application_email ? (
        <a
          href={`mailto:${job.application_email}?subject=${subject}`}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-bold transition ${
            link
              ? "border border-slate-200 text-slate-800 hover:bg-slate-50"
              : "bg-[#f59e0b] text-slate-950 shadow-sm hover:bg-[#fbbf24]"
          }`}
        >
          <Mail size={16} aria-hidden="true" />
          Apply by email
        </a>
      ) : null}
      {job.application_email ? (
        <p className="break-all text-center text-xs text-slate-500">
          {job.application_email}
        </p>
      ) : null}
    </div>
  );
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getPublishedJobById(id);
  if (!job) {
    notFound();
  }

  const reportSubject = encodeURIComponent(`Report listing #${job.id}: ${job.title}`);

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jobPostingSchema(job)) }}
        />
        <section className="bg-[linear-gradient(135deg,#06283d,#0077b6)] text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="font-bold text-[#fbbf24]">{job.company_name}</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black sm:text-5xl">
              {job.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full bg-white/15 px-4 py-2">
                {job.city}, {job.country}
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2">
                {job.job_type}
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2">
                {job.work_mode}
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2">
                {formatSalary(job)}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
          <div className="grid h-fit gap-6">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Job description
              </h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                {job.description}
              </p>
            </section>
            <DetailList title="Requirements" items={job.requirements} />
            <DetailList title="Responsibilities" items={job.responsibilities} />
            <DetailList title="Benefits" items={job.benefits} />
          </div>
          <aside className="grid h-fit gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Apply for this role
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Applications go directly to {job.company_name}.
              </p>
              <ApplyOptions job={job} />
              {job.source_name && job.source_url ? (
                <p className="mt-4 text-xs text-slate-500">
                  Originally listed by{" "}
                  <a
                    href={job.source_url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="font-semibold underline"
                  >
                    {job.source_name}
                  </a>
                  .
                </p>
              ) : null}
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-900">
              <p className="flex items-center gap-2 font-bold">
                <ShieldCheck size={16} aria-hidden="true" />
                Stay safe
              </p>
              <p className="mt-2">
                Genuine employers never ask you to pay to apply, for training,
                or for travel documents. Don&apos;t send bank details or ID
                before an interview.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${reportSubject}`}
                className="mt-3 inline-flex items-center gap-2 font-bold underline"
              >
                <Flag size={14} aria-hidden="true" />
                Report this listing
              </a>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
