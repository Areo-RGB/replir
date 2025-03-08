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

export interface NormativeData {
  test: string;
  values: number[];
  unit: string;
  ratings: {
    range: [number, number];
    label: string;
  }[];
  lowerIsBetter?: boolean;
}

export const normativeData: NormativeData[] = [
  {
    test: "Schnelligkeit (20m)",
    values: [4.14, 4.01, 3.93, 3.87, 3.82, 3.78, 3.74, 3.69, 3.64, 3.57, 3.47],
    unit: "s",
    lowerIsBetter: true,
    ratings: [
      { range: [0, 30], label: "unterdurchschnittlich (C)" },
      { range: [31, 70], label: "durchschnittlich (B)" },
      { range: [71, 80], label: "gut (A)" },
      { range: [81, 90], label: "sehr gut (A)" },
      { range: [91, 100], label: "ausgezeichnet (A)" }
    ]
  },
  {
    test: "Antritt (10m)",
    values: [2.39, 2.33, 2.28, 2.24, 2.21, 2.18, 2.16, 2.13, 2.1, 2.05, 1.99],
    unit: "s",
    lowerIsBetter: true,
    ratings: [
      { range: [0, 30], label: "unterdurchschnittlich (C)" },
      { range: [31, 70], label: "durchschnittlich (B)" },
      { range: [71, 80], label: "gut (A)" },
      { range: [81, 90], label: "sehr gut (A)" },
      { range: [91, 100], label: "ausgezeichnet (A)" }
    ]
  },
  {
    test: "Gewandtheit",
    values: [9.66, 9.35, 9.07, 8.9, 8.77, 8.66, 8.54, 8.42, 8.28, 8.11, 7.91],
    unit: "s",
    lowerIsBetter: true,
    ratings: [
      { range: [0, 30], label: "unterdurchschnittlich (C)" },
      { range: [31, 70], label: "durchschnittlich (B)" },
      { range: [71, 80], label: "gut (A)" },
      { range: [81, 90], label: "sehr gut (A)" },
      { range: [91, 100], label: "ausgezeichnet (A)" }
    ]
  },
  {
    test: "Dribbling",
    values: [14.37, 13.42, 12.84, 12.46, 12.15, 11.9, 11.69, 11.44, 11.16, 10.84, 10.43],
    unit: "s",
    lowerIsBetter: true,
    ratings: [
      { range: [0, 30], label: "unterdurchschnittlich (C)" },
      { range: [31, 70], label: "durchschnittlich (B)" },
      { range: [71, 80], label: "gut (A)" },
      { range: [81, 90], label: "sehr gut (A)" },
      { range: [91, 100], label: "ausgezeichnet (A)" }
    ]
  },
  {
    test: "Ballkontrolle",
    values: [15.29, 13.81, 12.86, 12.28, 11.78, 11.36, 10.99, 15.59, 10.18, 9.66, 9],
    unit: "s",
    lowerIsBetter: true,
    ratings: [
      { range: [0, 30], label: "unterdurchschnittlich (C)" },
      { range: [31, 70], label: "durchschnittlich (B)" },
      { range: [71, 80], label: "gut (A)" },
      { range: [81, 90], label: "sehr gut (A)" },
      { range: [91, 100], label: "ausgezeichnet (A)" }
    ]
  },
  {
    test: "Balljonglieren",
    values: [0, 0, 0, 0, 1, 1, 1, 1, 2, 5, 6],
    unit: "Reps",
    lowerIsBetter: false,
    ratings: [
      { range: [0, 30], label: "unterdurchschnittlich (C)" },
      { range: [31, 70], label: "durchschnittlich (B)" },
      { range: [71, 80], label: "gut (A)" },
      { range: [81, 90], label: "sehr gut (A)" },
      { range: [91, 100], label: "ausgezeichnet (A)" }
    ]
  },
  {
    test: "Standweitsprung DMT",
    values: [76, 99, 104, 108, 111, 113, 115, 118, 120, 122, 125, 126, 129, 131, 132, 133, 134, 135, 136, 138, 139, 140, 141, 142, 143, 145, 146, 147, 148, 149, 150, 151, 153, 154, 155, 156, 157, 158, 160, 161, 162, 165, 167, 169, 171, 174, 176, 178, 181, 183, 188, 192, 216],
    unit: "cm",
    ratings: [
      { range: [0, 30], label: "unterdurchschnittlich (C)" },
      { range: [31, 70], label: "durchschnittlich (B)" },
      { range: [71, 80], label: "gut (A)" },
      { range: [81, 90], label: "sehr gut (A)" },
      { range: [91, 100], label: "ausgezeichnet (A)" }
    ]
  }
];

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
  {
    id: "deutscher_motorik_test",
    name: "Deutscher Motorik Test",
    description: "Standardized motor performance test battery",
  }
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