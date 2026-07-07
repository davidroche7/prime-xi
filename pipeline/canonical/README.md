# pipeline/canonical/ — the answer keys live here, and only here

Everything in this directory except this README is **gitignored**. The repo is
public and these files are the plaintext canonical XIs for The Perfect XI —
committing them would publish the answers.

Only salted hashes ship: `pnpm pipeline:export` runs the keys through
`pipeline/eras.ts#buildEraKey` and writes `data/eras.json`.

To (re)create the keys, copy `pipeline/canonical.example.ts` into this
directory per era and add an `index.ts` exporting `CANONICAL: CanonicalEra[]`
with all three eras (all-time, post-war, premier-league). Edit freely and
re-run the export — hashes are deterministic.
