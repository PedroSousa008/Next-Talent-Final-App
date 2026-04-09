import type { ProfileData } from "@/contexts/ProfileContext";
import type { MockPlayer } from "@/data/mockPlayers";
import { profileToSearchPlayer } from "@/lib/mergeSearchWithProfile";

export type LineupPlacement = {
  /** Position on the tactical board */
  slotLabel: string;
  leftPct: number;
  topPct: number;
  player: MockPlayer;
};

const CLUB = "Benfica";

/** 4-4-2 — top of pitch = attack (same idea as FUT). */
const SLOTS_442: { slotLabel: string; leftPct: number; topPct: number }[] = [
  { slotLabel: "ST", leftPct: 28, topPct: 8 },
  { slotLabel: "ST", leftPct: 72, topPct: 8 },
  { slotLabel: "LM", leftPct: 10, topPct: 26 },
  { slotLabel: "CM", leftPct: 38, topPct: 26 },
  { slotLabel: "CM", leftPct: 62, topPct: 26 },
  { slotLabel: "RM", leftPct: 90, topPct: 26 },
  { slotLabel: "LB", leftPct: 10, topPct: 44 },
  { slotLabel: "CB", leftPct: 38, topPct: 44 },
  { slotLabel: "CB", leftPct: 62, topPct: 44 },
  { slotLabel: "RB", leftPct: 90, topPct: 44 },
  { slotLabel: "GK", leftPct: 50, topPct: 66 },
];

function p(
  id: string,
  name: string,
  position: string,
  foot: MockPlayer["dominantFoot"],
  age: number,
  nation: string
): MockPlayer {
  return {
    id,
    name,
    position,
    dominantFoot: foot,
    age,
    club: CLUB,
    nation,
  };
}

/**
 * Coach-selected starting XI for home league demo — aligns with club hub squad names where possible.
 */
export function getBenficaCoachLineup(profile: ProfileData): LineupPlacement[] {
  const self = profileToSearchPlayer(profile);
  const lcm: MockPlayer = {
    ...self,
    position:
      profile.searchPosition !== "Any"
        ? profile.searchPosition
        : profile.position || "CM",
  };

  const players: MockPlayer[] = [
    p("xi-st1", "Arthur Cabral", "ST", "Right Foot", 26, "Brazil"),
    p("xi-st2", "Henrique Araújo", "ST", "Right Foot", 22, "Portugal"),
    p("xi-lm", "Nuno Santos", "LM", "Left Foot", 29, "Portugal"),
    lcm,
    p("xi-rcm", "Orkun Kökçü", "CM", "Right Foot", 24, "Turkey"),
    p("xi-rm", "Ángel Di María", "RM", "Left Foot", 36, "Argentina"),
    p("xi-lb", "David Pereira", "LB", "Left Foot", 24, "Portugal"),
    p("xi-lcb", "Tomás Araújo", "CB", "Right Foot", 22, "Portugal"),
    p("xi-rcb", "António Silva", "CB", "Right Foot", 21, "Portugal"),
    p("xi-rb", "João Neves", "RB", "Right Foot", 20, "Portugal"),
    p("xi-gk", "Rafael Neves", "GK", "Right Foot", 25, "Portugal"),
  ];

  return SLOTS_442.map((slot, i) => ({
    slotLabel: slot.slotLabel,
    leftPct: slot.leftPct,
    topPct: slot.topPct,
    player: players[i]!,
  }));
}
