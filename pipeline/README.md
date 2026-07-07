# PRIME XI — offline data pipeline (v2)

**Never deployed.** Run by hand; output is committed as static JSON under `/data`.
Production never scrapes and never computes anything at runtime.

## Stages

```
wikipedia.ts    A — roster spine from the three "List of Liverpool F.C. players"
                    pages (MediaWiki API) → cache/spine.json (committed)
lfchistory.ts   B — enrich the notable subset from lfchistory.net
                    (disk cache, 1.5s backoff, descriptive UA) → cache/enrichment.json
clues.ts        clue generation + difficulty rating from raw facts
export.ts       C — assemble committed /data JSON from the caches
canonical/      Task 7 — canonical XI plaintext. GITIGNORED; only salted
                    hashes are exported (eras.json). Never commit plaintext.
```

## Commands

```
pnpm pipeline:export   # cache/*.json → data/players-index.json + data/answers.json
                       # (+ data/eras.json + data/managers.json once canonical/ exists)
pnpm test              # includes pipeline/__tests__/data.test.ts validating /data
```

`pipeline/cache/` is gitignored except `spine.json`. Re-fetch stages A/B only when
updating data; the export is deterministic from the caches.
