import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Send,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { CountryCard } from "@/components/CountryCard";
import { JobCard } from "@/components/JobCard";
import { CategoryCard } from "@/components/CategoryCard";
import { categories, countries } from "@/data/jobs";
import { getPublishedJobs } from "@/lib/jobs";

// Refresh the homepage from the database at most once a minute.
export const revalidate = 60;

const steps = [
  ["Search jobs", "Filter by country, company, category, salary, or work mode."],
  ["Apply directly", "Contact employers by email or through their own application page."],
  ["Get hired", "Connect directly with employers building Caribbean teams."],
];

const resources = [
  "Resume tips",
  "Cover letter template",
  "Interview questions",
  "Remote work tips",
];

export default async function Home() {
  const liveJobs = await getPublishedJobs();
  const featuredJobs = liveJobs.slice(0, 3);
  const spotlight = liveJobs[0];

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#06283d_0%,#0077b6_55%,#10b981_100%)] text-white">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-white [clip-path:polygon(0_70%,100%_25%,100%_100%,0_100%)]" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-28 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-24">
            <div>
              <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold ring-1 ring-white/20">
                Your Future. Our Caribbean. One Opportunity at a Time.
              </p>
              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight sm:text-6xl">
                Find Jobs Across the Caribbean
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">
                Search opportunities in Trinidad, Jamaica, Barbados, Guyana and
                beyond.
              </p>
              <div className="mt-8">
                <SearchBar />
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 font-bold text-slate-950 transition hover:bg-[#fbbf24]"
                >
                  Find Jobs
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  href="/post-job"
                  className="inline-flex items-center justify-center rounded-lg border border-white/40 px-5 py-3 font-bold text-white transition hover:bg-white/10"
                >
                  Post a Job
                </Link>
              </div>
            </div>
            <div className="grid content-start gap-4 rounded-lg bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur">
              {spotlight ? (
                <Link
                  href={`/jobs/${spotlight.id}`}
                  className="block rounded-lg bg-white p-5 text-slate-950 shadow-xl transition hover:shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#0077b6]">
                        {spotlight.is_featured ? "Featured today" : "Latest opening"}
                      </p>
                      <h2 className="mt-1 text-2xl font-bold">{spotlight.title}</h2>
                    </div>
                    <Sparkles className="text-[#f59e0b]" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-slate-600">
                    {spotlight.company_name} - {spotlight.country}
                  </p>
                </Link>
              ) : (
                <div className="rounded-lg bg-white p-5 text-slate-950 shadow-xl">
                  <p className="text-sm font-bold text-[#0077b6]">Hiring?</p>
                  <h2 className="mt-1 text-2xl font-bold">
                    Be the first employer featured here
                  </h2>
                  <Link href="/post-job" className="mt-3 inline-flex font-bold text-[#0077b6]">
                    Post a job
                  </Link>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/90 p-5 text-slate-950">
                  <p className="text-3xl font-black">{countries.length}</p>
                  <p className="text-sm font-semibold text-slate-600">
                    Countries
                  </p>
                </div>
                <div className="rounded-lg bg-white/90 p-5 text-slate-950">
                  <p className="text-3xl font-black">{liveJobs.length}</p>
                  <p className="text-sm font-semibold text-slate-600">
                    Open {liveJobs.length === 1 ? "role" : "roles"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
                Featured countries
              </p>
              <h2 className="text-3xl font-bold text-slate-950">
                Work where the Caribbean is growing
              </h2>
            </div>
            <Link href="/jobs" className="font-bold text-[#0077b6]">
              Browse all jobs
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {countries.map((country) => (
              <CountryCard key={country} country={country} />
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
                  Featured jobs
                </p>
                <h2 className="text-3xl font-bold text-slate-950">
                  New opportunities from regional employers
                </h2>
              </div>
              <Link href="/jobs" className="font-bold text-[#0077b6]">
                See more
              </Link>
            </div>
            <div className="mt-8 grid gap-4">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              {featuredJobs.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
                  <h3 className="text-xl font-bold text-slate-950">
                    New listings are on the way
                  </h3>
                  <p className="mt-2 text-slate-600">
                    Employers are adding vacancies now. Hiring?{" "}
                    <Link href="/post-job" className="font-bold text-[#0077b6]">
                      Post a job
                    </Link>
                    .
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
              Job categories
            </p>
            <h2 className="text-3xl font-bold text-slate-950">
              Find work by specialty
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category} category={category} />
            ))}
          </div>
        </section>

        <section className="bg-[#ecfeff] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {steps.map(([title, text], index) => (
                <div key={title} className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#06283d] text-white">
                    {index === 0 ? <ClipboardList /> : null}
                    {index === 1 ? <Send /> : null}
                    {index === 2 ? <CheckCircle2 /> : null}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-2 leading-7 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div className="rounded-lg bg-[#06283d] p-8 text-white">
            <p className="text-sm font-bold uppercase tracking-wide text-[#fbbf24]">
              Employers
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Post your vacancy across the Caribbean
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-blue-100">
              Reach active job seekers, promote your company, and collect
              applications from professionals across the region.
            </p>
            <Link
              href="/post-job"
              className="mt-6 inline-flex rounded-lg bg-[#f59e0b] px-5 py-3 font-bold text-slate-950"
            >
              Post a Job
            </Link>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
              Career resources
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Prepare for the next step
            </h2>
            <div className="mt-6 grid gap-3">
              {resources.map((resource) => (
                <Link
                  href="/resources"
                  key={resource}
                  className="rounded-lg border border-slate-200 bg-white p-4 font-bold text-slate-800 shadow-sm hover:text-[#0077b6]"
                >
                  {resource}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
