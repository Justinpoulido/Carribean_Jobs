import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ApplicationModal } from "@/components/ApplicationModal";
import { formatSalary, getJobById, sampleJobs } from "@/data/jobs";

export async function generateStaticParams() {
  return sampleJobs.map((job) => ({ id: job.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) {
    return { title: "Job not found" };
  }

  return {
    title: `${job.title} at ${job.company_name}`,
    description: `${job.title} in ${job.city}, ${job.country}. ${job.description}`,
  };
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <ul className="mt-4 space-y-3 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#10b981]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) {
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.created_at,
    employmentType: job.job_type.toUpperCase().replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company_name,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.city,
        addressCountry: job.country,
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salary_min,
        maxValue: job.salary_max,
        unitText: "YEAR",
      },
    },
  };

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
          <div className="grid gap-6">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Job description
              </h2>
              <p className="mt-4 leading-8 text-slate-600">{job.description}</p>
            </section>
            <DetailList title="Requirements" items={job.requirements} />
            <DetailList title="Responsibilities" items={job.responsibilities} />
            <DetailList title="Benefits" items={job.benefits} />
          </div>
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Apply for this role
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Send your profile and resume directly through Caribbean Jobs.
            </p>
            <div className="mt-6">
              <ApplicationModal jobId={job.id} jobTitle={job.title} />
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
