"use client";

import { useMemo, useState } from "react";
import { fit, type Fit } from "@/lib/scoring";
import type { FormationSlot, PlayerSeason } from "@/lib/types";

interface PlayerPickerProps {
  slot: FormationSlot;
  players: PlayerSeason[];
  usedIds: Set<string>;
  remaining: number; // credits left excluding current slot occupant
  currentId?: string;
  onPick: (player: PlayerSeason) => void;
  onClear: () => void;
  onClose: () => void;
}

const FIT_LABEL: Record<Fit, string> = { natural: "", adjacent: "off-position", alien: "way off" };

export function PlayerPicker({ slot, players, usedIds, remaining, currentId, onPick, onClear, onClose }: PlayerPickerProps) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    return players
      .map((p) => ({ p, f: fit(p.positions, slot.group) }))
      .filter(({ f }) => showAll || f !== "alien")
      .filter(({ p }) => !q || p.playerName.toLowerCase().includes(q) || p.seasonLabel.includes(q))
      .sort((a, b) => b.p.rating - a.p.rating || a.p.playerName.localeCompare(b.p.playerName));
  }, [players, slot.group, query, showAll]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-ink-700 bg-ink-900">
      <div className="flex items-center justify-between border-b border-ink-800 p-3">
        <h3 className="text-sm font-bold">
          Pick a {slot.group} <span className="font-normal text-zinc-400">· {remaining.toFixed(1)} credits left</span>
        </h3>
        <button type="button" onClick={onClose} className="rounded px-2 text-zinc-400 hover:text-white" aria-label="Close picker">
          ✕
        </button>
      </div>
      <div className="flex items-center gap-2 border-b border-ink-800 p-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search player or season…"
          className="w-full rounded border border-ink-700 bg-ink-950 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
        />
        <label className="flex shrink-0 items-center gap-1 text-xs text-zinc-400">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
          all
        </label>
      </div>
      <ul className="flex-1 divide-y divide-ink-800 overflow-y-auto">
        {currentId ? (
          <li>
            <button type="button" onClick={onClear} className="w-full px-3 py-2 text-left text-sm text-red-300 hover:bg-ink-800">
              Remove current player
            </button>
          </li>
        ) : null}
        {options.map(({ p, f }) => {
          const used = usedIds.has(p.id) && p.id !== currentId;
          const unaffordable = p.cost > remaining && p.id !== currentId;
          const disabled = used || unaffordable;
          return (
            <li key={p.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(p)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm ${
                  disabled ? "opacity-40" : "hover:bg-ink-800"
                }`}
              >
                <span className="min-w-0">
                  <span className="font-semibold">{p.playerName}</span>{" "}
                  <span className="text-zinc-400">{p.seasonLabel}</span>
                  <span className="block truncate text-xs text-zinc-500">
                    {p.positions.join("/")}
                    {f !== "natural" ? ` · ${FIT_LABEL[f]}` : ""}
                    {p.stats?.goals != null ? ` · ${p.stats.goals} goals` : ""}
                    {used ? " · already picked" : unaffordable ? " · too expensive" : ""}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-bold">{p.rating}</span>
                  <span className="block text-xs text-amber-300">{p.cost}c</span>
                </span>
              </button>
            </li>
          );
        })}
        {options.length === 0 ? <li className="px-3 py-4 text-sm text-zinc-500">No matches.</li> : null}
      </ul>
    </div>
  );
}
