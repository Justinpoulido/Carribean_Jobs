import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Career Resources",
  description:
    "Resume tips, cover letter guidance, interview questions, remote work advice, country job trends, and salary guides.",
};

const resources = [
  ["Resume tips", "Write a focused Caribbean-ready resume with clear wins, tools, and measurable impact."],
  ["Cover letter template", "Adapt a simple opening, proof paragraph, and close for each employer."],
  ["Interview questions", "Prepare answers for behavioral, technical, and culture-fit interviews."],
  ["Remote work tips", "Set up routines, communication habits, and productivity signals for distributed teams."],
  ["Best jobs by country", "Track demand across Trinidad, Jamaica, Barbados, Guyana, and more."],
  ["Salary guide", "Compare compensation expectations by market, seniority, and job family."],
];

export default function ResourcesPage() {
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
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {resources.map(([title, text]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
