import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SubmitButton } from "@/components/FormStatus";
import { submitContact } from "@/app/actions";
import { ContactStatus } from "./status";
import { Motion } from "@/components/Motion";
import { PageHero } from "@/components/PageHero";
import { contactEmail } from "@/lib/site";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Caribbean Jobs for job seeker or employer support.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero
          kicker="Contact"
          title="Talk to Caribbean Jobs"
          lead="Send a message about employer plans, job seeker support, or regional hiring partnerships."
        />
        <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[0.75fr_1fr] lg:px-8">
          <div data-reveal>
            <h2 className="font-display text-[23px] font-bold text-ocean">
              Prefer email?
            </h2>
            <p className="mt-3 leading-7 text-ink-soft">
              Write to us directly and we will come back to you.
            </p>
            <a
              href={`mailto:${contactEmail()}`}
              className="mt-5 inline-flex items-center gap-2.5 font-semibold text-teal-deep transition-colors hover:text-ocean"
            >
              <Mail size={18} aria-hidden="true" />
              {contactEmail()}
            </a>
          </div>
          <ContactStatus action={submitContact}>
            <label className="grid gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-teal-deep">
              Name
              <input required name="name" placeholder="Your name" className="field" />
            </label>
            <label className="grid gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-teal-deep">
              Email
              <input
                required
                name="email"
                type="email"
                placeholder="you@example.com"
                className="field"
              />
            </label>
            <label className="grid gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-teal-deep">
              Message
              <textarea
                required
                name="message"
                rows={6}
                placeholder="How can we help?"
                className="field"
              />
            </label>
            <SubmitButton
              pendingText="Sending..."
              className="inline-flex min-h-13 items-center justify-center rounded-full bg-ocean px-7 font-bold text-white transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:bg-teal hover:shadow-[0_12px_28px_rgb(14_124_123/0.3)] disabled:translate-y-0 disabled:opacity-70"
            >
              Send message
            </SubmitButton>
          </ContactStatus>
        </section>
      </main>
      <Footer />
      <Motion />
    </>
  );
}
