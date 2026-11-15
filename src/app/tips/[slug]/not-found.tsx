import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TipNotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-teal-deep">
            Career tips
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4.6vw,3rem)] font-bold text-ocean">
            This tip is not available
          </h1>
          <p className="mt-4 text-[1.0625rem] leading-8 text-ink-soft">
            It may have been unpublished or the link is mistyped.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/tips"
              className="inline-flex min-h-13 items-center justify-center rounded-full bg-ocean px-7 font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              All career tips
            </Link>
            <Link
              href="/jobs"
              className="inline-flex min-h-13 items-center justify-center rounded-full border-2 border-ocean px-7 font-bold text-ocean transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:bg-ocean hover:text-white"
            >
              Browse jobs
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
