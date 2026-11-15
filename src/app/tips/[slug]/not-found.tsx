import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TipNotFound() {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
            Career tips
          </p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">
            This tip is not available
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            It may have been unpublished or the link is mistyped.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/tips"
              className="inline-flex rounded-lg bg-[#0077b6] px-5 py-3 font-bold text-white"
            >
              All career tips
            </Link>
            <Link
              href="/jobs"
              className="inline-flex rounded-lg border border-[#0077b6] px-5 py-3 font-bold text-[#0077b6]"
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
