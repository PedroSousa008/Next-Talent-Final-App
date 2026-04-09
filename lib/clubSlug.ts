/** URL-safe slug for club routes (e.g. "Benfica" → "benfica"). */
export function clubToSlug(club: string): string {
  return club
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function slugToTitle(slug: string): string {
  const s = decodeURIComponent(slug).replace(/-/g, " ");
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
