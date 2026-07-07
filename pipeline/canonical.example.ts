import type { CanonicalEra } from "./eras";

/**
 * TEMPLATE — copy into pipeline/canonical/ (gitignored) and fill with the real
 * answer keys. The repo is public: plaintext keys must never be committed; only
 * the salted hashes in /data/eras.json ship. pipeline/canonical/index.ts must
 * export `CANONICAL: CanonicalEra[]` (all three eras).
 *
 * Player ids match data/players-index.json; seasons are "YYYY-YY"; the manager's
 * peak season is computed from pipeline/managers.ts, not written here.
 */
export const example: CanonicalEra = {
  slug: "all-time",
  title: "The Greatest All-Time Liverpool XI",
  seasonRange: "1892 – today",
  formationId: "433",
  managerId: "bob-paisley",
  slots: [
    // GK — each slot accepts 1–3 players (equivalents), each with 1–2 defining seasons.
    // A player may appear in only ONE slot across the whole key.
    [
      { playerId: "fake-goalkeeper", seasons: ["1976-77", "1978-79"] },
      { playerId: "fake-modern-goalkeeper", seasons: ["2018-19"] },
    ],
    [{ playerId: "fake-right-back", seasons: ["2019-20"] }],
    [{ playerId: "fake-centre-back", seasons: ["2018-19"] }],
    [{ playerId: "fake-centre-back-2", seasons: ["1983-84"] }],
    [{ playerId: "fake-left-back", seasons: ["2019-20"] }],
    [{ playerId: "fake-midfielder", seasons: ["1980-81"] }],
    [{ playerId: "fake-midfielder-2", seasons: ["2005-06"] }],
    [{ playerId: "fake-midfielder-3", seasons: ["1987-88"] }],
    [{ playerId: "fake-winger", seasons: ["2017-18"] }],
    [{ playerId: "fake-striker", seasons: ["1983-84"] }],
    [{ playerId: "fake-forward", seasons: ["1979-80"] }],
  ],
};
