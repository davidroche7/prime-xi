import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { PROD_URL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Head-to-head — play your Perfect XI against rival clubs",
  description:
    "How head-to-head works: once you submit a Perfect XI, pit its hidden strength against Manchester United, Real Madrid, Bayern Munich and more — or against The Legends, the actual hidden XI.",
  alternates: { canonical: `${PROD_URL}/head-to-head/` },
  openGraph: {
    title: "Head-to-head — play your Perfect XI against rival clubs",
    url: `${SITE_URL}/head-to-head/`,
    images: ["/og.png"],
  },
};

const OPPONENTS = [
  "Manchester United", "Manchester City", "Arsenal", "Everton",
  "Real Madrid", "Barcelona", "Bayern Munich", "AC Milan", "Ajax",
];

export default function HeadToHeadPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6 text-sm leading-relaxed text-dune-600">
      <h1 className="font-display text-2xl uppercase tracking-tight text-ink-950">Head-to-head</h1>
      <p>
        Head-to-head is unlocked the moment you submit a Perfect XI. It takes the eleven (player,
        season) picks you just built and turns them into a single hidden number — your team&apos;s
        strength — then compares it against a rival club&apos;s hidden number for the same era.
      </p>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">What you see</h2>
        <p>
          A scoreline and a result — win, draw or loss. Nothing else. Your own rating is never shown,
          the rival&apos;s rating is never shown, and neither XI is ever shown. This is a single
          rating-versus-rating comparison, not a simulated match — there's no lineup playing out, no
          minute-by-minute, just one number against another.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Why your season picks matter</h2>
        <p>
          Every player in your build is rated for the exact season you chose for him, not his whole
          career. A legend picked in an off-year quietly weakens your team; the same legend in his
          defining season strengthens it. Getting the Perfect XI build right and getting the strongest
          head-to-head team are the same skill.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">The Legends — beat the actual answer</h2>
        <p>
          One opponent is different from the rest: <strong className="text-ink-950">The Legends</strong>.
          It isn't a rival club — it's this era&apos;s own hidden canonical XI, rated the same way as
          everything else. Beating it in head-to-head means your build, imperfect as it might still be
          on the strict letter of the key, is strong enough to beat the actual answer on merit.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg uppercase text-ink-950">Who you can play</h2>
        <p>
          Depending on the era, rivals include {OPPONENTS.join(", ")} — and The Legends. Every club is
          rated by the same offline formula as Liverpool, so a result is decided by the quality of your
          picks, not by which club has more data behind it.
        </p>
      </section>

      <div className="mx-auto max-w-xl">
        <AdSlot slot="head-to-head-below-prose" />
      </div>

      <p>
        Head-to-head only appears after a submission — read{" "}
        <Link href="/how-it-works/" className="font-semibold text-blood-600 hover:text-red-300">
          how the Perfect XI is scored
        </Link>{" "}
        first, then{" "}
        <Link href="/" className="font-semibold text-blood-600 hover:text-red-300">
          build one
        </Link>
        .
      </p>
    </article>
  );
}
