/**
 * Deterministic PRNG utilities. Same inputs → same outputs, every device, forever.
 */

/** FNV-1a 32-bit hash of a string (e.g. a "YYYY-MM-DD" UTC date). */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, deterministic 32-bit PRNG. Returns floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick one element deterministically. Throws on empty input. */
export function pick<T>(rng: () => number, items: readonly T[]): T {
  if (items.length === 0) throw new Error("pick: empty array");
  return items[Math.floor(rng() * items.length)];
}

/** Pick n distinct elements deterministically (order of draws preserved). */
export function pickN<T>(rng: () => number, items: readonly T[], n: number): T[] {
  const pool = [...items];
  const out: T[] = [];
  while (out.length < n && pool.length > 0) {
    const i = Math.floor(rng() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

/** Current UTC date as "YYYY-MM-DD". */
export function utcDateString(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}
