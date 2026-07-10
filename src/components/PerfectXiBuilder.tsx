"use client";

import { useEffect, useMemo, useState } from "react";
import { H2HShareCard } from "@/components/H2HShareCard";
import { Pitch } from "@/components/Pitch";
import { PlayerSearch } from "@/components/PlayerSearch";
import { XiShareCard } from "@/components/XiShareCard";
import { matchResult, RATING_FLOOR, teamRating } from "@/lib/h2h";
import { scoreBuild, type XiBuild, type XiScore } from "@/lib/perfectXi";
import { seasonsBetween, seasonsFromYearRanges } from "@/lib/seasons";
import { readStored, writeStored } from "@/lib/storage";
import type { EraKey, Formation, IndexedPlayer, Manager, Ratings } from "@/lib/types";

interface Opponent {
  club: string;
  name: string; // display name, e.g. "Manchester United"
  canonicalRating: number; // hidden — only the resulting scoreline is shown
}

interface PerfectXiBuilderProps {
  era: EraKey;
  formations: Formation[];
  players: IndexedPlayer[];
  managers: Manager[];
  ratings: Ratings;
  opponents: Opponent[];
}

const clubName = (slug: string) => slug.replace(/(^|-)(\w)/g, (_, s, c) => (s ? " " : "") + c.toUpperCase());

interface Pick {
  playerId: string;
  season: string;
}

interface Saved {
  attempts: number;
  best: number;
  solvedBuild: XiBuild | null;
}

/** Team-sheet stats line: age in the picked season + career totals + honour marks. */
const statsLine = (p: IndexedPlayer, season: string) => {
  const bits: string[] = [];
  if (p.birthYear) bits.push(`age ${parseInt(season) - p.birthYear}`);
  bits.push(`${p.apps} apps`);
  if (p.goals > 0) bits.push(`${p.goals} gls`);
  if (p.marks) bits.push(...p.marks);
  return bits.join(" · ");
};

const labelClass = "mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-blood-700";
const selectClass =
  "shadow-poster-sm w-full border-[3px] border-ink-950 bg-paper-50 px-3 py-2.5 text-sm font-bold outline-none disabled:opacity-50";

export function PerfectXiBuilder({ era, formations, players, managers, ratings, opponents }: PerfectXiBuilderProps) {
  const storageKey = `xi:${era.club}:${era.slug}`;
  const [formationId, setFormationId] = useState(formations[0].id);
  const [picks, setPicks] = useState<Record<string, Pick | undefined>>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [managerId, setManagerId] = useState("");
  const [managerSeason, setManagerSeason] = useState("");
  const [feedback, setFeedback] = useState<XiScore | null>(null);
  const [yourRating, setYourRating] = useState<number | null>(null); // H2H team strength (hidden)
  const [rival, setRival] = useState<Opponent | null>(null);
  const [saved, setSaved] = useState<Saved>({ attempts: 0, best: 0, solvedBuild: null });

  // hidden H2H team strength of a build — a pick with no shipped rating counts as the floor
  const ratingOfBuild = (build: XiBuild) =>
    teamRating(build.picks.map((p) => ratings[p.playerId]?.[p.season] ?? RATING_FLOOR));

  const formation = formations.find((f) => f.id === formationId) ?? formations[0];
  const byId = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);
  const solved = saved.solvedBuild !== null;

  // era gating: only players, seasons and managers from the era window are pickable
  const eligiblePlayers = useMemo(
    () => players.filter((p) => p.years[1] >= era.fromYear),
    [players, era.fromYear],
  );
  const playerSeasons = (p: IndexedPlayer) => seasonsBetween(Math.max(p.years[0], era.fromYear), p.years[1]);
  const managerSeasonsById = useMemo(
    () =>
      new Map(
        managers.map((m) => [m.id, seasonsFromYearRanges(m.years).filter((s) => parseInt(s) >= era.fromYear)]),
      ),
    [managers, era.fromYear],
  );
  const eligibleManagers = managers.filter((m) => (managerSeasonsById.get(m.id) ?? []).length > 0);

  // restore attempts/best and, if already solved, the winning build (local reveal)
  useEffect(() => {
    const s = readStored<Saved>(storageKey);
    if (!s) return;
    setSaved(s);
    if (s.solvedBuild) {
      setFormationId(s.solvedBuild.formationId);
      setManagerId(s.solvedBuild.managerId);
      setManagerSeason(s.solvedBuild.managerSeason);
      setFeedback(scoreBuild(s.solvedBuild, era)); // so the share card survives a reload
      setYourRating(ratingOfBuild(s.solvedBuild)); // so H2H survives a reload too
    }
  }, [storageKey, era]);

  // lay the solved build out once its formation is active
  useEffect(() => {
    if (!saved.solvedBuild || saved.solvedBuild.formationId !== formation.id) return;
    setPicks(Object.fromEntries(formation.slots.map((s, i) => [s.slotId, saved.solvedBuild!.picks[i]])));
  }, [saved.solvedBuild, formation]);

  // only the active formation's picks — a formation switch must not leave ghost exclusions
  const pickedIds = formation.slots.flatMap((s) => (picks[s.slotId] ? [picks[s.slotId]!.playerId] : []));

  const labels = Object.fromEntries(
    formation.slots.map((s) => {
      const p = picks[s.slotId];
      return [s.slotId, p ? (byId.get(p.playerId)?.name ?? p.playerId).split(" ").slice(-1)[0] : undefined];
    }),
  );

  const filledCount = formation.slots.filter((s) => picks[s.slotId]).length;
  const complete =
    formation.slots.every((s) => picks[s.slotId]) && managerId !== "" && managerSeason !== "";

  const submit = () => {
    if (!complete || solved) return;
    const build: XiBuild = {
      picks: formation.slots.map((s) => picks[s.slotId]!),
      managerId,
      managerSeason,
      formationId: formation.id,
    };
    const s = scoreBuild(build, era);
    const next: Saved = {
      attempts: saved.attempts + 1,
      best: Math.max(saved.best, s.total),
      solvedBuild: s.perfect ? build : null,
    };
    setFeedback(s);
    setYourRating(ratingOfBuild(build)); // unlocks head-to-head
    setSaved(next);
    writeStored(storageKey, next);
  };

  const selected = selectedSlot ? picks[selectedSlot] : undefined;
  const selectedPlayer = selected ? byId.get(selected.playerId) : undefined;
  const manager = managers.find((m) => m.id === managerId);

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
      {solved
        ? Array.from({ length: 30 }, (_, i) => (
            <span
              key={i}
              aria-hidden
              className="confetti-piece"
              style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 10) * 0.25}s` }}
            >
              {["🔴", "🏆", "⭐"][i % 3]}
            </span>
          ))
        : null}

      {/* formation diagram + setup — names never appear on the pitch */}
      <div className="flex gap-4 md:block md:space-y-4">
        <div className="w-[44%] shrink-0 md:w-full">
          <Pitch
            formation={formation}
            labels={labels}
            selectedSlotId={selectedSlot}
            onSelectSlot={(id) => setSelectedSlot(id)}
          />
        </div>
        <div className="min-w-0 flex-1 space-y-3 md:space-y-4">
          <label className="block">
            <span className={labelClass}>Formation</span>
            <select
              value={formationId}
              onChange={(e) => {
                setFormationId(e.target.value);
                setSelectedSlot(null);
              }}
              disabled={solved}
              className={selectClass}
            >
              {formations.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Manager</span>
            <select
              value={managerId}
              onChange={(e) => {
                setManagerId(e.target.value);
                setManagerSeason("");
              }}
              disabled={solved}
              className={selectClass}
            >
              <option value="">—</option>
              {eligibleManagers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.years})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>His peak season</span>
            <select
              value={managerSeason}
              onChange={(e) => setManagerSeason(e.target.value)}
              disabled={solved || !manager}
              className={selectClass}
            >
              <option value="">—</option>
              {manager
                ? (managerSeasonsById.get(manager.id) ?? []).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))
                : null}
            </select>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {solved ? (
          <div className="shadow-poster border-[3px] border-ink-950 bg-pitch-800 p-4 text-center text-cream-100">
            <p className="font-display text-lg uppercase">Perfect — 98/98</p>
            <p className="mt-1 text-sm">
              You found the canonical {era.title} in {saved.attempts} attempts. Your team sheet below
              is the hidden XI.
            </p>
          </div>
        ) : null}

        <div className="shadow-poster-sm border-[3px] border-ink-950 bg-paper-50 p-4">
          {!selectedSlot ? (
            <p className="text-sm font-bold text-dune-600">
              Tap a team-sheet row (or a pitch dot) to pick a player.
            </p>
          ) : selected && selectedPlayer ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-display uppercase">{selectedPlayer.name}</span>
                {!solved ? (
                  <button
                    type="button"
                    onClick={() => setPicks({ ...picks, [selectedSlot]: undefined })}
                    className="text-xs font-bold uppercase tracking-wide text-dune-600 hover:text-blood-600"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <label className="block">
                <span className={labelClass}>His defining season</span>
                <select
                  value={selected.season}
                  onChange={(e) =>
                    setPicks({ ...picks, [selectedSlot]: { ...selected, season: e.target.value } })
                  }
                  disabled={solved}
                  className={selectClass}
                >
                  {playerSeasons(selectedPlayer).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : (
            <PlayerSearch
              players={eligiblePlayers}
              onPick={(p) =>
                setPicks({
                  ...picks,
                  [selectedSlot]: { playerId: p.id, season: playerSeasons(p)[0] },
                })
              }
              exclude={pickedIds}
              placeholder={`Pick your ${formation.slots.find((s) => s.slotId === selectedSlot)?.group}…`}
            />
          )}
        </div>

        {/* the team sheet — where the XI actually lives */}
        <div className="shadow-poster border-[3px] border-ink-950 bg-paper-50">
          <div className="flex items-center justify-between bg-ink-950 px-3 py-2 text-cream-100">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em]">Team sheet</span>
            <span className="font-display text-sm">{filledCount}/11</span>
          </div>
          {formation.slots.map((slot, i) => {
            const pick = picks[slot.slotId];
            const player = pick ? byId.get(pick.playerId) : undefined;
            const sel = selectedSlot === slot.slotId;
            return (
              <button
                type="button"
                key={slot.slotId}
                onClick={() => setSelectedSlot(slot.slotId)}
                className={`flex w-full items-center gap-2.5 border-b-2 border-sand-300 px-3 py-2 text-left last:border-b-0 ${
                  sel ? "bg-sand-300/60" : "hover:bg-sand-300/30"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 border-ink-950 text-[10px] font-bold ${
                    player ? "bg-blood-600 text-white" : "bg-paper-50 text-dune-600"
                  }`}
                >
                  {i + 1}
                </span>
                {player && pick ? (
                  <>
                    <span className="min-w-0 flex-1">
                      <span className="font-display block truncate text-xs uppercase">{player.name}</span>
                      <span className="block truncate text-[11px] font-bold text-dune-600">
                        {statsLine(player, pick.season)}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-bold text-blood-600">{pick.season}</span>
                  </>
                ) : (
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase text-dune-600">— {slot.group}</span>
                    <span className="block text-[11px] text-dune-600">tap to pick player + season</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!solved ? (
          <button
            type="button"
            onClick={submit}
            disabled={!complete}
            className="font-display shadow-poster w-full border-[3px] border-ink-950 bg-blood-600 px-4 py-3 text-sm uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-paper-50 disabled:text-dune-600 disabled:shadow-none"
          >
            {complete ? "Score my XI" : "Fill all 11 slots + manager to submit"}
          </button>
        ) : null}

        {feedback ? (
          <div className="shadow-poster border-[3px] border-ink-950 bg-ink-950 p-4 text-center text-cream-100">
            <p className="font-display text-3xl">
              {feedback.total}
              <span className="text-lg text-cream-100/60">/98</span>
            </p>
            <p className="mt-2 text-sm font-bold">
              Players {feedback.playersCorrect}/11 · Seasons {feedback.seasonsCorrect}/11 · Formation{" "}
              {feedback.formationCorrect ? "✓" : "✗"} · Manager {feedback.managerCorrect ? "✓" : "✗"} ·
              Peak {feedback.managerSeasonCorrect ? "✓" : "✗"}
            </p>
            <p className="mt-1 text-xs text-cream-100/60">
              {saved.attempts} attempt{saved.attempts === 1 ? "" : "s"} · best {saved.best}/98
            </p>
            <div className="mt-3 flex justify-center">
              <XiShareCard score={feedback} eraTitle={era.title} eraSlug={era.slug} attempts={saved.attempts} />
            </div>
          </div>
        ) : saved.attempts > 0 && !solved ? (
          <p className="text-center text-xs font-bold text-dune-600">
            {saved.attempts} attempt{saved.attempts === 1 ? "" : "s"} so far · best {saved.best}/98
          </p>
        ) : null}

        {feedback && yourRating !== null && opponents.length > 0 ? (
          <div className="shadow-poster-sm border-[3px] border-ink-950 bg-paper-50 p-4">
            <p className="font-display text-center text-sm uppercase">Head to head</p>
            <p className="mt-1 text-center text-xs font-bold text-dune-600">
              Play your XI against another club&apos;s greatest side — result only, their team stays hidden.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {opponents.map((o) => (
                <button
                  key={o.club}
                  type="button"
                  onClick={() => setRival(o)}
                  className={`border-2 border-ink-950 px-3 py-2 text-xs font-bold uppercase tracking-wide ${
                    rival?.club === o.club
                      ? "shadow-poster-sm bg-blood-600 text-white"
                      : "bg-paper-50 hover:bg-sand-300/60"
                  }`}
                >
                  {o.name}
                </button>
              ))}
            </div>
            {rival
              ? (() => {
                  const result = matchResult(yourRating, rival.canonicalRating);
                  const tone =
                    result.outcome === "W"
                      ? "text-pitch-800"
                      : result.outcome === "L"
                        ? "text-blood-700"
                        : "text-dune-600";
                  const word = result.outcome === "W" ? "Win" : result.outcome === "L" ? "Loss" : "Draw";
                  return (
                    <div className="mt-4 text-center">
                      <p className="text-sm font-bold text-dune-600">
                        {clubName(era.club)} <span className="opacity-60">v</span> {rival.name}
                      </p>
                      <p className={`font-display text-5xl ${tone}`}>{result.scoreline}</p>
                      <p className={`font-display text-sm uppercase ${tone}`}>{word}</p>
                      <div className="mt-3 flex justify-center">
                        <H2HShareCard
                          result={result}
                          yourClub={clubName(era.club)}
                          rivalClub={rival.name}
                          eraTitle={era.title}
                        />
                      </div>
                    </div>
                  );
                })()
              : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
