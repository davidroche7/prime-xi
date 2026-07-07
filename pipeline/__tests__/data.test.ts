import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { AnswerPlayer, EraKey, Formation, IndexedPlayer, Manager } from "../../src/lib/types";

/** Validates the committed static JSON in /data — the app's only data source. */

const DATA = join(__dirname, "..", "..", "data");
const read = <T>(f: string) => JSON.parse(readFileSync(join(DATA, f), "utf8")) as T;

const index = read<IndexedPlayer[]>("players-index.json");
const answers = read<AnswerPlayer[]>("answers.json");
const formations = read<Formation[]>("formations.json");

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

// Task 7 artefacts — validated once they exist.
const hasEras = existsSync(join(DATA, "eras.json"));
describe.runIf(hasEras)("eras.json + managers.json", () => {
  // describe bodies run at collection even when skipped — read lazily
  const eras = () => read<EraKey[]>("eras.json");
  const managers = () => read<Manager[]>("managers.json");

  it("three era keys with 11 hashed slots each and no plaintext", () => {
    expect(eras().map((e) => e.slug).sort()).toEqual(["all-time", "post-war", "premier-league"]);
    for (const e of eras()) {
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
