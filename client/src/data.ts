export interface AthleteResult {
  test: string;
  athlete: string;
  category: string;
  result: number;
  unit: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "speed",
    name: "Speed",
    description: "Tests measuring acceleration and maximum velocity"
  },
  {
    id: "endurance",
    name: "Endurance",
    description: "Tests measuring stamina and long-distance performance"
  },
  {
    id: "strength",
    name: "Strength",
    description: "Tests measuring power and muscular strength"
  },
  {
    id: "coordination",
    name: "Coordination",
    description: "Tests measuring agility and motor skills"
  }
];

export const athleteData: AthleteResult[] = [
  // Speed (Schnelligkeit) tests
  { test: "Antritt (10m)", athlete: "August", category: "speed", result: 2.38, unit: "s" },
  { test: "Antritt (10m)", athlete: "Iraklis", category: "speed", result: 2.16, unit: "s" },
  { test: "Antritt (10m)", athlete: "Erik", category: "speed", result: 2.21, unit: "s" },
  { test: "Antritt (10m)", athlete: "Finley", category: "speed", result: 1.96, unit: "s" },
  { test: "Antritt (10m)", athlete: "Levi", category: "speed", result: 2.14, unit: "s" },
  { test: "Antritt (10m)", athlete: "Orestis", category: "speed", result: 2.27, unit: "s" },
  { test: "Antritt (10m)", athlete: "Paul", category: "speed", result: 2.11, unit: "s" },
  { test: "Antritt (10m)", athlete: "Lasse", category: "speed", result: 2.13, unit: "s" },
  { test: "Antritt (10m)", athlete: "Lion", category: "speed", result: 2.09, unit: "s" },
  { test: "Antritt (10m)", athlete: "Nicklas", category: "speed", result: 2.13, unit: "s" },
  { test: "Antritt (10m)", athlete: "CJ", category: "speed", result: 2.12, unit: "s" },

  // Coordination (Koordination) tests
  { test: "Seilspringen", athlete: "Arvid", category: "coordination", result: 32, unit: "Reps" },
  { test: "Seilspringen", athlete: "Carl", category: "coordination", result: 10, unit: "Reps" },
  { test: "Seilspringen", athlete: "CJ", category: "coordination", result: 31, unit: "Reps" },
  { test: "Seilspringen", athlete: "Erik", category: "coordination", result: 121, unit: "Reps" },
  { test: "Seilspringen", athlete: "Finley", category: "coordination", result: 82, unit: "Reps" },
  { test: "Seilspringen", athlete: "Jakob", category: "coordination", result: 21, unit: "Reps" },
  { test: "Seilspringen", athlete: "Lasse", category: "coordination", result: 30, unit: "Reps" },
  { test: "Seilspringen", athlete: "Levi", category: "coordination", result: 22, unit: "Reps" },
  { test: "Seilspringen", athlete: "Lion", category: "coordination", result: 66, unit: "Reps" },
  { test: "Seilspringen", athlete: "Silas", category: "coordination", result: 51, unit: "Reps" },

  // Strength (Kraft) tests
  { test: "Standweitsprung", athlete: "Ø", category: "strength", result: 163, unit: "cm" },
  { test: "Standweitsprung", athlete: "Arvid", category: "strength", result: 201, unit: "cm" },
  { test: "Standweitsprung", athlete: "Carl", category: "strength", result: 151, unit: "cm" },
  { test: "Standweitsprung", athlete: "CJ", category: "strength", result: 198, unit: "cm" },
  { test: "Standweitsprung", athlete: "Erik", category: "strength", result: 143, unit: "cm" },
  { test: "Standweitsprung", athlete: "Finley", category: "strength", result: 169, unit: "cm" },
  { test: "Standweitsprung", athlete: "Iraklis", category: "strength", result: 146, unit: "cm" },
  { test: "Standweitsprung", athlete: "Jakob", category: "strength", result: 161, unit: "cm" },
  { test: "Standweitsprung", athlete: "Lasse", category: "strength", result: 162, unit: "cm" },
  { test: "Standweitsprung", athlete: "Levi", category: "strength", result: 152, unit: "cm" },
  { test: "Standweitsprung", athlete: "Lion", category: "strength", result: 182, unit: "cm" },
  { test: "Standweitsprung", athlete: "Nicklas", category: "strength", result: 124, unit: "cm" },
  { test: "Standweitsprung", athlete: "Orestis", category: "strength", result: 161, unit: "cm" },
  { test: "Standweitsprung", athlete: "Paul", category: "strength", result: 176, unit: "cm" },
  { test: "Standweitsprung", athlete: "Silas", category: "strength", result: 149, unit: "cm" },

  // Endurance (Ausdauer) tests
  { test: "800m Lauf", athlete: "Finley", category: "endurance", result: 198, unit: "s" },
  { test: "800m Lauf", athlete: "Erik", category: "endurance", result: 186, unit: "s" }
];

export interface AthleteParticipation {
  athlete: string;
  participation: number;
}

export const participationData: AthleteParticipation[] = [
  { athlete: "Levi", participation: 91 },
  { athlete: "Silas", participation: 87 },
  { athlete: "August", participation: 87 },
  { athlete: "Lasse", participation: 89 },
  { athlete: "Finley", participation: 86 },
  { athlete: "Erik", participation: 86 },
  { athlete: "Carl", participation: 82 },
  { athlete: "Lion", participation: 75 },
  { athlete: "Nicklas", participation: 89 },
  { athlete: "Orestis", participation: 87 },
  { athlete: "Paul", participation: 84 },
  { athlete: "Iraklis", participation: 83 },
  { athlete: "Carl.J", participation: 79 },
  { athlete: "Arvid", participation: 86 }
];