import { describe, expect, it } from "vitest";
import { difficultyFor, generateClues } from "../clues";
import type { Enrichment } from "../lfchistory";
import type { SpinePlayer } from "../wikipedia";

const salahSpine: SpinePlayer = {
  id: "mohamed-salah",
  name: "Mohamed Salah",
  nationality: "Egypt",
  position: "FW",
  careerSpans: [[2017, 2026]],
  apps: 442,
  goals: 257,
  lfchId: 1317,
};

const salahEnrich: Enrichment = {
  lfchId: 1317,
  birthYear: 1992,
  birthplace: "Basyoun, Egypt",
  signedFrom: "Roma",
  fee: "£43.9m",
  joinedYear: 2017,
  debutYear: 2017,
  honours: "Champions League 2019, European Super Cup 2019, FIFA Club World Cup 2019, Premier League 2019/20, 2024/25, FA Cup 2022, League Cup 2022, 2024",
};

const obscureSpine: SpinePlayer = {
  id: "joe-mcque",
  name: "Joe McQue",
  nationality: "Scotland",
  position: "FB",
  careerSpans: [[1892, 1898]],
  apps: 142,
  goals: 14,
  lfchId: 758,
};

describe("generateClues", () => {
  const clues = generateClues(salahSpine, salahEnrich);

  it("always produces exactly 6 non-empty clues", () => {
    expect(clues).toHaveLength(6);
    for (const c of clues) expect(c.length).toBeGreaterThan(10);
  });

  it("never contains the player's name", () => {
    for (const c of clues) {
      expect(c.toLowerCase()).not.toContain("salah");
      expect(c.toLowerCase()).not.toContain("mohamed");
    }
  });

  it("clue 1 is career shape with apps rounded to 25", () => {
    expect(clues[0]).toBe("Made roughly 450 appearances for Liverpool between 2017 and 2026");
  });

  it("clue 2 is origin from birthplace + birth decade", () => {
    expect(clues[1]).toBe("Born in Basyoun, Egypt, in the 1990s");
  });

  it("clue 3 is arrival with fee", () => {
    expect(clues[2]).toBe("Signed from Roma for £43.9m");
  });

  it("clue 4 is goal output", () => {
    expect(clues[3]).toBe("Scored 257 goals in a red shirt");
  });

  it("clue 5 names recognisable trophies", () => {
    expect(clues[4]).toContain("Champions League");
    expect(clues[4]).toContain("Premier League");
  });

  it("clue 6 is position + initials", () => {
    expect(clues[5]).toBe("A forward with the initials M.S.");
  });

  it("degrades gracefully without enrichment fields", () => {
    const clues = generateClues(obscureSpine, { lfchId: 758 });
    expect(clues).toHaveLength(6);
    expect(clues[1]).toBe("Born in Scotland"); // no birthplace/birth year → nationality
    expect(clues[2]).toBe("Joined Liverpool in 1892"); // no signedFrom → joined year from career
    expect(clues[4]).toBe("Made his Liverpool debut in 1892"); // no honours data → debut clue, never a false "no trophies"
  });

  it("GK goal clue talks appearances, not goals", () => {
    const gk = { ...obscureSpine, position: "GK", goals: 0 };
    const clues = generateClues(gk, { lfchId: 1 });
    expect(clues[3]).toBe("Kept goal in 142 games for the club");
    expect(clues[5]).toBe("A goalkeeper with the initials J.M.");
  });

  it("uses 'Never won a major trophy' only when honours data exists and has no major trophy", () => {
    const clues = generateClues(obscureSpine, { lfchId: 758, honours: "Lancashire League 1893" });
    expect(clues[4]).toBe("Never won a major trophy at Anfield");
  });
});

describe("difficultyFor", () => {
  it("household names are 1", () => {
    expect(difficultyFor(salahSpine)).toBe(1);
    expect(difficultyFor({ ...obscureSpine, apps: 640, careerSpans: [[1960, 1978]] })).toBe(1);
  });
  it("deep pre-war cuts are 5", () => {
    expect(difficultyFor({ ...obscureSpine, apps: 60 })).toBe(5);
  });
  it("mid-tier modern players land in the middle", () => {
    const d = difficultyFor({ ...obscureSpine, apps: 150, careerSpans: [[2005, 2010]] });
    expect(d).toBeGreaterThanOrEqual(2);
    expect(d).toBeLessThanOrEqual(3);
  });
  it("always returns 1..5", () => {
    for (const apps of [50, 100, 200, 400, 800]) {
      for (const span of [[1900, 1910], [1960, 1970], [2015, 2025]] as [number, number][]) {
        const d = difficultyFor({ ...obscureSpine, apps, careerSpans: [span] });
        expect(d).toBeGreaterThanOrEqual(1);
        expect(d).toBeLessThanOrEqual(5);
      }
    }
  });
});
