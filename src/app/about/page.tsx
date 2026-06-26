import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Caribbean Jobs connects professionals across the Caribbean with employers looking for talent.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
            About Caribbean Jobs
          </p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">
            Connecting Caribbean talent with Caribbean opportunity
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Caribbean Jobs connects professionals across the Caribbean with
            employers looking for talent. The platform is designed for regional
            hiring, helping candidates search by country, category, company,
            salary, and work mode while giving employers a clean way to post and
            promote vacancies.
          </p>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            From Port of Spain to Kingston, Bridgetown, Georgetown and beyond,
            our goal is to make opportunity easier to find and easier to act on.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
