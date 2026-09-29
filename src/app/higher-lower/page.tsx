import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { HigherOrLower } from "@/components/HigherOrLower";
import { getPlayersIndex } from "@/lib/data";
import { PROD_URL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Higher or Lower — the daily Liverpool FC appearances quiz",
  description:
    "A free daily Liverpool FC quiz: guess whether each player has more or fewer career appearances than the last. Same chain worldwide, resets at midnight UTC.",
  alternates: { canonical: `${PROD_URL}/higher-lower/` },
  openGraph: {
    title: "Higher or Lower — the daily Liverpool FC appearances quiz",
    url: `${SITE_URL}/higher-lower/`,
    images: ["/og.png"],
  },
};

const FAQS = [
  {
    q: "What is Higher or Lower?",
    a: "A daily streak game: starting from one Liverpool player, guess whether the next has more or fewer career appearances for the club. Guess wrong and the chain breaks.",
  },
  {
    q: "Is the chain the same for everyone?",
    a: "Yes — like Guess the Red, everyone worldwide gets the same daily chain of players, and it resets at 00:00 UTC.",
  },
  {
    q: "What happens on a tie?",
    a: "Equal appearance counts always count as correct, whichever way you guess.",
  },
];

export default function HigherLowerPage() {
  const players = getPlayersIndex("liverpool");

  return (
    <>
      <section className="fleck -mx-4 -mt-6 mb-8 border-b-[3px] border-ink-950 px-4 py-8 text-center text-cream-100">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em]">The daily streak</p>
        <h1 className="font-display mt-2 text-3xl uppercase tracking-tight sm:text-4xl">
          Higher <span className="text-ink-950">or</span> Lower
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm font-bold">
          One appearance count at a time. How long a chain can you build?
        </p>
      </section>

      <HigherOrLower players={players} />

      <section className="mx-auto mt-14 max-w-xl space-y-4 border-t-[3px] border-ink-950 pt-8 text-sm leading-relaxed text-dune-600">
        <h2 className="font-display text-lg uppercase text-ink-950">A different kind of knowledge test</h2>
        <p>
          Guess the Red tests whether you can name a player from clues. Higher or Lower tests something
          else: your feel for scale across 130 years of Liverpool history. Is a one-season cult hero
          more capped than a club legend from the 1970s? Some calls are obvious, some are a genuine
          coin flip — the chain rewards knowing which is which.
        </p>
        <p>
          Every player in the chain is drawn from Liverpool&apos;s complete playing record, the same
          dataset behind{" "}
          <Link href="/" className="font-semibold text-blood-600 hover:text-red-300">
            The Perfect XI
          </Link>
          . Your best streak is saved on your device — no account needed.
        </p>
      </section>

      <div className="mx-auto mt-8 max-w-xl">
        <AdSlot slot="higher-lower-below-prose" />
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
