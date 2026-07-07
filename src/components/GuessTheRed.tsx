"use client";

import { useEffect, useMemo, useState } from "react";
import { GuessShareCard } from "@/components/GuessShareCard";
import { dailyAnswerId, type Mode } from "@/lib/dailyAnswer";
import {
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
import type { AnswerPlayer, IndexedPlayer } from "@/lib/types";

interface GuessTheRedProps {
  players: IndexedPlayer[];
  answers: AnswerPlayer[];
}

interface Streak {
  lastPlayed: string; // "YYYY-MM-DD"
  count: number;
}

// localStorage is optional-only (spec §1) — every access swallows failures
function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — state just won't persist
  }
}

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function GuessTheRed({ players, answers }: GuessTheRedProps) {
  // Computed after mount: the puzzle depends on the visitor's current UTC date,
  // which must not run during static prerender.
  const [date, setDate] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("normal");
  const [state, setState] = useState<GuessState>(initialState());
  const [streak, setStreak] = useState<Streak | null>(null);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDate(utcDateString());
    setStreak(readJson<Streak>("gtr:streak"));
  }, []);

  // restore (or reset) per-day, per-mode game state
  useEffect(() => {
    if (!date) return;
    setState(readJson<GuessState>(`gtr:${date}:${mode}`) ?? initialState());
    setQuery("");
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
    writeJson(`gtr:${date}:${mode}`, next);
    // streak tracks the standard daily puzzle only; a fail resets it
    const justEnded = (next.solved || next.failed) && !over;
    if (justEnded && mode === "normal") {
      const prev = readJson<Streak>("gtr:streak");
      if (prev?.lastPlayed !== date) {
        const yesterday = new Date(Date.parse(date) - 86400000).toISOString().slice(0, 10);
        const updated: Streak = next.solved
          ? { lastPlayed: date, count: prev?.lastPlayed === yesterday ? prev.count + 1 : 1 }
          : { lastPlayed: date, count: 0 };
        writeJson("gtr:streak", updated);
        setStreak(updated);
      }
    }
  };

  const matches = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    const hits = players.filter(
      (p) => !state.wrongGuesses.includes(p.id) && p.search.some((s) => s.includes(q)),
    );
    hits.sort((a, b) => {
      const aPre = a.search.some((s) => s.startsWith(q)) ? 0 : 1;
      const bPre = b.search.some((s) => s.startsWith(q)) ? 0 : 1;
      return aPre - bPre || a.name.localeCompare(b.name);
    });
    return hits.slice(0, 8);
  }, [players, query, state.wrongGuesses]);

  const submitGuess = (p: IndexedPlayer) => {
    if (!answer || over) return;
    apply(guess(state, p.id, answer.id));
    setQuery("");
    setHighlight(0);
  };

  const copyShare = async () => {
    if (!date) return;
    try {
      await navigator.clipboard.writeText(shareText(state, date, mode, SITE_URL));
      setCopied(true);
    } catch {
      // clipboard unavailable — the share card download still works
    }
  };

  if (!date || !answer) {
    return (
      <div className="rounded-xl border border-ink-700 bg-ink-900 p-8 text-center text-zinc-400">
        Loading today&apos;s puzzle…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-zinc-400">
          {date}
          {streak && streak.count > 0 ? <span className="ml-2">🔥 {streak.count}-day streak</span> : null}
        </span>
        <div className="flex rounded-lg border border-ink-700 p-0.5" role="group" aria-label="Difficulty mode">
          {(["normal", "hard"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 font-semibold capitalize ${
                mode === m ? "bg-red-700 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-2">
        {answer.clues.slice(0, state.cluesRevealed).map((clue, i) => (
          <li key={i} className="flex gap-3 rounded-lg border border-ink-800 bg-ink-900 p-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-red-900/60 text-xs font-bold text-red-200">
              {i + 1}
            </span>
            <span>{clue}</span>
          </li>
        ))}
      </ol>

      {!over ? (
        <div className="relative mt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlight(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlight((h) => Math.min(h + 1, matches.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlight((h) => Math.max(h - 1, 0));
              } else if (e.key === "Enter" && matches[highlight]) {
                e.preventDefault();
                submitGuess(matches[highlight]);
              } else if (e.key === "Escape") {
                setQuery("");
              }
            }}
            placeholder="Guess a Liverpool player…"
            aria-label="Guess a Liverpool player"
            autoComplete="off"
            className="w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-red-700"
          />
          {matches.length > 0 ? (
            <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-ink-700 bg-ink-900 shadow-xl">
              {matches.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => submitGuess(p)}
                    onMouseEnter={() => setHighlight(i)}
                    className={`flex w-full items-baseline justify-between px-4 py-2 text-left ${
                      i === highlight ? "bg-red-900/40" : ""
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-xs text-zinc-500">
                      {p.years[0]}–{p.years[1]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-zinc-500">
              Clue {state.cluesRevealed}/{MAX_CLUES} · solve now for {MAX_CLUES + 1 - state.cluesRevealed} pts
            </span>
            {state.cluesRevealed < MAX_CLUES ? (
              <button
                type="button"
                onClick={() => apply(revealClue(state))}
                className="rounded-lg border border-ink-700 px-3 py-1.5 text-zinc-300 hover:border-red-700 hover:text-white"
              >
                Reveal next clue
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-ink-700 bg-ink-900 p-5 text-center">
          {state.solved ? (
            <p className="text-lg">
              <span className="font-black text-emerald-400">Solved!</span> It&apos;s{" "}
              <span className="font-bold">{answer.name}</span> — {score(state)}/6 points
            </p>
          ) : (
            <p className="text-lg">
              <span className="font-black text-red-400">Out of clues.</span> It was{" "}
              <span className="font-bold">{answer.name}</span>
            </p>
          )}
          <div className="mt-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={copyShare}
              className="rounded-lg bg-red-700 px-4 py-2 font-bold text-white hover:bg-red-600"
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
            <span key={id} className="rounded-full border border-ink-700 px-3 py-1 text-zinc-400 line-through">
              {nameById.get(id) ?? id}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
