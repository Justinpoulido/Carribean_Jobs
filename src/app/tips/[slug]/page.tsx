import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TipBody } from "@/components/TipBody";
import { Motion } from "@/components/Motion";
import { SparkleDoodle, SunDoodle, WaveDivider } from "@/components/Doodles";
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
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(tipArticleJsonLd(tip, pageUrl, siteName)),
          }}
        />
        <section className="relative overflow-hidden bg-ocean text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_380px_at_85%_8%,rgba(14,124,123,0.5),transparent_68%)]"
          />
          <SunDoodle
            className="pointer-events-none absolute right-[5%] top-[18%] hidden h-24 w-24 text-sun opacity-35 animate-spin-slow lg:block"
            strokeWidth={3}
          />
          <SparkleDoodle
            className="pointer-events-none absolute left-[5%] bottom-[22%] hidden h-7 w-7 text-turq opacity-45 animate-twinkle lg:block"
            strokeWidth={6}
          />
          <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
            <Link
              href="/tips"
              className="group inline-flex items-center gap-2 py-2 text-[14.5px] font-bold text-sun transition-colors hover:text-white"
            >
              <ArrowLeft
                size={17}
                className="transition-transform duration-300 ease-brand group-hover:-translate-x-1"
                aria-hidden="true"
              />
              All career tips
            </Link>
            <div className="mt-5 flex flex-wrap gap-2 text-[14px] font-semibold">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                {tip.category}
              </span>
              <time
                dateTime={tip.publishedAt}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2"
              >
                {formatJobDate(tip.publishedAt)}
              </time>
            </div>
            <h1 className="mt-5 text-[clamp(2rem,4.8vw,3.25rem)] font-bold leading-[1.08]">
              {tip.title}
            </h1>
          </div>
          <div className="relative w-full overflow-hidden">
            <WaveDivider topColor="text-cream" />
          </div>
        </section>

        <article className="mx-auto max-w-3xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
          <div
            className="rounded-brand-lg border-2 border-ocean/10 bg-white p-7 sm:p-10"
            data-reveal
          >
            <TipBody body={tip.body} />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="inline-flex min-h-13 items-center justify-center rounded-full bg-sun px-7 font-bold text-ocean shadow-[0_5px_0_var(--color-sun-deep)] transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--color-sun-deep)]"
            >
              Browse open jobs
            </Link>
            <Link
              href="/tips"
              className="inline-flex min-h-13 items-center justify-center rounded-full border-2 border-ocean px-7 font-bold text-ocean transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:bg-ocean hover:text-white"
            >
              More career tips
            </Link>
          </div>
        </article>

        {related.length > 0 ? (
          <section className="bg-sand">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <h2
                className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold text-ocean"
                data-reveal
              >
                More tips
              </h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {related.map((item, index) => (
                  <div
                    key={item.id}
                    data-reveal
                    data-reveal-delay={String((index % 3) * 80)}
                  >
                    <TipCard tip={item} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
      <Motion />
    </>
  );
}
