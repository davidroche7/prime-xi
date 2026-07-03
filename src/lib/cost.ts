import type { PositionGroup } from "./types";

/**
 * Cost is convex in rating so eleven superstars are unaffordable — that IS the game.
 * Computed OFFLINE by the pipeline and shipped in static JSON; the app only reads
 * `PlayerSeason.cost`. This module is imported by /pipeline (and by tests).
 */

export const COST_EXP = 3.2; // convexity — tuned during data prep (§5.2)
export const COST_MAX = 100;

const SCARCITY: Partial<Record<PositionGroup, number>> = {
  GK: 1.05,
  CB: 1.05,
  DM: 1.03,
};
const SCARCITY_DEFAULT = 1.0;

export function scarcityFor(primary: PositionGroup | undefined): number {
  return (primary && SCARCITY[primary]) ?? SCARCITY_DEFAULT;
}

/** Credits for a player-season, rounded to 1 decimal place. */
export function cost(rating: number, positions: readonly PositionGroup[]): number {
  const base = Math.pow(rating / 99, COST_EXP) * COST_MAX * scarcityFor(positions[0]);
  return Math.round(base * 10) / 10;
}
