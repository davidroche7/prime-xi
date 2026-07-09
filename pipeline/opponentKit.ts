import { RATING_FLOOR } from "../src/lib/h2h";
import type { Enrichment } from "./lfchistory";
import { playerSeasonRating } from "./ratings";
import type { SpinePlayer } from "./wikipedia";

/**
 * Shared builder for H2H **opponent** canonicals (the gitignored
 * pipeline/canonical/<club>.ts files). An opponent is 11 hand-authored picks
 * per era, each carrying real career facts + honour-years, rated by the SAME
 * `playerSeasonRating` formula as the home club — so the duel is fair and the
 * honours knowledge is preserved without needing a full roster or scrape.
 *
 * Career totals come from famous facts (spot-checked against the scraped roster
 * where one exists); honour-years are authored per pick. ponytail: upgrade path
 * = a full club (roster scrape → playable Perfect XI), for which these picks are
 * the seed.
 */
export interface OppPick {
  id: string; // url-safe slug, e.g. "peter-schmeichel"
  pos: "GK" | "DF" | "FB" | "MF" | "FW"; // formula distinguishes FW / MF / other
  apps: number; // career appearances (all competitions)
  goals: number;
  span: [number, number]; // first–last season (end year)
  wins: number[]; // distinct years the player won a major honour
}

/** A ratingOf(playerId, season) over a set of authored picks, or the floor. */
export function ratingsFor(picks: OppPick[]) {
  const byId = new Map(picks.map((p) => [p.id, p]));
  return (playerId: string, season: string): number => {
    const p = byId.get(playerId);
    if (!p) return RATING_FLOOR;
    const player: SpinePlayer = {
      id: p.id,
      name: p.id,
      nationality: "",
      position: p.pos,
      careerSpans: [p.span],
      apps: p.apps,
      goals: p.goals,
    };
    const enr: Enrichment = { lfchId: 0, honours: p.wins.join(" ") };
    return playerSeasonRating(player, parseInt(season), enr);
  };
}
