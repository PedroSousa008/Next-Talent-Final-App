import type { ProfileData } from "@/contexts/ProfileContext";
import { CURRENT_USER_PLAYER_ID } from "@/constants/playerSearch";
import type { MockPlayer } from "@/data/mockPlayers";
import type { PlayerSearchCriteria } from "@/lib/filterPlayers";

export type SearchListPlayer = MockPlayer & { avatarUri?: string | null };

/**
 * Profile appears in Search only when the name query is non-empty and matches
 * displayName, and all active filters match (search fields treat empty / null as "match any").
 */
export function profileMatchesSearchCriteria(
  profile: ProfileData,
  c: PlayerSearchCriteria
): boolean {
  const nameQ = c.playerName.trim().toLowerCase();
  if (!nameQ) return false;
  if (!profile.displayName.trim().toLowerCase().includes(nameQ)) {
    return false;
  }
  if (c.position !== "Any") {
    if (
      profile.searchPosition !== "Any" &&
      profile.searchPosition !== c.position
    ) {
      return false;
    }
  }
  if (c.foot !== "Any") {
    if (profile.searchFoot && profile.searchFoot !== c.foot) {
      return false;
    }
  }
  if (c.age !== "Any") {
    if (
      profile.searchAge != null &&
      String(profile.searchAge) !== c.age
    ) {
      return false;
    }
  }
  return true;
}

export function profileToSearchPlayer(profile: ProfileData): SearchListPlayer {
  const position =
    profile.searchPosition !== "Any" ? profile.searchPosition : "CM";
  const foot =
    profile.searchFoot && profile.searchFoot.length > 0
      ? profile.searchFoot
      : "Right Foot";
  const age = profile.searchAge ?? 21;
  return {
    id: CURRENT_USER_PLAYER_ID,
    name: profile.displayName,
    position,
    dominantFoot: foot,
    age,
    club: profile.club,
    nation: profile.nationality,
    avatarUri: profile.avatarUri,
  };
}

function normalizeName(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Put the signed-in profile first; drop mock rows with the same display name. */
export function mergeSearchResultsWithProfile(
  mockResults: MockPlayer[],
  profile: ProfileData,
  criteria: PlayerSearchCriteria
): SearchListPlayer[] {
  if (!profileMatchesSearchCriteria(profile, criteria)) {
    return mockResults.map((p) => ({ ...p }));
  }
  const self = profileToSearchPlayer(profile);
  const selfName = normalizeName(self.name);
  const rest = mockResults.filter(
    (p) => normalizeName(p.name) !== selfName
  );
  return [self, ...rest.map((p) => ({ ...p }))];
}
