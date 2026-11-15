import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TipCard } from "@/components/TipCard";
import { Motion } from "@/components/Motion";
import { PageHero } from "@/components/PageHero";
import { getPublishedTips } from "@/lib/load-tips";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Career Resources",
  description:
    "Resume tips, cover letter guidance, interview questions, remote work advice, country job trends, salary guides, and the latest Caribbean Jobs career tips.",
  alternates: { canonical: "/resources" },
};

const resources = [
  ["resume-tips", "Resume tips", "Write a focused Caribbean-ready resume with clear wins, tools, and measurable impact."],
  ["cover-letter", "Cover letter template", "Adapt a simple opening, proof paragraph, and close for each employer."],
  ["interview-questions", "Interview questions", "Prepare answers for behavioral, technical, and culture-fit interviews."],
  ["remote-work-tips", "Remote work tips", "Set up routines, communication habits, and productivity signals for distributed teams."],
  ["best-jobs-by-country", "Best jobs by country", "Track demand across Trinidad, Jamaica, Barbados, Guyana, and more."],
  ["salary-guide", "Salary guide", "Compare compensation expectations by market, seniority, and job family."],
];

export default async function ResourcesPage() {
  const latestTips = (await getPublishedTips()).slice(0, 6);

  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          kicker="Career resources"
          title="Build a stronger job search"
          lead="Guides for every stage of your search, plus the practical career tips we share on the Caribbean Jobs Facebook Page."
        />
        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {resources.map(([id, title, text], index) => (
            <article
              id={id}
              key={id}
              data-reveal
              data-reveal-delay={String((index % 3) * 80)}
              className="scroll-mt-28 rounded-brand-lg border-2 border-ocean/10 bg-white p-7 transition-all duration-300 ease-brand hover:-translate-y-1.5 hover:border-teal/40 hover:shadow-[0_18px_40px_rgb(6_48_58/0.12)]"
            >
              <h2 className="font-display text-[21px] font-bold text-ocean">
                {title}
              </h2>
              <p className="mt-3 leading-7 text-ink-soft">{text}</p>
            </article>
          ))}
        </section>
        {latestTips.length > 0 ? (
          <section
            id="career-tips"
            aria-labelledby="career-tips-title"
            className="scroll-mt-28 bg-sand"
          >
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
                <div>
                  <p className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-teal-deep">
                    <span className="h-[2.5px] w-7 rounded-full bg-sun" />
                    Career tips
                  </p>
                  <h2
                    id="career-tips-title"
                    className="mt-3 font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold text-ocean"
                  >
                    Latest tips
                  </h2>
                </div>
                <Link
                  href="/tips"
                  className="group inline-flex items-center gap-2 py-1 font-bold text-teal-deep"
                >
                  See all career tips
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 ease-brand group-hover:translate-x-1.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {latestTips.map((tip, index) => (
                  <div
                    key={tip.id}
                    data-reveal
                    data-reveal-delay={String((index % 3) * 80)}
                  >
                    <TipCard tip={tip} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
      <Motion />
    </>
  );
}
