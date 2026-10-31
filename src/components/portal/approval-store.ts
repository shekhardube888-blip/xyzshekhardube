"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ApprovalType = "registration" | "weekly_solution" | "test_paper" | "certificate"
export type ApprovalStatus = "pending" | "approved" | "rejected"

export type ApprovalRequest = {
  id: string
  studentName: string
  studentEmail: string
  stream?: string
  type: ApprovalType
  stage: string // e.g. "Week 1 — Brand Audit", "Test: Brand Audit Essentials", "Final certificate"
  detail: string // brief description of what's being approved
  status: ApprovalStatus
  submittedAt: number
  reviewedAt?: number
  mentorComment?: string
}

type ApprovalState = {
  requests: ApprovalRequest[]
  createRequest: (input: Omit<ApprovalRequest, "id" | "status" | "submittedAt">) => ApprovalRequest
  approve: (id: string, comment?: string) => void
  reject: (id: string, comment?: string) => void
  resetToDemo: () => void
}

function uid(): string {
  return `apr_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`
}

const DEMO_REQUESTS: ApprovalRequest[] = [
  {
    id: "apr_demo_1",
    studentName: "Aditya Sharma",
    studentEmail: "aditya.s@iiti.ac.in",
    stream: "MBA · Marketing",
    type: "weekly_solution",
    stage: "Week 1 — Brand Audit Fundamentals",
    detail: "Brand audit of Loom Solar — 254-word analysis with 3 recommendations.",
    status: "pending",
    submittedAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: "apr_demo_2",
    studentName: "Priya Menon",
    studentEmail: "priya.m@nmims.edu",
    stream: "BBA · Digital Marketing",
    type: "weekly_solution",
    stage: "Week 2 — Customer Persona Canvas",
    detail: "Persona canvas for Boat smart-home expansion — 312 words.",
    status: "pending",
    submittedAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: "apr_demo_3",
    studentName: "Kartik Verma",
    studentEmail: "kartik.v@xaviers.edu",
    stream: "BSc · Statistics",
    type: "test_paper",
    stage: "Test: Statistics for Analytics",
    detail: "Scored 27/30 (90%) — above pass threshold, pending mentor sign-off.",
    status: "pending",
    submittedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "apr_demo_4",
    studentName: "Sneha Kulkarni",
    studentEmail: "sneha.k@fergusson.edu",
    stream: "BSc · Computer Science",
    type: "registration",
    stage: "New student registration",
    detail: "BSc CS student, semester 5, wants to join Data Science track.",
    status: "pending",
    submittedAt: Date.now() - 1000 * 60 * 60 * 30,
  },
  {
    id: "apr_demo_5",
    studentName: "Rahul Joshi",
    studentEmail: "rahul.j@symbiosis.edu",
    stream: "BBA · Entrepreneurship",
    type: "certificate",
    stage: "Final certificate issuance",
    detail: "Completed all 8 weeks + 4 test papers + simulation (Grade B). Requesting certificate.",
    status: "pending",
    submittedAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: "apr_demo_6",
    studentName: "Nidhi Patel",
    studentEmail: "nidhi.p@nmims.edu",
    stream: "MBA · Operations",
    type: "weekly_solution",
    stage: "Week 3 — GTM Strategy",
    detail: "GTM plan for Wakefit tier-2 entry — 380 words.",
    status: "approved",
    submittedAt: Date.now() - 1000 * 60 * 60 * 72,
    reviewedAt: Date.now() - 1000 * 60 * 60 * 60,
    mentorComment: "Strong analysis — clear channel sequencing. Approved.",
  },
  {
    id: "apr_demo_7",
    studentName: "Vikram Rao",
    studentEmail: "vikram.r@tcs.com",
    stream: "Enterprise · TCS",
    type: "registration",
    stage: "Enterprise learner registration",
    detail: "TCS Digital Re-skilling Cohort — seat invite accepted.",
    status: "approved",
    submittedAt: Date.now() - 1000 * 60 * 60 * 96,
    reviewedAt: Date.now() - 1000 * 60 * 60 * 90,
    mentorComment: "Enterprise seat confirmed by L&D contact.",
  },
]

function initialState() {
  return { requests: DEMO_REQUESTS }
}

export const useApprovalStore = create<ApprovalState>()(
  persist(
    (set) => ({
      ...initialState(),

      createRequest: (input) => {
        const req: ApprovalRequest = {
          ...input,
          id: uid(),
          status: "pending",
          submittedAt: Date.now(),
        }
        set((s) => ({ requests: [req, ...s.requests] }))
        return req
      },

      approve: (id, comment) =>
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === id
              ? { ...r, status: "approved", reviewedAt: Date.now(), mentorComment: comment }
              : r,
          ),
        })),

      reject: (id, comment) =>
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === id
              ? { ...r, status: "rejected", reviewedAt: Date.now(), mentorComment: comment }
              : r,
          ),
        })),

      resetToDemo: () => set(initialState()),
    }),
    {
      name: "agileportal-approvals",
      partialize: (s) => ({ requests: s.requests }),
    },
  ),
)

// Helper: get approval status for a specific student + stage
export function getApprovalStatusFor(
  requests: ApprovalRequest[],
  studentEmail: string,
  stage: string,
): ApprovalRequest | null {
  const matches = requests.filter(
    (r) => r.studentEmail.toLowerCase() === studentEmail.toLowerCase() && r.stage === stage,
  )
  if (matches.length === 0) return null
  // Return the most recent
  return matches.sort((a, b) => b.submittedAt - a.submittedAt)[0]
}
