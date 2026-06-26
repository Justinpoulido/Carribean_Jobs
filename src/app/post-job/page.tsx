import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SubmitButton } from "@/components/FormStatus";
import { createJobPost } from "@/app/actions";
import { categories, countries, jobTypes, workModes } from "@/data/jobs";
import { PostJobStatus } from "./status";

export const metadata: Metadata = {
  title: "Post a Job",
  description:
    "Post a Caribbean job vacancy and receive applications from regional candidates.",
};

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
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <PostJobStatus action={createJobPost}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required name="company_name" placeholder="Company name" className="field" />
              <input required name="contact_email" type="email" placeholder="Contact email" className="field" />
              <input required name="title" placeholder="Job title" className="field sm:col-span-2" />
              <select required name="country" defaultValue="" className="field">
                <option value="" disabled>Country</option>
                {countries.map((country) => <option key={country}>{country}</option>)}
              </select>
              <input required name="city" placeholder="City" className="field" />
              <select required name="category" defaultValue="" className="field">
                <option value="" disabled>Category</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
              <select required name="job_type" defaultValue="" className="field">
                <option value="" disabled>Job type</option>
                {jobTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
              <select required name="work_mode" defaultValue="" className="field">
                <option value="" disabled>Remote / On-site / Hybrid</option>
                {workModes.map((mode) => <option key={mode}>{mode}</option>)}
              </select>
              <input name="salary_min" type="number" min="0" placeholder="Salary minimum" className="field" />
              <input name="salary_max" type="number" min="0" placeholder="Salary maximum" className="field" />
              <textarea required name="description" rows={5} placeholder="Description" className="field sm:col-span-2" />
              <textarea required name="requirements" rows={4} placeholder="Requirements" className="field sm:col-span-2" />
              <textarea required name="responsibilities" rows={4} placeholder="Responsibilities" className="field sm:col-span-2" />
              <textarea name="benefits" rows={4} placeholder="Benefits" className="field sm:col-span-2" />
              <input name="application_email" type="email" placeholder="Application email" className="field" />
              <input name="application_link" type="url" placeholder="Application link" className="field" />
              <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 sm:col-span-2">
                <input name="is_featured" type="checkbox" className="h-5 w-5 accent-[#0077b6]" />
                Featured job
              </label>
            </div>
            <SubmitButton
              pendingText="Posting job..."
              className="mt-6 w-full rounded-lg bg-[#0077b6] px-5 py-3 font-bold text-white transition hover:bg-[#005f8f] disabled:opacity-70"
            >
              Submit job post
            </SubmitButton>
          </PostJobStatus>
        </section>
      </main>
      <Footer />
    </>
  );
}
