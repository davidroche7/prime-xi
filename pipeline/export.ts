import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { difficultyFor, generateClues } from "./clues";
import type { Enrichment } from "./lfchistory";
import { enrichmentSubset } from "./lfchistory";
import type { SpinePlayer } from "./wikipedia";

/** Pipeline C — assemble committed /data JSON from cached pipeline outputs. */

const CACHE = join(__dirname, "cache");
const DATA = join(__dirname, "..", "data");

function writeJson(name: string, value: unknown) {
  writeFileSync(join(DATA, name), JSON.stringify(value) + "\n");
  console.log(`wrote data/${name}`);
}

function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function buildPlayersIndex(spine: SpinePlayer[]) {
  return spine.map((p) => {
    const lower = p.name.toLowerCase();
    const plain = stripDiacritics(lower);
    const surname = plain.split(" ").slice(-1)[0];
    return {
      id: p.id,
      name: p.name,
      search: [...new Set([lower, plain, surname])],
      years: [p.careerSpans[0][0], p.careerSpans[p.careerSpans.length - 1][1]] as [number, number],
    };
  });
}

export function buildAnswers(spine: SpinePlayer[], enrichment: Record<number, Enrichment>) {
  return enrichmentSubset(spine)
    .filter((p) => enrichment[p.lfchId!])
    .map((p) => ({
      id: p.id,
      name: p.name,
      difficulty: difficultyFor(p),
      clues: generateClues(p, enrichment[p.lfchId!]),
    }));
}

if (require.main === module) {
  const spine: SpinePlayer[] = JSON.parse(readFileSync(join(CACHE, "spine.json"), "utf8"));
  const enrichment: Record<number, Enrichment> = JSON.parse(readFileSync(join(CACHE, "enrichment.json"), "utf8"));

  writeJson("players-index.json", buildPlayersIndex(spine));
  const answers = buildAnswers(spine, enrichment);
  writeJson("answers.json", answers);

  const byDiff = [1, 2, 3, 4, 5].map((d) => answers.filter((a) => a.difficulty === d).length);
  console.log(`answers: ${answers.length} (difficulty 1..5: ${byDiff.join("/")})`);

  // Task 7 artefacts — exported only once the canonical module exists locally.
  const canonicalDir = join(__dirname, "canonical");
  if (existsSync(join(canonicalDir, "index.ts"))) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { exportCanonical } = require("./canonical/index.ts");
    exportCanonical(writeJson);
  } else {
    console.log("canonical/ not present — skipping managers.json/eras.json (Task 7)");
  }
}
