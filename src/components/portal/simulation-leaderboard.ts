// Leaderboard types + pre-seeded anonymized cohort entries + sort helpers.

export type Grade = "A" | "B" | "C" | "D"

export type LeaderboardEntry = {
  id: string
  anonymousName: string
  stream: string // "MBA · Marketing", "BBA · Digital", etc.
  grade: Grade
  finalCash: number
  brandEquity: number // 0-100
  avgMarketShare: number // %
  totalProfit: number
  quartersCompleted: number // 1-8
  playedAt: number // timestamp
}

export type SortKey = "grade" | "cash" | "share" | "profit"

// Grade ranking weight for sorting (A > B > C > D)
const gradeWeight: Record<Grade, number> = { A: 4, B: 3, C: 2, D: 1 }

// 10 pre-seeded anonymized cohort entries — mix of grades, streams, and
// performance so the leaderboard feels real on first load.
const DEMO_ENTRIES: LeaderboardEntry[] = [
  {
    id: "seed_1",
    anonymousName: "Ananya I.",
    stream: "MBA · Marketing",
    grade: "A",
    finalCash: 12_400_000,
    brandEquity: 84,
    avgMarketShare: 28.4,
    totalProfit: 7_400_000,
    quartersCompleted: 8,
    playedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "seed_2",
    anonymousName: "Rahul S.",
    stream: "MBA · Finance",
    grade: "A",
    finalCash: 9_800_000,
    brandEquity: 78,
    avgMarketShare: 24.1,
    totalProfit: 4_800_000,
    quartersCompleted: 8,
    playedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: "seed_3",
    anonymousName: "Priya M.",
    stream: "BBA · Digital Marketing",
    grade: "B",
    finalCash: 6_200_000,
    brandEquity: 68,
    avgMarketShare: 19.3,
    totalProfit: 1_200_000,
    quartersCompleted: 8,
    playedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: "seed_4",
    anonymousName: "Kartik V.",
    stream: "BSc · Statistics",
    grade: "B",
    finalCash: 5_800_000,
    brandEquity: 64,
    avgMarketShare: 17.8,
    totalProfit: 800_000,
    quartersCompleted: 8,
    playedAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },
  {
    id: "seed_5",
    anonymousName: "Sneha K.",
    stream: "BSc · Computer Science",
    grade: "B",
    finalCash: 5_400_000,
    brandEquity: 62,
    avgMarketShare: 16.2,
    totalProfit: 400_000,
    quartersCompleted: 8,
    playedAt: Date.now() - 1000 * 60 * 60 * 24 * 11,
  },
  {
    id: "seed_6",
    anonymousName: "Vikram R.",
    stream: "MBA · Operations",
    grade: "C",
    finalCash: 3_100_000,
    brandEquity: 52,
    avgMarketShare: 12.5,
    totalProfit: -1_900_000,
    quartersCompleted: 8,
    playedAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: "seed_7",
    anonymousName: "Nidhi P.",
    stream: "BBA · Entrepreneurship",
    grade: "C",
    finalCash: 1_800_000,
    brandEquity: 48,
    avgMarketShare: 9.7,
    totalProfit: -3_200_000,
    quartersCompleted: 8,
    playedAt: Date.now() - 1000 * 60 * 60 * 24 * 17,
  },
  {
    id: "seed_8",
    anonymousName: "Arjun D.",
    stream: "MBA · Marketing",
    grade: "C",
    finalCash: 650_000,
    brandEquity: 46,
    avgMarketShare: 8.2,
    totalProfit: -4_350_000,
    quartersCompleted: 8,
    playedAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
  {
    id: "seed_9",
    anonymousName: "Meera J.",
    stream: "BSc · Biotechnology",
    grade: "D",
    finalCash: -800_000,
    brandEquity: 38,
    avgMarketShare: 5.4,
    totalProfit: -5_800_000,
    quartersCompleted: 6,
    playedAt: Date.now() - 1000 * 60 * 60 * 24 * 22,
  },
  {
    id: "seed_10",
    anonymousName: "Rohan T.",
    stream: "BBA · HR",
    grade: "D",
    finalCash: -1_900_000,
    brandEquity: 32,
    avgMarketShare: 3.1,
    totalProfit: -6_900_000,
    quartersCompleted: 5,
    playedAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
  },
]

export function getDemoEntries(): LeaderboardEntry[] {
  return DEMO_ENTRIES
}

export function sortEntries(
  entries: LeaderboardEntry[],
  key: SortKey,
): LeaderboardEntry[] {
  const sorted = [...entries]
  switch (key) {
    case "grade":
      // Sort by grade desc, then by cash desc as tiebreaker
      sorted.sort(
        (a, b) =>
          gradeWeight[b.grade] - gradeWeight[a.grade] ||
          b.finalCash - a.finalCash,
      )
      break
    case "cash":
      sorted.sort((a, b) => b.finalCash - a.finalCash)
      break
    case "share":
      sorted.sort((a, b) => b.avgMarketShare - a.avgMarketShare)
      break
    case "profit":
      sorted.sort((a, b) => b.totalProfit - a.totalProfit)
      break
  }
  return sorted
}

export function rankOfGrade(grade: Grade): string {
  return grade
}

export const GRADE_BADGE_CLASS: Record<Grade, string> = {
  A: "border-emerald-300 bg-emerald-50 text-emerald-700",
  B: "border-violet-300 bg-violet-50 text-violet-700",
  C: "border-amber-300 bg-amber-50 text-amber-700",
  D: "border-rose-300 bg-rose-50 text-rose-700",
}
