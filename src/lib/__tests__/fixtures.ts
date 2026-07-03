import type { Formation, PlayerSeason, PositionGroup, XiEntry } from "../types";

export const F433: Formation = {
  id: "433",
  name: "4-3-3",
  slots: [
    { slotId: "gk", group: "GK", x: 50, y: 94 },
    { slotId: "fb-l", group: "FB", x: 12, y: 74 },
    { slotId: "cb-l", group: "CB", x: 35, y: 78 },
    { slotId: "cb-r", group: "CB", x: 65, y: 78 },
    { slotId: "fb-r", group: "FB", x: 88, y: 74 },
    { slotId: "dm", group: "DM", x: 50, y: 58 },
    { slotId: "cm-l", group: "CM", x: 30, y: 44 },
    { slotId: "cm-r", group: "CM", x: 70, y: 44 },
    { slotId: "w-l", group: "W", x: 15, y: 22 },
    { slotId: "w-r", group: "W", x: 85, y: 22 },
    { slotId: "st", group: "ST", x: 50, y: 10 },
  ],
};

let nextId = 0;

export function makePlayer(overrides: Partial<PlayerSeason> & { rating: number; positions: PositionGroup[] }): PlayerSeason {
  nextId += 1;
  return {
    id: `test-${nextId}`,
    playerName: `Player ${nextId}`,
    clubId: "test-club",
    seasonLabel: "1999-00",
    seasonEndYear: 2000,
    cost: 10,
    ...overrides,
  };
}

/** A tidy, all-natural XI: every player rated `rating`, in position, for F433. */
export function naturalXi(rating: number): XiEntry[] {
  return F433.slots.map((slot) => ({
    slotId: slot.slotId,
    player: makePlayer({ rating, positions: [slot.group] }),
  }));
}
