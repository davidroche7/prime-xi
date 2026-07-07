"use client";

import type { Formation } from "@/lib/types";

interface PitchProps {
  formation: Formation;
  /** slotId -> short label (e.g. surname) for filled slots */
  labels: Record<string, string | undefined>;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

export function Pitch({ formation, labels, selectedSlotId, onSelectSlot }: PitchProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-ink-700 bg-gradient-to-b from-pitch-800 to-pitch-900"
      style={{ aspectRatio: "3 / 4" }}
    >
      {/* pitch markings */}
      <div className="pointer-events-none absolute inset-3 rounded border border-white/20" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
      <div className="pointer-events-none absolute left-3 right-3 top-1/2 border-t border-white/20" />

      {formation.slots.map((slot) => {
        const label = labels[slot.slotId];
        const selected = selectedSlotId === slot.slotId;
        return (
          <button
            key={slot.slotId}
            type="button"
            onClick={() => onSelectSlot(slot.slotId)}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            aria-label={`${slot.group} slot${label ? `: ${label}` : ", empty"}`}
          >
            <span
              className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full border-2 text-[10px] font-bold shadow-lg transition ${
                selected
                  ? "border-amber-300 bg-amber-400 text-black"
                  : label
                    ? "border-white/70 bg-red-800 text-white"
                    : "border-dashed border-white/50 bg-black/30 text-white/70 hover:bg-black/50"
              }`}
            >
              {slot.group}
            </span>
            <span className="mt-1 block max-w-20 truncate text-[10px] font-semibold text-white drop-shadow sm:max-w-24 sm:text-xs">
              {label ?? " "}
            </span>
          </button>
        );
      })}
    </div>
  );
}
