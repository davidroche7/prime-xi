"use client";

export function BudgetBar({ spent, budget }: { spent: number; budget: number }) {
  const pct = Math.min(100, (spent / budget) * 100);
  const remaining = Math.round((budget - spent) * 10) / 10;
  const tight = pct > 85;
  return (
    <div aria-label="budget" className="w-full">
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-semibold">
          {Math.round(spent * 10) / 10} / {budget} credits
        </span>
        <span className={remaining < 0 ? "text-red-400" : "text-zinc-400"}>{remaining} left</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded bg-ink-800">
        <div
          className={`h-full rounded transition-all ${tight ? "bg-amber-500" : "bg-emerald-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
