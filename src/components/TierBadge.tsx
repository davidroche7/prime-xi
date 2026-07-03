import type { TierLabel } from "@/lib/types";

const TIER_STYLES: Record<TierLabel, string> = {
  "Cult Hero": "bg-zinc-700 text-zinc-100",
  "Fan Favourite": "bg-sky-800 text-sky-100",
  Continental: "bg-indigo-700 text-indigo-100",
  Elite: "bg-violet-700 text-violet-100",
  Legendary: "bg-amber-600 text-amber-50",
  GOAT: "bg-gradient-to-r from-amber-400 to-yellow-300 text-black",
};

export function TierBadge({ tier, className = "" }: { tier: TierLabel; className?: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${TIER_STYLES[tier]} ${className}`}
    >
      {tier}
    </span>
  );
}
