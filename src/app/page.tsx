import Link from "next/link";
import { ArrowRight, ClipboardList, Send, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";
import { SearchBar } from "@/components/SearchBar";
import { CountryCard } from "@/components/CountryCard";
import { JobCard } from "@/components/JobCard";
import { CategoryCard } from "@/components/CategoryCard";
import { JobsEmptyState } from "@/components/JobsEmptyState";
import { categories, countries } from "@/data/jobs";
import { getListedJobs } from "@/lib/load-public-jobs";
import {
  ArrowDoodle,
  BoatDoodle,
  CompassDoodle,
  DotsDoodle,
  PalmDoodle,
  SparkleDoodle,
  StarDoodle,
  SquiggleDoodle,
  SunDoodle,
  UnderlineDoodle,
  WaveDivider,
} from "@/components/Doodles";

export const revalidate = 3600;

const steps = [
  {
    title: "Search jobs",
    text: "Filter the jobs board by keyword, employer, or location.",
    icon: ClipboardList,
  },
  {
    title: "See how to apply",
    text: "Each listing includes the employer's link or email.",
    icon: Send,
  },
  {
    title: "Get hired",
    text: "Connect directly with employers building Caribbean teams.",
    icon: CheckCircle2,
  },
];

const resources = [
  ["Resume tips", "/resources#resume-tips"],
  ["Cover letter template", "/resources#cover-letter"],
  ["Interview questions", "/resources#interview-questions"],
  ["Remote work tips", "/resources#remote-work-tips"],
];

export default async function Home() {
  const listedJobs = await getListedJobs();
  const latestJobs = listedJobs.slice(0, 3);

  return (
    <>
      <Header />
      <main id="main">
        {/* ============================= HERO ============================= */}
        <section className="relative overflow-hidden bg-ocean text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_480px_at_78%_15%,rgba(14,124,123,0.55),transparent_65%)]"
          />

          {/* floating doodles */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <SunDoodle
              className="absolute right-[6%] top-[8%] hidden h-28 w-28 text-sun opacity-70 animate-spin-slow sm:block sm:h-40 sm:w-40"
              strokeWidth={3}
            />
            <StarDoodle
              className="absolute left-[4%] top-[18%] hidden h-10 w-10 text-turq opacity-50 animate-float lg:block"
              strokeWidth={5}
            />
            <SparkleDoodle
              className="absolute right-[34%] top-[6%] hidden h-8 w-8 text-sun opacity-60 animate-twinkle lg:block"
              strokeWidth={5}
            />
            <PalmDoodle
              className="absolute -left-6 bottom-[22%] hidden h-36 w-36 text-turq opacity-25 animate-float-slow xl:block"
              strokeWidth={4}
            />
            <BoatDoodle
              className="absolute bottom-[26%] right-[3%] hidden h-24 w-24 text-turq opacity-30 animate-float-rev lg:block"
              strokeWidth={4}
            />
            <DotsDoodle className="absolute left-[46%] bottom-[12%] hidden h-20 w-20 text-white opacity-10 lg:block" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pb-16 lg:pt-24">
            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-x-12 lg:gap-y-4">
              <div className="lg:col-start-1 lg:row-start-1" data-reveal>
                <p className="inline-flex items-center gap-2 rounded-full border border-sun/45 bg-sun/15 px-4 py-2 text-[13px] font-bold uppercase tracking-[0.09em] text-sun">
                  <SparkleDoodle className="h-3.5 w-3.5" strokeWidth={8} />
                  Your Future. Our Caribbean.
                </p>

                <h1 className="mt-6 max-w-[15ch] text-[clamp(2.6rem,7vw,4.75rem)] font-bold leading-[1.04]">
                  Find jobs across the{" "}
                  <span className="relative inline-block text-sun">
                    Caribbean
                    <UnderlineDoodle className="absolute -bottom-2 left-0 h-4 w-full text-sun/80" />
                  </span>
                </h1>

                <p className="mt-7 max-w-[52ch] text-[clamp(1.05rem,2vw,1.28rem)] leading-relaxed text-white/80">
                  Search opportunities in Trinidad, Jamaica, Barbados, Guyana
                  and beyond — then apply straight to the employer.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/jobs"
                    className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-sun px-7 font-bold text-ocean shadow-[0_5px_0_var(--color-sun-deep)] transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--color-sun-deep)] active:translate-y-0 active:shadow-[0_3px_0_var(--color-sun-deep)]"
                  >
                    Find Jobs
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                  <Link
                    href="/post-job"
                    className="inline-flex min-h-13 items-center justify-center rounded-full border-2 border-white/40 px-7 font-bold text-white transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-ocean"
                  >
                    Post a Job
                  </Link>
                </div>
              </div>

              {/* stat panel */}
              <div
                className="order-last grid gap-4 sm:grid-cols-2 lg:order-none lg:col-start-2 lg:row-start-1"
                data-reveal
                data-reveal-delay="200"
              >
                <div className="rounded-brand-lg border border-white/15 bg-white/8 p-6 backdrop-blur-sm sm:col-span-2">
                  <p className="font-display text-[15px] font-semibold text-turq">
                    The board right now
                  </p>
                  <p className="mt-2 leading-7 text-white/75">
                    Live vacancies from employers and public listings across
                    eight Caribbean countries.
                  </p>
                </div>
                <div className="rounded-brand-lg border border-white/15 bg-white/8 p-6 backdrop-blur-sm">
                  <p className="font-display text-[44px] font-bold leading-none text-sun">
                    8
                  </p>
                  <p className="mt-2 text-[14px] font-semibold text-white/70">
                    Countries
                  </p>
                </div>
                <div className="rounded-brand-lg border border-white/15 bg-white/8 p-6 backdrop-blur-sm">
                  <p
                    className="font-display text-[44px] font-bold leading-none text-sun"
                    data-count-to={listedJobs.length}
                  >
                    {listedJobs.length}
                  </p>
                  <p className="mt-2 text-[14px] font-semibold text-white/70">
                    Open roles
                  </p>
                </div>
              </div>

              <div
                className="lg:col-span-2 lg:row-start-2 lg:mt-6"
                data-reveal
                data-reveal-delay="160"
              >
                <SearchBar />
              </div>
            </div>
          </div>

          {/* waves into the next section */}
          <div className="relative w-full overflow-hidden">
            <WaveDivider topColor="text-cream" />
          </div>
        </section>

        {/* ========================== COUNTRIES ========================== */}
        <section className="relative overflow-hidden py-20 sm:py-24">
          <CompassDoodle
            className="pointer-events-none absolute -left-16 top-16 hidden h-56 w-56 text-turq opacity-10 animate-float-slow xl:block"
            strokeWidth={3}
          />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className="flex flex-wrap items-end justify-between gap-6"
              data-reveal
            >
              <div>
                <p className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-teal-deep">
                  <span className="h-[2.5px] w-7 rounded-full bg-sun" />
                  Featured countries
                </p>
                <h2 className="mt-3 max-w-[18ch] text-[clamp(2rem,4.6vw,3.25rem)] font-bold text-ocean">
                  Work where the Caribbean is growing
                </h2>
              </div>
              <Link
                href="/jobs"
                className="group inline-flex items-center gap-2 font-bold text-teal-deep"
              >
                Browse all jobs
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 ease-brand group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {countries.map((country, index) => (
                <div
                  key={country}
                  data-reveal
                  data-reveal-delay={String((index % 4) * 70)}
                >
                  <CountryCard country={country} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================== JOBS BOARD ========================== */}
        <section className="relative overflow-hidden bg-sand py-20 sm:py-24">
          <SquiggleDoodle
            className="pointer-events-none absolute right-8 top-10 hidden h-10 w-40 text-sun opacity-40 lg:block"
            strokeWidth={5}
          />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className="flex flex-wrap items-end justify-between gap-6"
              data-reveal
            >
              <div>
                <p className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-teal-deep">
                  <span className="h-[2.5px] w-7 rounded-full bg-sun" />
                  Jobs board
                </p>
                <h2 className="mt-3 text-[clamp(2rem,4.6vw,3.25rem)] font-bold text-ocean">
                  Latest openings
                </h2>
              </div>
              <Link
                href="/jobs"
                className="group inline-flex items-center gap-2 font-bold text-teal-deep"
              >
                See the jobs board
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 ease-brand group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </Link>
            </div>

            {latestJobs.length > 0 ? (
              <div className="mt-12 grid gap-5">
                {latestJobs.map((job, index) => (
                  <div
                    key={job.id}
                    data-reveal
                    data-reveal-delay={String(index * 90)}
                  >
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-12" data-reveal>
                <JobsEmptyState />
              </div>
            )}
          </div>
        </section>

        {/* ========================== CATEGORIES ========================== */}
        <section className="relative overflow-hidden py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div data-reveal>
              <p className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-teal-deep">
                <span className="h-[2.5px] w-7 rounded-full bg-sun" />
                Job categories
              </p>
              <h2 className="mt-3 text-[clamp(2rem,4.6vw,3.25rem)] font-bold text-ocean">
                Find work by specialty
              </h2>
            </div>
          </div>

          {/* scrolling ticker of every category */}
          <div
            className="marquee-mask mt-10 overflow-hidden py-2"
            aria-hidden="true"
          >
            <div className="marquee-track flex w-max animate-marquee gap-3">
              {[...categories, ...categories].map((category, index) => (
                <span
                  key={`${category}-${index}`}
                  className="whitespace-nowrap rounded-full border-2 border-ocean/10 bg-white px-5 py-2.5 font-display text-[15px] font-semibold text-ocean"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <div
                  key={category}
                  data-reveal
                  data-reveal-delay={String((index % 3) * 70)}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================= HOW IT WORKS ========================= */}
        <section className="relative overflow-hidden bg-turq-soft py-20 sm:py-24">
          <StarDoodle
            className="pointer-events-none absolute left-[7%] top-12 hidden h-12 w-12 text-teal opacity-25 animate-float lg:block"
            strokeWidth={5}
          />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div data-reveal>
              <p className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-teal-deep">
                <span className="h-[2.5px] w-7 rounded-full bg-sun" />
                How it works
              </p>
              <h2 className="mt-3 max-w-[18ch] text-[clamp(2rem,4.6vw,3.25rem)] font-bold text-ocean">
                Three steps to your next role
              </h2>
            </div>

            <div className="relative mt-14 grid gap-6 lg:grid-cols-3">
              {/* hand-drawn arrows between the steps */}
              <ArrowDoodle
                className="pointer-events-none absolute left-[31%] top-6 hidden h-10 w-24 text-teal opacity-35 lg:block"
                strokeWidth={4}
              />
              <ArrowDoodle
                className="pointer-events-none absolute left-[64%] top-6 hidden h-10 w-24 text-teal opacity-35 lg:block"
                strokeWidth={4}
              />

              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    data-reveal
                    data-reveal-delay={String(index * 120)}
                    className="group relative rounded-brand-lg border-2 border-ocean/8 bg-white p-7 transition-all duration-300 ease-brand hover:-translate-y-1.5 hover:shadow-[0_20px_44px_rgb(6_48_58/0.13)]"
                  >
                    <span className="absolute right-6 top-5 font-display text-[54px] font-bold leading-none text-ocean/8">
                      {index + 1}
                    </span>
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean text-sun transition-transform duration-300 ease-brand group-hover:-rotate-6">
                      <Icon size={25} aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 font-display text-[22px] font-bold text-ocean">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 leading-7 text-ink-soft">{step.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== EMPLOYERS + RESOURCES ==================== */}
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.75fr] lg:px-8 lg:py-24">
          <div
            className="relative overflow-hidden rounded-brand-lg bg-ocean p-9 text-white sm:p-11"
            data-reveal
          >
            <SunDoodle
              className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 text-sun opacity-20 animate-spin-slow"
              strokeWidth={3}
            />
            <BoatDoodle
              className="pointer-events-none absolute bottom-4 right-8 hidden h-24 w-24 text-turq opacity-25 animate-float sm:block"
              strokeWidth={4}
            />
            <p className="relative inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-sun">
              <span className="h-[2.5px] w-7 rounded-full bg-sun" />
              Employers
            </p>
            <h2 className="relative mt-4 max-w-[16ch] text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold">
              Post your vacancy across the Caribbean
            </h2>
            <p className="relative mt-5 max-w-[46ch] leading-7 text-white/75">
              Reach active job seekers, promote your company, and collect
              applications from professionals across the region.
            </p>
            <Link
              href="/post-job"
              className="relative mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-sun px-7 font-bold text-ocean shadow-[0_5px_0_var(--color-sun-deep)] transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--color-sun-deep)]"
            >
              Post a Job
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <div data-reveal data-reveal-delay="120">
            <p className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-teal-deep">
              <span className="h-[2.5px] w-7 rounded-full bg-sun" />
              Career resources
            </p>
            <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.5rem)] font-bold text-ocean">
              Prepare for the next step
            </h2>
            <div className="mt-7 grid gap-3">
              {resources.map(([label, href]) => (
                <Link
                  href={href}
                  key={href}
                  className="group flex items-center justify-between gap-3 rounded-brand border-2 border-ocean/10 bg-white px-5 py-4 font-display text-[17px] font-semibold text-ocean transition-all duration-300 ease-brand hover:-translate-y-1 hover:border-teal hover:shadow-[0_14px_30px_rgb(6_48_58/0.12)]"
                >
                  {label}
                  <ArrowRight
                    size={18}
                    className="text-teal transition-transform duration-300 ease-brand group-hover:translate-x-1.5"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Motion />
    </>
  );
}
