import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { getClubIndex } from "@/lib/data";
import { SITE_TAGLINE } from "@/lib/site";

export default function HomePage() {
  const clubs = getClubIndex().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <section className="py-8 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Build your club&apos;s <span className="text-emerald-400">greatest XI</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-zinc-400">
          {SITE_TAGLINE} Fixed budget, convex prices, deterministic rating out of 99. Eleven superstars are
          unaffordable — that&apos;s the point.
        </p>
        <Link
          href="/daily/"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-bold hover:bg-emerald-500"
        >
          Play today&apos;s daily puzzle →
        </Link>
      </section>

      <AdSlot id="home-top" />

      <section>
        <h2 className="mb-4 text-xl font-bold">Pick a club</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <li key={club.slug}>
              <Link
                href={`/club/${club.slug}/`}
                className="block rounded-xl border border-ink-700 bg-ink-900 p-4 transition hover:border-zinc-500"
              >
                <span className="mb-2 block h-1.5 w-10 rounded" style={{ backgroundColor: club.themeColour }} />
                <span className="block font-bold">{club.name}</span>
                <span className="block text-sm text-zinc-500">
                  {club.playerCount} peak seasons · {club.budget} credits
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 max-w-2xl text-sm leading-relaxed text-zinc-400">
        <h2 className="mb-2 text-lg font-bold text-zinc-200">How it works</h2>
        <p>
          Every player appears at one peak season, with a rating out of 99 and a price in credits. Prices grow
          steeply with rating, so a full XI of legends costs about a third more than your budget — building a
          great side means knowing which cult heroes punch above their price. Scoring is deterministic and
          rewards balance: same XI, same score, forever.
        </p>
      </section>
    </div>
  );
}
