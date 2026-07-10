# PRD — PRIME XI, v2 scope (LFC pivot)

**Status:** v2 spec, approved 2026-07-07 · **Owner:** Dave · **Build tool:** Fable (Claude)
**Supersedes** the v1 budget-builder PRD (killed after demo — see §1).

## 1. What changed and why

The budget-cap builder was killed after a demo proved the problem we feared: Liverpool's pool is too top-heavy for a knapsack to feel tense. Two knowledge games replace it. They share one dataset and ship in three phases, so the certain win (the daily quiz) is live long before the ambitious part (crowd-owned perfect XI) is finished.

The perfect XI carries an unavoidable subjectivity — there is no answer key fans will all agree on. Rather than fight that, the design weaponises it: the canonical XI is community-owned, and you earn the right to change it by proving you understand it. Subjectivity becomes the meta-game, not the complaint.

## 2. The two games

### Game A — "Guess the Red" (daily, ships first)

Progressive-clue player guesser with an objective answer (the player's identity), so nobody can call it wrong. Start on the hardest clue; reveal easier clues one at a time; fewer clues + fewer wrong guesses = higher score. Guessing via autocomplete restricted to players who actually played for Liverpool. One player per day, same for everyone. Wordle-style share card. Fully backendless.

### Game B — "The Perfect XI" (evergreen, per era)

Blind, knowledge-driven team build. For each slot you pick a player and a season, choose a formation, and pick a manager — any era, no stats shown until submit. Your build is scored against a hidden canonical XI (each player at their defining season). You see your score plus Mastermind-style counts, never which picks were right. The canonical XI is revealed publicly only when someone first scores 100%. Offered as era variants (see §4).

## 3. Build phases

| Phase | Scope | Backend? | Ships |
|---|---|---|---|
| 1 | Game A daily guesser, LFC | None (static) | First — the SEO wedge |
| 2 | Game B perfect XI with a hand-seeded canonical key; score + counts feedback | None (reads static seeded key) | Playable & shareable, no voting |
| 3 | Community voting/governance — canonical XI becomes crowd-owned; unlock at 95% | First backend (Cloudflare D1/KV + Turnstile + anonymous curator identity) | The ambitious phase, deliberately last |

The backend arrives only in Phase 3. Everything before it is static, anonymous, and spike-proof. Voting is the first thing that nudges "set and forget" toward "lightly tended" — hence last.

## 4. Eras (Game B content + SEO multiplier)

Each era is its own evergreen puzzle with its own canonical XI, its own voting, and its own SEO page:

- Complete history — all-time Liverpool XI
- Post-war — 1945 onward
- Premier League era — 1992 onward
- (room for more: Shankly/Paisley boot-room era, the modern Klopp era, etc.)

This is the anonymous growth engine: "greatest Liverpool XI of all time", "best Liverpool Premier League XI", "greatest post-war Liverpool team" are all high-intent evergreen searches.

## 5. Scoring — Game B (max 98, matching the "out of 98" mental model; tunable)

Per canonical slot: player identity 6 pts, correct season +2 pts (only if the player is right). Eleven slots = 88. Manager 4 + manager's peak season 2 = 6. Formation 4. Total 98.

- **Equivalence classes:** a slot may have several equally-canonical answers (e.g. Clemence ≈ Alisson in goal). Any accepted (player, season) scores full.
- **Manager scoring:** the manager is a 12th blind pick, judged on their peak season, rated by weighted honours won that season: European Cup 10 · League 8 · other European (UEFA/Europa/Cup Winners'/Super Cup) 5 · FA Cup 3 · League Cup 2. The canonical manager-season is the one maximising that sum. (Longevity is a deliberate v2 modifier — the one-season-wonder problem has no clean answer and would swallow the build.)
- **Feedback model (Mastermind, not a bare number):** on submit the player sees total score and counts — players correct: 9/11 · seasons correct: 6/11 · formation ✓ · manager ✗ — but never which. Legible enough to reason with; leaks nothing.
- **Reveal:** the canonical XI stays hidden until the first 100% "first ascent", after which it's shown as solved.

## 6. Voting & governance — Game B, Phase 3

- **Curator gate:** scoring ≥95% (≥93/98) in a single submission on an era earns curator status for that era — you now see its current canonical XI and may propose/vote changes. This is a mastery gate: you can't edit the boss until you've all but beaten it, which also makes brigading hard (you must demonstrate the knowledge, not just show up).
- **Proposals:** a curator proposes a slot change (alternative player and/or season, or a formation/manager change). Other curators vote. A change flips the canonical only past a vote count + margin threshold.
- **Versioning:** every canonical XI keeps history — first-ascent credit, amendment log, current version.
- **Anti-abuse:** Cloudflare Turnstile on submissions; rate limits; one vote per curator per proposal.
- **Anonymity note (the honest cost):** one-vote-per-curator needs a stable identity, so curators get an anonymous recovery-code identity (no email, no social). This is the one place the pure-anonymity model bends — accepted, and scoped to curators only.

## 7. Distribution (unchanged principle: anonymous)

Programmatic SEO per era/page; user-shared result cards for both games (users propagate, owner stays faceless); no owner social account anywhere.

## 8. Monetisation (defined, not front-loaded)

Ad slots behind an off flag until traffic. Pro unlock (v2): remove ads, hard mode, extra eras. Merchant of record (LemonSqueezy/Paddle) only when payments exist — handles UK VAT and anonymity.

## 9. Data & legal

- Source facts from lfchistory.net — appearances, goals, positions, dates, shirt numbers, honours, transfers, manager tenures. Scrape once, cache static.
- Facts are usable; do not lift lfchistory's editorial or their question-of-the-day. Generate our own clues from raw data.
- Quiet "data via lfchistory.net" credit — courteous and costs nothing.
- No LFC badge, crest, kit, or competition marks. Club name as fact + generic Red theme only. Standard "independent, not affiliated" disclaimer.
- **Amendment (approved 2026-07-07):** hybrid sourcing — Wikipedia's three "List of Liverpool F.C. players" pages (MediaWiki API, CC BY-SA, attributed) provide the complete all-time roster spine so no player is missed; lfchistory.net (robots.txt permits; scraped once with cache + backoff) enriches the notable subset for clue generation.

## 10. Success & risks

- **Phase 1 done:** daily LFC guesser live, static, shareable, with difficulty-rated players and a Hard mode.
- **Traction signals:** organic impressions on Liverpool guesser/XI queries; share-card referrals; daily return visits (Plausible).
- **Risks:** Phase-3 voting is brigadable if the curator gate is weak (mitigated by the 95% gate + Turnstile); scope creep into match simulation (fenced, permanently out); the perfect-XI's subjectivity (converted into the voting meta-game rather than removed).

## 11. Amendment — multi-club + head-to-head (approved 2026-07-08)

Adds a second axis of play on top of the single-club v2 scope above, sequenced as **Phase B** (before the Phase-3 backend, so the backend's data model is club-keyed from birth). Nothing here reopens match simulation.

- **Club becomes a data dimension, not a fork.** One app; per-club data lives under `data/clubs/<slug>/`. Liverpool is the fully-playable home club. This de-risks app-store review (Apple 4.3 cookie-cutter) and trademark exposure, and lets the Phase-3 community-ownership model scale per club.
- **Head-to-head (new mechanic).** After submitting a Perfect XI for an era, the player can pit its **hidden team rating** against a rival club's **hidden canonical rating** for the same era, seeing a **scoreline + win/draw/loss only** — never the opponent XI, never either rating. Ratings are per-(player, season), derived by one deterministic offline formula shared across all clubs (so a poor season rates lower automatically and the duel is merit, not scale). Ratings ship in-client but are never displayed — deterrent-level, exactly like the canonical hashes. Full match/season simulation stays permanently out; this is one number vs one number.
- **Opponent-only → full richness (rollout rule).** A new club joins cheaply as an **H2H opponent** (one authored all-time canonical → one `canonicalRating`, no roster scrape) to validate the vertical, then earns Liverpool-level data (full roster, playable Perfect XI, per-club routing + a home club-picker) where data supports it. **B1 shipped**: Liverpool vs Manchester United (opponent-only), all-time era. **B2**: first club to full richness (adds routing/club-picker). Target end-state: many clubs — including historic/lower-league sides — each as rich as data allows, so any fan can argue their strongest XI.
- **Data/keys.** `eras.json` per era carries the hashed canonical key **plus** a precomputed `canonicalRating`; `ratings.json` ships per-(player, season) ratings; hash salt extends to `…|<club>|<era>|…`. Opponent-club plaintext keys are gitignored per club (`pipeline/canonical/<club>.ts`), same rule as Liverpool's.
- **Later phases unchanged.** Phase C = the Phase-3 backend (voting/curation), now keyed `club+era` from day one. Phase D = PWA + Capacitor store wrap of the same static export.
