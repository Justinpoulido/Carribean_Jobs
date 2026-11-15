import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TipBody } from "@/components/TipBody";
import { TipCard } from "@/components/TipCard";
import { getPublishedTips, getTip } from "@/lib/load-tips";
import { formatJobDate, jsonLdScript } from "@/lib/public-jobs";
import { siteName, siteUrl } from "@/lib/site";
import { tipArticleJsonLd } from "@/lib/tips";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tip = await getTip(slug);
  if (!tip) {
    return { title: "Tip not found" };
  }
  const canonical = `/tips/${tip.slug}`;
  return {
    title: tip.title,
    description: tip.excerpt,
    alternates: { canonical },
    openGraph: {
      title: tip.title,
      description: tip.excerpt,
      url: canonical,
      type: "article",
      publishedTime: tip.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: tip.title,
      description: tip.excerpt,
    },
  };
}

export default async function TipPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tip = await getTip(slug);
  if (!tip) {
    notFound();
  }

  const all = await getPublishedTips();
  const others = all.filter((item) => item.slug !== tip.slug);
  const related = [
    ...others.filter((item) => item.category === tip.category),
    ...others.filter((item) => item.category !== tip.category),
  ].slice(0, 3);
  const pageUrl = `${siteUrl}/tips/${tip.slug}`;

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(tipArticleJsonLd(tip, pageUrl, siteName)),
          }}
        />
        <section className="bg-[linear-gradient(135deg,#06283d,#0077b6)] text-white">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <Link
              href="/tips"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#fbbf24]"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              All career tips
            </Link>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
              <span className="rounded-full bg-white/15 px-4 py-2">{tip.category}</span>
              <time dateTime={tip.publishedAt} className="rounded-full bg-white/15 px-4 py-2">
                {formatJobDate(tip.publishedAt)}
              </time>
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              {tip.title}
            </h1>
          </div>
        </section>

        <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <TipBody body={tip.body} />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="inline-flex justify-center rounded-lg bg-[#f59e0b] px-5 py-3 font-bold text-slate-950 shadow-sm transition hover:bg-[#fbbf24]"
            >
              Browse open jobs
            </Link>
            <Link
              href="/tips"
              className="inline-flex justify-center rounded-lg border border-[#0077b6] px-5 py-3 font-bold text-[#0077b6]"
            >
              More career tips
            </Link>
          </div>
        </article>

        {related.length > 0 ? (
          <section className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-black text-slate-950">More tips</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <TipCard key={item.id} tip={item} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
