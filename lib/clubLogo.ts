import type { ImageSourcePropType } from "react-native";

const BENFICA = require("@/assets/Benfica.png") as ImageSourcePropType;

/**
 * Bundled crest when `club` matches. Replace assets/Benfica.png with the real logo.
 */
export function clubLogoSource(club: string): ImageSourcePropType | null {
  const n = club.trim().toLowerCase();
  if (n === "benfica" || n === "sl benfica" || n === "sport lisboa e benfica") {
    return BENFICA;
  }
  return null;
}
