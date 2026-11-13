import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobsEmptyState } from "@/components/JobsEmptyState";
import { JobsExplorer } from "@/components/JobsExplorer";
import { getListedJobs } from "@/lib/load-public-jobs";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "Approved Caribbean job openings with the employer's link or email, filterable by keyword, country, category, company, salary, and work mode.",
  alternates: { canonical: "/jobs" },
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialFilters = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] || "" : value || "",
    ]),
  );
  const jobs = await getListedJobs();

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
              Caribbean job search
            </p>
            <h1 className="mt-3 text-4xl font-black text-slate-950">Jobs board</h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Approved vacancies only. Filter by keyword, country, category,
              company, salary, or work mode. Each listing links to the
              employer&apos;s application page or email.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {jobs.length === 0 ? (
            <JobsEmptyState />
          ) : (
            <JobsExplorer jobs={jobs} initialFilters={initialFilters} />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
