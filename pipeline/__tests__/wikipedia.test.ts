import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseListPage, mergeSpine } from "../wikipedia";

const fixture = readFileSync(join(__dirname, "fixtures", "wikipedia-rows.txt"), "utf8");

describe("parseListPage", () => {
  const rows = parseListPage(fixture);

  it("parses every fixture row", () => {
    expect(rows).toHaveLength(10);
  });

  it("handles open careers (Gomez 2015–), single-year careers (Pearson 1892) and empty sortname surnames (Alisson)", () => {
    const gomez = rows.find((r) => r.name === "Joe Gomez")!;
    expect(gomez.careerSpans[0][0]).toBe(2015);
    expect(gomez.careerSpans[0][1]).toBeGreaterThanOrEqual(2026);

    const pearson = rows.find((r) => r.name === "Joseph Pearson")!;
    expect(pearson.careerSpans).toEqual([[1892, 1892]]);
    expect(pearson.apps).toBe(1);

    expect(rows.find((r) => r.name === "Alisson")).toBeDefined();
  });

  it("parses a simple 1890s row (McQue)", () => {
    const r = rows.find((r) => r.name === "Joe McQue")!;
    expect(r).toMatchObject({
      nationality: "Scotland",
      position: "FB",
      apps: 142,
      goals: 14,
      lfchId: 758,
    });
    expect(r.careerSpans).toEqual([[1892, 1898]]);
  });

  it("handles disambiguated sortnames (McCartney)", () => {
    const r = rows.find((r) => r.name === "John McCartney")!;
    expect(r.lfchId).toBe(734);
  });

  it("handles multi-spell careers (Rush)", () => {
    const r = rows.find((r) => r.name === "Ian Rush")!;
    expect(r.careerSpans).toEqual([
      [1980, 1987],
      [1988, 1996],
    ]);
    expect(r.apps).toBe(660); // Total column, not starts
    expect(r.goals).toBe(346);
    expect(r.nationality).toBe("Wales");
  });

  it("handles full-country flag templates (Fowler: England)", () => {
    const r = rows.find((r) => r.name === "Robbie Fowler")!;
    expect(r.nationality).toBe("England");
  });

  it("parses a modern row (Salah)", () => {
    const r = rows.find((r) => r.name === "Mohamed Salah")!;
    expect(r).toMatchObject({ nationality: "Egypt", position: "FW", apps: 442, goals: 257, lfchId: 1317 });
  });
});

describe("mergeSpine", () => {
  it("assigns unique ids and disambiguates collisions with first year", () => {
    const rows = parseListPage(fixture);
    const twin = { ...rows[0], careerSpans: [[1950, 1955]] as [number, number][], lfchId: 9999 };
    const spine = mergeSpine([rows, [twin]]);
    const ids = spine.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("joe-mcque-1892");
    expect(ids).toContain("joe-mcque-1950");
  });

  it("slugifies ids to url-safe form", () => {
    const spine = mergeSpine([parseListPage(fixture)]);
    for (const p of spine) expect(p.id).toMatch(/^[a-z0-9-]+$/);
  });
});
