import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TipCard } from "@/components/TipCard";
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
      <main className="bg-slate-50">
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
              Career resources
            </p>
            <h1 className="mt-3 text-4xl font-black text-slate-950">
              Build a stronger job search
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Guides for every stage of your search, plus the practical career
              tips we share on the Caribbean Jobs Facebook Page.
            </p>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {resources.map(([id, title, text]) => (
            <article id={id} key={id} className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </section>
        {latestTips.length > 0 ? (
          <section
            id="career-tips"
            aria-labelledby="career-tips-title"
            className="scroll-mt-24 border-t border-slate-200 bg-white"
          >
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
                    Career tips
                  </p>
                  <h2
                    id="career-tips-title"
                    className="mt-2 text-3xl font-black text-slate-950"
                  >
                    Latest tips
                  </h2>
                </div>
                <Link
                  href="/tips"
                  className="inline-flex items-center gap-1 font-bold text-[#0077b6]"
                >
                  See all career tips
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {latestTips.map((tip) => (
                  <TipCard key={tip.id} tip={tip} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
