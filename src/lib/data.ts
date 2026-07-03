import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ClubData, Formation } from "./types";

/**
 * Build-time-only readers for the static JSON in /data. With `output: 'export'` these
 * run during `next build` (SSG) — never on a server in production.
 */

const DATA_DIR = join(process.cwd(), "data");

export interface ClubIndexEntry {
  id: string;
  slug: string;
  name: string;
  tier: "marquee" | "longtail";
  themeColour: string;
  budget: number;
  playerCount: number;
}

export function getClubIndex(): ClubIndexEntry[] {
  return JSON.parse(readFileSync(join(DATA_DIR, "index.json"), "utf8"));
}

export function getClubSlugs(): string[] {
  return readdirSync(join(DATA_DIR, "clubs"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

export function getClubData(slug: string): ClubData {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Bad club slug: ${slug}`);
  return JSON.parse(readFileSync(join(DATA_DIR, "clubs", `${slug}.json`), "utf8"));
}

export function getFormations(): Formation[] {
  return JSON.parse(readFileSync(join(DATA_DIR, "formations.json"), "utf8"));
}
