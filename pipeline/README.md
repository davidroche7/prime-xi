# PRIME XI — offline data pipeline

**Never deployed.** Run by hand; output is committed as static JSON under `/data`.
Production never computes ratings/costs and never scrapes at runtime.

## Current state (v1 seed data)

v1 ships **hand-curated seed rosters** in `seed/` — ~30 peak player-seasons per marquee
club. Season labels, positions, and the sparse apps/goals figures are historical facts
(approximate, league-only, indicative). **Ratings are our own editorial estimates**
(1–99); costs are derived from ratings by `src/lib/cost.ts`. No scraping was needed for
v1 — replace/extend `seed/` with the scraped pipeline below when widening club coverage.

## Target pipeline (for the data-update run)

`scrape → normalise/dedupe → assign positions → derive rating → derive cost → export JSON`

- Sources: worldfootballR, soccerdata, ScraperFC, StatsBomb open data, football-data.co.uk.
  Scrape respectfully: cache everything, back off. **Do not depend on xG** (FBref lost
  Opta access Jan 2026); apps/goals/assists + a derived rating are sufficient.

## Commands

```
pnpm pipeline:export   # derive costs + budgets, write /data/*.json, print tuning report
pnpm pipeline:tune     # print the §5.2 tuning report without writing files
```

## Budget tuning (§5.2)

Per-club budget = `round(superstarXICost / 1.35 / 5) * 5`, where superstarXICost is the
cost of the best natural player per 4-3-3 slot. By construction an all-superstar XI is
~30–40% over budget. The report also shows a greedy "strong balanced XI" spend so you can
confirm it lands in 90–100% of budget. The spec's original 260-credit starting budget is
mathematically incompatible with COST_EXP 3.2 for rosters rated 65–98 (it would cap the
XI at ~62 average rating), so budgets are derived per club instead — the spec's own
tuning target takes precedence.
