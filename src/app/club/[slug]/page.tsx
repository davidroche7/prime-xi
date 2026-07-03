import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Builder } from "@/components/Builder";
import { CLUB_CONTENT } from "@/content/clubs";
import { getClubData, getClubIndex, getClubSlugs, getFormations } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return getClubSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { club } = getClubData(slug);
  const title = `Build ${club.name}'s Greatest XI`;
  const description = `Pick ${club.name}'s greatest XI from every player at their peak. ${club.budget} credits, deterministic rating out of 99, shareable team card.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/club/${club.slug}/` },
    openGraph: { title, description, url: `${SITE_URL}/club/${club.slug}/` },
  };
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let data;
  try {
    data = getClubData(slug);
  } catch {
    notFound();
  }
  const formations = getFormations();
  const content = CLUB_CONTENT[slug];
  const index = getClubIndex();
  const rivals = (content?.rivals ?? []).map((r) => index.find((c) => c.slug === r)).filter((c) => c != null);

  const faqJsonLd = content
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">
        Build {data.club.name}&apos;s Greatest XI — Every Player at Their Peak
      </h1>
      <p className="mt-1 mb-6 text-sm text-zinc-400">
        {data.players.length} peak player-seasons · {data.club.budget} credits · deterministic score out of 99
      </p>

      <Builder data={data} formations={formations} />

      <AdSlot id={`club-${slug}-below-builder`} />

      {content ? (
        <>
          <section className="prose-invert mt-10 max-w-3xl space-y-4 text-sm leading-relaxed text-zinc-300">
            {content.prose.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </section>

          <section className="mt-8 max-w-3xl">
            <h2 className="mb-3 text-xl font-bold">Frequently asked questions</h2>
            <dl className="space-y-4 text-sm">
              {content.faq.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold text-zinc-200">{f.q}</dt>
                  <dd className="mt-1 text-zinc-400">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </>
      ) : null}

      {rivals.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-zinc-500">Build a rival&apos;s XI</h2>
          <div className="flex flex-wrap gap-2">
            {rivals.map((r) => (
              <Link
                key={r.slug}
                href={`/club/${r.slug}/`}
                className="rounded-lg border border-ink-700 px-3 py-1.5 text-sm hover:border-zinc-500"
              >
                {r.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}
    </div>
  );
}
