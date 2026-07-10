import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { normalizeCanonical } from "../src/lib/canonicalHash";
import { RATING_FLOOR } from "../src/lib/h2h";
import { seasonsBetween } from "../src/lib/seasons";
import type { Ratings } from "../src/lib/types";
import { difficultyFor, generateClues } from "./clues";
import { buildEraKey, type CanonicalEra } from "./eras";
import type { Enrichment } from "./lfchistory";
import { enrichmentSubset } from "./lfchistory";
import { MANAGERS, type ManagerRecord } from "./managers";
import { playerSeasonRating } from "./ratings";
import type { SpinePlayer } from "./wikipedia";

/** Pipeline C — assemble committed /data JSON from cached pipeline outputs. */

const CACHE = join(__dirname, "cache");
// Liverpool is the first club; new clubs get their own data/clubs/<slug>/ dir.
const DATA = join(__dirname, "..", "data", "clubs", "liverpool");

function writeJson(name: string, value: unknown) {
  writeFileSync(join(DATA, name), JSON.stringify(value) + "\n");
  console.log(`wrote data/${name}`);
}

export function buildPlayersIndex(spine: SpinePlayer[]) {
  return spine.map((p) => {
    const lower = p.name.toLowerCase();
    const plain = normalizeCanonical(p.name);
    const surname = plain.split(" ").slice(-1)[0];
    return {
      id: p.id,
      name: p.name,
      search: [...new Set([lower, plain, surname])],
      years: [p.careerSpans[0][0], p.careerSpans[p.careerSpans.length - 1][1]] as [number, number],
    };
  });
}

/** Per-(player, season) H2H rating table. Floor-omitted — a missing entry means
 *  the rating floor, so the shipped table is effectively the notable subset. */
export function buildRatings(spine: SpinePlayer[], enrichment: Record<number, Enrichment>): Ratings {
  const out: Ratings = {};
  for (const p of spine) {
    const enr = p.lfchId != null ? enrichment[p.lfchId] : undefined;
    const first = p.careerSpans[0][0];
    const last = p.careerSpans[p.careerSpans.length - 1][1];
    const seasons: Record<string, number> = {};
    for (const label of seasonsBetween(first, last)) {
      const r = playerSeasonRating(p, parseInt(label), enr);
      if (r > RATING_FLOOR) seasons[label] = r;
    }
    if (Object.keys(seasons).length) out[p.id] = seasons;
  }
  return out;
}

/** Opponent clubs (H2H only): an authored mini-canonical (gitignored) → one
 *  eras.json, no roster/daily. Rated by the same formula as the home club so
 *  scorelines are fair. Skipped silently when the key is absent (public repo).
 *  Richen to a full club later by adding the usual files beside eras.json. */
function buildOpponent(club: string) {
  const key = join(__dirname, "canonical", `${club}.ts`);
  if (!existsSync(key)) return console.log(`canonical/${club}.ts not present — skipping ${club}`);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CANONICAL, MANAGERS: mgrs, ratingOf } = require(key) as {
    CANONICAL: CanonicalEra[];
    MANAGERS: ManagerRecord[];
    ratingOf: (playerId: string, season: string) => number;
  };
  const dir = join(__dirname, "..", "data", "clubs", club);
  mkdirSync(dir, { recursive: true });
  const eras = CANONICAL.map((e) => buildEraKey(e, club, ratingOf, mgrs));
  writeFileSync(join(dir, "eras.json"), JSON.stringify(eras) + "\n");
  console.log(`wrote data/clubs/${club}/eras.json (canonicalRating ${eras.map((e) => e.canonicalRating).join("/")})`);
}

export function buildAnswers(spine: SpinePlayer[], enrichment: Record<number, Enrichment>) {
  return enrichmentSubset(spine)
    .filter((p) => enrichment[p.lfchId!])
    .map((p) => ({
      id: p.id,
      name: p.name,
      difficulty: difficultyFor(p),
      clues: generateClues(p, enrichment[p.lfchId!]),
    }));
}

if (require.main === module) {
  const spine: SpinePlayer[] = JSON.parse(readFileSync(join(CACHE, "spine.json"), "utf8"));
  const enrichment: Record<number, Enrichment> = JSON.parse(readFileSync(join(CACHE, "enrichment.json"), "utf8"));

  mkdirSync(DATA, { recursive: true });

  writeJson("players-index.json", buildPlayersIndex(spine));
  const answers = buildAnswers(spine, enrichment);
  writeJson("answers.json", answers);

  const byDiff = [1, 2, 3, 4, 5].map((d) => answers.filter((a) => a.difficulty === d).length);
  console.log(`answers: ${answers.length} (difficulty 1..5: ${byDiff.join("/")})`);

  writeJson(
    "managers.json",
    MANAGERS.map(({ id, name, years }) => ({ id, name, years })),
  );

  const ratings = buildRatings(spine, enrichment);
  writeJson("ratings.json", ratings);
  console.log(`ratings: ${Object.keys(ratings).length} players with above-floor seasons`);
  const ratingOf = (playerId: string, season: string) => ratings[playerId]?.[season] ?? RATING_FLOOR;

  // eras.json needs the plaintext keys, which live only in gitignored canonical/
  if (existsSync(join(__dirname, "canonical", "index.ts"))) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { CANONICAL } = require("./canonical/index.ts") as { CANONICAL: CanonicalEra[] };
    const ids = new Set(spine.map((p) => p.id));
    for (const era of CANONICAL)
      for (const slot of era.slots)
        for (const p of slot)
          if (!ids.has(p.playerId)) throw new Error(`canonical ${era.slug}: unknown player ${p.playerId}`);
    writeJson("eras.json", CANONICAL.map((era) => buildEraKey(era, "liverpool", ratingOf)));
  } else {
    console.log("canonical/ not present — skipping eras.json (see pipeline/canonical/README.md)");
  }

  // H2H opponents — each ships only an all-time canonicalRating for now.
  buildOpponent("manchester-united");
}
