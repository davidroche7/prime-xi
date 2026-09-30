import type { IndexedPlayer } from "./types";

/**
 * §On this day — Liverpool players born on a given calendar date. Pure: "today"
 * is passed in as "MM-DD", never read from the system clock in here. Coverage
 * is whatever the source (lfchistory "Born" field) actually gave a full date
 * for — most days have zero or one match, never a guessed or padded one.
 */

export function playersBornOn(players: readonly IndexedPlayer[], monthDay: string): IndexedPlayer[] {
  return players.filter((p) => p.birthMonthDay === monthDay);
}

export interface NextBirthday {
  player: IndexedPlayer;
  monthDay: string;
  daysAway: number;
}

const REFERENCE_YEAR = 2001; // non-leap — only used for MM-DD ordering, never a real date
const dayOfYear = (monthDay: string) => {
  const [m, d] = monthDay.split("-").map(Number);
  return Date.UTC(REFERENCE_YEAR, m - 1, d) / 86400000;
};

/** Nearest upcoming birthday after `monthDay`, wrapping year-end — the honest
 *  fallback when today has no match, instead of showing nothing. */
export function nextBirthdayAfter(players: readonly IndexedPlayer[], monthDay: string): NextBirthday | undefined {
  const today = dayOfYear(monthDay);
  let best: NextBirthday | undefined;
  for (const player of players) {
    if (!player.birthMonthDay) continue;
    // REFERENCE_YEAR (2001) has 365 days — that's the wrap length, not 366.
    const daysAway = (((dayOfYear(player.birthMonthDay) - today) % 365) + 365) % 365 || 365;
    if (!best || daysAway < best.daysAway) best = { player, monthDay: player.birthMonthDay, daysAway };
  }
  return best;
}
