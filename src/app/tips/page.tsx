import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";
import { PageHero } from "@/components/PageHero";
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
      <main id="main">
        <PageHero
          kicker="Career tips"
          title="Get hired in the Caribbean"
          lead="Short, practical advice from the Caribbean Jobs Facebook Page, from your first application to your first week on the job."
        >
          {categories.length > 1 ? (
            <nav aria-label="Tip categories" className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <a
                  key={category}
                  href={`#${categoryAnchor(category)}`}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[14px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-sun hover:bg-sun hover:text-ocean"
                >
                  {category}
                </a>
              ))}
            </nav>
          ) : null}
        </PageHero>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
          {tips.length === 0 ? (
            <TipsEmptyState />
          ) : (
            <div className="grid gap-16">
              {categories.map((category) => {
                const inCategory = tips.filter((tip) => tip.category === category);
                return (
                  <section
                    key={category}
                    id={categoryAnchor(category)}
                    aria-labelledby={`${categoryAnchor(category)}-title`}
                    className="scroll-mt-28"
                  >
                    <div
                      className="flex items-baseline justify-between gap-4 border-b-2 border-ocean/10 pb-4"
                      data-reveal
                    >
                      <h2
                        id={`${categoryAnchor(category)}-title`}
                        className="font-display text-[clamp(1.6rem,3vw,2.1rem)] font-bold text-ocean"
                      >
                        {category}
                      </h2>
                      <span className="shrink-0 font-semibold text-ink-soft">
                        {inCategory.length}{" "}
                        {inCategory.length === 1 ? "tip" : "tips"}
                      </span>
                    </div>
                    <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {inCategory.map((tip, index) => (
                        <div
                          key={tip.id}
                          data-reveal
                          data-reveal-delay={String((index % 3) * 80)}
                        >
                          <TipCard tip={tip} />
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          <section
            className="mt-16 flex flex-col items-start justify-between gap-5 rounded-brand-lg border-2 border-sun bg-white p-7 sm:flex-row sm:items-center sm:p-8"
            data-reveal
          >
            <div>
              <h2 className="font-display text-[23px] font-bold text-ocean">
                Ready to put a tip to work?
              </h2>
              <p className="mt-1.5 leading-7 text-ink-soft">
                Browse approved vacancies across the region.
              </p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex min-h-13 shrink-0 items-center justify-center rounded-full bg-sun px-7 font-bold text-ocean shadow-[0_5px_0_var(--color-sun-deep)] transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--color-sun-deep)]"
            >
              Browse jobs
            </Link>
          </section>
        </div>
      </main>
      <Footer />
      <Motion />
    </>
  );
}
