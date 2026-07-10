import type { Metadata } from "next";
import { DISCLAIMER, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: `Terms of use for ${SITE_NAME} — a free, independent football knowledge game.`,
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6 text-sm leading-relaxed text-dune-600">
      <h1 className="font-display text-2xl uppercase tracking-tight text-ink-950">Terms of use</h1>
      <p className="text-xs text-dune-600">Last updated: 10 July 2026</p>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">What this is</h2>
        <p>
          {SITE_NAME} is a free football knowledge game provided as-is, for entertainment. We make no
          guarantees about availability, accuracy, or fitness for any purpose, and accept no liability
          for anything arising from its use, to the fullest extent the law allows.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Independence</h2>
        <p>{DISCLAIMER}</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Data and content</h2>
        <p>
          Player statistics derive from Wikipedia (CC BY-SA) and lfchistory.net, used as historical
          facts with credit. Game design, scoring, and generated content are ours. Share cards you
          generate are yours to share anywhere.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Changes</h2>
        <p>
          We may update the games, ratings, and these terms at any time. Continued play means you
          accept the current version.
        </p>
      </section>
    </article>
  );
}
