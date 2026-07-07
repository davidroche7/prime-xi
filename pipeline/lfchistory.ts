import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { SpinePlayer } from "./wikipedia";

/**
 * Pipeline B — enrich the notable subset from lfchistory.net player profiles.
 * robots.txt permits; we fetch once with a 1.5s delay, cache every page to disk,
 * and extract FACTS only (never editorial text). Credit appears in the site footer.
 */

const CACHE_DIR = join(__dirname, "cache", "lfchistory");
const DELAY_MS = 1500;
const MIN_APPS = 50; // enrichment subset threshold (~350 players)

export interface Enrichment {
  lfchId: number;
  birthYear?: number;
  birthplace?: string;
  signedFrom?: string;
  fee?: string; // "£43.9m" — only when the Joined Liverpool field carries one
  joinedYear?: number;
  debutYear?: number;
  honours?: string; // raw honours string; clue generation extracts trophies
  intlCaps?: string; // "74 (33 goals)" style, when present
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&([a-z])uml;/gi, (_, c) => ({ a: "ä", o: "ö", u: "ü", e: "ë", i: "ï", A: "Ä", O: "Ö", U: "Ü" })[c as string] ?? c);
}

/** Extract the profile <dl>'s dt/dd pairs into a label→value map. Pure. */
export function parseProfile(html: string): Enrichment {
  const fields = new Map<string, string>();
  for (const m of html.matchAll(/<dt>([^<]+)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/g)) {
    const value = decodeEntities(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    fields.set(m[1].replace(/:\s*$/, "").trim(), value);
  }
  const year = (v?: string) => {
    const m = v?.match(/\b(1[89]\d{2}|20\d{2})\b/);
    return m ? Number(m[1]) : undefined;
  };
  const joined = fields.get("Joined Liverpool");
  const fee = joined?.match(/£[\d.,]+[mk]?/i)?.[0];

  return {
    lfchId: 0, // caller sets
    birthYear: year(fields.get("Born")),
    birthplace: fields.get("Place of Birth") || undefined,
    signedFrom: fields.get("Signed from") || undefined,
    ...(fee ? { fee } : {}),
    joinedYear: year(joined),
    debutYear: year(fields.get("Debut")),
    honours: fields.get("Honours") || undefined,
    intlCaps: fields.get("International caps") || undefined,
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchProfile(lfchId: number): Promise<string> {
  const cacheFile = join(CACHE_DIR, `${lfchId}.html`);
  if (existsSync(cacheFile)) return readFileSync(cacheFile, "utf8");

  await sleep(DELAY_MS); // polite: only delays on cache miss
  const res = await fetch(`https://www.lfchistory.net/players/${lfchId}`, {
    headers: { "User-Agent": "prime-xi-pipeline/1.0 (one-time data build; cached; contact: site footer)" },
  });
  if (!res.ok) throw new Error(`lfchistory ${lfchId}: HTTP ${res.status}`);
  const html = await res.text();
  writeFileSync(cacheFile, html);
  return html;
}

export function enrichmentSubset(spine: SpinePlayer[]): SpinePlayer[] {
  return spine.filter((p) => p.lfchId && p.apps >= MIN_APPS);
}

export async function fetchEnrichment(spine: SpinePlayer[]): Promise<Record<number, Enrichment>> {
  mkdirSync(CACHE_DIR, { recursive: true });
  const subset = enrichmentSubset(spine);
  const out: Record<number, Enrichment> = {};
  let done = 0;
  for (const p of subset) {
    try {
      const html = await fetchProfile(p.lfchId!);
      out[p.lfchId!] = { ...parseProfile(html), lfchId: p.lfchId! };
    } catch (e) {
      console.warn(`skip ${p.name} (${p.lfchId}): ${e}`);
    }
    done++;
    if (done % 25 === 0) console.log(`enrichment: ${done}/${subset.length}`);
  }
  writeFileSync(join(__dirname, "cache", "enrichment.json"), JSON.stringify(out, null, 1));
  return out;
}

// Run directly: `pnpm tsx pipeline/lfchistory.ts`
if (require.main === module) {
  const spine: SpinePlayer[] = JSON.parse(readFileSync(join(__dirname, "cache", "spine.json"), "utf8"));
  fetchEnrichment(spine).then((e) => {
    const vals = Object.values(e);
    console.log(
      `enriched ${vals.length}; birthplace ${vals.filter((v) => v.birthplace).length}, signedFrom ${vals.filter((v) => v.signedFrom).length}, honours ${vals.filter((v) => v.honours).length}, fee ${vals.filter((v) => v.fee).length}`,
    );
  });
}
