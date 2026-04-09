/**
 * Demo hub content for club pages — replace with API data later.
 */

export type ClubCalendarItem = {
  id: string;
  title: string;
  dayLabel: string;
  time: string;
  kind: "training" | "match" | "meeting";
};

export type ClubDocumentItem = {
  id: string;
  title: string;
  meta: string;
};

export type SquadRow = {
  id: string;
  name: string;
  position: string;
  isYou?: boolean;
};

const BENFICA_CALENDAR: ClubCalendarItem[] = [
  {
    id: "c1",
    title: "First team training",
    dayLabel: "Tue 15 Apr",
    time: "10:00",
    kind: "training",
  },
  {
    id: "c2",
    title: "League match · home",
    dayLabel: "Sat 19 Apr",
    time: "20:30",
    kind: "match",
  },
  {
    id: "c3",
    title: "Video review · set pieces",
    dayLabel: "Mon 21 Apr",
    time: "15:00",
    kind: "meeting",
  },
];

const BENFICA_DOCS: ClubDocumentItem[] = [
  {
    id: "d1",
    title: "Code of conduct · 2025/26",
    meta: "PDF · Updated Mar 2025",
  },
  {
    id: "d2",
    title: "Travel & kit checklist",
    meta: "PDF · Staff only",
  },
  {
    id: "d3",
    title: "Medical consent forms",
    meta: "Folder · 3 files",
  },
];

const BENFICA_TEAMMATES: Omit<SquadRow, "isYou">[] = [
  { id: "t1", name: "Rafael Neves", position: "GK" },
  { id: "t2", name: "Tomás Araújo", position: "CB" },
  { id: "t3", name: "António Silva", position: "CB" },
  { id: "t4", name: "Fredrik Aursnes", position: "CM" },
  { id: "t5", name: "Orkun Kökçü", position: "CM" },
  { id: "t6", name: "Ángel Di María", position: "RW" },
  { id: "t7", name: "Arthur Cabral", position: "ST" },
];

const GENERIC_CALENDAR: ClubCalendarItem[] = [
  {
    id: "g1",
    title: "Team training",
    dayLabel: "Wed 16 Apr",
    time: "18:00",
    kind: "training",
  },
];

const GENERIC_DOCS: ClubDocumentItem[] = [
  { id: "gd1", title: "Club handbook", meta: "PDF" },
];

function isBenficaSlug(slug: string): boolean {
  const n = slug.toLowerCase();
  return n === "benfica" || n === "sl-benfica" || n.includes("benfica");
}

export function getClubHubForSlug(
  slug: string,
  selfDisplayName: string,
  selfPosition: string
): {
  calendar: ClubCalendarItem[];
  documents: ClubDocumentItem[];
  squad: SquadRow[];
} {
  if (isBenficaSlug(slug)) {
    const you: SquadRow = {
      id: "you",
      name: selfDisplayName,
      position: selfPosition,
      isYou: true,
    };
    return {
      calendar: BENFICA_CALENDAR,
      documents: BENFICA_DOCS,
      squad: [you, ...BENFICA_TEAMMATES],
    };
  }

  const you: SquadRow = {
    id: "you",
    name: selfDisplayName,
    position: selfPosition,
    isYou: true,
  };
  return {
    calendar: GENERIC_CALENDAR,
    documents: GENERIC_DOCS,
    squad: [you],
  };
}
