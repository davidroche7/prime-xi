import { cost } from "../src/lib/cost";
import { fit } from "../src/lib/scoring";
import type { Club, ClubData, Formation, PlayerSeason } from "../src/lib/types";
import { seasonEndYear, type SeedClub } from "./seedTypes";
import { acMilan } from "./seed/ac-milan";
import { arsenal } from "./seed/arsenal";
import { barcelona } from "./seed/barcelona";
import { liverpool } from "./seed/liverpool";
import { manchesterUnited } from "./seed/manchester-united";
import { realMadrid } from "./seed/real-madrid";

export const SEED_CLUBS: SeedClub[] = [acMilan, arsenal, barcelona, liverpool, manchesterUnited, realMadrid];

export const FORMATIONS: Formation[] = [
  {
    id: "433",
    name: "4-3-3",
    slots: [
      { slotId: "gk", group: "GK", x: 50, y: 94 },
      { slotId: "fb-l", group: "FB", x: 12, y: 74 },
      { slotId: "cb-l", group: "CB", x: 35, y: 78 },
      { slotId: "cb-r", group: "CB", x: 65, y: 78 },
      { slotId: "fb-r", group: "FB", x: 88, y: 74 },
      { slotId: "dm", group: "DM", x: 50, y: 58 },
      { slotId: "cm-l", group: "CM", x: 28, y: 44 },
      { slotId: "cm-r", group: "CM", x: 72, y: 44 },
      { slotId: "w-l", group: "W", x: 15, y: 22 },
      { slotId: "w-r", group: "W", x: 85, y: 22 },
      { slotId: "st", group: "ST", x: 50, y: 10 },
    ],
  },
  {
    id: "442",
    name: "4-4-2",
    slots: [
      { slotId: "gk", group: "GK", x: 50, y: 94 },
      { slotId: "fb-l", group: "FB", x: 12, y: 74 },
      { slotId: "cb-l", group: "CB", x: 35, y: 78 },
      { slotId: "cb-r", group: "CB", x: 65, y: 78 },
      { slotId: "fb-r", group: "FB", x: 88, y: 74 },
      { slotId: "w-l", group: "W", x: 12, y: 42 },
      { slotId: "cm-l", group: "CM", x: 37, y: 48 },
      { slotId: "cm-r", group: "CM", x: 63, y: 48 },
      { slotId: "w-r", group: "W", x: 88, y: 42 },
      { slotId: "st-l", group: "ST", x: 36, y: 14 },
      { slotId: "st-r", group: "ST", x: 64, y: 14 },
    ],
  },
  {
    id: "4231",
    name: "4-2-3-1",
    slots: [
      { slotId: "gk", group: "GK", x: 50, y: 94 },
      { slotId: "fb-l", group: "FB", x: 12, y: 74 },
      { slotId: "cb-l", group: "CB", x: 35, y: 78 },
      { slotId: "cb-r", group: "CB", x: 65, y: 78 },
      { slotId: "fb-r", group: "FB", x: 88, y: 74 },
      { slotId: "dm-l", group: "DM", x: 36, y: 56 },
      { slotId: "dm-r", group: "DM", x: 64, y: 56 },
      { slotId: "w-l", group: "W", x: 14, y: 32 },
      { slotId: "am", group: "AM", x: 50, y: 36 },
      { slotId: "w-r", group: "W", x: 86, y: 32 },
      { slotId: "st", group: "ST", x: 50, y: 10 },
    ],
  },
];

const SUPERSTAR_RATIO = 1.35; // superstar XI should cost ~35% over budget (§5.2 target b)

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildPlayers(seed: SeedClub): PlayerSeason[] {
  return seed.players
    .map((sp) => ({
      id: `${slugify(sp.playerName)}-${seasonEndYear(sp.seasonLabel)}`,
      playerName: sp.playerName,
      clubId: seed.slug,
      seasonLabel: sp.seasonLabel,
      seasonEndYear: seasonEndYear(sp.seasonLabel),
      positions: sp.positions,
      rating: sp.rating,
      cost: cost(sp.rating, sp.positions),
      ...(sp.stats ? { stats: sp.stats } : {}),
      ...(sp.note ? { note: sp.note } : {}),
    }))
    .sort((a, b) => b.rating - a.rating || a.playerName.localeCompare(b.playerName));
}

/**
 * Cost of the "superstar XI": for each 4-3-3 slot, the priciest unused player who is
 * NATURAL in that group. Deterministic; greedy is fine for tuning purposes.
 */
export function superstarXiCost(players: PlayerSeason[]): number {
  const f433 = FORMATIONS[0];
  const used = new Set<string>();
  let total = 0;
  for (const slot of f433.slots) {
    const best = players
      .filter((p) => !used.has(p.id) && fit(p.positions, slot.group) === "natural")
      .sort((a, b) => b.cost - a.cost)[0];
    if (!best) throw new Error(`No natural ${slot.group} available for superstar XI`);
    used.add(best.id);
    total += best.cost;
  }
  return Math.round(total * 10) / 10;
}

/**
 * Tuning target (a) proxy: the best XI a player can actually afford. Start from the
 * cheapest natural per slot, then repeatedly apply the single upgrade with the best
 * rating gain per credit that stays within budget. Its spend should land at ~90-100%
 * of budget — i.e. a strong, well-balanced XI exhausts the budget.
 */
export function bestAffordableXi(
  players: PlayerSeason[],
  budget: number,
): { cost: number; avgRating: number } {
  const f433 = FORMATIONS[0];
  const chosen = new Map<string, PlayerSeason>(); // slotId -> player
  const naturals = (group: string) =>
    players.filter((p) => fit(p.positions, group as PlayerSeason["positions"][0]) === "natural");

  for (const slot of f433.slots) {
    const options = naturals(slot.group)
      .filter((p) => ![...chosen.values()].some((c) => c.id === p.id))
      .sort((a, b) => a.cost - b.cost);
    if (options.length === 0) throw new Error(`No natural ${slot.group} available`);
    chosen.set(slot.slotId, options[0]);
  }

  const spend = () => [...chosen.values()].reduce((s, p) => s + p.cost, 0);
  for (;;) {
    let best: { slotId: string; player: PlayerSeason; gainPerCredit: number } | null = null;
    const remaining = budget - spend();
    for (const slot of f433.slots) {
      const current = chosen.get(slot.slotId)!;
      for (const cand of naturals(slot.group)) {
        if ([...chosen.values()].some((c) => c.id === cand.id)) continue;
        const dCost = cand.cost - current.cost;
        const dRating = cand.rating - current.rating;
        if (dRating <= 0 || dCost > remaining) continue;
        const gainPerCredit = dCost <= 0 ? Infinity : dRating / dCost;
        if (!best || gainPerCredit > best.gainPerCredit) best = { slotId: slot.slotId, player: cand, gainPerCredit };
      }
    }
    if (!best) break;
    chosen.set(best.slotId, best.player);
  }

  const picks = [...chosen.values()];
  return {
    cost: Math.round(spend() * 10) / 10,
    avgRating: Math.round((picks.reduce((s, p) => s + p.rating, 0) / picks.length) * 10) / 10,
  };
}

export function deriveBudget(players: PlayerSeason[]): number {
  return Math.round(superstarXiCost(players) / SUPERSTAR_RATIO / 5) * 5;
}

export function buildClubData(seed: SeedClub): ClubData {
  const players = buildPlayers(seed);
  const club: Club = {
    id: seed.slug,
    slug: seed.slug,
    name: seed.name,
    aliases: seed.aliases,
    tier: seed.tier,
    themeColour: seed.themeColour,
    budget: deriveBudget(players),
  };
  return { club, players };
}

export interface TuningRow {
  slug: string;
  budget: number;
  superstar: number;
  superstarPctOfBudget: number; // want ~130-140
  bestAffordable: number;
  bestAffordablePct: number; // want ~90-100
  bestAvgRating: number;
  playerCount: number;
}

export function tuningReport(): TuningRow[] {
  return SEED_CLUBS.map((seed) => {
    const { club, players } = buildClubData(seed);
    const superstar = superstarXiCost(players);
    const best = bestAffordableXi(players, club.budget);
    return {
      slug: club.slug,
      budget: club.budget,
      superstar,
      superstarPctOfBudget: Math.round((superstar / club.budget) * 100),
      bestAffordable: best.cost,
      bestAffordablePct: Math.round((best.cost / club.budget) * 100),
      bestAvgRating: best.avgRating,
      playerCount: players.length,
    };
  });
}
