/** Order: Any → … → last → (arrows wrap) → Any */
export const POSITION_OPTIONS = [
  "Any",
  "GK",
  "CB",
  "LB",
  "RB",
  "CDM",
  "CM",
  "CAM",
  "LW",
  "RW",
  "CF",
  "ST",
] as const;

export const DOMINANT_FOOT_OPTIONS = [
  "Any",
  "Right Foot",
  "Left Foot",
  "Two-Footed",
] as const;

/** Any + ages 16–40 */
export const AGE_OPTIONS = [
  "Any",
  ...Array.from({ length: 25 }, (_, i) => String(16 + i)),
] as const;

export type PositionOption = (typeof POSITION_OPTIONS)[number];
export type FootOption = (typeof DOMINANT_FOOT_OPTIONS)[number];
export type AgeOption = (typeof AGE_OPTIONS)[number];
