import { describe, expect, it } from "vitest";
import { seasonLabel, seasonsBetween, seasonsFromYearRanges } from "../seasons";

describe("seasons", () => {
  it("labels wrap the century", () => {
    expect(seasonLabel(1976)).toBe("1976-77");
    expect(seasonLabel(1999)).toBe("1999-00");
    expect(seasonLabel(2009)).toBe("2009-10");
  });
  it("enumerates a career span, minimum one season", () => {
    expect(seasonsBetween(2017, 2020)).toEqual(["2017-18", "2018-19", "2019-20"]);
    expect(seasonsBetween(1997, 1997)).toEqual(["1997-98"]);
  });
  it("parses manager tenure strings, including split spells and open ends", () => {
    expect(seasonsFromYearRanges("1983–1985")).toEqual(["1983-84", "1984-85"]);
    expect(seasonsFromYearRanges("1985–1991, 2011–2012")).toEqual([
      "1985-86",
      "1986-87",
      "1987-88",
      "1988-89",
      "1989-90",
      "1990-91",
      "2011-12",
    ]);
    expect(seasonsFromYearRanges("2024–", 2026)).toEqual(["2024-25", "2025-26"]);
  });
});
