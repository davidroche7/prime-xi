/**
 * §Game A — pure guess-game reducer. Six clues, hardest → easiest. A wrong guess
 * (or a voluntary reveal) exposes the next clue; solving on clue k scores 7−k;
 * a wrong guess with all six clues out is a fail.
 */

export const MAX_CLUES = 6;

export interface GuessState {
  cluesRevealed: number; // 1..6
  wrongGuesses: string[];
  solved: boolean;
  failed: boolean;
}

export function initialState(): GuessState {
  return { cluesRevealed: 1, wrongGuesses: [], solved: false, failed: false };
}

export function guess(state: GuessState, guessId: string, answerId: string): GuessState {
  if (state.solved || state.failed) return state;
  if (guessId === answerId) return { ...state, solved: true };
  if (state.wrongGuesses.includes(guessId)) return state;

  const wrongGuesses = [...state.wrongGuesses, guessId];
  return state.cluesRevealed >= MAX_CLUES
    ? { ...state, wrongGuesses, failed: true }
    : { ...state, wrongGuesses, cluesRevealed: state.cluesRevealed + 1 };
}

export function revealClue(state: GuessState): GuessState {
  if (state.solved || state.failed || state.cluesRevealed >= MAX_CLUES) return state;
  return { ...state, cluesRevealed: state.cluesRevealed + 1 };
}

/** Concede: ends the game as a fail so the answer can be revealed. */
export function giveUp(state: GuessState): GuessState {
  if (state.solved || state.failed) return state;
  return { ...state, failed: true };
}

/** 6 (first-clue solve) … 1 (last-clue solve); 0 unsolved. */
export function score(state: GuessState): number {
  return state.solved ? MAX_CLUES + 1 - state.cluesRevealed : 0;
}

export function shareText(state: GuessState, dateUTC: string, mode: "normal" | "hard", url: string): string {
  const attempts = state.solved ? `${state.cluesRevealed}/6` : "X/6";
  const grid = state.solved
    ? "🟥".repeat(state.cluesRevealed - 1) + "🟩"
    : "🟥".repeat(state.cluesRevealed) + "⬛";
  const hard = mode === "hard" ? " HARD" : "";
  return `Guess the Red ${dateUTC}${hard} ${attempts}\n${grid}\n${url}`;
}
