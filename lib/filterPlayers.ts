import type { MockPlayer } from "@/data/mockPlayers";

export type PlayerSearchCriteria = {
  playerName: string;
  position: string;
  foot: string;
  age: string;
};

/**
 * Player must satisfy every filter that is not "Any" / empty.
 */
export function playerMatchesCriteria(
  p: MockPlayer,
  c: PlayerSearchCriteria
): boolean {
  const nameQ = c.playerName.trim().toLowerCase();
  if (nameQ && !p.name.toLowerCase().includes(nameQ)) {
    return false;
  }
  if (c.position !== "Any" && p.position !== c.position) {
    return false;
  }
  if (c.foot !== "Any" && p.dominantFoot !== c.foot) {
    return false;
  }
  if (c.age !== "Any") {
    const want = parseInt(c.age, 10);
    if (Number.isNaN(want) || p.age !== want) {
      return false;
    }
  }
  return true;
}

export function filterPlayersByCriteria(
  players: MockPlayer[],
  c: PlayerSearchCriteria
): MockPlayer[] {
  return players.filter((p) => playerMatchesCriteria(p, c));
}
