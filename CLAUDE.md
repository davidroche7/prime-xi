# CLAUDE.md — PRIME XI (v2: the LFC pivot)

Operating spec for the build agent. If any instruction here conflicts with a request made mid-build, **this file wins** unless Dave explicitly overrides it. The v1 budget-cap builder is dead (see PRD §1) — do not resurrect any part of its game design.

## 0. What you are building

Two backendless Liverpool knowledge games on one static site, sharing one dataset:

- **Game A — "Guess the Red"**: daily progressive-clue player guesser. Objective answer, autocomplete restricted to real LFC players, Wordle-style share card. Lives at `/`. Ships first.
- **Game B — "The Perfect XI"**: blind team build (player + season per slot, formation, manager) scored /98 against a hidden canonical XI per era. Mastermind-count feedback only. Era pages at `/xi/<era>/`.

You are **not** building a match/season simulation, and **not** building Phase 3 (voting/backend) — see §8.

## 1. Hard rules (violating any of these is a defect)

- **NO backend, NO database, NO auth, NO accounts** in Phases 1–2. Static + client-side only. Phase 3 (Cloudflare D1/KV + Turnstile + curator identity) is deliberately last and out of current scope.
- **NO LFC badge, crest, kit, or competition marks.** Club name as fact + generic red theme. "Independent, not affiliated" disclaimer stays live.
- All game logic = **pure, deterministic functions in `src/lib` with unit tests**. Same inputs → same outputs, every device, forever.
- Data is produced **offline** in `/pipeline` and shipped as static JSON in `/data`. Production never scrapes, never computes ratings.
- **Canonical-key plaintext is never committed** — `pipeline/canonical/` is gitignored; only salted-hash exports ship. The repo is public.
- Clues are **generated from raw facts**. Never lift lfchistory.net's editorial text or their question-of-the-day.
- localStorage is optional-only (streaks, per-day state, best scores). Never required for core play.

## 2. Tech (locked)

Next.js App Router `output: 'export'` · TypeScript · Tailwind v4 · pnpm · Vitest · Plausible (env-gated) · client-canvas share cards. Demo host: GitHub Pages (basePath-aware). Production host: Cloudflare Pages. Ads behind `NEXT_PUBLIC_ADS_ENABLED` (off).

## 3. Data (hybrid, offline)

- **Wikipedia** (MediaWiki API): the three "List of Liverpool F.C. players" pages = the complete all-time roster spine (name, nationality, position, career years, apps, goals). CC BY-SA — credit in footer.
- **lfchistory.net**: robots.txt permits; scrape once with disk cache + 1.5s backoff + descriptive UA; enrich the notable subset (birthplace, signed-from, honours, season stats) for clue generation. Quiet "data via lfchistory.net" credit.
- Pipeline: `fetch spine → fetch enrichment → generate clues + difficulty → export /data JSON`. `/data` is committed; `pipeline/cache/` is not.

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

## 6. Share cards

Client-canvas → PNG, both games. First-class feature: this is the distribution channel. No logos, plain URL back to the site.

## 7. SEO

Home (Game A) + era pages carry evergreen prose (300–500 words), FAQ JSON-LD, sitemap, semantic HTML, no layout shift. Target queries: "Liverpool player quiz", "greatest Liverpool XI of all time", "best Liverpool Premier League XI", "greatest post-war Liverpool team".

## 8. Scope guardrails — STOP list

Leave a `// V2:` or `// PHASE3:` comment instead of building:

- Match/season simulation → **out, permanently**
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
