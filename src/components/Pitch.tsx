"use client";

import type { Formation } from "@/lib/types";

interface PitchProps {
  formation: Formation;
  /** slotId -> filled player surname — used for aria labels only; the diagram never shows text */
  labels: Record<string, string | undefined>;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

/** Compact formation diagram: dashed dot = empty, solid cream square = filled,
 *  red = selected. Names live on the team sheet, never on the pitch. */
export function Pitch({ formation, labels, selectedSlotId, onSelectSlot }: PitchProps) {
  return (
    <div
      className="shadow-poster-sm relative w-full overflow-hidden border-[3px] border-ink-950 bg-pitch-800"
      style={{ aspectRatio: "3 / 4" }}
    >
      <div className="pointer-events-none absolute inset-2 border border-cream-100/25" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream-100/25" />
      <div className="pointer-events-none absolute left-2 right-2 top-1/2 border-t border-cream-100/25" />

      {formation.slots.map((slot) => {
        const filled = Boolean(labels[slot.slotId]);
        const selected = selectedSlotId === slot.slotId;
        return (
          <button
            key={slot.slotId}
            type="button"
            onClick={() => onSelectSlot(slot.slotId)}
            className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            aria-label={`${slot.group} slot${filled ? `: ${labels[slot.slotId]}` : ", empty"}`}
            aria-pressed={selected}
          >
            <span
              className={
                selected
                  ? "h-5 w-5 rounded-full border-2 border-cream-100 bg-blood-600 shadow-[0_0_0_2px_var(--color-ink-950)]"
                  : filled
                    ? "h-5 w-5 border-2 border-ink-950 bg-paper-50 shadow-[2px_2px_0_var(--color-ink-950)]"
                    : "h-5 w-5 rounded-full border-2 border-dashed border-cream-100/60"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
