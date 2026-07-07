"use client";

import { useMemo, useState } from "react";
import { normalizeCanonical as normalize } from "@/lib/canonicalHash";
import type { IndexedPlayer } from "@/lib/types";

interface PlayerSearchProps {
  players: IndexedPlayer[];
  onPick: (p: IndexedPlayer) => void;
  placeholder: string;
  /** player ids to hide from results (already guessed / already picked) */
  exclude?: string[];
}

/** Autocomplete restricted to the real all-time roster — blind: name + years only. */
export function PlayerSearch({ players, onPick, placeholder, exclude }: PlayerSearchProps) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const matches = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    const hidden = new Set(exclude);
    const hits = players.filter((p) => !hidden.has(p.id) && p.search.some((s) => s.includes(q)));
    hits.sort((a, b) => {
      const aPre = a.search.some((s) => s.startsWith(q)) ? 0 : 1;
      const bPre = b.search.some((s) => s.startsWith(q)) ? 0 : 1;
      return aPre - bPre || a.name.localeCompare(b.name);
    });
    return hits.slice(0, 8);
  }, [players, query, exclude]);

  const pick = (p: IndexedPlayer) => {
    onPick(p);
    setQuery("");
    setHighlight(0);
  };

  return (
    <div className="relative">
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
            pick(matches[highlight]);
          } else if (e.key === "Escape") {
            setQuery("");
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        className="w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-red-700"
      />
      {matches.length > 0 ? (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-ink-700 bg-ink-900 shadow-xl">
          {matches.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => pick(p)}
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
    </div>
  );
}
