import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { AnswerPlayer, EraKey, Formation, IndexedPlayer, Manager } from "./types";

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
