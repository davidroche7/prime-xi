import type { Metadata } from "next";
import { CONTACT_EMAIL, DISCLAIMER, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${SITE_NAME} handles your data: no accounts, device-local game storage, and how Google advertising cookies work on this site.`,
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6 text-sm leading-relaxed text-dune-600">
      <h1 className="font-display text-2xl uppercase tracking-tight text-ink-950">Privacy policy</h1>
      <p className="text-xs text-dune-600">Last updated: 1 November 2026</p>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">The short version</h2>
        <p>
          {SITE_NAME} has no accounts or sign-up, and we don&apos;t collect personal data ourselves. Your
          game progress lives only on your own device. Our advertising partner, Google, may use cookies
          as described below.
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
          This site uses Google AdSense to show ads. Third-party vendors, including Google, use cookies
          to serve ads based on your prior visits to this site and other websites. Google&apos;s use of
          advertising cookies enables it and its partners to serve ads to you based on those visits.
        </p>
        <p>
          You can opt out of personalised advertising in{" "}
          <a className="font-bold text-blood-600 hover:underline" href="https://www.google.com/settings/ads">Google Ads Settings</a>,
          and opt out of some third-party vendors&apos; cookies at{" "}
          <a className="font-bold text-blood-600 hover:underline" href="https://www.aboutads.info/choices/">aboutads.info</a>.
          See also{" "}
          <a className="font-bold text-blood-600 hover:underline" href="https://policies.google.com/technologies/partner-sites">how Google uses information from sites that use its services</a>.
        </p>
        <p>
          Your game data is never passed to advertisers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Contact</h2>
        <p>
          Questions about this policy: <a className="font-bold text-blood-600 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <p className="text-xs text-dune-600">{DISCLAIMER}</p>
    </article>
  );
}
