"use client";

import { useEffect, useState } from "react";
import type { TeamScore } from "@/lib/scoring";
import { TierBadge } from "./TierBadge";

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      left: (i * 37 + 13) % 100,
      delay: ((i * 53) % 20) / 10,
      emoji: ["🏆", "⭐", "🎉", "✨"][i % 4],
    })),
  );
  return (
    <>
      {pieces.map((p, i) => (
        <span key={i} className="confetti-piece" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s` }}>
          {p.emoji}
        </span>
      ))}
    </>
  );
}

export function ScorePanel({ score, filled, total }: { score: TeamScore | null; filled: number; total: number }) {
  const [celebrate, setCelebrate] = useState(false);
  const isGoat = score?.tier === "GOAT";

  useEffect(() => {
    if (isGoat) {
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 4000);
      return () => clearTimeout(t);
    }
  }, [isGoat]);

  if (!score) {
    return (
      <div className="rounded-xl border border-ink-700 bg-ink-900 p-4 text-center text-sm text-zinc-400">
        Fill all {total} positions to rate your XI ({filled}/{total})
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900 p-4 text-center">
      {celebrate ? <Confetti /> : null}
      <div className="text-5xl font-black tabular-nums">
        {score.overall}
        <span className="text-xl font-semibold text-zinc-500">/99</span>
      </div>
      <div className="mt-2">
        <TierBadge tier={score.tier} />
      </div>
      {score.penalty > 0 ? (
        <ul className="mt-3 space-y-1 text-left text-xs text-amber-300">
          {score.penaltyReasons.map((r) => (
            <li key={r}>−&nbsp;{r}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-emerald-400">Balanced side — no penalties</p>
      )}
    </div>
  );
}
