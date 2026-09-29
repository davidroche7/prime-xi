import { describe, expect, it } from "vitest";
import { nextBirthdayAfter, playersBornOn } from "../onThisDay";
import type { IndexedPlayer } from "../types";

const player = (id: string, birthMonthDay?: string): IndexedPlayer => ({
  id,
  name: id,
  search: [id],
  years: [2000, 2001],
  pos: "MF",
  apps: 100,
  goals: 10,
  ...(birthMonthDay ? { birthMonthDay } : {}),
});

describe("playersBornOn", () => {
  it("matches exact month-day, ignoring birth year", () => {
    const players = [player("a", "05-10"), player("b", "05-11"), player("c")];
    expect(playersBornOn(players, "05-10").map((p) => p.id)).toEqual(["a"]);
  });
  it("returns empty when nobody matches", () => {
    expect(playersBornOn([player("a", "05-10")], "01-01")).toEqual([]);
  });
});

describe("nextBirthdayAfter", () => {
  it("finds the nearest upcoming birthday", () => {
    const players = [player("far", "01-01"), player("near", "05-15"), player("none")];
    expect(nextBirthdayAfter(players, "05-10")?.player.id).toBe("near");
  });
  it("wraps around the year end", () => {
    const players = [player("early-next-year", "01-02")];
    const next = nextBirthdayAfter(players, "12-30");
    expect(next?.player.id).toBe("early-next-year");
    expect(next?.daysAway).toBe(3);
  });
  it("returns undefined when no player has a birth date", () => {
    expect(nextBirthdayAfter([player("a")], "05-10")).toBeUndefined();
  });
});
