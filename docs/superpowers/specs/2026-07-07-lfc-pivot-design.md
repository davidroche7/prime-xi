# Design: LFC pivot — Guess the Red + The Perfect XI

Approved 2026-07-07. Full product spec in `PRD.md`; operating rules in `CLAUDE.md`; implementation plan in the session plan file.

## Routes

- `/` — Game A (daily guesser IS the homepage; SEO wedge) + era links
- `/xi/all-time/` · `/xi/post-war/` · `/xi/premier-league/` — Game B era pages

## Data flow

```
Wikipedia API (3 list pages, complete roster)  ─┐
                                                ├─ pipeline: merge → clues + difficulty → export
lfchistory.net (≈300 profile pages, enriched)  ─┘
        ↓ committed static JSON
/data/players-index.json   all players (autocomplete)
/data/answers.json         answer pool: 6 clues + difficulty each
/data/managers.json        manager picker
/data/eras.json            per era: salted-hash canonical key (plaintext gitignored)
/data/formations.json      kept from v1
```

## Key decisions

- **Hybrid sourcing** (validated live): Wikipedia = completeness guarantee, parseable wikitables via API; lfchistory = clue richness, robots.txt permits, cache + 1.5s backoff.
- **Daily selection**: fixed-seed Fisher-Yates permutation over pool, day-index modulo — deterministic, worldwide-identical, no repeats per cycle. Reuses v1 `prng.ts` untouched.
- **Guess scoring**: 6 clues hardest→easiest; wrong guess force-reveals next; solve on clue k = 7−k points.
- **Perfect XI matching**: greedy set-match of picks against canonical slots (position-independent), equivalence classes per slot; player 6 + season 2 ×11 + manager 4+2 + formation 4 = 98.
- **Key secrecy**: FNV-1a salted hashes shipped; plaintext keys live only in gitignored `pipeline/canonical/`. Brute-forceable — accepted deterrent for Phase 2; Phase 3's server owns real secrecy.
- **Kept from v1**: prng, Pitch, canvas share-card approach, formations, flags/site/data readers, deploy workflow, localStorage patterns. Everything budget-related deleted.

## Out of scope (fenced)

Phase 3 (voting, D1/KV, Turnstile, curator identity, global first-ascent), simulation (permanent), manager longevity modifier (v2).
