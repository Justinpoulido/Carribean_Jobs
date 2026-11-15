import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TipCard } from "@/components/TipCard";
import { TipsEmptyState } from "@/components/TipsEmptyState";
import { getPublishedTips } from "@/lib/load-tips";
import { categoryAnchor, tipCategories } from "@/lib/tips";

export const revalidate = 3600;

const description =
  "Practical career tips for Caribbean job seekers: resumes, cover letters, interviews, job offers, salary questions, networking and spotting job scams.";

export const metadata: Metadata = {
  title: "Career Tips",
  description,
  alternates: { canonical: "/tips" },
  openGraph: {
    title: "Career Tips | Caribbean Jobs",
    description,
    url: "/tips",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Tips | Caribbean Jobs",
    description,
  },
};

export default async function TipsPage() {
  const tips = await getPublishedTips();
  const categories = tipCategories(tips);

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="bg-[linear-gradient(135deg,#06283d,#0077b6)] text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-wide text-[#fbbf24]">
              Career tips
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black sm:text-5xl">
              Get hired in the Caribbean
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-blue-100">
              Short, practical advice from the Caribbean Jobs Facebook Page, from
              your first application to your first week on the job.
            </p>
            {categories.length > 1 ? (
              <nav aria-label="Tip categories" className="mt-8 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <a
                    key={category}
                    href={`#${categoryAnchor(category)}`}
                    className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/25"
                  >
                    {category}
                  </a>
                ))}
              </nav>
            ) : null}
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {tips.length === 0 ? (
            <TipsEmptyState />
          ) : (
            <div className="grid gap-12">
              {categories.map((category) => {
                const inCategory = tips.filter((tip) => tip.category === category);
                return (
                  <section
                    key={category}
                    id={categoryAnchor(category)}
                    aria-labelledby={`${categoryAnchor(category)}-title`}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h2
                        id={`${categoryAnchor(category)}-title`}
                        className="text-2xl font-black text-slate-950"
                      >
                        {category}
                      </h2>
                      <span className="text-sm font-semibold text-slate-500">
                        {inCategory.length} {inCategory.length === 1 ? "tip" : "tips"}
                      </span>
                    </div>
                    <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {inCategory.map((tip) => (
                        <TipCard key={tip.id} tip={tip} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          <section className="mt-12 flex flex-col items-start justify-between gap-4 rounded-lg border border-[#f59e0b] bg-white p-6 shadow-sm sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Ready to put a tip to work?</h2>
              <p className="mt-1 text-slate-600">
                Browse approved vacancies across the region.
              </p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex rounded-lg bg-[#f59e0b] px-5 py-3 font-bold text-slate-950 shadow-sm transition hover:bg-[#fbbf24]"
            >
              Browse jobs
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
