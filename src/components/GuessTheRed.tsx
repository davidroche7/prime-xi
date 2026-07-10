"use client";

import { useEffect, useMemo, useState } from "react";
import { GuessShareCard } from "@/components/GuessShareCard";
import { PlayerSearch } from "@/components/PlayerSearch";
import { dailyAnswerId, type Mode } from "@/lib/dailyAnswer";
import {
  giveUp,
  guess,
  initialState,
  MAX_CLUES,
  revealClue,
  score,
  shareText,
  type GuessState,
} from "@/lib/guessGame";
import { utcDateString } from "@/lib/prng";
import { SITE_URL } from "@/lib/site";
import { readStored, writeStored } from "@/lib/storage";
import type { AnswerPlayer, IndexedPlayer } from "@/lib/types";

interface GuessTheRedProps {
  players: IndexedPlayer[];
  answers: AnswerPlayer[];
}

interface Streak {
  lastPlayed: string; // "YYYY-MM-DD"
  count: number;
}

export function GuessTheRed({ players, answers }: GuessTheRedProps) {
  // Computed after mount: the puzzle depends on the visitor's current UTC date,
  // which must not run during static prerender.
  const [date, setDate] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("normal");
  const [state, setState] = useState<GuessState>(initialState());
  const [streak, setStreak] = useState<Streak | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDate(utcDateString());
    setStreak(readStored<Streak>("gtr:streak"));
  }, []);

  // restore (or reset) per-day, per-mode game state
  useEffect(() => {
    if (!date) return;
    setState(readStored<GuessState>(`gtr:${date}:${mode}`) ?? initialState());
    setCopied(false);
  }, [date, mode]);

  const answer = useMemo(() => {
    if (!date) return null;
    const id = dailyAnswerId(date, answers, mode);
    return answers.find((a) => a.id === id) ?? null;
  }, [date, mode, answers]);

  const nameById = useMemo(() => new Map(players.map((p) => [p.id, p.name])), [players]);

  const over = state.solved || state.failed;

  const apply = (next: GuessState) => {
    if (!date) return;
    setState(next);
    writeStored(`gtr:${date}:${mode}`, next);
    // streak tracks the standard daily puzzle only; a fail resets it
    const justEnded = (next.solved || next.failed) && !over;
    if (justEnded && mode === "normal") {
      const prev = readStored<Streak>("gtr:streak");
      if (prev?.lastPlayed !== date) {
        const yesterday = new Date(Date.parse(date) - 86400000).toISOString().slice(0, 10);
        const updated: Streak = next.solved
          ? { lastPlayed: date, count: prev?.lastPlayed === yesterday ? prev.count + 1 : 1 }
          : { lastPlayed: date, count: 0 };
        writeStored("gtr:streak", updated);
        setStreak(updated);
      }
    }
  };

  const submitGuess = (p: IndexedPlayer) => {
    if (!answer || over) return;
    apply(guess(state, p.id, answer.id));
  };

  const copyShare = async () => {
    if (!date) return;
    try {
      await navigator.clipboard.writeText(shareText(state, date, mode, `${SITE_URL}/daily/`));
      setCopied(true);
    } catch {
      // clipboard unavailable — the share card download still works
    }
  };

  if (!date || !answer) {
    return (
      <div className="shadow-poster-sm border-[3px] border-ink-950 bg-paper-50 p-8 text-center font-bold text-dune-600">
        Loading today&apos;s puzzle…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="font-bold text-dune-600">
          {date}
          {streak && streak.count > 0 ? <span className="ml-2">🔥 {streak.count}-day streak</span> : null}
        </span>
        <div className="flex border-[3px] border-ink-950 bg-paper-50 p-0.5" role="group" aria-label="Difficulty mode">
          {(["normal", "hard"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                mode === m ? "bg-blood-600 text-white" : "text-dune-600 hover:text-ink-950"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-2">
        {answer.clues.slice(0, state.cluesRevealed).map((clue, i) => (
          <li key={i} className="shadow-poster-sm flex gap-3 border-[3px] border-ink-950 bg-paper-50 p-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink-950 bg-blood-600 text-xs font-bold text-white">
              {i + 1}
            </span>
            <span>{clue}</span>
          </li>
        ))}
      </ol>

      {!over ? (
        <div className="mt-4">
          <PlayerSearch
            players={players}
            onPick={submitGuess}
            exclude={state.wrongGuesses}
            placeholder="Guess a Liverpool player…"
          />
          <div className="mt-3 flex items-center justify-between gap-2 text-sm">
            <span className="text-xs font-bold uppercase tracking-wide text-dune-600">
              Clue {state.cluesRevealed}/{MAX_CLUES} · solve now for {MAX_CLUES + 1 - state.cluesRevealed} pts
            </span>
            <span className="flex gap-2">
              {state.cluesRevealed < MAX_CLUES ? (
                <button
                  type="button"
                  onClick={() => apply(revealClue(state))}
                  className="border-2 border-ink-950 bg-paper-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide hover:bg-sand-300/60"
                >
                  Reveal next clue
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => apply(giveUp(state))}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-dune-600 hover:text-blood-600"
              >
                Give up
              </button>
            </span>
          </div>
        </div>
      ) : (
        <div className="shadow-poster mt-4 border-[3px] border-ink-950 bg-ink-950 p-5 text-center text-cream-100">
          {state.solved ? (
            <p className="text-lg">
              <span className="font-display uppercase text-cream-100">Solved!</span> It&apos;s{" "}
              <span className="font-bold">{answer.name}</span> — {score(state)}/6 points
            </p>
          ) : (
            <p className="text-lg">
              <span className="font-display uppercase text-blood-600">Not this time.</span> It was{" "}
              <span className="font-bold">{answer.name}</span>
            </p>
          )}
          <div className="mt-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={copyShare}
              className="border-2 border-cream-100 bg-blood-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-blood-700"
            >
              {copied ? "Copied!" : "Copy result"}
            </button>
            <GuessShareCard state={state} dateUTC={date} mode={mode} />
          </div>
        </div>
      )}

      {state.wrongGuesses.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {state.wrongGuesses.map((id) => (
            <span key={id} className="border-2 border-sand-300 px-3 py-1 text-sm font-bold text-dune-600 line-through">
              {nameById.get(id) ?? id}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
