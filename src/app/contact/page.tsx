import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SubmitButton } from "@/components/FormStatus";
import { submitContact } from "@/app/actions";
import { ContactStatus } from "./status";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Caribbean Jobs for job seeker or employer support.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
              Contact
            </p>
            <h1 className="mt-3 text-4xl font-black text-slate-950">
              Talk to Caribbean Jobs
            </h1>
            <p className="mt-4 leading-7 text-slate-600">
              Send a message about employer plans, job seeker support, or
              regional hiring partnerships.
            </p>
          </div>
          <ContactStatus action={submitContact}>
            <input required name="name" placeholder="Name" className="field" />
            <input required name="email" type="email" placeholder="Email" className="field" />
            <textarea required name="message" rows={6} placeholder="Message" className="field" />
            <SubmitButton
              pendingText="Sending..."
              className="rounded-lg bg-[#0077b6] px-5 py-3 font-bold text-white transition hover:bg-[#005f8f] disabled:opacity-70"
            >
              Send message
            </SubmitButton>
          </ContactStatus>
        </section>
      </main>
      <Footer />
    </>
  );
}
