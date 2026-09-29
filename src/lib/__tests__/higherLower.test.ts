import { describe, expect, it } from "vitest";
import { CHAIN_LENGTH, answer, complete, dailyChain, initialState, shareText } from "../higherLower";
import type { StatPlayer } from "../higherLower";

const pool: StatPlayer[] = Array.from({ length: 40 }, (_, i) => ({
  id: `p${i}`,
  name: `Player ${i}`,
  apps: i * 3,
}));

describe("dailyChain", () => {
  it("is deterministic for the same date", () => {
    expect(dailyChain(pool, "2026-07-04")).toEqual(dailyChain(pool, "2026-07-04"));
  });
  it("changes across dates", () => {
    expect(dailyChain(pool, "2026-07-04")).not.toEqual(dailyChain(pool, "2026-07-05"));
  });
  it("returns CHAIN_LENGTH distinct ids", () => {
    const chain = dailyChain(pool, "2026-07-04");
    expect(chain).toHaveLength(CHAIN_LENGTH);
    expect(new Set(chain).size).toBe(CHAIN_LENGTH);
  });
  it("throws when the pool is smaller than the chain", () => {
    expect(() => dailyChain(pool.slice(0, 3), "2026-07-04")).toThrow();
  });
});

describe("answer", () => {
  const chain: StatPlayer[] = [
    { id: "a", name: "a", apps: 10 },
    { id: "b", name: "b", apps: 20 },
    { id: "c", name: "c", apps: 5 },
  ];

  it("advances the streak on a correct guess", () => {
    const s = answer(initialState(), chain, "higher");
    expect(s).toEqual({ index: 2, streak: 1, failed: false });
  });
  it("fails on a wrong guess", () => {
    const s = answer(initialState(), chain, "lower");
    expect(s.failed).toBe(true);
  });
  it("treats a tie as correct either way", () => {
    const tieChain: StatPlayer[] = [{ id: "a", apps: 10, name: "a" }, { id: "b", apps: 10, name: "b" }];
    expect(answer(initialState(), tieChain, "higher").failed).toBe(false);
    expect(answer(initialState(), tieChain, "lower").failed).toBe(false);
  });
  it("is a no-op once failed", () => {
    const failed = { index: 1, streak: 0, failed: true };
    expect(answer(failed, chain, "higher")).toBe(failed);
  });
  it("is a no-op once complete", () => {
    const done = { index: chain.length, streak: 2, failed: false };
    expect(complete(done, chain.length)).toBe(true);
    expect(answer(done, chain, "higher")).toBe(done);
  });
});

describe("shareText", () => {
  it("includes the date, streak and url", () => {
    const s = { index: 4, streak: 3, failed: true };
    expect(shareText(s, "2026-07-04", "https://theperfectxi.com/higher-lower/")).toContain("streak 3/7");
  });
});
