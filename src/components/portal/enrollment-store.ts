"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type EnrollmentStatus = "active" | "completed"

export type WeeklyProgress = {
  testPassed: boolean
  testScore: number // 0-4
  solutionSubmitted: boolean
  solutionSubmittedAt?: number
}

export type Enrollment = {
  id: string
  studentEmail: string
  category: string // "MBA / Management"
  subcategory: string // "Marketing & Brand Strategy"
  track: string // "MBA · Marketing"
  enrolledAt: number
  startDate?: number
  status: EnrollmentStatus
  weeklyProgress: Record<number, WeeklyProgress> // weekId → progress
  testScores: Record<string, number> // testPaperId → percentage
  simulationGrade?: string // "A" | "B" | "C" | "D"
  completedAt?: number
}

type EnrollmentState = {
  enrollments: Enrollment[]
  activeEnrollmentId: string | null
  createEnrollment: (input: Omit<Enrollment, "id" | "enrolledAt" | "status" | "weeklyProgress" | "testScores">) => Enrollment
  setActiveEnrollment: (id: string) => void
  updateWeekProgress: (enrollmentId: string, weekId: number, progress: Partial<WeeklyProgress>) => void
  updateTestScore: (enrollmentId: string, testPaperId: string, percentage: number) => void
  setSimulationGrade: (enrollmentId: string, grade: string) => void
  markCompleted: (enrollmentId: string) => void
  getEnrollmentsForStudent: (email: string) => Enrollment[]
  getActiveEnrollment: (email: string) => Enrollment | null
  resetAll: () => void
}

function uid(): string {
  return `enr_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`
}

export const useEnrollmentStore = create<EnrollmentState>()(
  persist(
    (set, get) => ({
      enrollments: [],
      activeEnrollmentId: null,

      createEnrollment: (input) => {
        const enr: Enrollment = {
          ...input,
          id: uid(),
          enrolledAt: Date.now(),
          status: "active",
          weeklyProgress: {},
          testScores: {},
        }
        set((s) => ({
          enrollments: [...s.enrollments, enr],
          activeEnrollmentId: enr.id,
        }))
        return enr
      },

      setActiveEnrollment: (id) => set({ activeEnrollmentId: id }),

      updateWeekProgress: (enrollmentId, weekId, progress) =>
        set((s) => ({
          enrollments: s.enrollments.map((e) =>
            e.id === enrollmentId
              ? {
                  ...e,
                  weeklyProgress: {
                    ...e.weeklyProgress,
                    [weekId]: { ...e.weeklyProgress[weekId] ?? { testPassed: false, testScore: 0, solutionSubmitted: false }, ...progress },
                  },
                }
              : e,
          ),
        })),

      updateTestScore: (enrollmentId, testPaperId, percentage) =>
        set((s) => ({
          enrollments: s.enrollments.map((e) =>
            e.id === enrollmentId
              ? { ...e, testScores: { ...e.testScores, [testPaperId]: percentage } }
              : e,
          ),
        })),

      setSimulationGrade: (enrollmentId, grade) =>
        set((s) => ({
          enrollments: s.enrollments.map((e) =>
            e.id === enrollmentId ? { ...e, simulationGrade: grade } : e,
          ),
        })),

      markCompleted: (enrollmentId) =>
        set((s) => ({
          enrollments: s.enrollments.map((e) =>
            e.id === enrollmentId ? { ...e, status: "completed", completedAt: Date.now() } : e,
          ),
        })),

      getEnrollmentsForStudent: (email) =>
        get().enrollments.filter((e) => e.studentEmail.toLowerCase() === email.toLowerCase()),

      getActiveEnrollment: (email) => {
        const list = get().enrollments.filter(
          (e) => e.studentEmail.toLowerCase() === email.toLowerCase() && e.status === "active",
        )
        const activeId = get().activeEnrollmentId
        if (activeId) {
          const found = list.find((e) => e.id === activeId)
          if (found) return found
        }
        return list[0] ?? null
      },

      resetAll: () => set({ enrollments: [], activeEnrollmentId: null }),
    }),
    {
      name: "agileportal-enrollments",
      partialize: (s) => ({
        enrollments: s.enrollments,
        activeEnrollmentId: s.activeEnrollmentId,
      }),
    },
  ),
)
