# CLAUDE.md — PRIME XI (v2: the LFC pivot)

Operating spec for the build agent. If any instruction here conflicts with a request made mid-build, **this file wins** unless Dave explicitly overrides it. The v1 budget-cap builder is dead (see PRD §1) — do not resurrect any part of its game design.

## 0. What you are building

Two backendless Liverpool knowledge games on one static site, sharing one dataset:

- **Game B — "The Perfect XI"** is the **main game** (Dave's call, 2026-07-07, overriding the original layout): blind team build (player + season per slot, formation, manager) scored /98 against a hidden canonical XI per era. Mastermind-count feedback only. The homepage `/` leads with it; era pages at `/xi/<era>/`.
- **Game A — "Guess the Red"** is the secondary daily game: progressive-clue player guesser. Objective answer, autocomplete restricted to real LFC players, Wordle-style share card. Lives at `/daily/`. Shipped first.
- **Head-to-head (Phase B, live)** rides on Game B: after you submit a Perfect XI, you may pit its **hidden team rating** against a rival club's **hidden canonical rating** for the same era → **scoreline + W/D/L only**, neither XI nor either rating ever shown. This is NOT a match simulation (see §8) — it's a single deterministic rating comparison. Spec in §5a.
- **Multi-club (Phase B, in progress)** — club is a **data dimension**, never a fork: `data/clubs/<slug>/`. Liverpool is the fully-playable home club; other clubs join first as **H2H opponents only** (one `eras.json` / `canonicalRating`), then get Liverpool-level richness (full roster, playable Perfect XI) as data allows. See §3, §5a, §10.

You are **not** building a match/season simulation, and **not** building Phase 3 (voting/backend) — see §8.

## 1. Hard rules (violating any of these is a defect)

- **NO backend, NO database, NO auth, NO accounts** in Phases 1–2. Static + client-side only. Phase 3 (Cloudflare D1/KV + Turnstile + curator identity) is deliberately last and out of current scope.
- **NO LFC badge, crest, kit, or competition marks.** Club name as fact + generic red theme. "Independent, not affiliated" disclaimer stays live.
- All game logic = **pure, deterministic functions in `src/lib` with unit tests**. Same inputs → same outputs, every device, forever.
- Data is produced **offline** in `/pipeline` and shipped as static JSON in `/data`. Production never scrapes, never computes ratings.
- **Canonical-key plaintext is never committed** — `pipeline/canonical/` is gitignored (per-club: `index.ts` = Liverpool, `<club>.ts` = each opponent); only salted-hash exports ship. The repo is public. Hash salt is `gtr-xi-v1|<club>|<era>|<kind>|<value>` so keys never collide across clubs.
- **H2H ratings are hidden, not secret** — per-(player, season) ratings ship in-client (needed to rate your own picks) but are **never displayed**; only a scoreline is. Deterrent-level, exactly like the canonical hashes. True secrecy waits for Phase 3's server.
- Clues are **generated from raw facts**. Never lift lfchistory.net's editorial text or their question-of-the-day.
- localStorage is optional-only (streaks, per-day state, best scores). Never required for core play.

## 2. Tech (locked)

Next.js App Router `output: 'export'` · TypeScript · Tailwind v4 · pnpm · Vitest · Plausible (env-gated) · client-canvas share cards. Demo host: GitHub Pages (basePath-aware). Production host: Cloudflare Pages. Ads behind `NEXT_PUBLIC_ADS_ENABLED` (off).

## 3. Data (hybrid, offline)

- **Wikipedia** (MediaWiki API): the three "List of Liverpool F.C. players" pages = the complete all-time roster spine (name, nationality, position, career years, apps, goals). CC BY-SA — credit in footer.
- **lfchistory.net**: robots.txt permits; scrape once with disk cache + 1.5s backoff + descriptive UA; enrich the notable subset (birthplace, signed-from, honours, season stats) for clue generation. Quiet "data via lfchistory.net" credit.
- Pipeline: `fetch spine → fetch enrichment → generate clues + difficulty → export /data JSON`. `/data` is committed; `pipeline/cache/` is not.
- **Club-scoped layout**: `data/clubs/<slug>/` holds `players-index.json`, `answers.json`, `managers.json`, `eras.json`, `ratings.json`; `data/formations.json` is shared. Loaders in `src/lib/data.ts` take a club slug. An **opponent-only** club ships just `eras.json` (all-time) — richen it later by adding the other files beside it (never a separate opponent type). `ratings.json` = per-(player, season) H2H rating 30–99, floor-omitted, from `pipeline/ratings.ts` (career-base × career-arc + trophy-season boost; no per-season stats exist yet — `// ponytail:` upgrade path is real per-season data). Every club rated by the **same** formula so H2H is fair.

## 4. Game A spec

- Daily answer: fixed-seed permutation over the answer pool (normal: difficulty ≤3; hard: ≥3), indexed by days-since-epoch — same player worldwide, resets 00:00 UTC, no repeats within a cycle.
- Six clues, hardest → easiest. Wrong guess auto-reveals the next clue. Solved on clue *k* → score `7−k` (6 best). Six clues exhausted + wrong = fail.
- Share text/card: date, score /6, clue boxes, no spoilers. Optional streak in localStorage.

## 5. Game B spec

- Score: per canonical slot, player 6 + season 2 (only if player right) ×11 = 88; manager 4 + manager peak season 2; formation 4. **Max 98.**
- Equivalence classes: a slot may accept several (player, season) answers — any scores full.
- Manager peak season = argmax of weighted honours that season: **EC/CL 10 · League 8 · other European 5 · FA Cup 3 · League Cup 2** (ties → earlier season). Longevity modifier is v2 — out.
- Feedback: total + counts (`players 9/11 · seasons 6/11 · formation ✓ · manager ✗`) — never which picks.
- Reveal: canonical hidden until 100%. Phase 2 = local reveal only (your own build is the key). Global first-ascent is Phase 3.
- Eras: all-time · post-war (1945+) · Premier League (1992+). Each is its own SEO page with prose + FAQ JSON-LD.

## 5a. Head-to-head spec (Phase B)

- **Trigger**: unlocks only *after* you submit a Perfect XI for an era. Offered only where a rival club has a canonical XI covering that same era (e.g. Man Utd = all-time only). No submit → no H2H.
- **Engine** (`src/lib/h2h.ts`, pure/tested): `teamRating(11 season-ratings)` = mean (unrated pick → `RATING_FLOOR` 30); `matchResult(yourRating, rivalRating)` maps the gap to a scoreline (1-pt edge = 1-0; wider gaps widen the margin). The mapping is invented — tune freely, it has no other callers.
- **Feedback**: **scoreline + W/D/L only.** Rival's XI is never shown; rival's rating is a hidden number; your own rating is not shown either (Dave: ratings hidden, scoreline only). The only place any canonical XI is ever revealed remains scoring 100% on that club's own Perfect XI.
- **Data**: your picks are rated against **your** club's shipped `ratings.json`; the rival contributes one precomputed `canonicalRating` from its `eras.json` (computed offline as `teamRating` of its canonical XI — reveals no players). Share via `H2HShareCard` (canvas, no XI).
- **Full match/season simulation stays permanently out** (§8) — H2H is one number vs one number.

## 6. Share cards

Client-canvas → PNG, both games. First-class feature: this is the distribution channel. No logos, plain URL back to the site.

## 7. SEO

Home (Perfect XI hub), `/daily/` (Game A) + era pages carry evergreen prose (300–500 words), FAQ JSON-LD, sitemap, semantic HTML, no layout shift. Target queries: "Liverpool player quiz", "greatest Liverpool XI of all time", "best Liverpool Premier League XI", "greatest post-war Liverpool team".

## 8. Scope guardrails — STOP list

Leave a `// V2:` or `// PHASE3:` comment instead of building:

- Match/season simulation (lineups playing out, xG, minute-by-minute) → **out, permanently**. The H2H rating-duel scoreline (§5a) is IN and is *not* this — it's one rating vs one rating.
- Voting, proposals, curator identity, first-ascent registry, leaderboards → **Phase 3**
- Accounts, login, profiles → Phase 3 curator-only identity, not now
- Server routes of any kind → Phase 3
- Real market-value pricing, live/current-season data → out
- Longevity modifier on manager scoring → v2

## 9. Definition of done (this build)

Phase 1: daily guesser live on the demo host, static, shareable, difficulty-rated players, Hard mode, streak. Phase 2: three era pages playable + shareable against hand-seeded hashed keys; canonical plaintext absent from repo and build output. Both: `pnpm test` green, typecheck clean, static build, credits + disclaimer in footer, ads off.

## 10. Decision log

- **Kill the budget builder** — demo proved LFC's pool too top-heavy for knapsack tension; knowledge games replace it.
- **Two games, one dataset, three phases** — certain win (daily quiz) ships before the ambitious one (crowd-owned XI); backend deliberately last.
- **Weaponise subjectivity** — canonical XI is community-owned in Phase 3; mastery (≥95%) gates editing.
- **Hybrid data** — Wikipedia guarantees completeness (validated); lfchistory enriches clues (robots-permitted, validated).
- **Hashed keys, public repo** — salted hashes are a deterrent, not secrecy; real secrecy arrives with Phase 3's server. Accepted.
- **Club as a data dimension, not a fork** (2026-07-08) — one app, `data/clubs/<slug>/`; de-risks store review + trademark exposure. Reinforces the community-owned direction per club.
- **Head-to-head = rating duel, scoreline only** (revised 2026-07-08) — a post-Perfect-XI feature; hidden per-(player,season) ratings → hidden team rating vs rival's hidden `canonicalRating` → scoreline. Every canonical XI stays hidden (only 100% on your own Perfect XI reveals one). Both clubs rated by the same offline formula so the duel is merit, not scale.
- **Opponent-only → full richness** (Dave, 2026-07-08) — a new club joins first as an H2H opponent (one `canonicalRating`, no scrape) to validate the vertical cheaply, then earns Liverpool-level data (roster scrape, playable Perfect XI, routing/club-picker) where data supports it. B1 = LFC vs Man Utd (opponent-only) shipped; B2 = first club to full richness.
