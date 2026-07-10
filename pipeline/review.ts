import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { RATING_FLOOR, teamRating } from "../src/lib/h2h";
import type { CanonicalEra } from "./eras";
import { managerPeakSeason, MANAGERS as LFC_MANAGERS, type ManagerRecord } from "./managers";
import type { OppPick } from "./opponentKit";
import type { SpinePlayer } from "./wikipedia";

/** Editorial review doc generator: renders every gitignored canonical XI
 *  (Liverpool + all opponents) with stats and computed ratings into
 *  pipeline/canonical/REVIEW.md (gitignored) for Dave's B-1 review.
 *  Re-run after edits: `pnpm pipeline:review`. Contains no plaintext itself. */

const DIR = join(__dirname, "canonical");
const out: string[] = [
  "# Editorial review — all canonical XIs (B-1)",
  "",
  `Generated ${new Date().toISOString().slice(0, 10)} from the gitignored plaintext keys. Edit the .ts files, then \`pnpm pipeline:export\` + \`pnpm pipeline:review\`.`,
  "",
  "- **Ratings** are the shared `playerSeasonRating` formula (30–99). Team rating = mean of the 11 primary picks.",
  "- English opponents' career totals are scraped (accurate); **European + Everton are famous-facts approximations — scrutinise those hardest**.",
  "- `wins` = distinct years with a major honour (drives the trophy boost).",
  "",
];

function eraSection(
  club: string,
  era: CanonicalEra,
  ratingOf: (id: string, season: string) => number,
  managers: ManagerRecord[],
  statFor: (id: string) => string,
) {
  const mgr = managers.find((m) => m.id === era.managerId)!;
  const ratings = era.slots.map((s) => ratingOf(s[0].playerId, s[0].seasons[0]));
  out.push(`### ${era.title} (\`${era.slug}\`) — team rating **${teamRating(ratings)}**`, "");
  out.push(`Formation \`${era.formationId}\` · Manager **${mgr.name}** (${mgr.years}, peak ${managerPeakSeason(mgr.honours)})`, "");
  out.push("| # | Player (primary) | Season | Rating | Career | Alternatives accepted |");
  out.push("|---|---|---|---|---|---|");
  era.slots.forEach((slot, i) => {
    const p = slot[0];
    const alts = [
      ...(p.seasons.length > 1 ? [`also ${p.seasons.slice(1).join(", ")}`] : []),
      ...slot.slice(1).map((a) => `${a.playerId} (${a.seasons.join(", ")})`),
    ].join(" · ") || "—";
    out.push(`| ${i + 1} | ${p.playerId} | ${p.seasons[0]} | ${ratings[i]} | ${statFor(p.playerId)} | ${alts} |`);
  });
  out.push("");
}

const summary: [string, string][] = [];

function reviewClub(file: string) {
  const club = file === "index.ts" ? "liverpool" : file.replace(/\.ts$/, "");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(join(DIR, file)) as {
    CANONICAL: CanonicalEra[];
    MANAGERS?: ManagerRecord[];
    PICKS?: OppPick[];
    ratingOf?: (id: string, season: string) => number;
  };
  const managers = mod.MANAGERS ?? LFC_MANAGERS;

  let ratingOf = mod.ratingOf;
  let statFor = (id: string) => "—";
  if (club === "liverpool") {
    // Liverpool rates against its shipped ratings.json + spine career stats
    const ratings = JSON.parse(readFileSync(join(__dirname, "..", "data", "clubs", "liverpool", "ratings.json"), "utf8"));
    ratingOf = (id, season) => ratings[id]?.[season] ?? RATING_FLOOR;
    const spine: SpinePlayer[] = JSON.parse(readFileSync(join(__dirname, "cache", "spine.json"), "utf8"));
    const byId = new Map(spine.map((p) => [p.id, p]));
    statFor = (id) => {
      const p = byId.get(id);
      return p ? `${p.apps} apps, ${p.goals} gls` : "?";
    };
  } else if (mod.PICKS) {
    const byId = new Map(mod.PICKS.map((p) => [p.id, p]));
    statFor = (id) => {
      const p = byId.get(id);
      return p ? `${p.apps} apps, ${p.goals} gls, ${p.span[0]}–${p.span[1]}, wins: ${p.wins.join(" ") || "none"}` : "?";
    };
  }

  out.push(`## ${club}`, "");
  for (const era of mod.CANONICAL) {
    eraSection(club, era, ratingOf!, managers, statFor);
    summary.push([club, `${era.slug} ${teamRating(era.slots.map((s) => ratingOf!(s[0].playerId, s[0].seasons[0])))}`]);
  }
}

if (require.main === module) {
  reviewClub("index.ts");
  for (const f of readdirSync(DIR).sort())
    if (f.endsWith(".ts") && f !== "index.ts") reviewClub(f);

  out.push("## Rating table (all clubs, all eras)", "");
  for (const [club, line] of summary) out.push(`- **${club}** — ${line}`);
  out.push("");

  const target = join(DIR, "REVIEW.md");
  writeFileSync(target, out.join("\n"));
  console.log(`wrote ${target} (${out.length} lines)`);
}
