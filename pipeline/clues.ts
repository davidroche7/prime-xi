import type { Enrichment } from "./lfchistory";
import type { SpinePlayer } from "./wikipedia";

/**
 * Pipeline C — pure clue generation. Six clues per player, hardest → easiest,
 * built ONLY from raw facts (never lfchistory editorial). Every clue slot has a
 * fact-safe fallback so all six always exist.
 */

const POSITION_WORD: Record<string, string> = {
  GK: "goalkeeper",
  FB: "full-back",
  DF: "defender",
  HB: "half-back",
  MF: "midfielder",
  FW: "forward",
  U: "utility man",
};

const MAJOR_TROPHIES = [
  "European Cup",
  "Champions League",
  "Premier League",
  "First Division",
  "League Championship",
  "FA Cup",
  "League Cup",
  "UEFA Cup",
  "Europa League",
  "Cup Winners' Cup",
  "UEFA Super Cup",
  "European Super Cup",
  "FIFA Club World Cup",
];

function roundTo25(n: number): number {
  return Math.round(n / 25) * 25;
}

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .map((w) => w[0].toUpperCase())
      .join(".") + "."
  );
}

export function generateClues(spine: SpinePlayer, e: Enrichment): string[] {
  const first = spine.careerSpans[0][0];
  const last = spine.careerSpans[spine.careerSpans.length - 1][1];

  // 1 — career shape (always derivable)
  const career =
    first === last
      ? `Played for Liverpool in ${first} only`
      : `Made roughly ${roundTo25(spine.apps)} appearances for Liverpool between ${first} and ${last}`;

  // 2 — origin
  const origin =
    e.birthplace && e.birthYear
      ? `Born in ${e.birthplace}, in the ${Math.floor(e.birthYear / 10) * 10}s`
      : e.birthplace
        ? `Born in ${e.birthplace}`
        : `Born in ${spine.nationality}`;

  // 3 — arrival
  const arrival = e.signedFrom
    ? `Signed from ${e.signedFrom}${e.fee ? ` for ${e.fee}` : ""}`
    : `Joined Liverpool in ${e.joinedYear ?? first}`;

  // 4 — output (position-aware)
  const output =
    spine.position === "GK"
      ? `Kept goal in ${spine.apps} games for the club`
      : spine.goals === 0
        ? `Never scored in ${spine.apps} games for the club`
        : `Scored ${spine.goals} goals in a red shirt`;

  // 5 — honours; only claim "never won" when we HAVE honours data saying so
  let honours: string;
  if (e.honours) {
    const won = MAJOR_TROPHIES.filter((t) => e.honours!.includes(t));
    const dedup = won.filter((t) => !(t === "Champions League" && won.includes("European Cup")));
    honours =
      dedup.length > 0
        ? `Won the ${dedup.slice(0, 3).join(", the ").replace(/, the ([^,]+)$/, " and the $1")} at Liverpool`
        : "Never won a major trophy at Anfield";
  } else {
    honours = `Made his Liverpool debut in ${e.debutYear ?? first}`;
  }

  // 6 — identity
  const identity = `A ${POSITION_WORD[spine.position] ?? "player"} with the initials ${initials(spine.name)}`;

  return [career, origin, arrival, output, honours, identity];
}

/** 1 = household name … 5 = deep cut. Pure; boundaries unit-tested. */
export function difficultyFor(spine: SpinePlayer): 1 | 2 | 3 | 4 | 5 {
  const lastYear = spine.careerSpans[spine.careerSpans.length - 1][1];
  let d: number;
  if (spine.apps >= 400 || spine.goals >= 150) d = 1;
  else if (spine.apps >= 250) d = 2;
  else if (spine.apps >= 120) d = 3;
  else if (spine.apps >= 80) d = 4;
  else d = 5;

  if (lastYear >= 2000) d -= 1; // recency: still in living memory of most players
  if (lastYear < 1960) d += 1; // pre-TV era: harder for everyone

  return Math.min(5, Math.max(1, d)) as 1 | 2 | 3 | 4 | 5;
}
