"use client"

/* eslint-disable react-hooks/set-state-in-effect -- SSR-safe localStorage hydration pattern */

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type TestAttempt = {
  paperId: string
  attemptId: string
  score: number
  totalMarks: number
  percentage: number
  passed: boolean
  timeTakenSec: number
  answers: number[]
  submittedAt: number
}

type ProgressMap = Record<string, TestAttempt[]>

const STORAGE_KEY = "agileportal-test-progress"

type TestProgressState = {
  progress: ProgressMap
  recordAttempt: (attempt: TestAttempt) => void
  resetAll: () => void
}

export const useTestProgress = create<TestProgressState>()(
  persist(
    (set) => ({
      progress: {},
      recordAttempt: (attempt) =>
        set((s) => {
          const prior = s.progress[attempt.paperId] ?? []
          return {
            progress: { ...s.progress, [attempt.paperId]: [...prior, attempt] },
          }
        }),
      resetAll: () => set({ progress: {} }),
    }),
    {
      name: STORAGE_KEY,
      skipHydration: true,
      partialize: (s) => ({ progress: s.progress }),
    },
  ),
)

// Hook API — wraps the store with selector helpers so callers don't need to
// read the whole store on every render. Each helper is a stable selector.
export function useTestProgressHelpers() {
  const progress = useTestProgress((s) => s.progress)
  const recordAttempt = useTestProgress((s) => s.recordAttempt)

  const getAttempts = (paperId: string): TestAttempt[] => progress[paperId] ?? []

  const getBest = (paperId: string): TestAttempt | null => {
    const list = progress[paperId] ?? []
    if (list.length === 0) return null
    return list.reduce((best, cur) => (cur.percentage > best.percentage ? cur : best))
  }

  const getLast = (paperId: string): TestAttempt | null => {
    const list = progress[paperId] ?? []
    if (list.length === 0) return null
    return list[list.length - 1]
  }

  const allAttempts = Object.values(progress).flat()
  const stats = {
    totalAttempts: allAttempts.length,
    uniquePassed: new Set(allAttempts.filter((a) => a.passed).map((a) => a.paperId)).size,
    avgScore:
      allAttempts.length > 0
        ? Math.round(allAttempts.reduce((sum, a) => sum + a.percentage, 0) / allAttempts.length)
        : 0,
  }

  return { progress, recordAttempt, getAttempts, getBest, getLast, stats }
}

/**
 * SSR-safe mounted guard — returns `true` only after the client-side hydration
 * completes. Use this in components that read from useTestProgress to avoid
 * hydration mismatches (the persisted store may differ between server + client).
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

// Imports placed at the bottom to keep the public API above the fold.
import { useEffect, useState } from "react"
