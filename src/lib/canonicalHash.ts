import { hashString } from "./prng";

/**
 * §Game B — salted hashing of canonical-key values. The pipeline hashes the
 * plaintext key at export; the client hashes user picks and compares. Same
 * function both sides, so it lives in src/lib.
 *
 * ponytail: deterrent only — the pool is brute-forceable client-side; real
 * secrecy is Phase 3's server.
 */

export function normalizeCanonical(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

export function canonicalHash(eraSlug: string, kind: "player" | "season" | "manager" | "manager-season" | "formation", value: string): string {
  return hashString(`gtr-xi-v1|${eraSlug}|${kind}|${normalizeCanonical(value)}`).toString(36);
}
