import type { FootOption, PositionOption } from "@/constants/searchFilters";

export type MockPlayer = {
  id: string;
  name: string;
  position: PositionOption | string;
  dominantFoot: FootOption | string;
  age: number;
  club: string;
  nation: string;
  /** Set for the signed-in user when they have a profile photo */
  avatarUri?: string | null;
};

/** Demo dataset — replace with API results later */
export const MOCK_PLAYERS: MockPlayer[] = [
  {
    id: "1",
    name: "João Silva",
    position: "CAM",
    dominantFoot: "Right Foot",
    age: 21,
    club: "North City FC",
    nation: "Portugal",
  },
  {
    id: "2",
    name: "Marcus Cole",
    position: "CM",
    dominantFoot: "Right Foot",
    age: 19,
    club: "Harbor United",
    nation: "England",
  },
  {
    id: "3",
    name: "Diego Ríos",
    position: "GK",
    dominantFoot: "Left Foot",
    age: 24,
    club: "South Vale",
    nation: "Spain",
  },
  {
    id: "4",
    name: "Amadou Koné",
    position: "ST",
    dominantFoot: "Two-Footed",
    age: 22,
    club: "North City FC",
    nation: "France",
  },
  {
    id: "5",
    name: "Liam O'Brien",
    position: "LB",
    dominantFoot: "Left Foot",
    age: 20,
    club: "Coastal AFC",
    nation: "Ireland",
  },
  {
    id: "6",
    name: "Tiago Mendes",
    position: "RW",
    dominantFoot: "Right Foot",
    age: 18,
    club: "North City FC",
    nation: "Portugal",
  },
  {
    id: "7",
    name: "Sven Lindberg",
    position: "CB",
    dominantFoot: "Right Foot",
    age: 26,
    club: "Harbor United",
    nation: "Sweden",
  },
  {
    id: "8",
    name: "Mateo Vargas",
    position: "CDM",
    dominantFoot: "Right Foot",
    age: 23,
    club: "South Vale",
    nation: "Argentina",
  },
  {
    id: "9",
    name: "Yuki Tanaka",
    position: "LW",
    dominantFoot: "Two-Footed",
    age: 21,
    club: "East Bridge",
    nation: "Japan",
  },
  {
    id: "10",
    name: "Noah Williams",
    position: "RB",
    dominantFoot: "Right Foot",
    age: 17,
    club: "Coastal AFC",
    nation: "USA",
  },
  {
    id: "11",
    name: "Gabriel Santos",
    position: "CF",
    dominantFoot: "Left Foot",
    age: 25,
    club: "South Vale",
    nation: "Brazil",
  },
  {
    id: "12",
    name: "Ethan Brooks",
    position: "CM",
    dominantFoot: "Two-Footed",
    age: 28,
    club: "Harbor United",
    nation: "England",
  },
];
