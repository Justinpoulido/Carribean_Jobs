import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobsExplorer } from "@/components/JobsExplorer";
import { sampleJobs } from "@/data/jobs";

export const metadata: Metadata = {
  title: "Browse Jobs",
  description:
    "Search Caribbean job listings by country, city, category, job type, salary, and work mode.",
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

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
              Caribbean job search
            </p>
            <h1 className="mt-3 text-4xl font-black text-slate-950">
              Search and filter jobs
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Find roles by country, category, company, salary range, and work
              mode across the region.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <JobsExplorer jobs={sampleJobs} initialFilters={initialFilters} />
        </section>
      </main>
      <Footer />
    </>
  );
}
