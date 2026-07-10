import { describe, expect, it } from "vitest";
import { matchResult, teamRating } from "../h2h";

describe("teamRating", () => {
  it("is the rounded mean of the season ratings", () => {
    expect(teamRating([90, 90, 90])).toBe(90);
    expect(teamRating([90, 91])).toBe(91); // 90.5 → 91
    expect(teamRating([])).toBe(0);
  });
});

describe("matchResult", () => {
  it("gives a 1-0 win for a one-point edge (Dave's calibration)", () => {
    expect(matchResult(99, 98)).toEqual({ outcome: "W", scoreline: "1-0" });
  });

  it("is symmetric — the loser's scoreline mirrors the winner's", () => {
    expect(matchResult(80, 90)).toEqual({ outcome: "L", scoreline: "1-3" });
    expect(matchResult(90, 80)).toEqual({ outcome: "W", scoreline: "3-1" });
  });

  it("draws on equal ratings", () => {
    expect(matchResult(85, 85)).toEqual({ outcome: "D", scoreline: "1-1" });
  });

  it("widens the winning margin as the gap grows, and never lets the loser outscore the winner", () => {
    let prevMargin = -1;
    for (const gap of [1, 5, 10, 15, 20, 40]) {
      const { scoreline } = matchResult(50 + gap, 50);
      const [yours, theirs] = scoreline.split("-").map(Number);
      expect(yours).toBeGreaterThan(theirs);
      expect(yours - theirs).toBeGreaterThanOrEqual(prevMargin);
      prevMargin = yours - theirs;
    }
  });
});
