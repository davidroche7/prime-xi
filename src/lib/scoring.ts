import type { Formation, FormationSlot, PlayerSeason, PositionGroup, TierLabel, XiEntry } from "./types";

/** §5.1 — pure, deterministic team scoring. */

export const POSITION_WEIGHTS: Record<PositionGroup, number> = {
  GK: 1.1,
  CB: 1.15,
  FB: 0.95,
  DM: 1.15,
  CM: 1.1,
  AM: 1.0,
  W: 1.0,
  ST: 1.05,
};

export const POSITION_FIT = { natural: 1.0, adjacent: 0.9, alien: 0.75 } as const;
export type Fit = keyof typeof POSITION_FIT;

/** Which groups count as "adjacent" to each other for position fit. Symmetric. */
const ADJACENT: Record<PositionGroup, readonly PositionGroup[]> = {
  GK: [],
  CB: ["FB", "DM"],
  FB: ["CB", "W"],
  DM: ["CB", "CM"],
  CM: ["DM", "AM"],
  AM: ["CM", "W", "ST"],
  W: ["FB", "AM", "ST"],
  ST: ["AM", "W"],
};

/** Fit of a player (any of their listed positions) against a slot group. */
export function fit(positions: readonly PositionGroup[], slotGroup: PositionGroup): Fit {
  if (positions.includes(slotGroup)) return "natural";
  if (positions.some((p) => ADJACENT[p].includes(slotGroup))) return "adjacent";
  return "alien";
}

export function effectiveRating(ps: PlayerSeason, slot: FormationSlot): number {
  return ps.rating * POSITION_FIT[fit(ps.positions, slot.group)];
}

export interface TeamScore {
  raw: number; // weighted average before penalty, ~1..99
  penalty: number; // 0..6
  penaltyReasons: string[];
  overall: number; // clamp(round(raw - penalty), 1, 99)
  tier: TierLabel;
}

interface SlottedPlayer {
  slot: FormationSlot;
  player: PlayerSeason;
}

function resolveXi(xi: readonly XiEntry[], formation: Formation): SlottedPlayer[] {
  return xi.map((entry) => {
    const slot = formation.slots.find((s) => s.slotId === entry.slotId);
    if (!slot) throw new Error(`Unknown slotId "${entry.slotId}" for formation ${formation.id}`);
    return { slot, player: entry.player };
  });
}

/** §5.1 balancePenalty — subtractive, capped at 6. */
export function balancePenalty(xi: readonly XiEntry[], formation: Formation): { penalty: number; reasons: string[] } {
  const slotted = resolveXi(xi, formation);
  let penalty = 0;
  const reasons: string[] = [];

  const cbs = slotted.filter((s) => s.slot.group === "CB");
  if (cbs.length > 0 && Math.min(...cbs.map((s) => s.player.rating)) < 75) {
    penalty += 3;
    reasons.push("Weak centre-back (weakest CB rated under 75)");
  }

  const spine = slotted.filter((s) => s.slot.group === "CM" || s.slot.group === "DM");
  if (!spine.some((s) => s.player.rating >= 80)) {
    penalty += 2;
    reasons.push("No central midfielder (CM/DM) rated 80+");
  }

  const outOfPosition = slotted.filter((s) => fit(s.player.positions, s.slot.group) !== "natural");
  if (outOfPosition.length > 3) {
    penalty += 2;
    reasons.push("More than 3 players out of natural position");
  }

  return { penalty: Math.min(penalty, 6), reasons };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function tierFor(overall: number): TierLabel {
  if (overall >= 96) return "GOAT";
  if (overall >= 92) return "Legendary";
  if (overall >= 87) return "Elite";
  if (overall >= 80) return "Continental";
  if (overall >= 70) return "Fan Favourite";
  return "Cult Hero";
}

/** Score a complete XI. Requires every formation slot to be filled exactly once. */
export function teamScore(xi: readonly XiEntry[], formation: Formation): TeamScore {
  if (xi.length !== formation.slots.length) {
    throw new Error(`XI has ${xi.length} players; formation ${formation.id} needs ${formation.slots.length}`);
  }
  const seen = new Set(xi.map((e) => e.slotId));
  if (seen.size !== xi.length) throw new Error("Duplicate slotId in XI");

  const slotted = resolveXi(xi, formation);
  let weighted = 0;
  let total = 0;
  for (const { slot, player } of slotted) {
    weighted += effectiveRating(player, slot) * POSITION_WEIGHTS[slot.group];
    total += POSITION_WEIGHTS[slot.group];
  }
  const raw = weighted / total;
  const { penalty, reasons } = balancePenalty(xi, formation);
  const overall = clamp(Math.round(raw - penalty), 1, 99);
  return { raw, penalty, penaltyReasons: reasons, overall, tier: tierFor(overall) };
}

/** Total cost of a (possibly partial) XI. */
export function xiCost(xi: readonly XiEntry[]): number {
  return Math.round(xi.reduce((sum, e) => sum + e.player.cost, 0) * 10) / 10;
}
