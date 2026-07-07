export type PositionGroup = "GK" | "CB" | "FB" | "DM" | "CM" | "AM" | "W" | "ST";

export interface FormationSlot {
  slotId: string;
  group: PositionGroup;
  x: number; // 0..100, left→right
  y: number; // 0..100, top (attack) → bottom (GK)
}

export interface Formation {
  id: string;
  name: string; // e.g. "4-3-3"
  slots: FormationSlot[];
}

/** One entry in /data/players-index.json — every player in club history. */
export interface IndexedPlayer {
  id: string;
  name: string;
  /** lowercase strings matched by the autocomplete (name variants) */
  search: string[];
  /** first and last year of their Liverpool career, e.g. [1990, 1999] */
  years: [number, number];
}

/** One entry in /data/answers.json — the Guess the Red answer pool. */
export interface AnswerPlayer {
  id: string;
  name: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  clues: string[]; // exactly 6, hardest → easiest
}

/** One entry in /data/managers.json. */
export interface Manager {
  id: string;
  name: string;
  years: string; // "1959–1974"
}

/** One entry in /data/eras.json — canonical key shipped as salted hashes only. */
export interface EraKey {
  slug: string;
  title: string;
  seasonRange: string; // human label, e.g. "1892 – today"
  fromYear: number; // era window start — pickers only offer players/managers/seasons from here on
  hashes: {
    slots: { players: string[]; seasons: string[] }[]; // 11 entries
    manager: string;
    managerSeason: string;
    formation: string;
  };
}
