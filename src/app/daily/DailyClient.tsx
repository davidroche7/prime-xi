"use client";

import { useEffect, useState } from "react";
import { Builder } from "@/components/Builder";
import { puzzleForDate, type DailyPuzzle } from "@/lib/dailyPuzzle";
import { utcDateString } from "@/lib/prng";
import type { ClubData, Formation } from "@/lib/types";

interface DailyClientProps {
  clubs: Record<string, ClubData>; // marquee clubs keyed by slug
  formations: Formation[];
}

interface Streak {
  lastPlayed: string; // "YYYY-MM-DD"
  count: number;
}

function readStreak(): Streak | null {
  try {
    const raw = localStorage.getItem("prime-xi:streak");
    return raw ? (JSON.parse(raw) as Streak) : null;
  } catch {
    return null;
  }
}

export function DailyClient({ clubs, formations }: DailyClientProps) {
  // Computed after mount: the puzzle depends on the visitor's current UTC date,
  // which must not run during static prerender.
  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);

  useEffect(() => {
    const date = utcDateString();
    const marquee = Object.values(clubs).map((c) => ({ slug: c.club.slug, budget: c.club.budget }));
    setPuzzle(puzzleForDate(date, marquee));
    setStreak(readStreak());
  }, [clubs]);

  const onScored = () => {
    if (!puzzle) return;
    const prev = readStreak();
    if (prev?.lastPlayed === puzzle.dateUTC) return;
    const yesterday = new Date(Date.parse(puzzle.dateUTC) - 86400000).toISOString().slice(0, 10);
    const next: Streak = {
      lastPlayed: puzzle.dateUTC,
      count: prev?.lastPlayed === yesterday ? prev.count + 1 : 1,
    };
    try {
      localStorage.setItem("prime-xi:streak", JSON.stringify(next));
    } catch {
      // storage unavailable — streaks are optional
    }
    setStreak(next);
  };

  if (!puzzle) {
    return <div className="rounded-xl border border-ink-700 bg-ink-900 p-8 text-center text-zinc-400">Loading today&apos;s puzzle…</div>;
  }

  const data = clubs[puzzle.clubSlug];
  if (!data) return <div className="text-red-400">Missing club data for today&apos;s puzzle.</div>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="font-bold text-emerald-400">{puzzle.dateUTC}</span>
        <span>
          Today&apos;s club: <strong>{data.club.name}</strong>
        </span>
        <span>
          Budget: <strong>{puzzle.budget}</strong> credits
        </span>
        {streak ? (
          <span className="text-amber-300">
            🔥 {streak.count}-day streak
          </span>
        ) : null}
      </div>
      <Builder data={data} formations={formations} puzzle={puzzle} onScored={onScored} />
    </div>
  );
}
