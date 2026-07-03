import { describe, expect, it } from "vitest";
import { CONSTRAINT_POOL, puzzleForDate, puzzleViolations } from "../dailyPuzzle";
import { makePlayer } from "./fixtures";
import type { XiEntry } from "../types";

const CLUBS = [
  { slug: "liverpool", budget: 700 },
  { slug: "arsenal", budget: 680 },
  { slug: "real-madrid", budget: 720 },
];

describe("puzzleForDate", () => {
  it("is deterministic for the same date", () => {
    expect(puzzleForDate("2026-07-04", CLUBS)).toEqual(puzzleForDate("2026-07-04", CLUBS));
  });

  it("does not depend on club array order", () => {
    const shuffled = [CLUBS[2], CLUBS[0], CLUBS[1]];
    expect(puzzleForDate("2026-07-04", shuffled)).toEqual(puzzleForDate("2026-07-04", CLUBS));
  });

  it("varies across dates (over a month, at least two distinct clubs and constraint sets)", () => {
    const puzzles = Array.from({ length: 30 }, (_, i) =>
      puzzleForDate(`2026-06-${String(i + 1).padStart(2, "0")}`, CLUBS),
    );
    expect(new Set(puzzles.map((p) => p.clubSlug)).size).toBeGreaterThan(1);
    expect(new Set(puzzles.map((p) => p.constraints.map((c) => c.id).join(","))).size).toBeGreaterThan(1);
  });

  it("picks 0..2 constraints, no duplicates", () => {
    for (let i = 1; i <= 60; i++) {
      const p = puzzleForDate(`2026-01-${String((i % 28) + 1).padStart(2, "0")}x${i}`, CLUBS);
      expect(p.constraints.length).toBeGreaterThanOrEqual(0);
      expect(p.constraints.length).toBeLessThanOrEqual(2);
      expect(new Set(p.constraints.map((c) => c.id)).size).toBe(p.constraints.length);
    }
  });

  it("applies reduced-budget factor to the club budget", () => {
    // find a date whose puzzle includes reduced-budget
    for (let i = 0; i < 400; i++) {
      const p = puzzleForDate(`probe-${i}`, CLUBS);
      if (p.constraints.some((c) => c.id === "reduced-budget")) {
        const club = CLUBS.find((c) => c.slug === p.clubSlug)!;
        expect(p.budget).toBe(Math.round(club.budget * 0.85));
        return;
      }
    }
    throw new Error("reduced-budget never drawn in 400 probes");
  });

  it("throws with no clubs", () => {
    expect(() => puzzleForDate("2026-07-04", [])).toThrow();
  });
});

describe("constraints", () => {
  const entry = (seasonEndYear: number, name: string): XiEntry => ({
    slotId: `slot-${name}`,
    player: makePlayer({ rating: 80, positions: ["CM"], seasonEndYear, playerName: name }),
  });

  it("no-player-after-2010 flags modern seasons", () => {
    const c = CONSTRAINT_POOL.find((c) => c.id === "no-player-after-2010")!;
    expect(c.violations([entry(2009, "Old"), entry(2015, "New")])).toHaveLength(1);
    expect(c.violations([entry(2010, "Edge")])).toHaveLength(0);
  });

  it("one-per-decade flags decade doubles", () => {
    const c = CONSTRAINT_POOL.find((c) => c.id === "one-per-decade")!;
    expect(c.violations([entry(1994, "A"), entry(1999, "B")])).toHaveLength(1);
    expect(c.violations([entry(1994, "A"), entry(2004, "B")])).toHaveLength(0);
  });

  it("pre-premier-league-era only enforces on a full XI", () => {
    const c = CONSTRAINT_POOL.find((c) => c.id === "pre-premier-league-era")!;
    expect(c.violations([entry(2005, "A")])).toHaveLength(0); // partial XI: ok
    const fullModern = Array.from({ length: 11 }, (_, i) => entry(2005, `P${i}`));
    expect(c.violations(fullModern)).toHaveLength(1);
    const withOld = [...fullModern.slice(0, 8), entry(1980, "X"), entry(1985, "Y"), entry(1990, "Z")];
    expect(c.violations(withOld)).toHaveLength(0);
  });

  it("puzzleViolations aggregates across constraints", () => {
    const puzzle = {
      dateUTC: "2026-07-04",
      clubSlug: "liverpool",
      budget: 700,
      constraints: CONSTRAINT_POOL.filter((c) => c.id === "no-player-after-2010" || c.id === "one-per-decade"),
    };
    const xi = [entry(2015, "A"), entry(2016, "B")];
    expect(puzzleViolations(puzzle, xi).length).toBeGreaterThanOrEqual(2);
  });
});
