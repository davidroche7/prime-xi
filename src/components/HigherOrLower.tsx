"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CHAIN_LENGTH,
  answer as applyAnswer,
  complete,
  dailyChain,
  initialState,
  shareText,
  type HigherLowerState,
  type StatPlayer,
} from "@/lib/higherLower";
import { utcDateString } from "@/lib/prng";
import { SITE_URL } from "@/lib/site";
import { readStored, writeStored } from "@/lib/storage";

interface HigherOrLowerProps {
  players: StatPlayer[];
}

export function HigherOrLower({ players }: HigherOrLowerProps) {
  const [date, setDate] = useState<string | null>(null);
  const [state, setState] = useState<HigherLowerState>(initialState());
  const [best, setBest] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDate(utcDateString());
    setBest(readStored<number>("hol:best") ?? 0);
  }, []);

  useEffect(() => {
    if (!date) return;
    setState(readStored<HigherLowerState>(`hol:${date}`) ?? initialState());
    setCopied(false);
  }, [date]);

  const chain = useMemo(() => {
    if (!date) return null;
    const ids = dailyChain(players, date);
    const byId = new Map(players.map((p) => [p.id, p]));
    return ids.map((id) => byId.get(id)!);
  }, [date, players]);

  const apply = (next: HigherLowerState) => {
    if (!date) return;
    setState(next);
    writeStored(`hol:${date}`, next);
    if (next.streak > best) {
      writeStored("hol:best", next.streak);
      setBest(next.streak);
    }
  };

  const guess = (dir: "higher" | "lower") => {
    if (!chain) return;
    apply(applyAnswer(state, chain, dir));
  };

  const copyShare = async () => {
    if (!date) return;
    try {
      await navigator.clipboard.writeText(shareText(state, date, `${SITE_URL}/higher-lower/`));
      setCopied(true);
    } catch {
      // clipboard unavailable
    }
  };

  if (!date || !chain) {
    return (
      <div className="shadow-poster-sm border-[3px] border-ink-950 bg-paper-50 p-8 text-center font-bold text-dune-600">
        Loading today&apos;s chain…
      </div>
    );
  }

  const over = state.failed || complete(state, chain.length);
  const current = chain[state.index - 1];
  const next = chain[state.index];

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="font-bold text-dune-600">{date}</span>
        {best > 0 ? <span className="font-bold text-dune-600">🏆 best streak {best}</span> : null}
      </div>

      <div className="shadow-poster-sm border-[3px] border-ink-950 bg-ink-950 p-5 text-center text-cream-100">
        <p className="text-xs font-bold uppercase tracking-wide text-cream-100/60">More Liverpool appearances than</p>
        <p className="font-display mt-1 text-2xl uppercase">{current.name}</p>
        <p className="mt-1 text-sm font-bold">{current.apps} appearances</p>
      </div>

      {!over ? (
        <>
          <p className="mt-4 text-center text-sm font-bold text-dune-600">
            Does <span className="text-ink-950">{next.name}</span> have more or fewer?
          </p>
          <div className="mt-3 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => guess("higher")}
              className="border-2 border-ink-950 bg-paper-50 px-6 py-2 text-xs font-bold uppercase tracking-wide hover:bg-sand-300/60"
            >
              Higher
            </button>
            <button
              type="button"
              onClick={() => guess("lower")}
              className="border-2 border-ink-950 bg-paper-50 px-6 py-2 text-xs font-bold uppercase tracking-wide hover:bg-sand-300/60"
            >
              Lower
            </button>
          </div>
          <p className="mt-3 text-center text-xs font-bold uppercase tracking-wide text-dune-600">
            Streak {state.streak}/{CHAIN_LENGTH - 1}
          </p>
        </>
      ) : (
        <div className="shadow-poster mt-4 border-[3px] border-ink-950 bg-ink-950 p-5 text-center text-cream-100">
          <p className="text-lg">
            <span className="font-display uppercase">
              {state.streak === CHAIN_LENGTH - 1 ? "Perfect chain!" : "Chain broken."}
            </span>{" "}
            Streak of {state.streak}
          </p>
          {!complete(state, chain.length) ? (
            <p className="mt-1 text-sm text-cream-100/70">
              {next.name} had {next.apps} appearances — {current.name} had {current.apps}.
            </p>
          ) : null}
          <button
            type="button"
            onClick={copyShare}
            className="mt-4 border-2 border-cream-100 bg-blood-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-blood-700"
          >
            {copied ? "Copied!" : "Copy result"}
          </button>
        </div>
      )}
    </div>
  );
}
