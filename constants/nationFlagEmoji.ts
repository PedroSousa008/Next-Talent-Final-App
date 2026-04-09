/**
 * National-team style flag emoji for card UI (falls back to globe).
 * Matches `nation` strings from mock / profile data.
 */
const NATION_TO_FLAG: Record<string, string> = {
  portugal: "🇵🇹",
  england: "🇬🇧",
  spain: "🇪🇸",
  france: "🇫🇷",
  ireland: "🇮🇪",
  sweden: "🇸🇪",
  argentina: "🇦🇷",
  japan: "🇯🇵",
  usa: "🇺🇸",
  "united states": "🇺🇸",
  brazil: "🇧🇷",
  germany: "🇩🇪",
  italy: "🇮🇹",
  netherlands: "🇳🇱",
  belgium: "🇧🇪",
  croatia: "🇭🇷",
  mexico: "🇲🇽",
  canada: "🇨🇦",
  australia: "🇦🇺",
  nigeria: "🇳🇬",
  ghana: "🇬🇭",
  senegal: "🇸🇳",
  morocco: "🇲🇦",
  egypt: "🇪🇬",
  uruguay: "🇺🇾",
  colombia: "🇨🇴",
  chile: "🇨🇱",
  ecuador: "🇪🇨",
  peru: "🇵🇪",
  poland: "🇵🇱",
  ukraine: "🇺🇦",
  turkey: "🇹🇷",
  wales: "🇬🇧",
  scotland: "🇬🇧",
  "northern ireland": "🇬🇧",
  denmark: "🇩🇰",
  norway: "🇳🇴",
  finland: "🇫🇮",
  austria: "🇦🇹",
  switzerland: "🇨🇭",
  "czech republic": "🇨🇿",
  serbia: "🇷🇸",
  greece: "🇬🇷",
  romania: "🇷🇴",
  hungary: "🇭🇺",
  russia: "🇷🇺",
  "south korea": "🇰🇷",
  "south africa": "🇿🇦",
  china: "🇨🇳",
  india: "🇮🇳",
};

export function nationFlagEmoji(nation: string): string {
  const key = nation.trim().toLowerCase();
  if (!key) return "🌐";
  return NATION_TO_FLAG[key] ?? "🌐";
}
