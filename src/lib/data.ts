import { existsSync, readdirSync, readFileSync } from "node:fs";
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

const clubName = (slug: string) => slug.replace(/(^|-)(\w)/g, (_, s, c) => (s ? " " : "") + c.toUpperCase());

/** H2H opponents whose canonical XI covers `eraSlug` — a display name + hidden
 *  rating. Any club dir with an eras.json (other than the one you're playing)
 *  is a candidate, so a new opponent auto-appears once its data is exported. */
export function getOpponents(club: string, eraSlug: string) {
  const clubsDir = join(DATA_DIR, "clubs");
  const rivals = readdirSync(clubsDir)
    .filter((c) => c !== club && existsSync(join(clubsDir, c, "eras.json")))
    .flatMap((c) => {
      const era = getEras(c).find((e) => e.slug === eraSlug);
      return era ? [{ club: c, name: clubName(c), canonicalRating: era.canonicalRating }] : [];
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // "The Legends" isn't a rival club — it's this era's own hidden canonical XI,
  // the exact team the build is scored against. Same rating-duel engine, but
  // beating it is beating the actual answer, not another club's number.
  const own = getEras(club).find((e) => e.slug === eraSlug);
  const legends = own ? [{ club: "legends", name: "The Legends", canonicalRating: own.canonicalRating }] : [];

  return [...legends, ...rivals];
}
