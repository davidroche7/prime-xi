# CLAUDE.md — PRIME XI

Operating spec for the build agent. Read this fully before writing any code. If any instruction here conflicts with a request made mid-build, **this file wins** unless I explicitly override it.

---

## 0. What you are building

A **static, serverless, accountless** web app: pick a club → spend a fixed budget filling a formation with peak player-seasons → get a deterministic **team rating (/99) + tier** → share an image card. Plus a **daily seeded puzzle** and **programmatic SEO pages** per club.

You are **not** building a match/season simulation. See §8.

---

## 1. Hard rules (violating any of these is a defect)

- **NO backend, NO database, NO auth, NO server-side state** in v1. The only "server" permitted is an optional Cloudflare Pages Function for share-card OG images (§6). Everything else is static + client-side.
- **NO match engine. NO season simulation. NO fixtures, no results, no "play the season."** v1 scores a static team. If you catch yourself modelling matches → **STOP** and re-read §8.
- **NO leaderboards, accounts, multiplayer, or real-time/live data.** All player data is historical and static.
- **NO club badges, kits, crests, official logos, or competition marks.** Club **names** and **historical stats** only (facts). Generic colour themes only.
- **Ratings and costs are pre-computed offline** by the pipeline (§3) and shipped as static JSON. Production **never** computes them and **never** scrapes at runtime.
- All scoring, cost, and daily-puzzle logic must be **pure, deterministic** functions in `src/lib` with **unit tests**. Same inputs → same outputs, on every device, forever.
- **localStorage is allowed** (this is a real Next.js app, not a sandboxed artifact) — use it for optional streak/last-build only. Never required for core play.

## 2. Tech (locked — do not substitute)

- **Next.js (App Router) with `output: 'export'`** — fully static. (Astro acceptable only if you flag it first; default is Next.)
- **TypeScript**, **Tailwind**, **pnpm**.
- **Cloudflare Pages** hosting. *Not Vercel* — static + Cloudflare avoids bill-shock if this goes viral.
- **Plausible** analytics (privacy-friendly, no cookie banner needed).
- Share card: **client-side `<canvas>`** → downloadable/shareable image. No backend needed for this.

## 3. Data pipeline (OFFLINE — never deployed)

Lives in `/pipeline`, run by hand, output committed as static JSON under `/data`. Historical stats never change, so this runs **once** per data update.

- Sources: `worldfootballR`, `soccerdata`, `ScraperFC`, StatsBomb open data, football-data.co.uk. Scrape respectfully (cache, backoff). **Note:** FBref lost Opta access Jan 2026 — do **not** design anything that depends on xG. Basic stats (apps, goals, assists) + a derived rating are sufficient.
- Pipeline stages: `scrape → normalise/dedupe → assign positions → derive rating → derive cost → export JSON`.
- The pipeline is the real work. Keep v1 to **6–12 marquee clubs** with clean data; everything else is a shallow SEO stub.

## 4. Data schema (static JSON under `/data`)

```ts
type PositionGroup = "GK" | "CB" | "FB" | "DM" | "CM" | "AM" | "W" | "ST";
type ClubTier = "marquee" | "longtail";

interface Club {
  id: string; slug: string; name: string; aliases: string[];
  tier: ClubTier; themeColour: string;      // generic, NOT official
}

interface PlayerSeason {
  id: string;                                // stable, unique
  playerName: string; clubId: string;
  seasonLabel: string; seasonEndYear: number; // "2013-14", 2014
  positions: PositionGroup[];                 // [0] = primary
  rating: number;                             // 1..99, derived offline
  cost: number;                               // credits, derived offline
  stats?: { apps?: number; goals?: number; assists?: number };
  note?: string;                              // short flavour, optional
}

interface FormationSlot { slotId: string; group: PositionGroup; x: number; y: number; }
interface Formation { id: string; name: string; slots: FormationSlot[]; } // e.g. "4-3-3"
```

`/data/clubs/<slug>.json` (Club + its PlayerSeason[]), `/data/formations.json`, `/data/index.json` (club list for routing/sitemap).

## 5. Scoring & cost (pure functions in `src/lib`)

### 5.1 Team score → `src/lib/scoring.ts`

```
POSITION_WEIGHTS = { GK:1.10, CB:1.15, FB:0.95, DM:1.15, CM:1.10, AM:1.00, W:1.00, ST:1.05 }
POSITION_FIT     = { natural:1.00, adjacent:0.90, alien:0.75 }   // player vs slot group

effectiveRating(ps, slot) = ps.rating * POSITION_FIT[fit(ps.positions, slot.group)]

teamScore(xi, formation):
   weighted = Σ  effectiveRating(ps,slot) * POSITION_WEIGHTS[slot.group]
   total    = Σ  POSITION_WEIGHTS[slot.group]
   raw      = weighted / total                       // ~1..99
   penalty  = balancePenalty(xi)                      // 0..~6, subtractive
   overall  = clamp(round(raw - penalty), 1, 99)

balancePenalty(xi):   // discourage lopsided sides
   +3 if weakest CB rating < 75
   +2 if no CM/DM rated ≥ 80
   +2 if more than 3 players are out of natural position
   (cap total at 6)
```

Tier labels by `overall`: `<70 Cult Hero · 70–79 Fan Favourite · 80–86 Continental · 87–91 Elite · 92–95 Legendary · 96+ GOAT`. (Confetti at GOAT.)

### 5.2 Cost → `src/lib/cost.ts`

Cost must be **convex** in rating so eleven superstars are unaffordable — this is the whole game.

```
COST_EXP = 3.2                 // convexity; tune during data prep
COST_MAX = 100
SCARCITY = { GK:1.05, CB:1.05, DM:1.03, default:1.00 }

cost(ps) = round( (ps.rating/99)^COST_EXP * COST_MAX * SCARCITY[ps.positions[0] ?? default], 1)
```

**BUDGET** (per club, in `Club` or a config): start ~**260 credits**.

> **Tuning target (do this during data prep, not in the UI):** set `COST_EXP` and `BUDGET` so that (a) a strong, well-balanced XI spends **90–100%** of budget, and (b) an all-superstar XI comes in **~30–40% over** budget. If those two aren't true, the puzzle is broken.

Budget is a **ceiling only** — no bonus for unspent credits (that would incentivise cheap teams).

## 6. Share card (the distribution channel — polish this)

- Rendered **client-side** to `<canvas>` → PNG the user saves/shares. This is how the app spreads while the owner stays anonymous — treat it as a first-class feature, not an afterthought.
- Card shows: XI by position, `overall/99`, tier badge, club name, date (daily mode), and a plain URL back to the site. No logos.
- *(v1.5 optional)* dynamic link-unfurl OG image via a **Cloudflare Pages Function** — the only server code permitted. Do not add it in v1 unless everything else is done.

## 7. Daily puzzle → `src/lib/dailyPuzzle.ts` (no server)

```
seed        = hash(currentDateUTC "YYYY-MM-DD")
rng         = mulberry32(seed)              // deterministic PRNG in src/lib/prng.ts
puzzle(rng) = { club: pick(marqueeClubs|"open"), budget, constraints: pick 0..2 from POOL }
```

`POOL` examples: "no player after 2010", "max one player per decade", "no two players from the same original club", reduced budget. Same puzzle worldwide; resets 00:00 UTC. Output = same score/tier + a **date-stamped** card. Optional localStorage streak; **never** a server leaderboard.

## 8. Scope guardrails — the 2 a.m. STOP list

If you find yourself doing **any** of the following, you have left scope. Stop, and leave a `// V2:` comment instead:

- Simulating matches, seasons, fixtures, or opponent results → **V2**
- "Play a season" / "beat a historical side" → **V2**
- "Guess the peak season" quiz mechanic → **V2** *(deliberately held back — it's the strongest future differentiator; do not spend it early)*
- Accounts, login, user profiles → **V2**
- Server-side leaderboards, multiplayer, PvP, Elo → **V2**
- A database, an ORM, server routes (beyond the one optional OG function) → **V2**
- Real market-value pricing / cross-era value modelling → **V2**
- Live scores, current-season data, anything real-time → **out, permanently**

When unsure whether something is v1: if it needs a server, an account, or a match result, it is **not** v1.

## 9. SEO (build into the static export)

- One page per club: `/club/[slug]`. Marquee clubs get the full builder; long-tail clubs get the page + builder on shallower data.
- Each page: `<h1>` "Build [Club]'s Greatest XI — Every Player at Their Peak", **300–500 words** of evergreen prose (generate per club), the builder, internal links to rival/related clubs, and **FAQ JSON-LD**.
- Generate `sitemap.xml` and per-page title/meta from templates. Semantic HTML; fast; no layout shift.

## 10. File structure

```
/
  CLAUDE.md  PRD.md  package.json  next.config.mjs   # output:'export'
  /data          # STATIC, from pipeline — clubs/<slug>.json, formations.json, index.json
  /pipeline      # OFFLINE ONLY, never deployed — scrape/normalise/rating/cost/export (+README)
  /public        # fonts, static card assets (no logos)
  /src
    /app
      layout.tsx  page.tsx                 # home + club picker
      /club/[slug]/page.tsx                # builder + SEO prose (static params from index.json)
      /daily/page.tsx
    /components   Pitch  PlayerSlot  PlayerPicker  BudgetBar  ScorePanel  TierBadge  ShareCard
    /lib          types  scoring  cost  dailyPuzzle  prng   # all pure + unit-tested
    /content/clubs/<slug>.mdx              # evergreen SEO copy (or inline in page)
```

## 11. Commands

```
pnpm install
pnpm dev                 # local
pnpm test                # scoring/cost/dailyPuzzle must have unit tests — keep green
pnpm build && pnpm export
# deploy: Cloudflare Pages (static output dir)
```

## 12. Definition of done (v1)

Static site deploys to Cloudflare Pages with **zero** server dependencies (bar the optional OG function); **6–12 marquee clubs** fully playable; budget tuned to §5.2 target; daily mode seeded & deterministic; client-side share card; per-club SEO pages + sitemap; ad slots present behind an **off** flag; disclaimer live; `pnpm test` green. No simulation, no accounts, no database anywhere in the tree.

## 13. Decision log (why, so you don't "helpfully" undo these)

- **Score, don't simulate** — the match engine is the scope-killer and a credibility trap; a budget-capped static score already *is* the game.
- **Convex cost** — linear cost collapses the puzzle to "buy the best XI"; convexity forces knowledge-driven allocation.
- **Cloudflare + static** — cheap, and immune to viral bill-shock.
- **Narrow & deep** — the puzzle is only rich for big clubs; the long tail earns its keep via SEO, not depth.
- **Hold back the quiz twist** — it's the best v2 differentiator; shipping it in v1 wastes the moat.

---

## Appendix: v1 build notes (2026-07-04)

- **Budget deviation from §5.2's "start ~260":** with `COST_EXP 3.2` and rosters rated
  65–98, 260 credits caps the XI at ~62 average rating. The §5.2 *tuning target* takes
  precedence (as this file instructs): budgets are derived per club in the pipeline as
  `superstarXICost / 1.35`, landing at 620–660. Both targets verified by
  `pnpm pipeline:tune` and the `/data` test suite.
- "No two players from the same original club" constraint from the §7 POOL examples is
  not implementable with v1 data (no origin-club field) — replaced with a
  "3+ pre-1993 seasons" constraint. // V2: add originClubId to PlayerSeason.
