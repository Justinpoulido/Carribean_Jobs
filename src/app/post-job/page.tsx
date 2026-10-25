import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SubmitButton } from "@/components/FormStatus";
import { createJobPost } from "@/app/actions";
import {
  categories,
  countries,
  currencies,
  jobTypes,
  salaryPeriods,
  workModes,
} from "@/data/jobs";
import { DEFAULT_LISTING_DAYS } from "@/lib/site";
import { PostJobStatus } from "./status";

export const metadata: Metadata = {
  title: "Post a Job",
  description:
    "Post a Caribbean job vacancy and receive applications directly from regional candidates.",
};

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-slate-500 sm:col-span-2">{children}</p>;
}

export default function PostJobPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
              Employers
            </p>
            <h1 className="mt-3 text-4xl font-black text-slate-950">
              Post a Job
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Share your vacancy with job seekers across the Caribbean.
              Candidates apply to you directly by email or through your own
              application page. Every post is reviewed before it goes live and
              stays up for {DEFAULT_LISTING_DAYS} days.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <PostJobStatus action={createJobPost}>
            <div className="grid gap-4 sm:grid-cols-2">
              <h2 className="text-lg font-bold text-slate-950 sm:col-span-2">
                Company
              </h2>
              <input required name="company_name" maxLength={140} placeholder="Company name" className="field" />
              <input required name="contact_email" type="email" maxLength={200} placeholder="Your contact email (not shown publicly)" className="field" />

              <h2 className="mt-4 text-lg font-bold text-slate-950 sm:col-span-2">
                The role
              </h2>
              <input required name="title" maxLength={140} placeholder="Job title" className="field sm:col-span-2" />
              <select required name="country" defaultValue="" className="field">
                <option value="" disabled>Country</option>
                {countries.map((country) => <option key={country}>{country}</option>)}
              </select>
              <input required name="city" maxLength={80} placeholder="City / town" className="field" />
              <select required name="category" defaultValue="" className="field">
                <option value="" disabled>Category</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
              <select required name="job_type" defaultValue="" className="field">
                <option value="" disabled>Job type</option>
                {jobTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
              <select required name="work_mode" defaultValue="" className="field sm:col-span-2">
                <option value="" disabled>Remote / On-site / Hybrid</option>
                {workModes.map((mode) => <option key={mode}>{mode}</option>)}
              </select>

              <h2 className="mt-4 text-lg font-bold text-slate-950 sm:col-span-2">
                Salary (optional)
              </h2>
              <input name="salary_min" type="number" min="0" step="any" placeholder="Minimum" className="field" />
              <input name="salary_max" type="number" min="0" step="any" placeholder="Maximum" className="field" />
              <select name="salary_currency" defaultValue="" className="field">
                <option value="">Currency (defaults to local)</option>
                {currencies.map((currency) => <option key={currency}>{currency}</option>)}
              </select>
              <select name="salary_period" defaultValue="Month" className="field">
                {salaryPeriods.map((period) => (
                  <option key={period} value={period}>Per {period.toLowerCase()}</option>
                ))}
              </select>

              <h2 className="mt-4 text-lg font-bold text-slate-950 sm:col-span-2">
                Details
              </h2>
              <textarea required name="description" rows={6} minLength={50} maxLength={8000} placeholder="Description of the role and your company" className="field sm:col-span-2" />
              <textarea name="requirements" rows={4} maxLength={4000} placeholder="Requirements (one per line)" className="field sm:col-span-2" />
              <textarea name="responsibilities" rows={4} maxLength={4000} placeholder="Responsibilities (one per line)" className="field sm:col-span-2" />
              <textarea name="benefits" rows={3} maxLength={2000} placeholder="Benefits (one per line)" className="field sm:col-span-2" />

              <h2 className="mt-4 text-lg font-bold text-slate-950 sm:col-span-2">
                How candidates apply
              </h2>
              <Hint>Add at least one. Candidates contact you directly; Caribbean Jobs never charges applicants.</Hint>
              <input name="application_email" type="email" maxLength={200} placeholder="Application email" className="field" />
              <input name="application_link" type="url" maxLength={500} placeholder="Application link (https://...)" className="field" />

              <label className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-slate-700 sm:col-span-2">
                <input name="featured_requested" type="checkbox" className="mt-1 h-5 w-5 accent-[#f59e0b]" />
                <span>
                  <span className="block font-semibold">Request a Featured listing</span>
                  <span className="text-sm">
                    Featured jobs appear first in search and on the homepage for a
                    small fee. We&apos;ll email you the price and payment details;
                    your job is featured once payment is received.
                  </span>
                </span>
              </label>

              {/* Honeypot: hidden from people, filled in by bots. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Company website
                  <input name="company_website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
            </div>
            <SubmitButton
              pendingText="Submitting job..."
              className="mt-6 w-full rounded-lg bg-[#0077b6] px-5 py-3 font-bold text-white transition hover:bg-[#005f8f] disabled:opacity-70"
            >
              Submit job for review
            </SubmitButton>
          </PostJobStatus>
        </section>
      </main>
      <Footer />
    </>
  );
}
