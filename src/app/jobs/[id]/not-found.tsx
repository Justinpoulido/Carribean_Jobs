import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { facebookPageUrl } from "@/lib/site";

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
            This job is no longer listed
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            It may have closed or passed its closing date. New jobs are posted
            daily, follow us on{" "}
            <a
              href={facebookPageUrl}
              className="font-bold text-[#0077b6] underline decoration-[#0077b6]/30 underline-offset-4"
            >
              Facebook
            </a>
            .
          </p>
          <Link
            href="/jobs"
            className="mt-8 inline-flex rounded-lg bg-[#0077b6] px-5 py-3 font-bold text-white"
          >
            Back to the jobs board
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
