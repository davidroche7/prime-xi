import type { ClubTier, PositionGroup } from "../src/lib/types";

/** A curated player-season before cost/id derivation. */
export interface SeedPlayer {
  playerName: string;
  seasonLabel: string; // "2013-14"
  positions: PositionGroup[]; // [0] = primary
  rating: number; // 1..99 editorial estimate
  stats?: { apps?: number; goals?: number; assists?: number };
  note?: string;
}

export interface SeedClub {
  slug: string;
  name: string;
  aliases: string[];
  tier: ClubTier;
  themeColour: string; // generic accent, NOT an official club colour claim
  players: SeedPlayer[];
}

/** Compact helper: p(name, "2013-14", ["W","AM"], 93, {apps, goals}, note?) */
export function p(
  playerName: string,
  seasonLabel: string,
  positions: PositionGroup[],
  rating: number,
  stats?: SeedPlayer["stats"],
  note?: string,
): SeedPlayer {
  return { playerName, seasonLabel, positions, rating, stats, note };
}

export function seasonEndYear(seasonLabel: string): number {
  const start = Number(seasonLabel.slice(0, 4));
  if (!Number.isInteger(start)) throw new Error(`Bad season label: ${seasonLabel}`);
  return start + 1;
}
