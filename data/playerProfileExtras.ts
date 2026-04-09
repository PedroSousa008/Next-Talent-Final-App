import type { ProfileData } from "@/contexts/ProfileContext";
import { CURRENT_USER_PLAYER_ID } from "@/constants/playerSearch";
import { profileToSearchPlayer } from "@/lib/mergeSearchWithProfile";
import { MOCK_PLAYERS, type MockPlayer } from "@/data/mockPlayers";
import { computeAgeFromDob } from "@/lib/birthDate";

/** Staff-entered strength tier (player cannot edit in-app). */
export type AttributeLevel = "strong" | "medium" | "weak" | null;

export type PlayerAttributeRatings = {
  shooting: AttributeLevel;
  longShooting: AttributeLevel;
  penaltyTaker: AttributeLevel;
  freeKickTaker: AttributeLevel;
  passing: AttributeLevel;
  vision: AttributeLevel;
  crossing: AttributeLevel;
  cornerTaker: AttributeLevel;
  dribbling: AttributeLevel;
  ballControl: AttributeLevel;
  firstTouch: AttributeLevel;
  composure: AttributeLevel;
  tackling: AttributeLevel;
  positioning: AttributeLevel;
  workRate: AttributeLevel;
  leadership: AttributeLevel;
};

export type SeasonDetails = {
  games: number | null;
  starts: number | null;
  goals: number | null;
  goalsPerGame: number | null;
  assists: number | null;
  assistsPerGame: number | null;
  minutes: number | null;
  yellows: number | null;
  reds: number | null;
  freeKickGoals: number | null;
  penaltyGoals: number | null;
  rightFootedGoals: number | null;
  leftFootedGoals: number | null;
  headerGoals: number | null;
};

/** Extended profile shown on the player screen (FIFA-style bio + details). */
export type PlayerWithProfile = MockPlayer & {
  shirtNumber: number;
  dateOfBirth: string;
  heightMeters: number;
  weightKg: number;
  attributeRatings: PlayerAttributeRatings;
  seasonDetails: SeasonDetails;
};

type Extra = Omit<PlayerWithProfile, keyof MockPlayer>;

const ATTR_KEYS: (keyof PlayerAttributeRatings)[] = [
  "shooting",
  "longShooting",
  "penaltyTaker",
  "freeKickTaker",
  "passing",
  "vision",
  "crossing",
  "cornerTaker",
  "dribbling",
  "ballControl",
  "firstTouch",
  "composure",
  "tackling",
  "positioning",
  "workRate",
  "leadership",
];

function attrsFromSeed(seed: number): PlayerAttributeRatings {
  const cycle: AttributeLevel[] = ["strong", "medium", "weak", null];
  const o = {} as PlayerAttributeRatings;
  ATTR_KEYS.forEach((k, i) => {
    o[k] = cycle[(seed + i * 3 + (i % 5)) % 4];
  });
  return o;
}

type SeasonLegacy = {
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
  /** If omitted, minutes are estimated from games (typical outfield minutes per appearance). */
  minutesPlayed?: number | null;
  starts?: number | null;
  freeKickGoals?: number | null;
  penaltyGoals?: number | null;
  rightFootedGoals?: number | null;
  leftFootedGoals?: number | null;
  headerGoals?: number | null;
};

function seasonDetailsFromStats(s: SeasonLegacy): SeasonDetails {
  const games = s.matchesOther + s.matchesCurrent;
  const goals = s.goalsOther + s.goalsCurrent;
  const assists = s.assistsOther + s.assistsCurrent;
  const yellows = s.yellowOther + s.yellowCurrent;
  const reds = s.redOther + s.redCurrent;
  const goalsPerGame =
    games > 0 ? Math.round((goals / games) * 100) / 100 : null;
  const assistsPerGame =
    games > 0 ? Math.round((assists / games) * 100) / 100 : null;
  const starts =
    s.starts ??
    (games > 0 ? Math.min(games, Math.max(1, Math.round(games * 0.85))) : null);
  const minutes =
    s.minutesPlayed != null && s.minutesPlayed >= 0
      ? Math.round(s.minutesPlayed)
      : games > 0
        ? Math.round(games * 78)
        : null;

  return {
    games: games > 0 ? games : null,
    starts,
    goals: games > 0 || goals > 0 ? goals : null,
    goalsPerGame,
    assists: games > 0 || assists > 0 ? assists : null,
    assistsPerGame,
    minutes,
    yellows: games > 0 || yellows > 0 ? yellows : null,
    reds: games > 0 || reds > 0 ? reds : null,
    freeKickGoals: s.freeKickGoals ?? null,
    penaltyGoals: s.penaltyGoals ?? null,
    rightFootedGoals: s.rightFootedGoals ?? null,
    leftFootedGoals: s.leftFootedGoals ?? null,
    headerGoals: s.headerGoals ?? null,
  };
}

function pack(
  shirtNumber: number,
  dateOfBirth: string,
  heightMeters: number,
  weightKg: number,
  seed: number,
  season: SeasonLegacy
): Extra {
  return {
    shirtNumber,
    dateOfBirth,
    heightMeters,
    weightKg,
    attributeRatings: attrsFromSeed(seed),
    seasonDetails: seasonDetailsFromStats(season),
  };
}

const EXTRAS: Record<string, Extra> = {
  "1": pack(
    10,
    "14/03/2003",
    1.78,
    76,
    3,
    {
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
      freeKickGoals: 1,
      penaltyGoals: 2,
      rightFootedGoals: 5,
      leftFootedGoals: 1,
      headerGoals: 1,
    }
  ),
  "2": pack(
    8,
    "02/11/2005",
    1.83,
    74,
    5,
    {
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
      freeKickGoals: 0,
      penaltyGoals: 1,
      rightFootedGoals: 4,
      leftFootedGoals: 0,
      headerGoals: 1,
    }
  ),
  "3": pack(
    1,
    "19/07/2001",
    1.88,
    86,
    7,
    {
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
    }
  ),
  "4": pack(
    9,
    "08/01/2002",
    1.83,
    79,
    11,
    {
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
      freeKickGoals: 2,
      penaltyGoals: 4,
      rightFootedGoals: 18,
      leftFootedGoals: 3,
      headerGoals: 7,
    }
  ),
  "5": pack(
    14,
    "22/05/2004",
    1.8,
    72,
    13,
    {
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
      rightFootedGoals: 3,
      leftFootedGoals: 2,
      headerGoals: 0,
    }
  ),
  "6": pack(
    7,
    "11/09/2006",
    1.75,
    68,
    17,
    {
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
      freeKickGoals: 0,
      penaltyGoals: 1,
      rightFootedGoals: 4,
      leftFootedGoals: 0,
      headerGoals: 1,
    }
  ),
  "7": pack(
    5,
    "30/04/1998",
    1.91,
    84,
    19,
    {
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
      rightFootedGoals: 2,
      leftFootedGoals: 0,
      headerGoals: 1,
    }
  ),
  "8": pack(
    6,
    "03/12/2000",
    1.8,
    78,
    23,
    {
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
      freeKickGoals: 1,
      penaltyGoals: 0,
      rightFootedGoals: 5,
      leftFootedGoals: 1,
      headerGoals: 0,
    }
  ),
  "9": pack(
    11,
    "17/06/2004",
    1.73,
    65,
    29,
    {
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
      rightFootedGoals: 7,
      leftFootedGoals: 3,
      headerGoals: 2,
    }
  ),
  "10": pack(
    19,
    "01/01/2007",
    1.78,
    71,
    31,
    {
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
      rightFootedGoals: 1,
      leftFootedGoals: 0,
      headerGoals: 0,
    }
  ),
  "11": pack(
    20,
    "25/09/1999",
    1.85,
    82,
    37,
    {
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
      freeKickGoals: 1,
      penaltyGoals: 3,
      rightFootedGoals: 14,
      leftFootedGoals: 4,
      headerGoals: 4,
    }
  ),
  "12": pack(
    4,
    "14/02/1997",
    1.83,
    77,
    41,
    {
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
      rightFootedGoals: 7,
      leftFootedGoals: 2,
      headerGoals: 1,
    }
  ),
    [CURRENT_USER_PLAYER_ID]: pack(
    8,
    "13/04/2003",
    1.8,
    73,
    43,
    {
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
      minutesPlayed: 14 * 78,
      freeKickGoals: 0,
      penaltyGoals: 1,
      rightFootedGoals: 4,
      leftFootedGoals: 1,
      headerGoals: 1,
    }
  ),
};

function fallbackExtra(p: MockPlayer): Extra {
  const n = parseInt(p.id, 10) || 1;
  return {
    shirtNumber: ((n * 3) % 28) + 1,
    dateOfBirth: "01/01/2000",
    heightMeters: 1.78 + (n % 10) * 0.02,
    weightKg: 70 + (n % 15),
    attributeRatings: attrsFromSeed(n + 50),
    seasonDetails: seasonDetailsFromStats({
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
    }),
  };
}

/** Bar fill width (%) — matches staff tier strength on the player details grid. */
export function attributeLevelToBarPercent(level: AttributeLevel): number {
  switch (level) {
    case "strong":
      return 88;
    case "medium":
      return 58;
    case "weak":
      return 32;
    default:
      return 45;
  }
}

export function attributeLevelBarColor(level: AttributeLevel): string {
  switch (level) {
    case "strong":
      return "#22C55E";
    case "medium":
      return "#EAB308";
    case "weak":
      return "#EF4444";
    default:
      return "rgba(148, 163, 184, 0.55)";
  }
}

/** Card counts → same green / yellow / red bands as the attributes table. */
export function disciplineLevelFromSeason(sd: SeasonDetails): AttributeLevel {
  const y = sd.yellows ?? 0;
  const r = sd.reds ?? 0;
  if (r >= 1) return "weak";
  if (y >= 3) return "weak";
  if (y >= 1) return "medium";
  return "strong";
}

export function getPlayerWithProfile(
  id: string,
  profile?: ProfileData
): PlayerWithProfile | undefined {
  if (id === CURRENT_USER_PLAYER_ID) {
    if (!profile) return undefined;
    const base = profileToSearchPlayer(profile);
    const extra = EXTRAS[CURRENT_USER_PLAYER_ID] ?? fallbackExtra(base);
    const merged: PlayerWithProfile = {
      ...base,
      ...extra,
      heightMeters: profile.heightMeters,
      weightKg: profile.weightKg,
      nation: profile.nationality,
      dateOfBirth: profile.dateOfBirth,
      shirtNumber: profile.shirtNumber,
      age: computeAgeFromDob(profile.dateOfBirth),
    };
    return merged;
  }
  const base = MOCK_PLAYERS.find((x) => x.id === id);
  if (!base) return undefined;
  const extra = EXTRAS[id] ?? fallbackExtra(base);
  const merged = { ...base, ...extra };
  return {
    ...merged,
    age: computeAgeFromDob(merged.dateOfBirth),
  };
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
