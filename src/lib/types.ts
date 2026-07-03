export type PositionGroup = "GK" | "CB" | "FB" | "DM" | "CM" | "AM" | "W" | "ST";
export type ClubTier = "marquee" | "longtail";

export interface Club {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  tier: ClubTier;
  themeColour: string; // generic, NOT official
  budget: number; // credits, tuned offline per club (§5.2)
}

export interface PlayerSeason {
  id: string; // stable, unique
  playerName: string;
  clubId: string;
  seasonLabel: string; // "2013-14"
  seasonEndYear: number; // 2014
  positions: PositionGroup[]; // [0] = primary
  rating: number; // 1..99, derived offline
  cost: number; // credits, derived offline
  stats?: { apps?: number; goals?: number; assists?: number };
  note?: string;
}

export interface FormationSlot {
  slotId: string;
  group: PositionGroup;
  x: number; // 0..100, left→right
  y: number; // 0..100, top (attack) → bottom (GK)
}

export interface Formation {
  id: string;
  name: string; // e.g. "4-3-3"
  slots: FormationSlot[];
}

export interface ClubData {
  club: Club;
  players: PlayerSeason[];
}

/** One filled slot in a starting XI. */
export interface XiEntry {
  slotId: string;
  player: PlayerSeason;
}

export type TierLabel =
  | "Cult Hero"
  | "Fan Favourite"
  | "Continental"
  | "Elite"
  | "Legendary"
  | "GOAT";
