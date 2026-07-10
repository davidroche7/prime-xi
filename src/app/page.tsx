import type { Metadata } from "next";
import Link from "next/link";
import { getEras } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Perfect XI — build the greatest Liverpool team and prove it",
  description:
    "Build the greatest Liverpool XI blind — players, defining seasons, formation, manager — and score it out of 98 against a hidden canonical team. Three eras, counts-only feedback.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: "The Perfect XI — build the greatest Liverpool team and prove it",
    url: `${SITE_URL}/`,
    images: ["/og.png"],
  },
};

const FAQS = [
  {
    q: "What is The Perfect XI?",
    a: "The Perfect XI is a Liverpool FC knowledge game. A canonical greatest XI — eleven players with their defining seasons, a formation, a manager and his peak season — is hidden for each era. You build your own team blind and score it out of 98; feedback tells you how many picks match, never which ones.",
  },
  {
    q: "How is a build scored?",
    a: "Each correct player is worth 6 points and his defining season 2 more (11 slots), the right formation earns 4, the right manager 4, and the manager's peak season 2 — a maximum of 98. Some slots accept more than one defensible legend, and any accepted pick scores in full.",
  },
  {
    q: "What are the three eras?",
    a: "All-time (1892 to today), post-war (1945 to today) and the Premier League era (1992 to today). Each has its own hidden canonical XI and its own page, so solving one tells you nothing mechanical about the others.",
  },
  {
    q: "Can I play my Liverpool XI against other clubs?",
    a: "Yes — head-to-head. Once you submit a build, you can pit it against another club's hidden greatest side for the same era: Manchester United, Everton, Manchester City, Arsenal, Real Madrid, Barcelona, Bayern Munich, Ajax and AC Milan. You see only a scoreline and a win, draw or loss — the opponent's team is never revealed, and because every rating turns on the exact season you picked, a legend in a poor year makes your team weaker.",
  },
  {
    q: "Is there a daily game too?",
    a: "Yes — Guess the Red is the daily warm-up: one mystery Liverpool player a day, six clues from hardest to easiest, with a shareable score grid and a streak.",
  },
];

const ERA_CARDS = [
  {
    slug: "all-time",
    label: "All-time",
    blurb: "Every player since 1892. The full argument.",
  },
  {
    slug: "post-war",
    label: "Post-war",
    blurb: "1945 to today. Liddell to van Dijk.",
  },
  {
    slug: "premier-league",
    label: "Premier League",
    blurb: "1992 to today. The era you watched.",
  },
];

export default function HomePage() {
  const eras = getEras("liverpool");

  return (
    <>
      <section className="fleck -mx-4 -mt-6 mb-10 border-b-[3px] border-ink-950 px-4 py-10 text-cream-100 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em]">A Liverpool knowledge game</p>
            <span className="bg-ink-950 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
              Free
            </span>
          </div>
          <h1 className="font-display mt-6 text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Build the greatest XI.
            <span className="block text-ink-950">Prove it.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm font-bold leading-relaxed sm:text-base">
            The team is hidden on this site. Build yours blind — players, defining seasons,
            formation, manager — and score it out of 98. Then it fights Europe.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {ERA_CARDS.map((card) => {
              const era = eras.find((e) => e.slug === card.slug);
              return (
                <Link
                  key={card.slug}
                  href={`/xi/${card.slug}/`}
                  className="shadow-poster group border-[3px] border-ink-950 bg-paper-50 p-4 text-ink-950 transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <span className="font-display block text-base uppercase">{card.label}</span>
                  <span className="mt-1 block text-xs font-bold text-dune-600">{era?.seasonRange}</span>
                  <span className="mt-1 block text-sm text-dune-600">{card.blurb}</span>
                  <span className="mt-3 inline-block bg-blood-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white group-hover:bg-blood-700">
                    Build it →
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 border-[3px] border-dashed border-cream-100/70 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em]">Head-to-head</p>
            <p className="font-display mt-1 text-sm uppercase leading-snug">
              Your XI vs United, Real Madrid, Bayern… scoreline only. Their team stays hidden.
            </p>
          </div>

          <Link
            href="/daily/"
            className="font-display mt-8 block border-[3px] border-ink-950 bg-ink-950 p-4 text-center text-sm uppercase tracking-wide text-cream-100 shadow-[5px_5px_0_rgb(26_10_14_/_0.45)] transition-transform duration-150 hover:-translate-y-0.5"
          >
            Guess the Red — today&apos;s puzzle →
          </Link>
          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.18em]">
            No account · works offline · free
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-2xl space-y-4 border-t-[3px] border-ink-950 pt-8 text-sm leading-relaxed text-dune-600">
        <h2 className="font-display text-lg uppercase text-ink-950">One hidden XI per era. Find it.</h2>
        <p>
          Every supporter has built the greatest Liverpool XI in their head. This site makes it a
          game with a score. For each era a canonical team is hidden behind salted hashes — eleven
          players, the season that defined each of them, the right formation, the right manager and
          the season that was his summit. You submit your own build completely blind and get
          Mastermind-style feedback: players right out of eleven, seasons right out of eleven, ticks
          for formation and manager. Never which picks were correct — working that out is the game.
        </p>
        <p>
          The scoring rewards real knowledge over vibes. Six points per correct player, two more for
          his defining season, four for the formation, four plus two for the manager and his peak: 98
          for perfection. Genuinely defensible alternatives are accepted — an all-time XI that starts
          Clemence is as right as one that starts Alisson — but only genuinely defensible ones. Reach
          100% and the canonical XI is revealed as your own team sheet, because at that moment they
          are the same thing.
        </p>
        <p>
          Start with the era you know best. The Premier League board rewards the football you
          actually watched; post-war demands the full sweep from Liddell to the modern champions; and
          the all-time page is the complete 130-year argument, more than 800 players deep. Attempts
          and best scores live on your device — no accounts, nothing to install. And when you need a
          breather from the big build, the daily Guess the Red puzzle resets every midnight UTC.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-2xl text-sm">
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
