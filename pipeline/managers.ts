import type { Manager } from "../src/lib/types";

/**
 * Curated Liverpool managers — famous facts, hand-checked. Honours listed by
 * season so the canonical manager's peak season is computed, not hand-picked.
 */

export interface ManagerRecord extends Manager {
  /** major honours by season, e.g. { season: "1976-77", honours: ["league", "european-cup"] } */
  honours: { season: string; honours: string[] }[];
}

/** Spec §5 weights. Unlisted honours (Charity Shield, Club World Cup…) weigh 0. */
const WEIGHTS: Record<string, number> = {
  "european-cup": 10, // incl. Champions League
  league: 8,
  "uefa-cup": 5, // incl. Europa League
  "cup-winners-cup": 5,
  "european-super-cup": 5,
  "fa-cup": 3,
  "league-cup": 2,
};

/** argmax of weighted honours; ties → earlier season. */
export function managerPeakSeason(honours: ManagerRecord["honours"]): string {
  if (honours.length === 0) throw new Error("managerPeakSeason: no honours listed");
  let best = honours[0];
  let bestScore = -1;
  for (const h of [...honours].sort((a, b) => a.season.localeCompare(b.season))) {
    const s = h.honours.reduce((sum, name) => sum + (WEIGHTS[name] ?? 0), 0);
    if (s > bestScore) {
      best = h;
      bestScore = s;
    }
  }
  return best.season;
}

export const MANAGERS: ManagerRecord[] = [
  { id: "we-barclay", name: "W.E. Barclay", years: "1892–1896", honours: [] },
  { id: "tom-watson", name: "Tom Watson", years: "1896–1915", honours: [
    { season: "1900-01", honours: ["league"] },
    { season: "1905-06", honours: ["league"] },
  ] },
  { id: "david-ashworth", name: "David Ashworth", years: "1920–1923", honours: [
    { season: "1921-22", honours: ["league"] },
  ] },
  { id: "matt-mcqueen", name: "Matt McQueen", years: "1923–1928", honours: [
    { season: "1922-23", honours: ["league"] },
  ] },
  { id: "george-patterson", name: "George Patterson", years: "1928–1936", honours: [] },
  { id: "george-kay", name: "George Kay", years: "1936–1951", honours: [
    { season: "1946-47", honours: ["league"] },
  ] },
  { id: "don-welsh", name: "Don Welsh", years: "1951–1956", honours: [] },
  { id: "phil-taylor", name: "Phil Taylor", years: "1956–1959", honours: [] },
  { id: "bill-shankly", name: "Bill Shankly", years: "1959–1974", honours: [
    { season: "1963-64", honours: ["league"] },
    { season: "1964-65", honours: ["fa-cup"] },
    { season: "1965-66", honours: ["league"] },
    { season: "1972-73", honours: ["league", "uefa-cup"] },
    { season: "1973-74", honours: ["fa-cup"] },
  ] },
  { id: "bob-paisley", name: "Bob Paisley", years: "1974–1983", honours: [
    { season: "1975-76", honours: ["league", "uefa-cup"] },
    { season: "1976-77", honours: ["league", "european-cup"] },
    { season: "1977-78", honours: ["european-cup", "european-super-cup"] },
    { season: "1978-79", honours: ["league"] },
    { season: "1979-80", honours: ["league"] },
    { season: "1980-81", honours: ["european-cup", "league-cup"] },
    { season: "1981-82", honours: ["league", "league-cup"] },
    { season: "1982-83", honours: ["league", "league-cup"] },
  ] },
  { id: "joe-fagan", name: "Joe Fagan", years: "1983–1985", honours: [
    { season: "1983-84", honours: ["league", "european-cup", "league-cup"] },
  ] },
  { id: "kenny-dalglish", name: "Kenny Dalglish", years: "1985–1991, 2011–2012", honours: [
    { season: "1985-86", honours: ["league", "fa-cup"] },
    { season: "1987-88", honours: ["league"] },
    { season: "1988-89", honours: ["fa-cup"] },
    { season: "1989-90", honours: ["league"] },
    { season: "2011-12", honours: ["league-cup"] },
  ] },
  { id: "graeme-souness", name: "Graeme Souness", years: "1991–1994", honours: [
    { season: "1991-92", honours: ["fa-cup"] },
  ] },
  { id: "roy-evans", name: "Roy Evans", years: "1994–1998", honours: [
    { season: "1994-95", honours: ["league-cup"] },
  ] },
  { id: "gerard-houllier", name: "Gérard Houllier", years: "1998–2004", honours: [
    { season: "2000-01", honours: ["fa-cup", "league-cup", "uefa-cup"] },
    { season: "2001-02", honours: ["european-super-cup"] },
    { season: "2002-03", honours: ["league-cup"] },
  ] },
  { id: "rafael-benitez", name: "Rafael Benítez", years: "2004–2010", honours: [
    { season: "2004-05", honours: ["european-cup"] },
    { season: "2005-06", honours: ["fa-cup", "european-super-cup"] },
  ] },
  { id: "roy-hodgson", name: "Roy Hodgson", years: "2010–2011", honours: [] },
  { id: "brendan-rodgers", name: "Brendan Rodgers", years: "2012–2015", honours: [] },
  { id: "jurgen-klopp", name: "Jürgen Klopp", years: "2015–2024", honours: [
    { season: "2018-19", honours: ["european-cup"] },
    { season: "2019-20", honours: ["league", "european-super-cup"] },
    { season: "2021-22", honours: ["fa-cup", "league-cup"] },
    { season: "2023-24", honours: ["league-cup"] },
  ] },
  { id: "arne-slot", name: "Arne Slot", years: "2024–", honours: [
    { season: "2024-25", honours: ["league"] },
  ] },
];
