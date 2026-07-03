import { describe, expect, it } from "vitest";
import { COST_MAX, cost, scarcityFor } from "../cost";

describe("cost", () => {
  it("is convex: cost gap widens as rating climbs", () => {
    const step80 = cost(85, ["ST"]) - cost(80, ["ST"]);
    const step90 = cost(95, ["ST"]) - cost(90, ["ST"]);
    expect(step90).toBeGreaterThan(step80);
  });

  it("is monotonic in rating", () => {
    let prev = 0;
    for (let r = 40; r <= 99; r++) {
      const c = cost(r, ["CM"]);
      expect(c).toBeGreaterThan(prev);
      prev = c;
    }
  });

  it("tops out at COST_MAX for a 99-rated outfielder with no scarcity", () => {
    expect(cost(99, ["ST"])).toBe(COST_MAX);
  });

  it("applies scarcity by primary position only", () => {
    expect(cost(90, ["GK"])).toBeCloseTo(cost(90, ["ST"]) * 1.05, 0);
    // ST primary, CB secondary → no CB scarcity
    expect(cost(90, ["ST", "CB"])).toBe(cost(90, ["ST"]));
  });

  it("scarcityFor defaults to 1", () => {
    expect(scarcityFor("AM")).toBe(1);
    expect(scarcityFor(undefined)).toBe(1);
  });

  it("rounds to one decimal", () => {
    const c = cost(87, ["W"]);
    expect(c).toBe(Math.round(c * 10) / 10);
  });
});
