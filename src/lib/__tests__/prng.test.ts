import { describe, expect, it } from "vitest";
import { hashString, mulberry32, pick, pickN, utcDateString } from "../prng";

describe("hashString", () => {
  it("is deterministic", () => {
    expect(hashString("2026-07-04")).toBe(hashString("2026-07-04"));
  });
  it("differs across dates", () => {
    expect(hashString("2026-07-04")).not.toBe(hashString("2026-07-05"));
  });
  it("returns an unsigned 32-bit integer", () => {
    const h = hashString("x");
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xffffffff);
    expect(Number.isInteger(h)).toBe(true);
  });
});

describe("mulberry32", () => {
  it("produces the same sequence for the same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });
  it("produces values in [0, 1)", () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it("differs across seeds", () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });
});

describe("pick / pickN", () => {
  it("pick is deterministic and in-range", () => {
    const items = ["a", "b", "c", "d"];
    expect(pick(mulberry32(9), items)).toBe(pick(mulberry32(9), items));
    expect(items).toContain(pick(mulberry32(123), items));
  });
  it("pick throws on empty", () => {
    expect(() => pick(mulberry32(1), [])).toThrow();
  });
  it("pickN returns distinct elements", () => {
    const out = pickN(mulberry32(5), [1, 2, 3, 4, 5], 3);
    expect(out).toHaveLength(3);
    expect(new Set(out).size).toBe(3);
  });
  it("pickN caps at pool size", () => {
    expect(pickN(mulberry32(5), [1, 2], 10)).toHaveLength(2);
  });
});

describe("utcDateString", () => {
  it("formats as YYYY-MM-DD in UTC", () => {
    expect(utcDateString(new Date(Date.UTC(2026, 6, 4, 23, 59)))).toBe("2026-07-04");
    expect(utcDateString(new Date(Date.UTC(2026, 6, 5, 0, 0)))).toBe("2026-07-05");
  });
});
