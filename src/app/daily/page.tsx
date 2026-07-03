import type { Metadata } from "next";
import { getClubData, getClubIndex, getFormations } from "@/lib/data";
import { DailyClient } from "./DailyClient";

export const metadata: Metadata = {
  title: "Daily Puzzle",
  description:
    "One club, one budget, fresh constraints every day at 00:00 UTC. Build the best XI you can and share your score — same puzzle for everyone, everywhere.",
};

export default function DailyPage() {
  const marquee = getClubIndex().filter((c) => c.tier === "marquee");
  const clubs = Object.fromEntries(marquee.map((c) => [c.slug, getClubData(c.slug)]));
  const formations = getFormations();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Daily Puzzle</h1>
      <p className="mt-1 mb-6 text-sm text-zinc-400">
        Same club, budget and constraints for everyone. Resets 00:00 UTC.
      </p>
      <DailyClient clubs={clubs} formations={formations} />
    </div>
  );
}
