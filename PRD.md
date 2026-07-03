# PRD — PRIME XI (working title)

> Build your club's greatest-ever team from each player's **peak season** — not their trophy years.
> A budget-capped, knowledge-driven squad puzzle with a daily mode and a shareable result card.

**Status:** v1 spec, pre-build · **Owner:** Dave · **Build tool:** Fable (Claude)
**Working name only** — final name/domain TBC and must clear trademark (see Legal).

---

## 1. Why this exists

The viral `38-0-0` genre (spin → draft → simulate a perfect season) peaked around June 2026 and is now saturated with near-identical clones competing on multiplayer and cosmetics. Two gaps remain open:

1. **Knowledge, not luck.** The incumbents are random-spin games. There is no lane yet for a *skill* game that rewards knowing football history.
2. **SEO, not social.** The incumbents grew via X virality. Nobody is mining the enormous **evergreen** search demand for *"greatest [club] XI of all time."*

PRIME XI targets both: a knowledge puzzle distributed by programmatic SEO + user-shared result cards, operable anonymously with no social presence.

## 2. The core insight

A player's **best individual season** rarely aligns with their team's **trophy season** (e.g. Suárez 2013‑14 at Liverpool — sublime individually, won nothing). The game is: assemble your club's greatest XI by picking each player at their *peak*, under a **budget cap** that stops you simply fielding eleven superstars.

## 3. What v1 is (and deliberately is not)

**v1 IS:** a static, accountless web app where you pick a club, spend a fixed budget filling a formation with peak player-seasons, and receive a deterministic **team rating (/99) + tier label** and a **share card**. Plus a **daily puzzle** (same constraint for everyone, seeded by date). Plus programmatic **SEO pages** per club.

**v1 IS NOT** (these are v2 — see §9): any match/season **simulation**, "beat a historical side," the "guess the peak season" quiz twist, leaderboards, accounts, multiplayer, or real market-value pricing.

> **The single most important decision:** v1 **scores**, it does not **simulate**. The match engine is the part that turns a weekend into a month and invites "your sim is rigged" complaints. With a budget cap, a deterministic score *is* the game — a knapsack puzzle: maximise team rating within budget.

## 4. Core loop

1. Choose a club (curated set).
2. Choose a formation.
3. Fill 11 slots by selecting peak player-seasons, each with a **cost**; the **budget** is a hard ceiling.
4. Team rating (/99) + tier update live as you build.
5. Lock it in → generate a **share card** (image, user-shared → anonymous distribution).
6. **Daily mode:** identical seeded constraint worldwide; date-stamped card; resets 00:00 UTC.

## 5. Why the budget cap carries the whole thing

The cap is the engine. It only rewards knowledge if **cost is not linear in rating** — otherwise everyone maxes out and builds the same XI (the "freedom kills the game" failure). v1 makes cost a **convex** function of rating (elite seasons cost disproportionately more) plus a small positional-scarcity multiplier. This forces allocation trade-offs — a world-class spine funded by knowing the *affordable-but-excellent* player-seasons out wide. That breadth-of-knowledge requirement is the v1 skill.

**Design consequence — narrow and deep:** the puzzle is only rich for clubs with a deep pool of elite seasons (~20–40 marquee clubs). Launch with **6–12 curated marquee clubs** done properly. Every other club exists as an **SEO landing page** (page + builder, shallower data) — it ranks for "greatest [club] XI" but doesn't pretend to be a deep puzzle.

## 6. Success criteria

- **Ship criterion:** live, static, accountless, 6–12 marquee clubs playable + daily mode + share card, in a weekend of build (plus data-prep evenings).
- **Traction signals (month 3–6):** organic impressions on "greatest [club] XI" queries; share-card referrals; daily-mode return visits (via privacy-friendly analytics).
- **Explicitly not a KPI in v1:** MAU/retention dashboards, revenue. Monetisation is switched on *after* traffic (§8).

## 7. Distribution

- **Programmatic SEO** — one page per club, evergreen prose + FAQ schema. This is the anonymous growth engine that needs no social account.
- **User-shared result cards** — the app is inherently shareable; *users* propagate it, owner stays anonymous.
- **No owner social presence required.**

## 8. Monetisation (defined, not front-loaded)

- Ad slots exist behind a feature flag, **off** until traffic justifies them.
- **Pro unlock** (v2): remove ads, extra clubs, expert mode. One-off purchase.
- **Merchant of record** (LemonSqueezy or Paddle) when payments arrive — handles UK VAT and preserves anonymity. Not needed in v1.

## 9. Scope fence

| In v1 | Out (v2+) |
|---|---|
| Budget-capped builder | Match / season **simulation** |
| Deterministic score + tier | "Beat a historical side" mode |
| Daily seeded puzzle | "Guess the peak season" quiz twist *(hold back — best long-term differentiator)* |
| Share card (client-side image) | Leaderboards, accounts, multiplayer |
| 6–12 marquee clubs + SEO long tail | Full club breadth as deep puzzles |
| Ads-ready (flagged off) | Real market-value pricing; Pro unlock; MoR payments |

## 10. Legal / branding (non-negotiable)

- Player names and historical stats are **facts** — usable.
- **No** club badges, kits, crests, official logos, or competition marks (e.g. Premier League marks). Club **names** as descriptive facts + **generic** colour themes only.
- Ship the standard disclaimer: *independent, not affiliated with or endorsed by any league, club or competition; ratings are an independent interpretation of publicly available data, used descriptively.*
- Final product **name/domain** must clear a trademark check before launch.

## 11. Key risks

- **Scope creep into a match engine** — the primary risk; mitigated by §9 and the CLAUDE.md guardrails.
- **Budget tuning** — if cost tracks rating too closely the puzzle collapses; must be tuned during data prep (target in CLAUDE.md).
- **Data grind** — the dataset, not the app, is the real work; keeping v1 to 6–12 clubs keeps the timeline honest.
- **Spike-shaped payoff** — likeliest outcome is modest; treat as a low-cost bet, not an annuity.
