import type { ImageSourcePropType } from "react-native";

const BENFICA = require("@/assets/slb.logo.png") as ImageSourcePropType;

/**
 * Bundled crest when `club` matches (SLB / Benfica — assets/slb.logo.png).
 */
export function clubLogoSource(club: string): ImageSourcePropType | null {
  const n = club.trim().toLowerCase();
  if (n === "benfica" || n === "sl benfica" || n === "sport lisboa e benfica") {
    return BENFICA;
  }
  return null;
}
