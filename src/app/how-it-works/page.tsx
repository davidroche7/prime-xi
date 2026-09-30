import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { PROD_URL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "How The Perfect XI is scored — the full breakdown",
  description:
    "How the Perfect XI Liverpool knowledge game is scored: players, defining seasons, formation, manager, manager's peak season — the full /98 breakdown and how ties are handled.",
  alternates: { canonical: `${PROD_URL}/how-it-works/` },
  openGraph: {
    title: "How The Perfect XI is scored — the full breakdown",
    url: `${SITE_URL}/how-it-works/`,
    images: ["/og.png"],
  },
};

export default function HowItWorksPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6 text-sm leading-relaxed text-dune-600">
      <h1 className="font-display text-2xl uppercase tracking-tight text-ink-950">
        How The Perfect XI is scored
      </h1>
      <p>
        The Perfect XI is a blind-build knowledge game. For each era — all-time, post-war, Premier
        League — a canonical Liverpool XI is hidden behind salted hashes before you ever touch the
        board: eleven players, the season that defined each of them, a formation, a manager, and the
        season that was his peak. You build your own version from scratch and submit it to find out how
        close you got. Here is exactly how the 98 points break down.
      </p>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">The 98-point breakdown</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong className="text-ink-950">6 points</strong> per correct player, ×11 slots — 66 points.</li>
          <li><strong className="text-ink-950">2 points</strong> per correct defining season, only if the player is also right, ×11 slots — 22 points.</li>
          <li><strong className="text-ink-950">4 points</strong> for the correct formation.</li>
          <li><strong className="text-ink-950">4 points</strong> for the correct manager.</li>
          <li><strong className="text-ink-950">2 points</strong> for that manager's peak season.</li>
        </ul>
        <p>66 + 22 + 4 + 4 + 2 = <strong className="text-ink-950">98</strong>, the maximum.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Feedback is counts only</h2>
        <p>
          After you submit, you get a total out of 98 and four counts — players correct out of 11,
          defining seasons correct out of 11, whether the formation matched, whether the manager
          matched. You are never told which eleven picks were right. Working that out from the counts,
          across repeated attempts, is the actual game.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Equivalence classes</h2>
        <p>
          Some slots have more than one defensible answer — an all-time XI that starts Clemence in goal
          is as legitimate as one that starts Alisson. Where that's true, any accepted (player, season)
          pair scores in full; the key isn't a single rigid answer, it's the set of picks a fair judge
          of Liverpool history would accept.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">How the manager's peak season is chosen</h2>
        <p>
          The peak season is whichever year scores highest on a fixed honours weighting: European Cup
          or Champions League wins count 10, the league title 8, other European trophies 5, the FA Cup
          3, the League Cup 2. Ties go to the earlier season. It's a mechanical rule, applied the same
          way to every manager in every era.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Reaching 100%</h2>
        <p>
          The canonical XI stays completely hidden until you score 98/98 — at that point your submitted
          build and the hidden key are, by definition, the same team, so revealing one reveals both.
          Attempts and your best score are stored only in your browser; there's nothing to sign up for.
        </p>
        <p>
          Once you've submitted a build, you can also send it into{" "}
          <Link href="/head-to-head/" className="font-semibold text-blood-600 hover:text-red-300">
            head-to-head
          </Link>{" "}
          against a rival club — or against The Legends, the actual hidden XI you were just scored
          against.
        </p>
      </section>

      <div className="mx-auto max-w-xl">
        <AdSlot slot="how-it-works-below-prose" />
      </div>

      <p>
        Ready to build? Start with{" "}
        <Link href="/" className="font-semibold text-blood-600 hover:text-red-300">
          an era
        </Link>
        , or warm up with the{" "}
        <Link href="/daily/" className="font-semibold text-blood-600 hover:text-red-300">
          daily quiz
        </Link>
        .
      </p>
    </article>
  );
}
