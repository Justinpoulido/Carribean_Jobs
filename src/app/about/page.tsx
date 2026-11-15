import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";
import { PageHero } from "@/components/PageHero";
import { PalmDoodle } from "@/components/Doodles";

export const metadata: Metadata = {
  title: "About",
  description:
    "Caribbean Jobs connects professionals across the Caribbean with employers looking for talent.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          kicker="About Caribbean Jobs"
          title="Connecting Caribbean talent with Caribbean opportunity"
        />
        <section className="relative mx-auto max-w-4xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
          <PalmDoodle
            className="pointer-events-none absolute -left-24 top-20 hidden h-40 w-40 text-turq opacity-15 animate-float-slow xl:block"
            strokeWidth={4}
          />
          <div className="relative grid gap-6" data-reveal>
            <p className="text-[clamp(1.1rem,2vw,1.3rem)] leading-9 text-ink-soft">
              Caribbean Jobs connects professionals across the Caribbean with
              employers looking for talent. The platform is designed for
              regional hiring, helping candidates search by country, category,
              company, salary, and work mode while giving employers a clean way
              to post and promote vacancies.
            </p>
            <p className="text-[clamp(1.1rem,2vw,1.3rem)] leading-9 text-ink-soft">
              From Port of Spain to Kingston, Bridgetown, Georgetown and beyond,
              our goal is to make opportunity easier to find and easier to act
              on.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <Motion />
    </>
  );
}
