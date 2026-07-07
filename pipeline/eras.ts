import { canonicalHash } from "../src/lib/canonicalHash";
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
  formationId: string;
  managerId: string;
  /** 11 slots; each accepts 1–3 players, each player 1–2 defining seasons.
   *  Equivalence classes must never share a player across slots (greedy match). */
  slots: { playerId: string; seasons: string[] }[][];
}

export function buildEraKey(era: CanonicalEra): EraKey {
  const manager = MANAGERS.find((m) => m.id === era.managerId);
  if (!manager) throw new Error(`buildEraKey: unknown manager ${era.managerId}`);
  if (era.slots.length !== 11) throw new Error(`buildEraKey: ${era.slug} has ${era.slots.length} slots`);
  const seen = new Set<string>();
  for (const slot of era.slots)
    for (const p of slot) {
      if (seen.has(p.playerId)) throw new Error(`buildEraKey: ${p.playerId} appears in two slots`);
      seen.add(p.playerId);
    }

  return {
    slug: era.slug,
    title: era.title,
    seasonRange: era.seasonRange,
    hashes: {
      slots: era.slots.map((slot) => ({
        players: slot.map((p) => canonicalHash(era.slug, "player", p.playerId)),
        seasons: slot.flatMap((p) =>
          p.seasons.map((s) => canonicalHash(era.slug, "season", `${p.playerId}|${s}`)),
        ),
      })),
      manager: canonicalHash(era.slug, "manager", era.managerId),
      managerSeason: canonicalHash(
        era.slug,
        "manager-season",
        `${era.managerId}|${managerPeakSeason(manager.honours)}`,
      ),
      formation: canonicalHash(era.slug, "formation", era.formationId),
    },
  };
}
