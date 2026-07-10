import { describe, expect, it } from "vitest";
import type { Enrichment } from "../lfchistory";
import { playerBase, playerSeasonRating } from "../ratings";
import type { SpinePlayer } from "../wikipedia";

const strike: SpinePlayer = {
  id: "star-striker",
  name: "Star Striker",
  nationality: "England",
  position: "FW",
  careerSpans: [[2000, 2014]],
  apps: 500,
  goals: 200,
  lfchId: 1,
};
const strikeEnr: Enrichment = {
  lfchId: 1,
  honours: "League Championship 2001, 2002; European Cup 2005",
};

const deepCut: SpinePlayer = {
  id: "abe-hartley",
  name: "Abe Hartley",
  nationality: "Scotland",
  position: "FW",
  careerSpans: [[1897, 1898]],
  apps: 12,
  goals: 1,
};

describe("playerSeasonRating", () => {
  it("always lands in 30–99", () => {
    for (const s of [2000, 2005, 2007, 2014]) {
      const r = playerSeasonRating(strike, s, strikeEnr);
      expect(r).toBeGreaterThanOrEqual(30);
      expect(r).toBeLessThanOrEqual(99);
    }
    expect(playerSeasonRating(deepCut, 1897)).toBeGreaterThanOrEqual(30);
  });

  it("rates a peak (mid-career) season above a fringe (career-edge) one", () => {
    const mid = playerSeasonRating(strike, 2007, strikeEnr);
    const edge = playerSeasonRating(strike, 2000, strikeEnr);
    expect(mid).toBeGreaterThan(edge);
  });

  it("boosts a trophy-winning season above an adjacent non-trophy season", () => {
    const trophy = playerSeasonRating(strike, 2005, strikeEnr); // European Cup 2005
    const noTrophy = playerSeasonRating(strike, 2004, strikeEnr);
    expect(trophy).toBeGreaterThan(noTrophy);
  });

  it("rates a low-apps, honourless deep cut near the floor", () => {
    expect(playerSeasonRating(deepCut, 1897)).toBeLessThanOrEqual(40);
  });

  it("rates an honoured, high-apps player well above a deep cut", () => {
    expect(playerBase(strike, strikeEnr)).toBeGreaterThan(playerBase(deepCut) + 30);
  });
});
