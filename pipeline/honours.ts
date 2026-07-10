/** Team-honour marks for the team sheet: parse the free-text lfchistory honours
 *  string into ≤3 short marks like "CL ’05" / "LG ’88", major honours first.
 *  Individual awards (Player of the Year etc.) are excluded by construction: a
 *  competition prefix only counts if the rest of its segment is years/punctuation. */

const COMPS: [RegExp, string, number][] = [
  [/^European Cup/i, "EC", 1],
  [/^Champions League/i, "CL", 1],
  [/^(League Championship|First Division|Premier League)/i, "LG", 2],
  [/^(European )?Cup Winners'? Cup/i, "CWC", 3],
  [/^(UEFA Cup|Europa League)/i, "UEFA", 3],
  [/^FA Cup/i, "FA", 4],
  [/^League Cup/i, "LC", 5],
];

const yearOf = (seg: string): string | null => {
  const m = seg.match(/\b(\d{4})(?:\/(\d{2}))?/);
  if (!m) return null;
  return `’${m[2] ?? m[1].slice(2)}`;
};

export function honourMarks(honours: string | undefined): string[] {
  if (!honours) return [];
  // honours listed after "Manager:" were won as a manager, not a player
  const found = new Map<string, { prio: number; year: string | null }>();
  for (const raw of honours.split(/Manager:/)[0].split(/[;,.]/)) {
    const seg = raw.trim().replace(/^Player:\s*/i, "");
    if (!seg || /^[\d\s\/–-]+$/.test(seg)) continue; // bare years = extra wins; first year already kept
    const hit = COMPS.find(([re]) => re.test(seg));
    if (!hit) continue;
    const rest = seg.replace(hit[0], "");
    if (!/^[\s\d\/:–-]*$/.test(rest)) continue; // trailing words = an award, not the trophy
    const [, abbr, prio] = hit;
    if (!found.has(abbr)) found.set(abbr, { prio, year: yearOf(seg) });
  }
  return [...found.entries()]
    .sort((a, b) => a[1].prio - b[1].prio)
    .slice(0, 3)
    .map(([abbr, { year }]) => (year ? `${abbr} ${year}` : abbr));
}
