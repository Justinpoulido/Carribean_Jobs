import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Megaphone, Send, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";
import { PageHero } from "@/components/PageHero";
import { BoatDoodle, SunDoodle } from "@/components/Doodles";

export const metadata: Metadata = {
  title: "Employers",
  description:
    "Post Caribbean vacancies, promote your company, and receive applications directly.",
};

const benefits = [
  {
    label: "Reach active job seekers",
    text: "Your vacancy sits in front of candidates already searching the region, not a general feed.",
    icon: BadgeCheck,
  },
  {
    label: "Promote your company",
    text: "Every listing carries your name, location and the role, across eight countries.",
    icon: Megaphone,
  },
  {
    label: "Receive applications directly",
    text: "Candidates apply to your own link or inbox. Nothing is held in between.",
    icon: Send,
  },
  {
    label: "Featured job options",
    text: "Highlight a role on the homepage and badge it on the board when you need it filled fast.",
    icon: Star,
  },
];

export default function EmployersPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          kicker="Employers"
          title="Post your vacancy across the Caribbean"
          lead="Reach professionals in Trinidad, Jamaica, Barbados, Guyana, Grenada, St. Lucia, the Bahamas, Belize, and beyond."
        >
          <Link
            href="/post-job"
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-sun px-7 font-bold text-ocean shadow-[0_5px_0_var(--color-sun-deep)] transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--color-sun-deep)]"
          >
            Post a Job
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.label}
                  data-reveal
                  data-reveal-delay={String((index % 2) * 90)}
                  className="group rounded-brand-lg border-2 border-ocean/10 bg-white p-7 transition-all duration-300 ease-brand hover:-translate-y-1.5 hover:border-teal/40 hover:shadow-[0_18px_40px_rgb(6_48_58/0.12)]"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean text-sun transition-transform duration-300 ease-brand group-hover:-rotate-6">
                    <Icon size={25} aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 font-display text-[21px] font-bold text-ocean">
                    {benefit.label}
                  </h2>
                  <p className="mt-2.5 leading-7 text-ink-soft">{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div
            className="relative overflow-hidden rounded-brand-lg bg-ocean p-9 text-white sm:p-12"
            data-reveal
          >
            <SunDoodle
              className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 text-sun opacity-20 animate-spin-slow"
              strokeWidth={3}
            />
            <BoatDoodle
              className="pointer-events-none absolute bottom-5 right-10 hidden h-24 w-24 text-turq opacity-25 animate-float sm:block"
              strokeWidth={4}
            />
            <h2 className="relative max-w-[18ch] text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold">
              Ready to find your next hire?
            </h2>
            <p className="relative mt-4 max-w-[48ch] leading-7 text-white/75">
              Submit the vacancy with a real way to apply. It is reviewed before
              it goes on the board, so candidates only see roles worth their
              time.
            </p>
            <Link
              href="/post-job"
              className="relative mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-sun px-7 font-bold text-ocean shadow-[0_5px_0_var(--color-sun-deep)] transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--color-sun-deep)]"
            >
              Post a Job
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <Motion />
    </>
  );
}
