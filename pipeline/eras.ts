import { canonicalHash } from "../src/lib/canonicalHash";
import { teamRating } from "../src/lib/h2h";
import type { EraKey } from "../src/lib/types";
import { MANAGERS, managerPeakSeason } from "./managers";

/**
 * Turns a plaintext canonical era key (gitignored, pipeline/canonical/) into
 * the salted-hash EraKey that ships in /data/eras.json.
 */

export interface CanonicalEra {
  slug: "all-time" | "post-war" | "premier-league";
  title: string;
  seasonRange: string;
  fromYear: number;
  formationId: string;
  managerId: string;
  /** 11 slots; each accepts 1–3 players, each player 1–2 defining seasons.
   *  Equivalence classes must never share a player across slots (greedy match). */
  slots: { playerId: string; seasons: string[] }[][];
}

/**
 * @param club owning club slug (part of the hash salt). Defaults to liverpool;
 *   the export passes it explicitly per club.
 * @param ratingOf per-(player, season) rating lookup; used to precompute the
 *   canonical XI's team rating for head-to-head. Defaults to 0 (tests don't need it).
 */
export function buildEraKey(
  era: CanonicalEra,
  club = "liverpool",
  ratingOf: (playerId: string, season: string) => number = () => 0,
): EraKey {
  const manager = MANAGERS.find((m) => m.id === era.managerId);
  if (!manager) throw new Error(`buildEraKey: unknown manager ${era.managerId}`);
  if (era.slots.length !== 11) throw new Error(`buildEraKey: ${era.slug} has ${era.slots.length} slots`);
  const seen = new Set<string>();
  for (const slot of era.slots)
    for (const p of slot) {
      if (seen.has(p.playerId)) throw new Error(`buildEraKey: ${p.playerId} appears in two slots`);
      seen.add(p.playerId);
      for (const s of p.seasons)
        if (parseInt(s) < era.fromYear)
          throw new Error(`buildEraKey: ${era.slug}: ${p.playerId} season ${s} predates era start ${era.fromYear}`);
    }
  const peak = managerPeakSeason(manager.honours);
  if (parseInt(peak) < era.fromYear)
    throw new Error(`buildEraKey: ${era.slug}: manager peak ${peak} predates era start ${era.fromYear}`);

  // canonical team rating = the primary (first) player-season of each of the 11 slots
  const canonicalRating = teamRating(era.slots.map((slot) => ratingOf(slot[0].playerId, slot[0].seasons[0])));

  return {
    club,
    slug: era.slug,
    title: era.title,
    seasonRange: era.seasonRange,
    fromYear: era.fromYear,
    canonicalRating,
    hashes: {
      slots: era.slots.map((slot) => ({
        players: slot.map((p) => canonicalHash(club, era.slug, "player", p.playerId)),
        seasons: slot.flatMap((p) =>
          p.seasons.map((s) => canonicalHash(club, era.slug, "season", `${p.playerId}|${s}`)),
        ),
      })),
      manager: canonicalHash(club, era.slug, "manager", era.managerId),
      managerSeason: canonicalHash(club, era.slug, "manager-season", `${era.managerId}|${peak}`),
      formation: canonicalHash(club, era.slug, "formation", era.formationId),
    },
  };
}
