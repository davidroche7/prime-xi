import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { PerfectXiBuilder } from "@/components/PerfectXiBuilder";
import { ERA_CONTENT } from "@/content/eras";
import { getEras, getFormations, getManagers, getOpponents, getPlayersIndex, getRatings } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getEras("liverpool").map((e) => ({ era: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ era: string }> }): Promise<Metadata> {
  const { era } = await params;
  const content = ERA_CONTENT[era];
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: `${SITE_URL}/xi/${era}/` },
    openGraph: { title: content.metaTitle, url: `${SITE_URL}/xi/${era}/`, images: ["/og.png"] },
  };
}

export default async function EraPage({ params }: { params: Promise<{ era: string }> }) {
  const { era: slug } = await params;
  const era = getEras("liverpool").find((e) => e.slug === slug);
  const content = ERA_CONTENT[slug];
  if (!era || !content) notFound();

  return (
    <>
      <section className="fleck -mx-4 -mt-6 mb-8 border-b-[3px] border-ink-950 px-4 py-8 text-center text-cream-100">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em]">The Perfect XI</p>
        <h1 className="font-display mx-auto mt-2 max-w-3xl text-2xl uppercase leading-tight tracking-tight sm:text-3xl">
          {content.h1}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm font-bold">
          {era.seasonRange} · build blind, score /98, counts-only feedback
        </p>
      </section>

      <PerfectXiBuilder
        era={era}
        formations={getFormations()}
        players={getPlayersIndex("liverpool")}
        managers={getManagers("liverpool")}
        ratings={getRatings("liverpool")}
        opponents={getOpponents("liverpool", era.slug)}
      />

      <div className="mx-auto max-w-2xl">
        <AdSlot slot="era-below-builder" />
      </div>

      <section className="mx-auto mt-16 max-w-2xl space-y-4 border-t-[3px] border-ink-950 pt-8 text-sm leading-relaxed text-dune-600">
        {content.prose.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>

      <section className="mx-auto mt-10 max-w-2xl text-sm">
        <h2 className="font-display text-lg uppercase text-ink-950">FAQ</h2>
        <dl className="mt-3 space-y-4">
          {content.faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold text-ink-950">{f.q}</dt>
              <dd className="mt-1 leading-relaxed text-dune-600">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: content.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
