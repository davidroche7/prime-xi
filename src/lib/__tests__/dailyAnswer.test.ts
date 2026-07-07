import { describe, expect, it } from "vitest";
import { dailyAnswerId, dayNumber } from "../dailyAnswer";

const pool = Array.from({ length: 120 }, (_, i) => ({
  id: `player-${i}`,
  difficulty: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5,
}));

describe("dayNumber", () => {
  it("counts UTC days since 2026-01-01", () => {
    expect(dayNumber("2026-01-01")).toBe(0);
    expect(dayNumber("2026-01-02")).toBe(1);
    expect(dayNumber("2026-07-07")).toBe(187);
  });
});

describe("dailyAnswerId", () => {
  it("is deterministic", () => {
    expect(dailyAnswerId("2026-07-07", pool, "normal")).toBe(dailyAnswerId("2026-07-07", pool, "normal"));
  });

  it("does not depend on pool order", () => {
    const shuffled = [...pool].reverse();
    expect(dailyAnswerId("2026-07-07", shuffled, "normal")).toBe(dailyAnswerId("2026-07-07", pool, "normal"));
  });

  it("differs between modes", () => {
    expect(dailyAnswerId("2026-07-07", pool, "normal")).not.toBe(dailyAnswerId("2026-07-07", pool, "hard"));
  });

  it("normal mode only serves difficulty ≤ 3; hard only ≥ 3", () => {
    for (let d = 0; d < 60; d++) {
      const date = `2026-03-${String((d % 28) + 1).padStart(2, "0")}`;
      const normal = pool.find((p) => p.id === dailyAnswerId(date, pool, "normal"))!;
      const hard = pool.find((p) => p.id === dailyAnswerId(date, pool, "hard"))!;
      expect(normal.difficulty).toBeLessThanOrEqual(3);
      expect(hard.difficulty).toBeGreaterThanOrEqual(3);
    }
  });

  it("never repeats within a full cycle", () => {
    const normalPoolSize = pool.filter((p) => p.difficulty <= 3).length;
    const seen = new Set<string>();
    const start = Date.UTC(2026, 0, 1);
    for (let d = 0; d < normalPoolSize; d++) {
      const date = new Date(start + d * 86400000).toISOString().slice(0, 10);
      seen.add(dailyAnswerId(date, pool, "normal"));
    }
    expect(seen.size).toBe(normalPoolSize);
  });

  it("throws on an empty pool", () => {
    expect(() => dailyAnswerId("2026-07-07", [], "normal")).toThrow();
  });
});
