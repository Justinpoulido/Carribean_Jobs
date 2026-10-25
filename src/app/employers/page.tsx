import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Megaphone, Send, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Employers",
  description:
    "Post Caribbean vacancies, promote your company, and receive applications directly.",
};

const benefits: Array<[string, typeof BadgeCheck, string]> = [
  [
    "Reach active job seekers",
    BadgeCheck,
    "Your vacancy is listed across eight Caribbean markets and is searchable by country, category and work mode.",
  ],
  [
    "Applications come straight to you",
    Send,
    "Candidates apply by your email or your own application page. No middleman, no extra logins.",
  ],
  [
    "Reviewed, trusted listings",
    Megaphone,
    "Every post is checked before it goes live, so your vacancy sits alongside genuine employers, not spam.",
  ],
  [
    "Featured listings",
    Star,
    "For a small fee, your job is pinned to the top of search and shown on the homepage. Request it when you post.",
  ],
];

export default function EmployersPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-[linear-gradient(135deg,#06283d,#0077b6)] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-wide text-[#fbbf24]">
              Employers
            </p>
            <h1 className="mt-3 max-w-3xl text-5xl font-black">
              Post your vacancy across the Caribbean
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">
              Reach professionals in Trinidad, Jamaica, Barbados, Guyana,
              Grenada, St. Lucia, the Bahamas, Belize, and beyond.
            </p>
            <Link
              href="/post-job"
              className="mt-8 inline-flex rounded-lg bg-[#f59e0b] px-5 py-3 font-bold text-slate-950"
            >
              Post a Job
            </Link>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(([label, Icon, text]) => (
              <div
                key={label}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ecfeff] text-[#0077b6]">
                  <Icon aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  {label}
                </h2>
                <p className="mt-2 leading-7 text-slate-600">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
