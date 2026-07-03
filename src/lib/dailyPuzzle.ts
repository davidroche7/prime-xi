import { hashString, mulberry32, pick, pickN } from "./prng";
import type { XiEntry } from "./types";

/**
 * §7 — deterministic daily puzzle. Same puzzle worldwide, resets 00:00 UTC.
 * No server: the seed is the UTC date string.
 */

export type ConstraintId =
  | "no-player-after-2010"
  | "one-per-decade"
  | "pre-premier-league-era"
  | "reduced-budget";

export interface Constraint {
  id: ConstraintId;
  label: string;
  /** Multiply the day's budget by this (1 = unchanged). */
  budgetFactor: number;
  /** Pure check over a (possibly partial) XI. Returns violation messages, empty = ok. */
  violations(xi: readonly XiEntry[]): string[];
}

export const CONSTRAINT_POOL: readonly Constraint[] = [
  {
    id: "no-player-after-2010",
    label: "Old school: no player-season ending after 2010",
    budgetFactor: 1,
    violations: (xi) =>
      xi
        .filter((e) => e.player.seasonEndYear > 2010)
        .map((e) => `${e.player.playerName} (${e.player.seasonLabel}) is after 2010`),
  },
  {
    id: "one-per-decade",
    label: "Time traveller: max one player per decade",
    budgetFactor: 1,
    violations: (xi) => {
      const byDecade = new Map<number, string[]>();
      for (const e of xi) {
        const decade = Math.floor(e.player.seasonEndYear / 10) * 10;
        byDecade.set(decade, [...(byDecade.get(decade) ?? []), e.player.playerName]);
      }
      return [...byDecade.entries()]
        .filter(([, names]) => names.length > 1)
        .map(([decade, names]) => `${decade}s has ${names.length} players (${names.join(", ")})`);
    },
  },
  {
    id: "pre-premier-league-era",
    label: "Black and white: at least three player-seasons ending before 1993",
    budgetFactor: 1,
    violations: (xi) => {
      if (xi.length < 11) return []; // only enforceable on a full XI
      const n = xi.filter((e) => e.player.seasonEndYear < 1993).length;
      return n >= 3 ? [] : [`Only ${n} pre-1993 player-season(s); need at least 3`];
    },
  },
  {
    id: "reduced-budget",
    label: "Austerity: budget cut by 15%",
    budgetFactor: 0.85,
    violations: () => [],
  },
];

export interface DailyPuzzle {
  dateUTC: string; // "YYYY-MM-DD"
  clubSlug: string; // a marquee club slug
  budget: number; // club budget after constraint factors, rounded
  constraints: Constraint[];
}

/**
 * Deterministic puzzle for a UTC date.
 * `marqueeClubs` must be the stable, sorted list of { slug, budget } for marquee clubs
 * (sorted by slug by the caller/pipeline so ordering never depends on file order).
 */
export function puzzleForDate(
  dateUTC: string,
  marqueeClubs: readonly { slug: string; budget: number }[],
): DailyPuzzle {
  if (marqueeClubs.length === 0) throw new Error("puzzleForDate: no marquee clubs");
  const sorted = [...marqueeClubs].sort((a, b) => (a.slug < b.slug ? -1 : 1));
  const rng = mulberry32(hashString(dateUTC));

  const club = pick(rng, sorted);
  const constraintCount = Math.floor(rng() * 3); // 0, 1 or 2
  const constraints = pickN(rng, CONSTRAINT_POOL, constraintCount);

  const budgetFactor = constraints.reduce((f, c) => f * c.budgetFactor, 1);
  const budget = Math.round(club.budget * budgetFactor);

  return { dateUTC, clubSlug: club.slug, budget, constraints: [...constraints] };
}

/** All violation messages for an XI under a puzzle's constraints. Empty = valid. */
export function puzzleViolations(puzzle: DailyPuzzle, xi: readonly XiEntry[]): string[] {
  return puzzle.constraints.flatMap((c) => c.violations(xi));
}
