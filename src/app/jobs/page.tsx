import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobsEmptyState } from "@/components/JobsEmptyState";
import { JobsExplorer } from "@/components/JobsExplorer";
import { PageHero } from "@/components/PageHero";
import { Motion } from "@/components/Motion";
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
      <main id="main">
        <PageHero
          kicker="Caribbean job search"
          title="The jobs board"
          lead="Approved vacancies only. Filter by keyword, country, category, company, salary, or work mode — every listing links straight to the employer's application page or email."
        />
        <section className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
          {jobs.length === 0 ? (
            <JobsEmptyState />
          ) : (
            <JobsExplorer jobs={jobs} initialFilters={initialFilters} />
          )}
        </section>
      </main>
      <Footer />
      <Motion />
    </>
  );
}
