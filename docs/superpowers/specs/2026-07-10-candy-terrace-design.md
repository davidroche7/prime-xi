# Candy Terrace — design spec (approved by Dave, 2026-07-10)

Prototype: claude.ai artifact `candy-terrace-teamsheet` (three phone frames: home, builder, daily).
Replaces the 2026-07-10-morning dark theme entirely. Light-only — the poster is the identity.

## Brand

- **Rename**: PRIME XI → **The Perfect XI** everywhere (site name, wordmark, manifest, og, icons).
  "Guess the Red" stays as the daily game title. sw cache name bumps.

## System

- **Palette**: kit red `#c8102e` · deep red `#a41623` · paper `#f9f3e4` · card `#fffaef` ·
  ink `#1a0a0e` · sand (rules) `#ece1c6` · dune (muted text) `#7d6a55` · pitch `#1d5c33`.
- **Fleck**: the '89-style irregular-shard texture as a tiled SVG data-URI (cream + ink shards on
  red). Red fleck = cover surfaces (homepage poster, page header bands, share cards, icons).
  Cream paper = working surfaces (builder, daily, prose, legal).
- **Poster grammar**: 3px ink borders, hard offset shadows (5px/5px cover, 3–4px inner),
  flat blocks, no gradients/glows anywhere. Stacked condensed caps display with an ink turn.
- **Type**: Archivo Black (display, caps) + Archivo (body/UI) via next/font. Small-caps tracking
  labels in red.

## Screens

- **Home**: red fleck poster (hero stack "Build the greatest XI. / Prove it.", era blocks with
  best-score chips, dashed H2H strip, ink daily CTA) on paper page; prose/FAQ below, poster headings.
- **Era builder**: fleck band header. Pitch shrinks to a **formation diagram** — dots only
  (dashed empty / solid filled / red selected), never any text on the pitch. Picker under it.
  **Team sheet** is the hero: numbered rows — NAME caps, season (red, right), stats line
  `age N · apps · gls · up-to-3 honour marks`; empty rows ghosted; row tap = select slot.
  Ink scoreboard strip; poster submit.
- **Daily**: fleck band header, clues as stamped blocks (red square numbers, locked = faded, no
  shadow), poster guess input and buttons.
- **Share cards + icons + og**: redrawn to match — fleck-red plate, caps, hard shadow.

## Data (pipeline, offline)

`players-index.json` rows gain: `pos`, `apps`, `goals`, and (enriched players only) `birthYear`,
`marks` (≤3 honour abbreviations with year, priority EC/CL > LG > CWC > UEFA > FA > LC, e.g.
`["CL ’05", "FA ’06"]`). Age shown = pick-season start year − birthYear. Per-season stats do not
exist in the dataset (known ponytail ceiling — real per-season data is the upgrade path).

## Non-goals

Dark mode (would be a different product) · behaviour changes to scoring/H2H · new pages.
