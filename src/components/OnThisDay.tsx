"use client";

import { useEffect, useState } from "react";
import { nextBirthdayAfter, playersBornOn } from "@/lib/onThisDay";
import type { IndexedPlayer } from "@/lib/types";

interface OnThisDayProps {
  players: IndexedPlayer[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatMonthDay(monthDay: string): string {
  const [m, d] = monthDay.split("-").map(Number);
  return `${d} ${MONTH_NAMES[m - 1]}`;
}

export function OnThisDay({ players }: OnThisDayProps) {
  // Computed after mount — depends on the visitor's date, must not run during prerender.
  const [monthDay, setMonthDay] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setMonthDay(`${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`);
  }, []);

  if (!monthDay) {
    return (
      <div className="shadow-poster-sm border-[3px] border-ink-950 bg-paper-50 p-8 text-center font-bold text-dune-600">
        Checking today&apos;s date…
      </div>
    );
  }

  const born = playersBornOn(players, monthDay);

  if (born.length === 0) {
    const next = nextBirthdayAfter(players, monthDay);
    return (
      <div className="shadow-poster-sm border-[3px] border-ink-950 bg-paper-50 p-6 text-center">
        <p className="font-bold text-dune-600">No Liverpool birthdays on {formatMonthDay(monthDay)}.</p>
        {next ? (
          <p className="mt-2 text-sm text-dune-600">
            Next up: <span className="font-bold text-ink-950">{next.player.name}</span>, born{" "}
            {formatMonthDay(next.monthDay)}
            {next.player.birthYear ? ` ${next.player.birthYear}` : ""}.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-bold text-dune-600">Born on {formatMonthDay(monthDay)}</p>
      <ul className="space-y-2">
        {born.map((p) => (
          <li
            key={p.id}
            className="shadow-poster-sm flex items-center justify-between gap-3 border-[3px] border-ink-950 bg-paper-50 p-3"
          >
            <span>
              <span className="font-display text-sm uppercase">{p.name}</span>
              <span className="ml-2 text-xs font-bold text-dune-600">
                {p.years[0]}–{p.years[1]}
                {p.birthYear ? ` · b. ${p.birthYear}` : ""}
              </span>
            </span>
            <span className="text-xs font-bold text-dune-600">
              {p.apps} apps{p.goals ? ` · ${p.goals} goals` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
