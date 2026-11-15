import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SubmitButton } from "@/components/FormStatus";
import { createJobPost } from "@/app/actions";
import {
  categories,
  countries,
  currencies,
  jobTypes,
  payPeriods,
  workModes,
} from "@/data/jobs";
import { PostJobStatus } from "./status";
import { PageHero } from "@/components/PageHero";
import { Motion } from "@/components/Motion";

export const metadata: Metadata = {
  title: "Post a Job",
  description:
    "Submit a Caribbean vacancy for review. It stays off the public board until it is approved.",
};

export default function PostJobPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          kicker="Employers"
          title="Post a Job"
          lead="Submit the vacancy with a real way to apply. It is saved as pending and does not appear on the board until it is approved."
        />
        <section className="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
          <PostJobStatus action={createJobPost}>
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>
                Company website
                <input name="company_website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Job title">
                <input required name="title" className="field" />
              </Field>
              <Field label="Company name">
                <input required name="company_name" className="field" />
              </Field>
              <Field label="Town or city">
                <input required name="city" className="field" />
              </Field>
              <Field label="Country">
                <select required name="country" defaultValue="" className="field">
                  <option value="" disabled>
                    Country
                  </option>
                  {countries.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </Field>
              <Field label="Category">
                <select required name="category" defaultValue="" className="field">
                  <option value="" disabled>
                    Category
                  </option>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </Field>
              <Field label="Job type">
                <select required name="job_type" defaultValue="" className="field">
                  <option value="" disabled>
                    Job type
                  </option>
                  {jobTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>
              <Field label="Work mode">
                <select required name="work_mode" defaultValue="" className="field">
                  <option value="" disabled>
                    Work mode
                  </option>
                  {workModes.map((mode) => (
                    <option key={mode}>{mode}</option>
                  ))}
                </select>
              </Field>
              <Field label="Closing date">
                <input required name="closing_date" type="date" className="field" />
              </Field>
              <Field label="Description" wide>
                <textarea required name="description" rows={5} className="field" />
              </Field>
              <Field label="Requirements" wide>
                <textarea required name="requirements" rows={4} className="field" />
              </Field>
              <Field label="Salary minimum">
                <input name="salary_min" type="number" min="0" className="field" />
              </Field>
              <Field label="Salary maximum">
                <input name="salary_max" type="number" min="0" className="field" />
              </Field>
              <Field label="Currency">
                <select name="currency" defaultValue="" className="field">
                  <option value="">No salary listed</option>
                  {currencies.map((currency) => (
                    <option key={currency}>{currency}</option>
                  ))}
                </select>
              </Field>
              <Field label="Pay period">
                <select name="pay_period" defaultValue="" className="field">
                  <option value="">No salary listed</option>
                  {payPeriods.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Employer application email">
                <input name="application_email" type="email" className="field" />
              </Field>
              <Field label="Application URL">
                <input name="application_link" type="url" className="field" />
              </Field>
              <p className="text-sm text-slate-500 sm:col-span-2">
                Provide the employer email or the application URL. At least one is required.
              </p>
              <Field label="Your name">
                <input required name="poster_name" className="field" />
              </Field>
              <Field label="Your email">
                <input required name="contact_email" type="email" className="field" />
              </Field>
              <p className="text-sm text-slate-500 sm:col-span-2">
                Your name and email are for review only. They are not shown on the public listing.
              </p>
              <label className="grid gap-2.5 rounded-brand border-2 border-sun/50 bg-sand px-5 py-5 text-[14.5px] leading-6 text-ink-soft sm:col-span-2">
                <span className="flex items-center gap-3 font-display text-[17px] font-semibold text-ocean">
                  <input name="is_featured" type="checkbox" className="h-5 w-5 accent-[#0e7c7b]" />
                  Request a featured placement
                </span>
                <span className="leading-6">
                  Featured vacancies are highlighted on the homepage and badged on the
                  jobs board. This is a paid option. The fee is confirmed by email
                  before anything is featured. Checking this box only makes the request.
                  This form does not take payment.
                </span>
              </label>
            </div>
            <SubmitButton
              pendingText="Sending..."
              className="mt-7 inline-flex min-h-13 w-full items-center justify-center rounded-full bg-ocean px-6 font-bold text-white transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:bg-teal hover:shadow-[0_12px_28px_rgb(14_124_123/0.3)] disabled:translate-y-0 disabled:opacity-70"
            >
              Submit for review
            </SubmitButton>
          </PostJobStatus>
        </section>
      </main>
      <Footer />
      <Motion />
    </>
  );
}

function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`grid gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-teal-deep ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
    </label>
  );
}
