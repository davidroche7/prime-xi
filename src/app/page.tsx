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
      <section className="py-12 text-center sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-400/90">
          A Liverpool knowledge game
        </p>
        <h1 className="mt-3 text-5xl font-black tracking-tighter sm:text-6xl">
          The Perfect{" "}
          <span className="bg-gradient-to-b from-red-400 to-red-600 bg-clip-text text-transparent">
            XI
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-zinc-400">
          The greatest Liverpool team is hidden on this site. Build yours blind — players, defining
          seasons, formation, manager — and score it out of 98. Counts-only feedback. Then take it
          head-to-head against the greatest XIs of United, Real Madrid and more.
        </p>
      </section>

      <section className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
        {ERA_CARDS.map((card) => {
          const era = eras.find((e) => e.slug === card.slug);
          return (
            <Link
              key={card.slug}
              href={`/xi/${card.slug}/`}
              className="group rounded-2xl bg-gradient-to-b from-ink-900 to-ink-950 p-5 text-center ring-1 ring-white/10 transition duration-200 hover:-translate-y-0.5 hover:ring-red-500/50"
            >
              <span className="block text-lg font-black tracking-tight">{card.label}</span>
              <span className="mt-1 block text-xs text-zinc-500">{era?.seasonRange}</span>
              <span className="mt-2 block text-sm text-zinc-400">{card.blurb}</span>
              <span className="mt-4 inline-block rounded-lg bg-gradient-to-b from-red-600 to-red-700 px-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-red-950/50 transition group-hover:from-red-500 group-hover:to-red-600">
                Build it →
              </span>
            </Link>
          );
        })}
      </section>

      <section className="mx-auto mt-10 max-w-3xl rounded-2xl bg-ink-900/60 p-6 text-center ring-1 ring-white/10">
        <h2 className="font-bold text-zinc-200">
          Guess the <span className="text-red-500">Red</span> — the daily warm-up
        </h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-zinc-400">
          One mystery Liverpool player a day, six clues, hardest first. Keep the streak alive while
          you plot your XI.
        </p>
        <Link
          href="/daily/"
          className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-bold ring-1 ring-white/15 transition hover:bg-white/5 hover:ring-red-500/60"
        >
          Play today&apos;s puzzle
        </Link>
      </section>

      <section className="mx-auto mt-10 max-w-3xl rounded-2xl bg-gradient-to-b from-red-950/40 to-ink-950 p-6 text-center ring-1 ring-red-500/25">
        <h2 className="font-bold text-zinc-100">
          Then take them <span className="text-red-500">head-to-head</span>
        </h2>
        <p className="mx-auto mt-1 max-w-xl text-sm text-zinc-400">
          Built your XI? Pit it against another club&apos;s greatest side — Manchester United, Real
          Madrid, Barcelona, Bayern Munich, AC Milan and more. You get a scoreline and nothing else:
          the opponent&apos;s team stays hidden, and every rating turns on the exact season you picked,
          so a legend in an off-year weakens your team. Is your greatest Liverpool XI really the
          greatest in Europe?
        </p>
        <Link
          href="/xi/all-time/"
          className="mt-4 inline-block rounded-lg bg-gradient-to-b from-red-600 to-red-700 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-950/50 transition hover:from-red-500 hover:to-red-600"
        >
          Build an XI, then play a rival →
        </Link>
      </section>

      <section className="mx-auto mt-16 max-w-2xl space-y-4 border-t border-ink-800 pt-8 text-sm leading-relaxed text-zinc-400">
        <h2 className="text-lg font-bold text-zinc-200">One hidden XI per era. Find it.</h2>
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
        <h2 className="text-lg font-bold text-zinc-200">FAQ</h2>
        <dl className="mt-3 space-y-4">
          {FAQS.map((f) => (
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
