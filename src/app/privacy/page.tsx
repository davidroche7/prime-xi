import type { Metadata } from "next";
import { DISCLAIMER, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${SITE_NAME} handles your data: no accounts, no personal data collected, optional device-local storage only.`,
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6 text-sm leading-relaxed text-dune-600">
      <h1 className="font-display text-2xl uppercase tracking-tight text-ink-950">Privacy policy</h1>
      <p className="text-xs text-dune-600">Last updated: 10 July 2026</p>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">The short version</h2>
        <p>
          {SITE_NAME} has no accounts, no sign-up, and collects no personal data. Your game progress
          lives only on your own device.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Data stored on your device</h2>
        <p>
          The games optionally use your browser&apos;s localStorage to remember streaks, best scores,
          and today&apos;s puzzle state. This data never leaves your device, is not required to play,
          and clearing your browser data removes it entirely.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Analytics</h2>
        <p>
          We use privacy-respecting, cookieless analytics (Cloudflare Web Analytics and/or Plausible)
          to count visits in aggregate. These tools set no cookies, store no personal information, and
          do not track you across sites.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Advertising</h2>
        <p>
          If advertising is enabled, ads are served by Google AdSense, which may use cookies or device
          identifiers subject to your consent where the law requires it (you will be asked before any
          such cookies are set). We do not pass any personal or game data to advertisers — the site
          holds none to pass.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Contact</h2>
        <p>
          Questions about this policy: <a className="font-bold text-blood-600 hover:underline" href="mailto:davidroche1979@gmail.com">davidroche1979@gmail.com</a>.
        </p>
      </section>

      <p className="text-xs text-dune-600">{DISCLAIMER}</p>
    </article>
  );
}
