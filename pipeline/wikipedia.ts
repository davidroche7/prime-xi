import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Pipeline A — the complete all-time roster spine from Wikipedia's three
 * "List of Liverpool F.C. players" pages (MediaWiki API, CC BY-SA, attributed
 * in the site footer). Together they cover every player in club history.
 */

/** Each club's "List of <club> F.C. players" pages — same MediaWiki template
 *  family, so parseListPage handles them all; only the titles differ. */
const CLUB_PAGES: Record<string, string[]> = {
  liverpool: [
    "List of Liverpool F.C. players",
    "List of Liverpool F.C. players (25–99 appearances)",
    "List of Liverpool F.C. players (1–24 appearances)",
  ],
  "manchester-united": [
    "List of Manchester United F.C. players (100+ appearances)",
    "List of Manchester United F.C. players (25–99 appearances)",
    "List of Manchester United F.C. players (1–24 appearances)",
  ],
  everton: ["List of Everton F.C. players"],
  arsenal: [
    "List of Arsenal F.C. players",
    "List of Arsenal F.C. players (25–99 appearances)",
    "List of Arsenal F.C. players (1–24 appearances)",
  ],
  "manchester-city": [
    "List of Manchester City F.C. players",
    "List of Manchester City F.C. players (25–99 appearances)",
    "List of Manchester City F.C. players (1–24 appearances)",
  ],
};

const CACHE_DIR = join(__dirname, "cache");

export interface RawRow {
  name: string;
  nationality: string; // readable country name
  position: string; // page key: GK | FB | HB | DF | MF | FW | U
  careerSpans: [number, number][];
  apps: number; // Total column (starts + subs)
  goals: number;
  lfchId?: number; // lfchistory.net profile id from the row's citation
}

export interface SpinePlayer extends RawRow {
  id: string;
}

/** Football country codes seen in {{fb*|…}} templates → readable names. */
const COUNTRY: Record<string, string> = {
  ENG: "England", SCO: "Scotland", WAL: "Wales", NIR: "Northern Ireland", IRL: "Republic of Ireland",
  IRE: "Ireland", EGY: "Egypt", ESP: "Spain", FRA: "France", GER: "Germany", NED: "Netherlands",
  BRA: "Brazil", ARG: "Argentina", URU: "Uruguay", POR: "Portugal", DEN: "Denmark", SWE: "Sweden",
  NOR: "Norway", FIN: "Finland", USA: "United States", AUS: "Australia", RSA: "South Africa",
  SEN: "Senegal", GUI: "Guinea", MLI: "Mali", CIV: "Ivory Coast", CMR: "Cameroon", JPN: "Japan",
  KOR: "South Korea", CZE: "Czech Republic", SVK: "Slovakia", POL: "Poland", HUN: "Hungary",
  CRO: "Croatia", SRB: "Serbia", SUI: "Switzerland", AUT: "Austria", BEL: "Belgium", ITA: "Italy",
  GRE: "Greece", ISR: "Israel", ZIM: "Zimbabwe", JAM: "Jamaica", COL: "Colombia", UKR: "Ukraine",
  SVN: "Slovenia", MAR: "Morocco", NGA: "Nigeria", GHA: "Ghana", ISL: "Iceland", EST: "Estonia",
  LTU: "Lithuania", BUL: "Bulgaria", ROU: "Romania", TUR: "Turkey", MEX: "Mexico", CHI: "Chile",
  PER: "Peru", PAR: "Paraguay", CRC: "Costa Rica", NZL: "New Zealand", CAN: "Canada", GRN: "Grenada",
};

function countryName(raw: string): string {
  const v = raw.trim();
  return COUNTRY[v.toUpperCase()] ?? v; // full names ({{fba|England}}) pass through
}

/** Careers listed as "2015–" (still open) end at the data snapshot year. */
const OPEN_SPAN_END = 2026; // ponytail: bump on the next data refresh

/** Parse one list page's wikitext into rows. Pure — unit-tested on fixtures. */
export function parseListPage(wikitext: string): RawRow[] {
  const rows: RawRow[] = [];
  // Row header + cell separators vary by page editor: Liverpool uses `!scope=row`
  // with newline-`|` cells; Man Utd uses `! scope="row"` with inline `||` cells.
  // Accept both — non-player rows (e.g. the positions-key legend) are dropped by
  // the year/numeric guards below regardless.
  for (const chunk of wikitext.split(/(?:^|\n)!\s*scope="?row"?/).slice(1)) {
    const cellBlock = chunk.split(/\n\|-/)[0];
    // Protect `||` inside templates (e.g. {{sortname|Alisson||Becker}} — an empty
    // surname) so it isn't mistaken for an inline cell separator, then restore.
    const S = "\u0000"; // sentinel — never present in wikitext
    const cells = cellBlock
      .replace(/\{\{[^{}]*\}\}/g, (m) => m.replaceAll("||", S))
      .split(/\n\||\|\|/)
      .map((c) => c.trim().replaceAll(S, "||"));

    // name lives in the scope=row line: {{sortname|First|Last|dab?|sort?}} or [[Link|Name]]
    const sort = cells[0].match(/\{\{sortname\|([^|}]*)\|([^|}]*)/);
    const link = cells[0].match(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/);
    const name = sort ? `${sort[1].trim()} ${sort[2].trim()}`.trim() : link ? link[1].trim() : null;
    if (!name) continue;

    const flag = cellBlock.match(/\{\{fb\w*\|([^}|]+)/);
    const pos = cellBlock.match(/\{\{sort\|\d+\|([A-Z]{1,2})\}\}/) ?? cellBlock.match(/\n\|\s*([A-Z]{1,2})\s*\n/);

    // career cell = first cell after the name whose PLAIN text carries a year —
    // years inside templates ({{fba|South Africa|1928}}) or <ref>s don't count.
    const plain = (c: string) =>
      c
        .replace(/\{\{nowrap\|([^}]*)\}\}/gi, "$1") // career years often sit inside {{nowrap}}
        .replace(/\{\{[^}]*\}\}/g, "")
        .replace(/<ref[\s\S]*?(<\/ref>|\/>|$)/gi, "");
    const careerIdx = cells.findIndex((c, i) => i > 0 && /\b(18\d{2}|19\d{2}|20\d{2})\b/.test(plain(c)));
    if (careerIdx < 1 || careerIdx + 4 >= cells.length) continue;
    const isNum = (c: string) => /^[\d,]+$/.test(c.replace(/<[^>]+>/g, "").trim());
    if (!cells.slice(careerIdx + 1, careerIdx + 5).every(isNum)) continue;

    const numStart = careerIdx + 1;
    const careerCell = cells[careerIdx];
    const spans: [number, number][] = [];
    for (const m of plain(careerCell).matchAll(/(\d{4})(?:–(\d{4})?)?/g)) {
      const a = Number(m[1]);
      if (a < 1890 || a > OPEN_SPAN_END) continue;
      const b = m[0].endsWith("–") && !m[2] ? OPEN_SPAN_END : Number(m[2] ?? m[1]);
      if (b >= a) spans.push([a, b]);
    }
    if (spans.length === 0) continue;

    const nums = cells.slice(numStart, numStart + 4).map((c) => Number(c.replace(/[^0-9]/g, "")));
    const lfch = cellBlock.match(/lfchistory\.net\/Players\/Player\/Profile\/(\d+)/i);

    rows.push({
      name,
      nationality: flag ? countryName(flag[1]) : "Unknown",
      position: pos ? pos[1] : "U",
      careerSpans: spans,
      apps: nums[2],
      goals: nums[3],
      ...(lfch ? { lfchId: Number(lfch[1]) } : {}),
    });
  }
  return rows;
}

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Merge page row-sets into the spine, disambiguating duplicate names by first year. */
export function mergeSpine(pages: RawRow[][]): SpinePlayer[] {
  const all = pages.flat();
  const byName = new Map<string, number>();
  for (const r of all) byName.set(r.name, (byName.get(r.name) ?? 0) + 1);

  return all
    .map((r) => ({
      ...r,
      id: byName.get(r.name)! > 1 ? `${slugify(r.name)}-${r.careerSpans[0][0]}` : slugify(r.name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function fetchPage(title: string): Promise<string> {
  mkdirSync(CACHE_DIR, { recursive: true });
  const cacheFile = join(CACHE_DIR, `wp-${slugify(title)}.json`);
  if (existsSync(cacheFile)) {
    return JSON.parse(readFileSync(cacheFile, "utf8")).parse.wikitext;
  }
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=wikitext&format=json&formatversion=2`;
  const res = await fetch(url, { headers: { "User-Agent": "prime-xi-pipeline/1.0 (one-time roster build)" } });
  if (!res.ok) throw new Error(`Wikipedia fetch failed: ${res.status} ${title}`);
  const body = await res.json();
  writeFileSync(cacheFile, JSON.stringify(body));
  return body.parse.wikitext;
}

export async function fetchSpine(club = "liverpool", minPlayers = 700): Promise<SpinePlayer[]> {
  const titles = CLUB_PAGES[club];
  if (!titles) throw new Error(`No Wikipedia list pages configured for club: ${club}`);
  const pages = await Promise.all(titles.map(fetchPage));
  const spine = mergeSpine(pages.map(parseListPage));

  // The home club needs a complete roster; opponent research only needs the
  // notable subset, so callers can lower the floor.
  if (spine.length < minPlayers) throw new Error(`Spine too small: ${spine.length} players (expected ≥ ${minPlayers})`);
  const dupes = spine.filter((p, i) => spine.findIndex((q) => q.id === p.id) !== i);
  if (dupes.length > 0) throw new Error(`Duplicate ids: ${dupes.map((d) => d.id).join(", ")}`);

  // Liverpool keeps the original filename; other clubs get spine-<club>.json.
  const file = club === "liverpool" ? "spine.json" : `spine-${club}.json`;
  writeFileSync(join(CACHE_DIR, file), JSON.stringify(spine, null, 1));
  return spine;
}

// Run directly: `pnpm tsx pipeline/wikipedia.ts [club]`
if (require.main === module) {
  const club = process.argv[2] ?? "liverpool";
  const min = club === "liverpool" ? 700 : 50; // opponents research the notable subset only
  fetchSpine(club, min).then((s) => {
    console.log(`${club} spine: ${s.length} players, ${s.filter((p) => p.lfchId).length} with lfchistory ids`);
  });
}
