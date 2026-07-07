import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PerfectXiBuilder } from "@/components/PerfectXiBuilder";
import { ERA_CONTENT } from "@/content/eras";
import { getEras, getFormations, getManagers, getPlayersIndex } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getEras().map((e) => ({ era: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ era: string }> }): Promise<Metadata> {
  const { era } = await params;
  const content = ERA_CONTENT[era];
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: `${SITE_URL}/xi/${era}/` },
  };
}

export default async function EraPage({ params }: { params: Promise<{ era: string }> }) {
  const { era: slug } = await params;
  const era = getEras().find((e) => e.slug === slug);
  const content = ERA_CONTENT[slug];
  if (!era || !content) notFound();

  return (
    <>
      <section className="py-6 text-center">
        <h1 className="mx-auto max-w-3xl text-3xl font-black tracking-tight">{content.h1}</h1>
        <p className="mx-auto mt-2 max-w-xl text-zinc-400">
          {era.seasonRange} · build blind, score /98, counts-only feedback
        </p>
      </section>

      <PerfectXiBuilder
        era={era}
        formations={getFormations()}
        players={getPlayersIndex()}
        managers={getManagers()}
      />

      <section className="mx-auto mt-16 max-w-2xl space-y-4 border-t border-ink-800 pt-8 text-sm leading-relaxed text-zinc-400">
        {content.prose.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>

      <section className="mx-auto mt-10 max-w-2xl text-sm">
        <h2 className="text-lg font-bold text-zinc-200">FAQ</h2>
        <dl className="mt-3 space-y-4">
          {content.faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold text-zinc-300">{f.q}</dt>
              <dd className="mt-1 leading-relaxed text-zinc-400">{f.a}</dd>
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
