import { ADS_ENABLED } from "@/lib/flags";

/** Ad placement placeholder — ships behind an OFF flag (§12). */
export function AdSlot({ id }: { id: string }) {
  if (!ADS_ENABLED) return null;
  return (
    <div
      data-ad-slot={id}
      className="my-4 flex h-24 items-center justify-center rounded border border-dashed border-ink-700 text-xs text-zinc-600"
    >
      ad slot: {id}
    </div>
  );
}
