import { z } from "zod";

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
    description: "Tests measuring acceleration and maximum velocity",
  },
  {
    id: "endurance",
    name: "Endurance",
    description: "Tests measuring stamina and long-distance performance",
  },
  {
    id: "strength",
    name: "Strength",
    description: "Tests measuring power and muscular strength",
  },
  {
    id: "coordination",
    name: "Coordination",
    description: "Tests measuring agility and motor skills",
  },
];

export const athleteData: AthleteResult[] = [
  // Speed tests - 10m Sprint

  {
    test: "Antritt (10m)",
    athlete: "Erik",
    category: "speed",
    result: 2.21,
    unit: "s",
  },
  {
    test: "Antritt (10m)",
    athlete: "Finley",
    category: "speed",
    result: 1.96,
    unit: "s",
  },
  {
    test: "Antritt (10m)",
    athlete: "Paul",
    category: "speed",
    result: 2.11,
    unit: "s",
  },
  {
    test: "Antritt (10m)",
    athlete: "Lion",
    category: "speed",
    result: 2.09,
    unit: "s",
  },
  {
    test: "Antritt (10m)",
    athlete: "Nicklas",
    category: "speed",
    result: 2.13,
    unit: "s",
  },
  {
    test: "Antritt (10m)",
    athlete: "CJ",
    category: "speed",
    result: 2.12,
    unit: "s",
  },

  // Speed tests - 20m Sprint

  {
    test: "Schnelligkeit (20m)",
    athlete: "Erik",
    category: "speed",
    result: 3.82,
    unit: "s",
  },
  {
    test: "Schnelligkeit (20m)",
    athlete: "Finley",
    category: "speed",
    result: 3.45,
    unit: "s",
  },

  {
    test: "Schnelligkeit (20m)",
    athlete: "Paul",
    category: "speed",
    result: 3.68,
    unit: "s",
  },
  {
    test: "Schnelligkeit (20m)",
    athlete: "Lion",
    category: "speed",
    result: 3.74,
    unit: "s",
  },
  {
    test: "Schnelligkeit (20m)",
    athlete: "Nicklas",
    category: "speed",
    result: 3.7,
    unit: "s",
  },
  {
    test: "Schnelligkeit (20m)",
    athlete: "CJ",
    category: "speed",
    result: 3.62,
    unit: "s",
  },

  // Speed tests - 50m Sprint
  {
    test: "50m Sprint",
    athlete: "Finley",
    category: "speed",
    result: 8.86,
    unit: "s",
  },
  {
    test: "50m Sprint",
    athlete: "Silas",
    category: "speed",
    result: 9.12,
    unit: "s",
  },
  {
    test: "50m Sprint",
    athlete: "Nicklas",
    category: "speed",
    result: 9.17,
    unit: "s",
  },
  {
    test: "50m Sprint",
    athlete: "Paul",
    category: "speed",
    result: 9.3,
    unit: "s",
  },
  {
    test: "50m Sprint",
    athlete: "Lion",
    category: "speed",
    result: 9.6,
    unit: "s",
  },

  // Coordination tests
  {
    test: "Seilspringen",
    athlete: "Arvid",
    category: "coordination",
    result: 32,
    unit: "Reps",
  },
  {
    test: "Seilspringen",
    athlete: "CJ",
    category: "coordination",
    result: 31,
    unit: "Reps",
  },
  {
    test: "Seilspringen",
    athlete: "Erik",
    category: "coordination",
    result: 121,
    unit: "Reps",
  },
  {
    test: "Seilspringen",
    athlete: "Finley",
    category: "coordination",
    result: 82,
    unit: "Reps",
  },
  {
    test: "Seilspringen",
    athlete: "Lion",
    category: "coordination",
    result: 66,
    unit: "Reps",
  },
  {
    test: "Seilspringen",
    athlete: "Silas",
    category: "coordination",
    result: 51,
    unit: "Reps",
  },

  // Strength tests
  {
    test: "Standweitsprung",
    athlete: "Arvid",
    category: "strength",
    result: 201,
    unit: "cm",
  },
  {
    test: "Standweitsprung",
    athlete: "CJ",
    category: "strength",
    result: 198,
    unit: "cm",
  },
  {
    test: "Standweitsprung",
    athlete: "Erik",
    category: "strength",
    result: 143,
    unit: "cm",
  },
  {
    test: "Standweitsprung",
    athlete: "Finley",
    category: "strength",
    result: 169,
    unit: "cm",
  },
  {
    test: "Standweitsprung",
    athlete: "Lion",
    category: "strength",
    result: 182,
    unit: "cm",
  },
  {
    test: "Standweitsprung",
    athlete: "Nicklas",
    category: "strength",
    result: 124,
    unit: "cm",
  },
  {
    test: "Standweitsprung",
    athlete: "Paul",
    category: "strength",
    result: 176,
    unit: "cm",
  },
  {
    test: "Standweitsprung",
    athlete: "Silas",
    category: "strength",
    result: 149,
    unit: "cm",
  },

  // Endurance tests
  {
    test: "800m Lauf",
    athlete: "Finley",
    category: "endurance",
    result: 198,
    unit: "s",
  },
  {
    test: "800m Lauf",
    athlete: "Erik",
    category: "endurance",
    result: 186,
    unit: "s",
  },
];
