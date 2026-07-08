import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { AnswerPlayer, EraKey, Formation, IndexedPlayer, Manager, Ratings } from "./types";

/**
 * Build-time-only readers for the static JSON in /data. With `output: 'export'` these
 * run during `next build` (SSG) — never on a server in production.
 */

const DATA_DIR = join(process.cwd(), "data");

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(DATA_DIR, name), "utf8"));
}
function readClubJson<T>(club: string, name: string): T {
  return JSON.parse(readFileSync(join(DATA_DIR, "clubs", club, name), "utf8"));
}

export const getFormations = () => readJson<Formation[]>("formations.json"); // shared across clubs
export const getPlayersIndex = (club: string) => readClubJson<IndexedPlayer[]>(club, "players-index.json");
export const getAnswers = (club: string) => readClubJson<AnswerPlayer[]>(club, "answers.json");
export const getManagers = (club: string) => readClubJson<Manager[]>(club, "managers.json");
export const getEras = (club: string) => readClubJson<EraKey[]>(club, "eras.json");
export const getRatings = (club: string) => readClubJson<Ratings>(club, "ratings.json");

/** Rival clubs offered for head-to-head. Opponent-only for now — each ships just
 *  an eras.json (canonicalRating), no roster. Add slugs here as clubs land. */
const OPPONENT_CLUBS = ["manchester-united"];

const clubName = (slug: string) => slug.replace(/(^|-)(\w)/g, (_, s, c) => (s ? " " : "") + c.toUpperCase());

/** H2H opponents whose canonical XI covers `eraSlug` — a display name + hidden rating. */
export function getOpponents(club: string, eraSlug: string) {
  return OPPONENT_CLUBS.filter((c) => c !== club)
    .filter((c) => existsSync(join(DATA_DIR, "clubs", c, "eras.json")))
    .flatMap((c) => {
      const era = getEras(c).find((e) => e.slug === eraSlug);
      return era ? [{ club: c, name: clubName(c), canonicalRating: era.canonicalRating }] : [];
    });
}
