/** Season labels: 1976 → "1976-77", 1999 → "1999-00". */

export function seasonLabel(startYear: number): string {
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

/** Seasons a career spanning [first, last] calendar years could cover. */
export function seasonsBetween(first: number, last: number): string[] {
  const out: string[] = [];
  for (let y = first; y <= Math.max(first, last - 1); y++) out.push(seasonLabel(y));
  return out;
}

/** Manager tenure strings → season labels: "1959–1974", "1985–1991, 2011–2012", "2024–". */
export function seasonsFromYearRanges(years: string, nowYear = new Date().getFullYear()): string[] {
  const out: string[] = [];
  for (const part of years.split(",")) {
    const m = part.trim().match(/^(\d{4})(?:\s*[–-]\s*(\d{4})?)?$/);
    if (!m) continue;
    out.push(...seasonsBetween(Number(m[1]), m[2] ? Number(m[2]) : nowYear));
  }
  return out;
}
