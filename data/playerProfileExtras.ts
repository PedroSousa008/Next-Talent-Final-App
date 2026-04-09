import type { ProfileData } from "@/contexts/ProfileContext";
import { CURRENT_USER_PLAYER_ID } from "@/constants/playerSearch";
import { profileToSearchPlayer } from "@/lib/mergeSearchWithProfile";
import { MOCK_PLAYERS, type MockPlayer } from "@/data/mockPlayers";

/** Extended profile shown on the player screen (FIFA-style bio + details). */
export type PlayerWithProfile = MockPlayer & {
  rarityLabel: string;
  rarityAccent: string;
  playStylesCount: number;
  knownAs: string | null;
  dateOfBirth: string;
  /** Canonical height for display toggles (metres) */
  heightMeters: number;
  /** Canonical weight for display toggles (kilograms) */
  weightKg: number;
  boughtFor: string;
  owners: number;
  tradeStatus: string;
  matchesOther: number;
  matchesCurrent: number;
  goalsOther: number;
  goalsCurrent: number;
  assistsOther: number;
  assistsCurrent: number;
  yellowOther: number;
  yellowCurrent: number;
  redOther: number;
  redCurrent: number;
};

type Extra = Omit<PlayerWithProfile, keyof MockPlayer>;

const EXTRAS: Record<string, Extra> = {
  "1": {
    rarityLabel: "Gold Rare",
    rarityAccent: "#5BA3E8",
    playStylesCount: 3,
    knownAs: null,
    dateOfBirth: "14/03/2003",
    heightMeters: 1.78,
    weightKg: 76,
    boughtFor: "First Owner",
    owners: 1,
    tradeStatus: "Tradable",
    matchesOther: 0,
    matchesCurrent: 24,
    goalsOther: 0,
    goalsCurrent: 9,
    assistsOther: 0,
    assistsCurrent: 11,
    yellowOther: 0,
    yellowCurrent: 2,
    redOther: 0,
    redCurrent: 0,
  },
  "2": {
    rarityLabel: "Rare",
    rarityAccent: "#9CA3AF",
    playStylesCount: 2,
    knownAs: null,
    dateOfBirth: "02/11/2005",
    heightMeters: 1.83,
    weightKg: 74,
    boughtFor: "125,000 coins",
    owners: 2,
    tradeStatus: "Tradable",
    matchesOther: 8,
    matchesCurrent: 31,
    goalsOther: 1,
    goalsCurrent: 4,
    assistsOther: 3,
    assistsCurrent: 7,
    yellowOther: 1,
    yellowCurrent: 0,
    redOther: 0,
    redCurrent: 0,
  },
  "3": {
    rarityLabel: "Gold Rare",
    rarityAccent: "#5BA3E8",
    playStylesCount: 1,
    knownAs: null,
    dateOfBirth: "19/07/2001",
    heightMeters: 1.88,
    weightKg: 86,
    boughtFor: "First Owner",
    owners: 1,
    tradeStatus: "Untradeable",
    matchesOther: 0,
    matchesCurrent: 18,
    goalsOther: 0,
    goalsCurrent: 0,
    assistsOther: 0,
    assistsCurrent: 2,
    yellowOther: 0,
    yellowCurrent: 0,
    redOther: 0,
    redCurrent: 0,
  },
  "4": {
    rarityLabel: "Gold Rare",
    rarityAccent: "#5BA3E8",
    playStylesCount: 4,
    knownAs: null,
    dateOfBirth: "08/01/2002",
    heightMeters: 1.83,
    weightKg: 79,
    boughtFor: "Pack",
    owners: 1,
    tradeStatus: "Untradeable",
    matchesOther: 0,
    matchesCurrent: 42,
    goalsOther: 0,
    goalsCurrent: 28,
    assistsOther: 0,
    assistsCurrent: 6,
    yellowOther: 0,
    yellowCurrent: 1,
    redOther: 0,
    redCurrent: 0,
  },
  "5": {
    rarityLabel: "Rare",
    rarityAccent: "#9CA3AF",
    playStylesCount: 2,
    knownAs: null,
    dateOfBirth: "22/05/2004",
    heightMeters: 1.8,
    weightKg: 72,
    boughtFor: "47,500 coins",
    owners: 3,
    tradeStatus: "Tradable",
    matchesOther: 22,
    matchesCurrent: 15,
    goalsOther: 2,
    goalsCurrent: 3,
    assistsOther: 5,
    assistsCurrent: 4,
    yellowOther: 2,
    yellowCurrent: 1,
    redOther: 0,
    redCurrent: 0,
  },
  "6": {
    rarityLabel: "Gold Rare",
    rarityAccent: "#5BA3E8",
    playStylesCount: 3,
    knownAs: null,
    dateOfBirth: "11/09/2006",
    heightMeters: 1.75,
    weightKg: 68,
    boughtFor: "First Owner",
    owners: 1,
    tradeStatus: "Tradable",
    matchesOther: 0,
    matchesCurrent: 12,
    goalsOther: 0,
    goalsCurrent: 5,
    assistsOther: 0,
    assistsCurrent: 8,
    yellowOther: 0,
    yellowCurrent: 0,
    redOther: 0,
    redCurrent: 0,
  },
  "7": {
    rarityLabel: "Rare",
    rarityAccent: "#9CA3AF",
    playStylesCount: 1,
    knownAs: null,
    dateOfBirth: "30/04/1998",
    heightMeters: 1.91,
    weightKg: 84,
    boughtFor: "SBC",
    owners: 1,
    tradeStatus: "Untradeable",
    matchesOther: 0,
    matchesCurrent: 56,
    goalsOther: 0,
    goalsCurrent: 3,
    assistsOther: 0,
    assistsCurrent: 2,
    yellowOther: 0,
    yellowCurrent: 4,
    redOther: 0,
    redCurrent: 0,
  },
  "8": {
    rarityLabel: "Gold Rare",
    rarityAccent: "#5BA3E8",
    playStylesCount: 2,
    knownAs: null,
    dateOfBirth: "03/12/2000",
    heightMeters: 1.8,
    weightKg: 78,
    boughtFor: "200,000 coins",
    owners: 1,
    tradeStatus: "Tradable",
    matchesOther: 0,
    matchesCurrent: 67,
    goalsOther: 0,
    goalsCurrent: 6,
    assistsOther: 0,
    assistsCurrent: 14,
    yellowOther: 0,
    yellowCurrent: 3,
    redOther: 0,
    redCurrent: 0,
  },
  "9": {
    rarityLabel: "Gold Rare",
    rarityAccent: "#5BA3E8",
    playStylesCount: 3,
    knownAs: null,
    dateOfBirth: "17/06/2004",
    heightMeters: 1.73,
    weightKg: 65,
    boughtFor: "First Owner",
    owners: 1,
    tradeStatus: "Untradeable",
    matchesOther: 0,
    matchesCurrent: 29,
    goalsOther: 0,
    goalsCurrent: 12,
    assistsOther: 0,
    assistsCurrent: 9,
    yellowOther: 0,
    yellowCurrent: 0,
    redOther: 0,
    redCurrent: 0,
  },
  "10": {
    rarityLabel: "Rare",
    rarityAccent: "#9CA3AF",
    playStylesCount: 1,
    knownAs: null,
    dateOfBirth: "01/01/2007",
    heightMeters: 1.78,
    weightKg: 71,
    boughtFor: "Academy",
    owners: 1,
    tradeStatus: "Untradeable",
    matchesOther: 0,
    matchesCurrent: 9,
    goalsOther: 0,
    goalsCurrent: 1,
    assistsOther: 0,
    assistsCurrent: 2,
    yellowOther: 0,
    yellowCurrent: 0,
    redOther: 0,
    redCurrent: 0,
  },
  "11": {
    rarityLabel: "Gold Rare",
    rarityAccent: "#5BA3E8",
    playStylesCount: 4,
    knownAs: null,
    dateOfBirth: "25/09/1999",
    heightMeters: 1.85,
    weightKg: 82,
    boughtFor: "Pack",
    owners: 1,
    tradeStatus: "Tradable",
    matchesOther: 0,
    matchesCurrent: 35,
    goalsOther: 0,
    goalsCurrent: 22,
    assistsOther: 0,
    assistsCurrent: 5,
    yellowOther: 0,
    yellowCurrent: 2,
    redOther: 0,
    redCurrent: 0,
  },
  "12": {
    rarityLabel: "Rare",
    rarityAccent: "#9CA3AF",
    playStylesCount: 2,
    knownAs: null,
    dateOfBirth: "14/02/1997",
    heightMeters: 1.83,
    weightKg: 77,
    boughtFor: "95,000 coins",
    owners: 4,
    tradeStatus: "Tradable",
    matchesOther: 44,
    matchesCurrent: 20,
    goalsOther: 6,
    goalsCurrent: 4,
    assistsOther: 8,
    assistsCurrent: 6,
    yellowOther: 3,
    yellowCurrent: 1,
    redOther: 0,
    redCurrent: 1,
  },
  [CURRENT_USER_PLAYER_ID]: {
    rarityLabel: "Gold Rare",
    rarityAccent: "#5BA3E8",
    playStylesCount: 3,
    knownAs: null,
    dateOfBirth: "15/06/2002",
    heightMeters: 1.8,
    weightKg: 73,
    boughtFor: "First Owner",
    owners: 1,
    tradeStatus: "Tradable",
    matchesOther: 0,
    matchesCurrent: 14,
    goalsOther: 0,
    goalsCurrent: 6,
    assistsOther: 0,
    assistsCurrent: 9,
    yellowOther: 0,
    yellowCurrent: 1,
    redOther: 0,
    redCurrent: 0,
  },
};

function fallbackExtra(p: MockPlayer): Extra {
  const n = parseInt(p.id, 10) || 1;
  return {
    rarityLabel: "Rare",
    rarityAccent: "#9CA3AF",
    playStylesCount: 1 + (n % 3),
    knownAs: null,
    dateOfBirth: "01/01/2000",
    heightMeters: 1.78 + (n % 10) * 0.02,
    weightKg: 70 + (n % 15),
    boughtFor: "—",
    owners: 1,
    tradeStatus: "Tradable",
    matchesOther: 0,
    matchesCurrent: 0,
    goalsOther: 0,
    goalsCurrent: 0,
    assistsOther: 0,
    assistsCurrent: 0,
    yellowOther: 0,
    yellowCurrent: 0,
    redOther: 0,
    redCurrent: 0,
  };
}

export function getPlayerWithProfile(
  id: string,
  profile?: ProfileData
): PlayerWithProfile | undefined {
  if (id === CURRENT_USER_PLAYER_ID) {
    if (!profile) return undefined;
    const base = profileToSearchPlayer(profile);
    const extra = EXTRAS[CURRENT_USER_PLAYER_ID] ?? fallbackExtra(base);
    return {
      ...base,
      ...extra,
      heightMeters: profile.heightMeters,
      weightKg: profile.weightKg,
      nation: profile.nationality,
    };
  }
  const base = MOCK_PLAYERS.find((x) => x.id === id);
  if (!base) return undefined;
  const extra = EXTRAS[id] ?? fallbackExtra(base);
  return { ...base, ...extra };
}

export function playerLastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts.length ? (parts[parts.length - 1] ?? fullName) : fullName;
}

export function preferredFootShort(dominant: string): string {
  if (dominant === "Right Foot") return "Right";
  if (dominant === "Left Foot") return "Left";
  if (dominant === "Two-Footed") return "Two-Footed";
  return dominant;
}
