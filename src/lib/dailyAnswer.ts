import { hashString, mulberry32 } from "./prng";

/**
 * §Game A — deterministic daily answer. Same player worldwide, resets 00:00 UTC,
 * no repeats within a full cycle of the pool (fixed-seed permutation + day index).
 */

const EPOCH_UTC = Date.UTC(2026, 0, 1);

export type Mode = "normal" | "hard";

export function dayNumber(dateUTC: string): number {
  return Math.floor((Date.parse(`${dateUTC}T00:00:00Z`) - EPOCH_UTC) / 86400000);
}

export function dailyAnswerId(
  dateUTC: string,
  pool: readonly { id: string; difficulty: number }[],
  mode: Mode,
): string {
  const eligible = pool
    .filter((p) => (mode === "normal" ? p.difficulty <= 3 : p.difficulty >= 3))
    .map((p) => p.id)
    .sort(); // stable regardless of input order
  if (eligible.length === 0) throw new Error(`dailyAnswerId: empty ${mode} pool`);

  // fixed-seed Fisher-Yates permutation — the schedule, not a per-day pick
  const rng = mulberry32(hashString(`guess-the-red-v1|${mode}`));
  for (let i = eligible.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
  }

  const day = dayNumber(dateUTC);
  return eligible[((day % eligible.length) + eligible.length) % eligible.length];
}
