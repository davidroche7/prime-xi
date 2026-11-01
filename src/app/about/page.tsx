import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, CREDITS, DISCLAIMER, PROD_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About and contact",
  description: `What ${SITE_NAME} is, how its Liverpool football data is sourced and checked, and how to get in touch.`,
  alternates: { canonical: `${PROD_URL}/about/` },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6 text-sm leading-relaxed text-dune-600">
      <h1 className="font-display text-2xl uppercase tracking-tight text-ink-950">About {SITE_NAME}</h1>

      <section className="space-y-2">
        <p>
          {SITE_NAME} is an independent, free site of Liverpool football history games. It has no
          accounts, no sign-up and no paywall: you open a page and play.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">What&apos;s here</h2>
        <p>
          The main game is <Link href="/" className="font-semibold text-blood-600 hover:text-red-300">The Perfect XI</Link>:
          build the best Liverpool team of an era blind and score it out of 98. Alongside it are{" "}
          <Link href="/daily/" className="font-semibold text-blood-600 hover:text-red-300">Guess the Red</Link>, a daily
          mystery-player quiz;{" "}
          <Link href="/higher-lower/" className="font-semibold text-blood-600 hover:text-red-300">Higher or Lower</Link>, on
          career appearances; and{" "}
          <Link href="/on-this-day/" className="font-semibold text-blood-600 hover:text-red-300">On This Day</Link>, a
          look-up of Liverpool player birthdays.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Where the data comes from</h2>
        <p>
          The all-time player list comes from Wikipedia&apos;s lists of Liverpool players, under CC BY-SA.
          Details such as birthplaces, transfers and honours come from lfchistory.net. Quiz clues are
          generated from those raw facts rather than copied from anyone&apos;s writing. Dates are shown only
          where the record gives them; nothing is estimated.
        </p>
        <p>
          The scoring rules are published in full on{" "}
          <Link href="/how-it-works/" className="font-semibold text-blood-600 hover:text-red-300">How it works</Link>.
          The canonical XIs are editorial judgements, so reasonable fans will disagree with them.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Contact</h2>
        <p>
          Spotted a wrong fact, or have a question about the site? Email{" "}
          <a className="font-bold text-blood-600 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <p className="text-xs text-dune-600">{CREDITS}</p>
      <p className="text-xs text-dune-600">{DISCLAIMER}</p>
    </article>
  );
}
