import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { AnswerPlayer, EraKey, Formation, IndexedPlayer, Manager, Ratings } from "../../src/lib/types";

/** Validates the committed static JSON in /data — the app's only data source. */

const DATA = join(__dirname, "..", "..", "data");
const CLUB = join(DATA, "clubs", "liverpool");
const read = <T>(f: string) => JSON.parse(readFileSync(join(DATA, f), "utf8")) as T;
const readClub = <T>(f: string) => JSON.parse(readFileSync(join(CLUB, f), "utf8")) as T;

const index = readClub<IndexedPlayer[]>("players-index.json");
const answers = readClub<AnswerPlayer[]>("answers.json");
const formations = read<Formation[]>("formations.json"); // shared across clubs, stays at data/

describe("players-index.json", () => {
  it("covers the complete roster (≥ 800 players)", () => {
    expect(index.length).toBeGreaterThanOrEqual(800);
  });
  it("ids are unique and url-safe", () => {
    expect(new Set(index.map((p) => p.id)).size).toBe(index.length);
    for (const p of index) expect(p.id).toMatch(/^[a-z0-9-]+$/);
  });
  it("every entry has search names and a valid year range", () => {
    for (const p of index) {
      expect(p.search.length).toBeGreaterThanOrEqual(1);
      expect(p.years[0]).toBeGreaterThanOrEqual(1892);
      expect(p.years[1]).toBeGreaterThanOrEqual(p.years[0]);
    }
  });
});

describe("answers.json", () => {
  it("has a playable pool (≥ 250) with both normal and hard coverage", () => {
    expect(answers.length).toBeGreaterThanOrEqual(250);
    expect(answers.filter((a) => a.difficulty <= 3).length).toBeGreaterThanOrEqual(100);
    expect(answers.filter((a) => a.difficulty >= 3).length).toBeGreaterThanOrEqual(50);
  });
  it("every answer has exactly 6 substantial clues that never name the player", () => {
    for (const a of answers) {
      expect(a.clues).toHaveLength(6);
      const surname = a.name.toLowerCase().split(" ").slice(-1)[0];
      for (const c of a.clues) {
        expect(c.length).toBeGreaterThan(10);
        if (surname.length > 3) expect(c.toLowerCase()).not.toContain(surname);
      }
    }
  });
  it("answers are a subset of the index with matching names", () => {
    const byId = new Map(index.map((p) => [p.id, p.name]));
    for (const a of answers) expect(byId.get(a.id)).toBe(a.name);
  });
  it("difficulty is 1..5", () => {
    for (const a of answers) expect([1, 2, 3, 4, 5]).toContain(a.difficulty);
  });
});

describe("formations.json", () => {
  it("every formation has 11 unique-slot entries and one GK", () => {
    for (const f of formations) {
      expect(f.slots).toHaveLength(11);
      expect(new Set(f.slots.map((s) => s.slotId)).size).toBe(11);
      expect(f.slots.filter((s) => s.group === "GK")).toHaveLength(1);
    }
  });
});

// canonical artefacts — validated once they exist.
const hasEras = existsSync(join(CLUB, "eras.json"));
describe.runIf(hasEras)("eras.json + managers.json", () => {
  // describe bodies run at collection even when skipped — read lazily
  const eras = () => readClub<EraKey[]>("eras.json");
  const managers = () => readClub<Manager[]>("managers.json");

  it("three era keys with 11 hashed slots each and no plaintext", () => {
    expect(eras().map((e) => e.slug).sort()).toEqual(["all-time", "post-war", "premier-league"]);
    for (const e of eras()) {
      expect(e.club).toBe("liverpool");
      expect(e.canonicalRating).toBeGreaterThanOrEqual(30); // H2H strength ships, reveals no players
      expect(e.canonicalRating).toBeLessThanOrEqual(99);
      expect(e.fromYear).toBeGreaterThanOrEqual(1892); // era window start ships with the key
      expect(e.hashes.slots).toHaveLength(11);
      for (const s of e.hashes.slots) {
        expect(s.players.length).toBeGreaterThanOrEqual(1);
        expect(s.seasons.length).toBeGreaterThanOrEqual(1);
        for (const h of [...s.players, ...s.seasons]) expect(h).toMatch(/^[0-9a-z]+$/);
      }
      expect(JSON.stringify(e)).not.toMatch(/dalglish|gerrard|salah/i); // spot-check: no plaintext leak
    }
  });

  it("managers list is substantial and unique", () => {
    expect(managers().length).toBeGreaterThanOrEqual(15);
    expect(new Set(managers().map((m) => m.id)).size).toBe(managers().length);
  });
});

// H2H opponent clubs ship only an all-time eras.json (one canonicalRating, no roster).
const MAN_UTD = join(DATA, "clubs", "manchester-united");
const hasOpponent = existsSync(join(MAN_UTD, "eras.json"));
describe.runIf(hasOpponent)("opponent club: manchester-united", () => {
  const eras = () => JSON.parse(readFileSync(join(MAN_UTD, "eras.json"), "utf8")) as EraKey[];

  it("ships a valid all-time key: rated, hashed, no plaintext", () => {
    const all = eras();
    expect(all.map((e) => e.slug)).toEqual(["all-time"]); // opponent-only: all-time era only for now
    for (const e of all) {
      expect(e.club).toBe("manchester-united"); // own club slug → hashes never collide with Liverpool's
      expect(e.canonicalRating).toBeGreaterThanOrEqual(30);
      expect(e.canonicalRating).toBeLessThanOrEqual(99);
      expect(e.hashes.slots).toHaveLength(11);
      for (const s of e.hashes.slots) for (const h of [...s.players, ...s.seasons]) expect(h).toMatch(/^[0-9a-z]+$/);
      expect(JSON.stringify(e)).not.toMatch(/schmeichel|charlton|ronaldo|ferguson/i); // no plaintext leak
    }
  });
});

const hasRatings = existsSync(join(CLUB, "ratings.json"));
describe.runIf(hasRatings)("ratings.json", () => {
  const ratings = () => readClub<Ratings>("ratings.json");

  it("maps known players to season→rating, floor-omitted (31–99)", () => {
    const r = ratings();
    const ids = new Set(index.map((p) => p.id));
    let entries = 0;
    for (const [pid, seasons] of Object.entries(r)) {
      expect(ids.has(pid)).toBe(true);
      for (const [season, rating] of Object.entries(seasons)) {
        expect(season).toMatch(/^\d{4}-\d{2}$/);
        expect(rating).toBeGreaterThan(30); // floor-omitted: the floor itself is never stored
        expect(rating).toBeLessThanOrEqual(99);
        entries++;
      }
    }
    expect(Object.keys(r).length).toBeGreaterThanOrEqual(50);
    expect(entries).toBeGreaterThan(0);
  });
});
