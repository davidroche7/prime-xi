import { describe, expect, it } from "vitest";
import { balancePenalty, effectiveRating, fit, teamScore, tierFor, xiCost } from "../scoring";
import { F433, makePlayer, naturalXi } from "./fixtures";

describe("fit", () => {
  it("natural when slot group is listed", () => {
    expect(fit(["ST", "W"], "ST")).toBe("natural");
    expect(fit(["W", "ST"], "ST")).toBe("natural");
  });
  it("adjacent for neighbouring groups", () => {
    expect(fit(["CM"], "DM")).toBe("adjacent");
    expect(fit(["W"], "ST")).toBe("adjacent");
    expect(fit(["CB"], "FB")).toBe("adjacent");
  });
  it("alien for distant groups, and GK is alien to everything else", () => {
    expect(fit(["ST"], "GK")).toBe("alien");
    expect(fit(["GK"], "CB")).toBe("alien");
    expect(fit(["ST"], "CB")).toBe("alien");
  });
});

describe("effectiveRating", () => {
  const slot = F433.slots.find((s) => s.slotId === "st")!;
  it("full rating in natural position", () => {
    expect(effectiveRating(makePlayer({ rating: 90, positions: ["ST"] }), slot)).toBe(90);
  });
  it("x0.9 adjacent, x0.75 alien", () => {
    expect(effectiveRating(makePlayer({ rating: 90, positions: ["W"] }), slot)).toBeCloseTo(81);
    expect(effectiveRating(makePlayer({ rating: 90, positions: ["GK"] }), slot)).toBeCloseTo(67.5);
  });
});

describe("teamScore", () => {
  it("uniform natural XI scores its rating (no penalty)", () => {
    const score = teamScore(naturalXi(88), F433);
    expect(score.penalty).toBe(0);
    expect(score.overall).toBe(88);
    expect(score.tier).toBe("Elite");
  });

  it("is deterministic", () => {
    const xi = naturalXi(85);
    expect(teamScore(xi, F433)).toEqual(teamScore(xi, F433));
  });

  it("clamps to 1..99", () => {
    expect(teamScore(naturalXi(99), F433).overall).toBeLessThanOrEqual(99);
    expect(teamScore(naturalXi(1), F433).overall).toBeGreaterThanOrEqual(1);
  });

  it("rejects incomplete XIs and duplicate slots", () => {
    const xi = naturalXi(80);
    expect(() => teamScore(xi.slice(0, 10), F433)).toThrow();
    const dup = [...xi.slice(0, 10), { ...xi[0] }];
    expect(() => teamScore(dup, F433)).toThrow();
  });
});

describe("balancePenalty", () => {
  it("+3 for a weak CB", () => {
    const xi = naturalXi(85).map((e) =>
      e.slotId === "cb-l" ? { ...e, player: makePlayer({ rating: 70, positions: ["CB"] }) } : e,
    );
    expect(balancePenalty(xi, F433).penalty).toBe(3);
  });

  it("+2 when no CM/DM is rated 80+", () => {
    const xi = naturalXi(85).map((e) =>
      ["dm", "cm-l", "cm-r"].includes(e.slotId)
        ? { ...e, player: makePlayer({ rating: 78, positions: e.slotId === "dm" ? ["DM"] : ["CM"] }) }
        : e,
    );
    expect(balancePenalty(xi, F433).penalty).toBe(2);
  });

  it("+2 when more than 3 players are out of natural position", () => {
    const xi = naturalXi(85).map((e, i) =>
      i < 4 ? { ...e, player: makePlayer({ rating: 85, positions: ["AM"] }) } : e,
    );
    // slots 0..3 are GK, FB, CB, CB — an AM is not natural in any of them
    expect(balancePenalty(xi, F433).penalty).toBe(2);
  });

  it("caps at 6", () => {
    // Weak CBs + weak midfield + 4 out of position: 3 + 2 + 2 = 7 → capped to 6
    const xi = F433.slots.map((slot) => ({
      slotId: slot.slotId,
      player: makePlayer({ rating: 70, positions: ["W"] }),
    }));
    expect(balancePenalty(xi, F433).penalty).toBe(6);
  });

  it("zero for a balanced, natural, strong XI", () => {
    expect(balancePenalty(naturalXi(85), F433).penalty).toBe(0);
  });
});

describe("tierFor", () => {
  it("maps boundaries exactly", () => {
    expect(tierFor(69)).toBe("Cult Hero");
    expect(tierFor(70)).toBe("Fan Favourite");
    expect(tierFor(79)).toBe("Fan Favourite");
    expect(tierFor(80)).toBe("Continental");
    expect(tierFor(86)).toBe("Continental");
    expect(tierFor(87)).toBe("Elite");
    expect(tierFor(91)).toBe("Elite");
    expect(tierFor(92)).toBe("Legendary");
    expect(tierFor(95)).toBe("Legendary");
    expect(tierFor(96)).toBe("GOAT");
    expect(tierFor(99)).toBe("GOAT");
  });
});

describe("xiCost", () => {
  it("sums player costs to one decimal", () => {
    const xi = naturalXi(80).map((e) => ({ ...e, player: { ...e.player, cost: 10.1 } }));
    expect(xiCost(xi)).toBeCloseTo(111.1, 5);
  });
});
