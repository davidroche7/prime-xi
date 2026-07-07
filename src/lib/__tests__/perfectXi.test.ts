import { describe, expect, it } from "vitest";
import { buildEraKey, type CanonicalEra } from "../../../pipeline/eras";
import { scoreBuild, type XiBuild } from "../perfectXi";

// test-only key, hashed by the same helper the pipeline uses
const canonical: CanonicalEra = {
  slug: "all-time",
  title: "Test XI",
  seasonRange: "x",
  formationId: "433",
  managerId: "bob-paisley", // peak season computes to 1976-77
  slots: [
    [
      { playerId: "keeper-a", seasons: ["1976-77", "1978-79"] },
      { playerId: "keeper-b", seasons: ["2018-19"] },
    ],
    ...Array.from({ length: 10 }, (_, i) => [{ playerId: `outfield-${i}`, seasons: ["1980-81"] }]),
  ],
};
const era = buildEraKey(canonical);

const perfectBuild: XiBuild = {
  picks: [
    { playerId: "keeper-a", season: "1976-77" },
    ...Array.from({ length: 10 }, (_, i) => ({ playerId: `outfield-${i}`, season: "1980-81" })),
  ],
  managerId: "bob-paisley",
  managerSeason: "1976-77",
  formationId: "433",
};

describe("scoreBuild", () => {
  it("a 100% build scores 98 and is perfect", () => {
    const s = scoreBuild(perfectBuild, era);
    expect(s).toEqual({
      total: 98,
      playersCorrect: 11,
      seasonsCorrect: 11,
      managerCorrect: true,
      managerSeasonCorrect: true,
      formationCorrect: true,
      perfect: true,
    });
  });

  it("equivalence classes: the alternate keeper with his own season scores full", () => {
    const s = scoreBuild(
      { ...perfectBuild, picks: [{ playerId: "keeper-b", season: "2018-19" }, ...perfectBuild.picks.slice(1)] },
      era,
    );
    expect(s.perfect).toBe(true);
  });

  it("one wrong player → 90, players 10/11, seasons 10/11", () => {
    const s = scoreBuild(
      { ...perfectBuild, picks: [{ playerId: "nobody", season: "1976-77" }, ...perfectBuild.picks.slice(1)] },
      era,
    );
    expect(s.total).toBe(90);
    expect(s.playersCorrect).toBe(10);
    expect(s.seasonsCorrect).toBe(10);
    expect(s.perfect).toBe(false);
  });

  it("right player, wrong season → seasons 10/11, total 96", () => {
    const s = scoreBuild(
      { ...perfectBuild, picks: [{ playerId: "keeper-a", season: "1999-00" }, ...perfectBuild.picks.slice(1)] },
      era,
    );
    expect(s.playersCorrect).toBe(11);
    expect(s.seasonsCorrect).toBe(10);
    expect(s.total).toBe(96);
  });

  it("a season from the slot's other accepted player does not count", () => {
    // keeper-a with keeper-b's defining season — player right, season wrong
    const s = scoreBuild(
      { ...perfectBuild, picks: [{ playerId: "keeper-a", season: "2018-19" }, ...perfectBuild.picks.slice(1)] },
      era,
    );
    expect(s.seasonsCorrect).toBe(10);
  });

  it("right manager, wrong peak season → +4 not +6", () => {
    const s = scoreBuild({ ...perfectBuild, managerSeason: "1982-83" }, era);
    expect(s.managerCorrect).toBe(true);
    expect(s.managerSeasonCorrect).toBe(false);
    expect(s.total).toBe(96);
  });

  it("wrong manager → no manager-season points even for the right season value", () => {
    const s = scoreBuild({ ...perfectBuild, managerId: "joe-fagan" }, era);
    expect(s.managerCorrect).toBe(false);
    expect(s.managerSeasonCorrect).toBe(false);
    expect(s.total).toBe(92);
  });

  it("wrong formation loses exactly 4", () => {
    expect(scoreBuild({ ...perfectBuild, formationId: "442" }, era).total).toBe(94);
  });

  it("duplicate picks cannot double-match one slot", () => {
    const s = scoreBuild(
      {
        ...perfectBuild,
        picks: [
          { playerId: "keeper-a", season: "1976-77" },
          { playerId: "keeper-a", season: "1976-77" },
          ...perfectBuild.picks.slice(2),
        ],
      },
      era,
    );
    expect(s.playersCorrect).toBe(10);
  });

  it("never reveals which picks matched", () => {
    const keys = Object.keys(scoreBuild(perfectBuild, era));
    expect(keys.sort()).toEqual(
      ["total", "playersCorrect", "seasonsCorrect", "managerCorrect", "managerSeasonCorrect", "formationCorrect", "perfect"].sort(),
    );
  });
});
