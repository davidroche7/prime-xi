/**
 * §Head-to-head — after building an XI you can pit its team rating against a
 * rival club's hidden canonical team rating for the same era. Pure + deterministic.
 *
 * This file only aggregates and compares numbers — it never sees which players,
 * so the pipeline reuses `teamRating` to precompute each club+era canonical's
 * rating offline, and the client uses it on your own picks. Neither side ever
 * exposes the other's XI: the opponent is a single number behind a scoreline.
 */

/** Aggregate 11 player-season ratings into one team strength (0–99). */
export function teamRating(seasonRatings: number[]): number {
  if (seasonRatings.length === 0) return 0;
  const mean = seasonRatings.reduce((a, b) => a + b, 0) / seasonRatings.length;
  return Math.round(mean);
}

export interface MatchResult {
  outcome: "W" | "D" | "L"; // from your perspective
  scoreline: string; // "yours-theirs", e.g. "1-0"
}

/**
 * Map the rating gap to a football scoreline, from your side. Calibrated so a
 * 1-point edge is a 1–0 win; bigger gaps widen the margin and clean the loser's
 * sheet. ponytail: invented mapping — tune freely, it has no other callers.
 */
export function matchResult(yourRating: number, rivalRating: number): MatchResult {
  const diff = yourRating - rivalRating;
  if (diff === 0) return { outcome: "D", scoreline: "1-1" };
  const gap = Math.abs(diff);
  const winnerGoals = 1 + Math.min(Math.floor(gap / 5), 4); // 1..5
  const loserGoals = Math.max(0, winnerGoals - 1 - Math.floor(gap / 10));
  const [yours, theirs] = diff > 0 ? [winnerGoals, loserGoals] : [loserGoals, winnerGoals];
  return { outcome: diff > 0 ? "W" : "L", scoreline: `${yours}-${theirs}` };
}
