import type { Enrichment } from "./lfchistory";
import type { SpinePlayer } from "./wikipedia";

/**
 * §Head-to-head ratings — a per-(player, season) strength 30–99, precomputed
 * offline and shipped as data (never displayed; deterrent-level like the
 * canonical hashes). We have career totals + honours-with-years but NO
 * per-season stats, so season-specificity comes from a career-arc curve
 * (fringe early/late seasons rate below the mid-career peak) plus a
 * trophy-season boost from the honours years we do have.
 *
 * ponytail: career-arc heuristic; upgrade path = real per-season apps/goals.
 */

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** A defender's 40 goals ≈ a forward's 200 — weight goals by position. */
function goalsComponent(position: string, goals: number): number {
  const cap = position === "FW" ? 200 : position === "MF" ? 100 : 45;
  const weight = position === "FW" ? 25 : position === "MF" ? 18 : 8;
  return Math.min(goals / cap, 1) * weight;
}

/** Years in which the player won something, parsed from the honours text.
 *  Honours read like "League Championship 1987/88; FA Cup 1989" — capture the
 *  leading 4-digit year and also year+1, since "1987/88" is the 1988 season. */
function honourYears(enr?: Enrichment): Set<number> {
  const years = new Set<number>();
  if (!enr?.honours) return years;
  for (const m of enr.honours.matchAll(/\b((?:18|19|20)\d{2})\b/g)) {
    const y = parseInt(m[1]);
    years.add(y);
    years.add(y + 1);
  }
  return years;
}

/** Career-quality base 30–99 from career totals + honours count. */
export function playerBase(player: SpinePlayer, enr?: Enrichment): number {
  const apps = Math.min(player.apps / 500, 1) * 25; // longevity / establishment
  const goals = goalsComponent(player.position, player.goals);
  // distinct honour-years ≈ trophies won; "1987/88" contributes years {1987,1988}
  const honourCount = enr?.honours ? honourYears(enr).size / 2 : 0;
  const honours = Math.min(honourCount / 8, 1) * 25;
  return clamp(Math.round(30 + apps + goals + honours), 30, 99);
}

/** Career-arc factor 0.85–1.0: fringe early/late seasons rate below mid-career. */
function careerArc(season: number, spans: [number, number][]): number {
  const start = spans[0][0];
  const end = spans[spans.length - 1][1];
  if (end <= start) return 1;
  const t = (season - start) / (end - start); // 0..1 across the career
  const fromPeak = Math.abs(t - 0.5) * 2; // 0 mid-career → 1 at the edges
  return 1 - 0.15 * fromPeak;
}

/** Rating 30–99 for a specific (player, season). */
export function playerSeasonRating(player: SpinePlayer, season: number, enr?: Enrichment): number {
  const base = playerBase(player, enr);
  const arc = careerArc(season, player.careerSpans);
  const trophy = honourYears(enr).has(season) ? 5 : 0;
  return clamp(Math.round(base * arc + trophy), 30, 99);
}
