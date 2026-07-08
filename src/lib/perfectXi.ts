import { canonicalHash } from "./canonicalHash";
import type { EraKey } from "./types";

/**
 * §Game B — scoring a blind build against the salted-hash canonical key.
 * Mastermind feedback only: totals and counts, never which picks matched.
 */

export interface XiBuild {
  picks: { playerId: string; season: string }[]; // 11 entries
  managerId: string;
  managerSeason: string;
  formationId: string;
}

export interface XiScore {
  total: number; // 0..98
  playersCorrect: number;
  seasonsCorrect: number;
  managerCorrect: boolean;
  managerSeasonCorrect: boolean;
  formationCorrect: boolean;
  perfect: boolean;
}

export function scoreBuild(build: XiBuild, era: EraKey): XiScore {
  // ponytail: greedy not Hungarian — equivalence classes never overlap across
  // slots in our keys (buildEraKey enforces it); revisit only if a key needs it
  const used = new Set<number>();
  let playersCorrect = 0;
  let seasonsCorrect = 0;
  for (const pick of build.picks) {
    const pHash = canonicalHash(era.club, era.slug, "player", pick.playerId);
    const i = era.hashes.slots.findIndex((s, idx) => !used.has(idx) && s.players.includes(pHash));
    if (i === -1) continue;
    used.add(i);
    playersCorrect++;
    const sHash = canonicalHash(era.club, era.slug, "season", `${pick.playerId}|${pick.season}`);
    if (era.hashes.slots[i].seasons.includes(sHash)) seasonsCorrect++;
  }

  const managerCorrect = canonicalHash(era.club, era.slug, "manager", build.managerId) === era.hashes.manager;
  const managerSeasonCorrect =
    managerCorrect &&
    canonicalHash(era.club, era.slug, "manager-season", `${build.managerId}|${build.managerSeason}`) ===
      era.hashes.managerSeason;
  const formationCorrect =
    canonicalHash(era.club, era.slug, "formation", build.formationId) === era.hashes.formation;

  const total =
    playersCorrect * 6 +
    seasonsCorrect * 2 +
    (managerCorrect ? 4 : 0) +
    (managerSeasonCorrect ? 2 : 0) +
    (formationCorrect ? 4 : 0);

  return { total, playersCorrect, seasonsCorrect, managerCorrect, managerSeasonCorrect, formationCorrect, perfect: total === 98 };
}
