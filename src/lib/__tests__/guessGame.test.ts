import { describe, expect, it } from "vitest";
import { guess, initialState, revealClue, score, shareText } from "../guessGame";

const ANSWER = "kenny-dalglish";

describe("guessGame reducer", () => {
  it("starts with one clue revealed and no result", () => {
    expect(initialState()).toEqual({ cluesRevealed: 1, wrongGuesses: [], solved: false, failed: false });
  });

  it("correct guess solves without revealing more clues", () => {
    const s = guess(initialState(), ANSWER, ANSWER);
    expect(s.solved).toBe(true);
    expect(s.cluesRevealed).toBe(1);
    expect(score(s)).toBe(6);
  });

  it("wrong guess records it and auto-reveals the next clue", () => {
    const s = guess(initialState(), "ian-rush", ANSWER);
    expect(s.solved).toBe(false);
    expect(s.wrongGuesses).toEqual(["ian-rush"]);
    expect(s.cluesRevealed).toBe(2);
  });

  it("voluntary reveal costs the same as a wrong guess", () => {
    const s = revealClue(initialState());
    expect(s.cluesRevealed).toBe(2);
    const solved = guess(s, ANSWER, ANSWER);
    expect(score(solved)).toBe(5);
  });

  it("solving on the last clue scores 1", () => {
    let s = initialState();
    for (let i = 0; i < 5; i++) s = revealClue(s);
    expect(s.cluesRevealed).toBe(6);
    expect(score(guess(s, ANSWER, ANSWER))).toBe(1);
  });

  it("wrong guess with all clues revealed fails the game", () => {
    let s = initialState();
    for (let i = 0; i < 5; i++) s = revealClue(s);
    s = guess(s, "ian-rush", ANSWER);
    expect(s.failed).toBe(true);
    expect(score(s)).toBe(0);
  });

  it("cannot reveal past 6 and terminal states are frozen", () => {
    let s = initialState();
    for (let i = 0; i < 9; i++) s = revealClue(s);
    expect(s.cluesRevealed).toBe(6);
    const solved = guess(s, ANSWER, ANSWER);
    expect(guess(solved, "ian-rush", ANSWER)).toEqual(solved);
    expect(revealClue(solved)).toEqual(solved);
  });

  it("duplicate wrong guesses are not double-counted", () => {
    let s = guess(initialState(), "ian-rush", ANSWER);
    s = guess(s, "ian-rush", ANSWER);
    expect(s.wrongGuesses).toEqual(["ian-rush"]);
    expect(s.cluesRevealed).toBe(2);
  });
});

describe("shareText", () => {
  it("renders a Wordle-style solve line", () => {
    let s = revealClue(initialState());
    s = guess(s, ANSWER, ANSWER);
    expect(shareText(s, "2026-07-07", "normal", "https://example.com")).toBe(
      "Guess the Red 2026-07-07 2/6\n🟥🟩\nhttps://example.com",
    );
  });

  it("renders failure with all six used and a black box", () => {
    let s = initialState();
    for (let i = 0; i < 5; i++) s = revealClue(s);
    s = guess(s, "wrong", ANSWER);
    expect(shareText(s, "2026-07-07", "normal", "https://example.com")).toBe(
      "Guess the Red 2026-07-07 X/6\n🟥🟥🟥🟥🟥🟥⬛\nhttps://example.com",
    );
  });

  it("marks hard mode", () => {
    const s = guess(initialState(), ANSWER, ANSWER);
    expect(shareText(s, "2026-07-07", "hard", "https://example.com")).toContain("HARD");
  });

  it("never contains the answer", () => {
    const s = guess(initialState(), ANSWER, ANSWER);
    expect(shareText(s, "2026-07-07", "normal", "https://example.com")).not.toContain("dalglish");
  });
});
