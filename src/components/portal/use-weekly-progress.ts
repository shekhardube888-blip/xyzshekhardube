"use client"

import { useCallback, useEffect, useState } from "react"

export type WeekProgress = {
  /** Set of question indexes the user picked in the most recent attempt */
  answers: number[]
  /** Latest score (0..4) */
  score: number
  /** Whether the test was passed (>= PASS_THRESHOLD) */
  passed: boolean
  /** Solution submission state */
  solution: {
    text: string
    referenceUrl: string
    submittedAt: number | null
  }
}

type ProgressMap = Record<number, WeekProgress>

const STORAGE_KEY = "agileportal-week-progress"

function emptyWeek(totalQuestions: number): WeekProgress {
  return {
    answers: Array.from({ length: totalQuestions }, () => -1),
    score: 0,
    passed: false,
    solution: { text: "", referenceUrl: "", submittedAt: null },
  }
}

/**
 * Hook that loads + persists per-week progress (test answers/score and
 * solution submission) to localStorage. SSR-safe — returns empty state
 * until mounted, then hydrates.
 */
export function useWeeklyProgress(totalQuestions: number) {
  const [progress, setProgress] = useState<ProgressMap>({})
  const [mounted, setMounted] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe hydration of localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as ProgressMap
        setProgress(parsed)
      }
    } catch {
      /* ignore parse errors */
    }
    setMounted(true)
  }, [])

  // Persist on every change (after mount)
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      /* ignore quota errors */
    }
  }, [progress, mounted])

  const getWeek = useCallback(
    (weekId: number): WeekProgress => {
      return progress[weekId] ?? emptyWeek(totalQuestions)
    },
    [progress, totalQuestions],
  )

  const setAnswer = useCallback(
    (weekId: number, qIndex: number, optionIndex: number) => {
      setProgress((prev) => {
        const cur = prev[weekId] ?? emptyWeek(totalQuestions)
        const nextAnswers = [...cur.answers]
        nextAnswers[qIndex] = optionIndex
        return {
          ...prev,
          [weekId]: { ...cur, answers: nextAnswers },
        }
      })
    },
    [totalQuestions],
  )

  const submitTest = useCallback(
    (weekId: number, correctIndexes: number[]): { score: number; passed: boolean } => {
      const cur = progress[weekId] ?? emptyWeek(totalQuestions)
      let score = 0
      for (let i = 0; i < correctIndexes.length; i++) {
        if (cur.answers[i] === correctIndexes[i]) score++
      }
      const passed = score >= 3 // PASS_THRESHOLD
      setProgress((prev) => ({
        ...prev,
        [weekId]: { ...(prev[weekId] ?? emptyWeek(totalQuestions)), score, passed },
      }))
      return { score, passed }
    },
    [progress, totalQuestions],
  )

  const submitSolution = useCallback(
    (weekId: number, text: string, referenceUrl: string) => {
      setProgress((prev) => {
        const cur = prev[weekId] ?? emptyWeek(totalQuestions)
        return {
          ...prev,
          [weekId]: {
            ...cur,
            solution: { text, referenceUrl, submittedAt: Date.now() },
          },
        }
      })
    },
    [totalQuestions],
  )

  /** Number of weeks where BOTH test passed AND solution submitted. */
  const completedWeeks = Object.values(progress).filter(
    (w) => w.passed && w.solution.submittedAt !== null,
  ).length

  return {
    mounted,
    progress,
    getWeek,
    setAnswer,
    submitTest,
    submitSolution,
    completedWeeks,
  }
}
