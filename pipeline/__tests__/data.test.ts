import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cost } from "../../src/lib/cost";
import { fit } from "../../src/lib/scoring";
import type { ClubData, Formation, PositionGroup } from "../../src/lib/types";

/** Validates the committed static JSON in /data — the app's only data source. */

const DATA_DIR = join(__dirname, "..", "..", "data");
const GROUPS: PositionGroup[] = ["GK", "CB", "FB", "DM", "CM", "AM", "W", "ST"];

const index = JSON.parse(readFileSync(join(DATA_DIR, "index.json"), "utf8")) as {
  slug: string;
  tier: string;
  budget: number;
}[];
const formations = JSON.parse(readFileSync(join(DATA_DIR, "formations.json"), "utf8")) as Formation[];
const clubFiles = readdirSync(join(DATA_DIR, "clubs")).filter((f) => f.endsWith(".json"));
const clubs = clubFiles.map(
  (f) => JSON.parse(readFileSync(join(DATA_DIR, "clubs", f), "utf8")) as ClubData,
);

describe("data/index.json", () => {
  it("has 6-12 marquee clubs (§3)", () => {
    const marquee = index.filter((c) => c.tier === "marquee");
    expect(marquee.length).toBeGreaterThanOrEqual(6);
    expect(marquee.length).toBeLessThanOrEqual(12);
  });
  it("matches the club files on disk", () => {
    expect(new Set(index.map((c) => `${c.slug}.json`))).toEqual(new Set(clubFiles));
  });
});

describe("data/formations.json", () => {
  it("every formation has 11 slots with unique ids and valid groups", () => {
    expect(formations.length).toBeGreaterThanOrEqual(1);
    for (const f of formations) {
      expect(f.slots).toHaveLength(11);
      expect(new Set(f.slots.map((s) => s.slotId)).size).toBe(11);
      for (const s of f.slots) {
        expect(GROUPS).toContain(s.group);
        expect(s.x).toBeGreaterThanOrEqual(0);
        expect(s.x).toBeLessThanOrEqual(100);
        expect(s.y).toBeGreaterThanOrEqual(0);
        expect(s.y).toBeLessThanOrEqual(100);
      }
      expect(f.slots.filter((s) => s.group === "GK")).toHaveLength(1);
    }
  });
});

describe.each(clubs.map((c) => [c.club.slug, c] as const))("data/clubs/%s.json", (_slug, data) => {
  it("player ids are unique and well-formed", () => {
    expect(new Set(data.players.map((p) => p.id)).size).toBe(data.players.length);
    for (const p of data.players) {
      expect(p.id).toMatch(/^[a-z0-9-]+$/);
      expect(p.clubId).toBe(data.club.id);
    }
  });

  it("ratings, seasons and positions are valid", () => {
    for (const p of data.players) {
      expect(p.rating).toBeGreaterThanOrEqual(1);
      expect(p.rating).toBeLessThanOrEqual(99);
      expect(p.seasonLabel).toMatch(/^\d{4}-\d{2}$/);
      expect(p.seasonEndYear).toBe(Number(p.seasonLabel.slice(0, 4)) + 1);
      expect(p.positions.length).toBeGreaterThanOrEqual(1);
      for (const pos of p.positions) expect(GROUPS).toContain(pos);
    }
  });

  it("shipped costs match the cost function exactly (never recomputed at runtime)", () => {
    for (const p of data.players) {
      expect(p.cost).toBe(cost(p.rating, p.positions));
    }
  });

  it("every formation can be filled with natural players within budget", () => {
    for (const f of formations) {
      const used = new Set<string>();
      let total = 0;
      for (const slot of f.slots) {
        const cheapest = data.players
          .filter((p) => !used.has(p.id) && fit(p.positions, slot.group) === "natural")
          .sort((a, b) => a.cost - b.cost)[0];
        expect(cheapest, `no natural ${slot.group} at ${data.club.slug} for ${f.name}`).toBeDefined();
        used.add(cheapest.id);
        total += cheapest.cost;
      }
      expect(total, `cheapest natural ${f.name} XI at ${data.club.slug} must fit budget`).toBeLessThanOrEqual(
        data.club.budget,
      );
    }
  });

  it("has a cheap depth band so budget choices are real", () => {
    expect(data.players.filter((p) => p.rating < 80).length).toBeGreaterThanOrEqual(5);
    expect(data.players.length).toBeGreaterThanOrEqual(30);
  });

  it("budget is tuned: superstar 4-3-3 XI is 28-42% over budget (§5.2)", () => {
    const f433 = formations.find((f) => f.id === "433")!;
    const used = new Set<string>();
    let superstar = 0;
    for (const slot of f433.slots) {
      const best = data.players
        .filter((p) => !used.has(p.id) && fit(p.positions, slot.group) === "natural")
        .sort((a, b) => b.cost - a.cost)[0];
      used.add(best.id);
      superstar += best.cost;
    }
    const ratio = superstar / data.club.budget;
    expect(ratio).toBeGreaterThanOrEqual(1.28);
    expect(ratio).toBeLessThanOrEqual(1.42);
  });
});
