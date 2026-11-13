import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function JobNotFound() {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
            Jobs board
          </p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">
            This job is not listed
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            It is unpublished, or it was never an approved vacancy.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="inline-flex rounded-lg bg-[#0077b6] px-5 py-3 font-bold text-white"
            >
              Back to the jobs board
            </Link>
            <Link
              href="/post-job"
              className="inline-flex rounded-lg border border-[#0077b6] px-5 py-3 font-bold text-[#0077b6]"
            >
              Post a vacancy
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
