import { dayNumber } from "./dailyAnswer";
import { hashString, mulberry32 } from "./prng";

/**
 * §Game C — Higher or Lower. A chain of Liverpool players by career appearances;
 * guess whether the next is higher or lower than the last, chain breaks on a
 * wrong call. Same daily chain worldwide, deterministic, pure.
 */

export interface StatPlayer {
  id: string;
  name: string;
  apps: number;
}

export const CHAIN_LENGTH = 8;

function shuffledIds(pool: readonly StatPlayer[]): string[] {
  const ids = pool.map((p) => p.id).sort(); // stable regardless of input order
  const rng = mulberry32(hashString("higher-lower-v1"));
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

/** Today's chain of player ids — a rotating window over a fixed-seed shuffle,
 *  so it changes daily but is identical worldwide for the same date. */
export function dailyChain(pool: readonly StatPlayer[], dateUTC: string): string[] {
  const ids = shuffledIds(pool);
  if (ids.length < CHAIN_LENGTH) throw new Error("dailyChain: pool too small");
  const day = dayNumber(dateUTC);
  const start = (((day * CHAIN_LENGTH) % ids.length) + ids.length) % ids.length;
  return Array.from({ length: CHAIN_LENGTH }, (_, i) => ids[(start + i) % ids.length]);
}

export type Direction = "higher" | "lower";

export interface HigherLowerState {
  index: number; // chain position being compared in next (1-based; 1 = comparing chain[1] to chain[0])
  streak: number;
  failed: boolean;
}

export function initialState(): HigherLowerState {
  return { index: 1, streak: 0, failed: false };
}

export const complete = (state: HigherLowerState, chainLength: number) => state.index >= chainLength;

/** Equal apps counts as correct either way — a tie isn't a wrong guess. */
export function answer(state: HigherLowerState, chain: readonly StatPlayer[], guess: Direction): HigherLowerState {
  if (state.failed || complete(state, chain.length)) return state;
  const prev = chain[state.index - 1];
  const curr = chain[state.index];
  const correct = curr.apps === prev.apps || (curr.apps > prev.apps ? guess === "higher" : guess === "lower");
  if (!correct) return { ...state, failed: true };
  return { ...state, index: state.index + 1, streak: state.streak + 1 };
}

export function shareText(state: HigherLowerState, dateUTC: string, url: string): string {
  return `Higher or Lower ${dateUTC} — streak ${state.streak}/${CHAIN_LENGTH - 1}\n${url}`;
}
