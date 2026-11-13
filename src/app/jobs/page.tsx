import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobsEmptyState } from "@/components/JobsEmptyState";
import { JobsExplorer } from "@/components/JobsExplorer";
import { getListedJobs } from "@/lib/load-board-jobs";
import { facebookPageUrl } from "@/lib/site";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "Current Caribbean job openings, mainly in Trinidad and Tobago, with the employer's link or email so you can apply.",
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
  const jobs = getListedJobs();

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
              Jobs board
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              The same openings posted on our Facebook Page, with how to apply
              on the employer&apos;s site or by email. New jobs are posted daily.
            </p>
            <a
              href={facebookPageUrl}
              className="mt-4 inline-flex font-bold text-[#0077b6]"
            >
              Follow us on Facebook
            </a>
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
