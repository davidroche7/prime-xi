import { describe, expect, it } from "vitest";
import { buildEraKey, type CanonicalEra } from "../eras";
import { MANAGERS, managerPeakSeason } from "../managers";

describe("managerPeakSeason", () => {
  it("Paisley peaks in 1976-77 (League + European Cup)", () => {
    const paisley = MANAGERS.find((m) => m.id === "bob-paisley")!;
    expect(managerPeakSeason(paisley.honours)).toBe("1976-77");
  });
  it("Fagan peaks in his treble season", () => {
    const fagan = MANAGERS.find((m) => m.id === "joe-fagan")!;
    expect(managerPeakSeason(fagan.honours)).toBe("1983-84");
  });
  it("ties go to the earlier season", () => {
    expect(
      managerPeakSeason([
        { season: "1979-80", honours: ["league"] },
        { season: "1978-79", honours: ["league"] },
      ]),
    ).toBe("1978-79");
  });
  it("unknown honour names weigh nothing", () => {
    expect(
      managerPeakSeason([
        { season: "1965-66", honours: ["charity-shield", "charity-shield"] },
        { season: "1970-71", honours: ["league-cup"] },
      ]),
    ).toBe("1970-71");
  });
  it("throws on an empty honours table", () => {
    expect(() => managerPeakSeason([])).toThrow();
  });
});

describe("MANAGERS", () => {
  it("is substantial with unique ids and well-formed seasons", () => {
    expect(MANAGERS.length).toBeGreaterThanOrEqual(15);
    expect(new Set(MANAGERS.map((m) => m.id)).size).toBe(MANAGERS.length);
    for (const m of MANAGERS)
      for (const h of m.honours) expect(h.season).toMatch(/^\d{4}-\d{2}$/);
  });
});

describe("buildEraKey", () => {
  const fake: CanonicalEra = {
    slug: "all-time",
    title: "Test",
    seasonRange: "x",
    fromYear: 1892,
    formationId: "433",
    managerId: "bob-paisley",
    slots: [
      [{ playerId: "fake-keeper", seasons: ["1976-77", "1978-79"] }],
      ...Array.from({ length: 10 }, (_, i) => [{ playerId: `fake-${i}`, seasons: ["1976-77"] }]),
    ],
  };

  it("is deterministic and leaks no plaintext", () => {
    const a = buildEraKey(fake);
    expect(a).toEqual(buildEraKey(fake));
    const json = JSON.stringify(a);
    expect(json).not.toContain("fake");
    expect(json).not.toContain("paisley");
    expect(json).not.toContain("1976");
    expect(a.hashes.slots).toHaveLength(11);
    expect(a.hashes.slots[0].seasons).toHaveLength(2);
    for (const h of [a.hashes.manager, a.hashes.managerSeason, a.hashes.formation])
      expect(h).toMatch(/^[0-9a-z]+$/);
  });

  it("salts by era: same value hashes differently per slug", () => {
    const other = buildEraKey({ ...fake, slug: "post-war" });
    expect(other.hashes.formation).not.toBe(buildEraKey(fake).hashes.formation);
  });

  it("rejects a player appearing in two slots", () => {
    const dup = { ...fake, slots: fake.slots.map(() => [{ playerId: "same", seasons: ["1976-77"] }]) };
    expect(() => buildEraKey(dup)).toThrow(/two slots/);
  });

  it("rejects a key without 11 slots", () => {
    expect(() => buildEraKey({ ...fake, slots: fake.slots.slice(0, 10) })).toThrow(/slots/);
  });
});
