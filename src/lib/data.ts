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

export const getFormations = () => readJson<Formation[]>("formations.json");
export const getPlayersIndex = () => readJson<IndexedPlayer[]>("players-index.json");
export const getAnswers = () => readJson<AnswerPlayer[]>("answers.json");
export const getManagers = () => readJson<Manager[]>("managers.json");
export const getEras = () => readJson<EraKey[]>("eras.json");
