"use client";

import { useEffect, useMemo, useState } from "react";
import type { DailyPuzzle } from "@/lib/dailyPuzzle";
import { puzzleViolations } from "@/lib/dailyPuzzle";
import { teamScore, xiCost } from "@/lib/scoring";
import type { ClubData, Formation, PlayerSeason, XiEntry } from "@/lib/types";
import { BudgetBar } from "./BudgetBar";
import { Pitch } from "./Pitch";
import { PlayerPicker } from "./PlayerPicker";
import { ScorePanel } from "./ScorePanel";
import { ShareCard } from "./ShareCard";

interface BuilderProps {
  data: ClubData;
  formations: Formation[];
  /** Present in daily mode: overrides budget and adds constraints. */
  puzzle?: DailyPuzzle;
  /** Fired once whenever a complete, valid XI produces a score. */
  onScored?: (overall: number) => void;
}

type Assignments = Record<string, string | undefined>; // slotId -> playerId

function storageKey(clubSlug: string, puzzle?: DailyPuzzle) {
  return puzzle ? `prime-xi:daily:${puzzle.dateUTC}` : `prime-xi:build:${clubSlug}`;
}

export function Builder({ data, formations, puzzle, onScored }: BuilderProps) {
  const { club, players } = data;
  const budget = puzzle?.budget ?? club.budget;
  const playerById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);

  const [formationId, setFormationId] = useState(formations[0].id);
  const [assignments, setAssignments] = useState<Assignments>({});
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const formation = formations.find((f) => f.id === formationId) ?? formations[0];

  // Optional last-build restore (localStorage is never required for core play).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(club.slug, puzzle));
      if (!raw) return;
      const saved = JSON.parse(raw) as { formationId: string; assignments: Assignments };
      if (formations.some((f) => f.id === saved.formationId)) {
        setFormationId(saved.formationId);
        const valid: Assignments = {};
        for (const [slotId, pid] of Object.entries(saved.assignments)) {
          if (pid && playerById.has(pid)) valid[slotId] = pid;
        }
        setAssignments(valid);
      }
    } catch {
      // ignore corrupt/blocked storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(club.slug, puzzle), JSON.stringify({ formationId, assignments }));
    } catch {
      // storage unavailable — fine
    }
  }, [assignments, formationId, club.slug, puzzle]);

  const xi: XiEntry[] = useMemo(
    () =>
      formation.slots.flatMap((slot) => {
        const pid = assignments[slot.slotId];
        const player = pid ? playerById.get(pid) : undefined;
        return player ? [{ slotId: slot.slotId, player }] : [];
      }),
    [assignments, formation, playerById],
  );

  const spent = xiCost(xi);
  const complete = xi.length === formation.slots.length;
  const violations = puzzle ? puzzleViolations(puzzle, xi) : [];
  const score = complete && violations.length === 0 ? teamScore(xi, formation) : null;

  const overall = score?.overall;
  useEffect(() => {
    if (overall != null) onScored?.(overall);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overall]);

  const usedIds = useMemo(() => new Set(xi.map((e) => e.player.id)), [xi]);
  const selectedSlot = formation.slots.find((s) => s.slotId === selectedSlotId) ?? null;
  const currentInSlot = selectedSlotId ? assignments[selectedSlotId] : undefined;
  const remainingForSlot =
    budget - spent + (currentInSlot ? (playerById.get(currentInSlot)?.cost ?? 0) : 0);

  const pitchAssignments = useMemo(() => {
    const out: Record<string, PlayerSeason | undefined> = {};
    for (const slot of formation.slots) {
      const pid = assignments[slot.slotId];
      out[slot.slotId] = pid ? playerById.get(pid) : undefined;
    }
    return out;
  }, [assignments, formation, playerById]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-zinc-400">
          Formation{" "}
          <select
            value={formationId}
            onChange={(e) => setFormationId(e.target.value)}
            className="ml-1 rounded border border-ink-700 bg-ink-900 px-2 py-1 text-sm text-white"
          >
            {formations.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setAssignments({})}
          className="rounded border border-ink-700 px-3 py-1 text-sm text-zinc-400 hover:text-white"
        >
          Clear XI
        </button>
      </div>

      {puzzle && puzzle.constraints.length > 0 ? (
        <div className="mb-4 rounded-lg border border-indigo-800 bg-indigo-950/50 p-3 text-sm">
          <p className="font-bold text-indigo-300">Today&apos;s constraints</p>
          <ul className="mt-1 list-inside list-disc text-indigo-200">
            {puzzle.constraints.map((c) => (
              <li key={c.id}>{c.label}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mb-4">
        <BudgetBar spent={spent} budget={budget} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Pitch
          formation={formation}
          assignments={pitchAssignments}
          selectedSlotId={selectedSlotId}
          onSelectSlot={(id) => setSelectedSlotId(id === selectedSlotId ? null : id)}
          themeColour={club.themeColour}
        />
        <div className="flex flex-col gap-4">
          {selectedSlot ? (
            <div className="min-h-0 lg:h-[28rem]">
              <PlayerPicker
                slot={selectedSlot}
                players={players}
                usedIds={usedIds}
                remaining={Math.round(remainingForSlot * 10) / 10}
                currentId={currentInSlot}
                onPick={(p) => {
                  setAssignments((a) => ({ ...a, [selectedSlot.slotId]: p.id }));
                  setSelectedSlotId(null);
                }}
                onClear={() => {
                  setAssignments((a) => ({ ...a, [selectedSlot.slotId]: undefined }));
                  setSelectedSlotId(null);
                }}
                onClose={() => setSelectedSlotId(null)}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-ink-700 p-4 text-center text-sm text-zinc-500">
              Tap a position on the pitch to pick a player
            </div>
          )}

          {violations.length > 0 && complete ? (
            <div className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300">
              <p className="font-bold">Constraint violations</p>
              <ul className="mt-1 list-inside list-disc">
                {violations.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <ScorePanel score={score} filled={xi.length} total={formation.slots.length} />

          {score ? (
            <ShareCard club={club} formation={formation} xi={xi} score={score} dateStamp={puzzle?.dateUTC} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
