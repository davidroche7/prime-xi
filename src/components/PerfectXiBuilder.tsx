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

  const selectClass =
    "w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 outline-none focus:border-red-700";

  return (
    <div className="grid gap-6 md:grid-cols-2">
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

      <div>
        <Pitch
          formation={formation}
          labels={labels}
          selectedSlotId={selectedSlot}
          onSelectSlot={(id) => setSelectedSlot(id)}
        />
      </div>

      <div className="space-y-4">
        {solved ? (
          <div className="rounded-xl border border-emerald-700 bg-emerald-950/40 p-4 text-center">
            <p className="text-lg font-black text-emerald-400">PERFECT — 98/98</p>
            <p className="mt-1 text-sm text-zinc-300">
              You found the canonical {era.title} in {saved.attempts} attempts. Your build below is
              the hidden XI.
            </p>
          </div>
        ) : null}

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-zinc-300">Formation</span>
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

        <div className="rounded-xl border border-ink-800 bg-ink-900/60 p-4">
          {!selectedSlot ? (
            <p className="text-sm text-zinc-500">Tap a slot on the pitch to pick a player.</p>
          ) : selected && selectedPlayer ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold">{selectedPlayer.name}</span>
                {!solved ? (
                  <button
                    type="button"
                    onClick={() => setPicks({ ...picks, [selectedSlot]: undefined })}
                    className="text-zinc-400 hover:text-red-400"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <label className="block">
                <span className="mb-1 block text-zinc-400">His defining season</span>
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

        <div className="grid grid-cols-2 gap-3 text-sm">
          <label className="block">
            <span className="mb-1 block font-semibold text-zinc-300">Manager</span>
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
            <span className="mb-1 block font-semibold text-zinc-300">His peak season</span>
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

        {!solved ? (
          <button
            type="button"
            onClick={submit}
            disabled={!complete}
            className="w-full rounded-lg bg-red-700 px-4 py-3 font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-zinc-500"
          >
            {complete ? "Score my XI" : "Fill all 11 slots + manager to submit"}
          </button>
        ) : null}

        {feedback ? (
          <div className="rounded-xl border border-ink-700 bg-ink-900 p-4 text-center">
            <p className="text-3xl font-black">
              {feedback.total}
              <span className="text-lg font-bold text-zinc-500">/98</span>
            </p>
            <p className="mt-2 text-sm text-zinc-300">
              Players {feedback.playersCorrect}/11 · Seasons {feedback.seasonsCorrect}/11 · Formation{" "}
              {feedback.formationCorrect ? "✓" : "✗"} · Manager {feedback.managerCorrect ? "✓" : "✗"} ·
              Peak {feedback.managerSeasonCorrect ? "✓" : "✗"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {saved.attempts} attempt{saved.attempts === 1 ? "" : "s"} · best {saved.best}/98
            </p>
            <div className="mt-3 flex justify-center">
              <XiShareCard score={feedback} eraTitle={era.title} eraSlug={era.slug} attempts={saved.attempts} />
            </div>
          </div>
        ) : saved.attempts > 0 && !solved ? (
          <p className="text-center text-xs text-zinc-500">
            {saved.attempts} attempt{saved.attempts === 1 ? "" : "s"} so far · best {saved.best}/98
          </p>
        ) : null}

        {feedback && yourRating !== null && opponents.length > 0 ? (
          <div className="rounded-xl border border-ink-700 bg-ink-900 p-4">
            <p className="text-center text-sm font-bold text-zinc-200">Head to head</p>
            <p className="mt-1 text-center text-xs text-zinc-500">
              Play your XI against another club’s greatest side — result only, their team stays hidden.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {opponents.map((o) => (
                <button
                  key={o.club}
                  type="button"
                  onClick={() => setRival(o)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                    rival?.club === o.club
                      ? "border-red-700 bg-red-700/20 text-white"
                      : "border-ink-700 text-zinc-300 hover:border-red-700"
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
                    result.outcome === "W" ? "text-emerald-400" : result.outcome === "L" ? "text-red-400" : "text-amber-400";
                  const word = result.outcome === "W" ? "Win" : result.outcome === "L" ? "Loss" : "Draw";
                  return (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-zinc-400">
                        {clubName(era.club)} <span className="text-zinc-600">v</span> {rival.name}
                      </p>
                      <p className={`text-5xl font-black ${tone}`}>{result.scoreline}</p>
                      <p className={`text-sm font-bold ${tone}`}>{word}</p>
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
