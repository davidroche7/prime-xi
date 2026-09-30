import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { OnThisDay } from "@/components/OnThisDay";
import { getPlayersIndex } from "@/lib/data";
import { PROD_URL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "On This Day in Liverpool FC History — player birthdays",
  description:
    "Which Liverpool FC players were born on this day? A free, always-updating look-up of Liverpool player birthdays across 130+ years of club history.",
  alternates: { canonical: `${PROD_URL}/on-this-day/` },
  openGraph: {
    title: "On This Day in Liverpool FC History — player birthdays",
    url: `${SITE_URL}/on-this-day/`,
    images: ["/og.png"],
  },
};

const FAQS = [
  {
    q: "What is On This Day?",
    a: "A daily look-up of Liverpool FC players born on today's date, drawn from the club's full playing history since 1892. It updates automatically at midnight UTC.",
  },
  {
    q: "Why don't some days show any players?",
    a: "Birth dates are only shown where the underlying historical record actually gives a full day and month — we never guess or estimate one. On a quiet day, the nearest upcoming Liverpool birthday is shown instead.",
  },
  {
    q: "Where does the data come from?",
    a: "Player records come from Wikipedia (CC BY-SA) and lfchistory.net, credited in the site footer — the same data that powers the Perfect XI and Guess the Red games.",
  },
];

export default function OnThisDayPage() {
  const players = getPlayersIndex("liverpool");

  return (
    <>
      <section className="fleck -mx-4 -mt-6 mb-8 border-b-[3px] border-ink-950 px-4 py-8 text-center text-cream-100">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em]">Liverpool history</p>
        <h1 className="font-display mt-2 text-3xl uppercase tracking-tight sm:text-4xl">On This Day</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm font-bold">
          Liverpool FC player birthdays, today — from 130+ years of club history.
        </p>
      </section>

      <div className="mx-auto max-w-xl">
        <OnThisDay players={players} />
      </div>

      <section className="mx-auto mt-14 max-w-xl space-y-4 border-t-[3px] border-ink-950 pt-8 text-sm leading-relaxed text-dune-600">
        <h2 className="font-display text-lg uppercase text-ink-950">A birthday a day, since 1892</h2>
        <p>
          Every Liverpool player who has ever worn the shirt has a birthday, and on any given date one
          or two of them fall due. This page checks the full club roster against today&apos;s date and
          shows who they are — league champions, cult heroes, one-season loanees, all of it drawn from
          the same historical record behind the Perfect XI and Guess the Red games elsewhere on this
          site.
        </p>
        <p>
          It only shows a player when the source record actually gives a full birth date. Plenty of
          Liverpool players from the club&apos;s early decades are recorded with a birth year and
          nothing more precise — those players are still fully searchable and playable in{" "}
          <Link href="/" className="font-semibold text-blood-600 hover:text-red-300">
            The Perfect XI
          </Link>
          , they just won&apos;t show up here on a specific day.
        </p>
      </section>

      <div className="mx-auto mt-8 max-w-xl">
        <AdSlot slot="on-this-day-below-prose" />
      </div>

      <section className="mx-auto mt-10 max-w-xl text-sm">
        <h2 className="font-display text-lg uppercase text-ink-950">FAQ</h2>
        <dl className="mt-3 space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="border-b-2 border-sand-300 pb-4">
              <dt className="font-bold text-ink-950">{f.q}</dt>
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
            mainEntity: FAQS.map((f) => ({
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
