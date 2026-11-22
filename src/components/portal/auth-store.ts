"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Role = "guest" | "admin" | "google" | "student" | "super_admin" | null

export type RegistrationStatus =
  | "none" // not registered
  | "registered" // filled the form, hasn't paid
  | "paid" // paid ₹1499, awaiting admin approval
  | "approved" // admin approved → internship started
  | "rejected" // admin rejected

export type Session = {
  role: Role
  name: string
  email: string
  phone?: string
  stream?: string
  // Academic + guardian fields (added for result mailing + profile)
  guardianEmail?: string // parent/teacher/HOD who receives internship results
  guardianRole?: string // "Parent" | "Teacher" | "HOD" | "Mentor"
  qualification?: string // "MBA", "BBA", "BSc", etc.
  year?: string // "1st Year", "2nd Year", "Final Year", "Semester 5", etc.
  college?: string
  city?: string
  picture?: string | null
  loggedInAt: number | null
  registrationStatus: RegistrationStatus
  paymentId?: string | null
  paidAt?: number | null
  approvedAt?: number | null
}

type AuthState = Session & {
  loginAsGuest: () => void
  loginAsAdmin: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  loginAsSuperAdmin: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  loginAsGoogle: (name: string, email: string, picture?: string | null) => void
  loginAsStudent: (name: string, email: string, stream?: string) => void
  /** Step 1 of the paid registration flow — student fills the form */
  registerStudent: (input: {
    name: string
    email: string
    phone: string
    stream: string
    guardianEmail?: string
    guardianRole?: string
    qualification?: string
    year?: string
    college?: string
    city?: string
  }) => void
  /** Step 2 — student pays ₹1499, transitions to 'paid' status */
  markPaid: (paymentId: string) => void
  /** Step 3 — admin approves, internship starts */
  markApproved: () => void
  /** Admin rejects the registration */
  markRejected: () => void
  /** Reset registration (start over) */
  resetRegistration: () => void
  logout: () => void
}

// Demo admin credentials (do NOT use in production — front-end only)
export const ADMIN_DEMO_EMAIL = "admin@agileportal.in"
export const ADMIN_DEMO_PASSWORD = "admin123"

// Demo super-admin credentials — org & team management
export const SUPER_ADMIN_DEMO_EMAIL = "superadmin@agileportal.in"
export const SUPER_ADMIN_DEMO_PASSWORD = "super123"

const GUEST_NAME = "Guest User"
const GUEST_EMAIL = "guest@agileportal.in"
const ADMIN_NAME = "Admin (AgilePortal Enterprise)"
const SUPER_ADMIN_NAME = "Super Admin (AgilePortal Enterprise)"

export const useAuth = create<AuthState>()(
  persist(
    (set, _get) => ({
      role: null,
      name: "",
      email: "",
      phone: undefined,
      stream: undefined,
      picture: null,
      loggedInAt: null,
      registrationStatus: "none",
      paymentId: null,
      paidAt: null,
      approvedAt: null,

      loginAsGuest: () =>
        set({
          role: "guest",
          name: GUEST_NAME,
          email: GUEST_EMAIL,
          phone: undefined,
          stream: undefined,
          picture: null,
          loggedInAt: Date.now(),
          registrationStatus: "none",
          paymentId: null,
          paidAt: null,
          approvedAt: null,
        }),

      loginAsAdmin: (email, password) => {
        const cleanEmail = email.trim().toLowerCase()
        if (cleanEmail !== ADMIN_DEMO_EMAIL) {
          return { ok: false, error: "Unknown admin email. Use admin@agileportal.in" }
        }
        if (password !== ADMIN_DEMO_PASSWORD) {
          return { ok: false, error: "Wrong password. Demo password is admin123" }
        }
        set({
          role: "admin",
          name: ADMIN_NAME,
          email: cleanEmail,
          stream: undefined,
          picture: null,
          loggedInAt: Date.now(),
          registrationStatus: "none",
          paymentId: null,
          paidAt: null,
          approvedAt: null,
        })
        return { ok: true }
      },

      loginAsSuperAdmin: (email, password) => {
        const cleanEmail = email.trim().toLowerCase()
        if (cleanEmail !== SUPER_ADMIN_DEMO_EMAIL) {
          return {
            ok: false,
            error: "Unknown super-admin email. Use superadmin@agileportal.in",
          }
        }
        if (password !== SUPER_ADMIN_DEMO_PASSWORD) {
          return { ok: false, error: "Wrong password. Demo password is super123" }
        }
        set({
          role: "super_admin",
          name: SUPER_ADMIN_NAME,
          email: cleanEmail,
          stream: undefined,
          picture: null,
          loggedInAt: Date.now(),
          registrationStatus: "none",
          paymentId: null,
          paidAt: null,
          approvedAt: null,
        })
        return { ok: true }
      },

      loginAsGoogle: (name, email, picture = null) =>
        set({
          role: "google",
          name: name || "Google User",
          email: email || "user@gmail.com",
          stream: undefined,
          picture,
          loggedInAt: Date.now(),
          registrationStatus: "approved", // Google sign-in bypasses the paid registration
          paymentId: null,
          paidAt: null,
          approvedAt: Date.now(),
        }),

      loginAsStudent: (name, email, stream) =>
        set({
          role: "student",
          name: name || "Student",
          email: email || "student@college.edu",
          stream: stream || "Unspecified",
          picture: null,
          loggedInAt: Date.now(),
          registrationStatus: "approved", // legacy direct student login — bypass registration
          paymentId: null,
          paidAt: null,
          approvedAt: Date.now(),
        }),

      registerStudent: (input) =>
        set({
          role: "student",
          name: input.name || "Student",
          email: input.email || "student@college.edu",
          phone: input.phone,
          stream: input.stream,
          guardianEmail: input.guardianEmail,
          guardianRole: input.guardianRole,
          qualification: input.qualification,
          year: input.year,
          college: input.college,
          city: input.city,
          picture: null,
          loggedInAt: Date.now(),
          registrationStatus: "registered",
          paymentId: null,
          paidAt: null,
          approvedAt: null,
        }),

      markPaid: (paymentId) =>
        set({
          registrationStatus: "paid",
          paymentId,
          paidAt: Date.now(),
        }),

      markApproved: () =>
        set({
          registrationStatus: "approved",
          approvedAt: Date.now(),
        }),

      markRejected: () =>
        set({
          registrationStatus: "rejected",
          approvedAt: null,
        }),

      resetRegistration: () =>
        set({
          registrationStatus: "none",
          paymentId: null,
          paidAt: null,
          approvedAt: null,
        }),

      logout: () =>
        set({
          role: null,
          name: "",
          email: "",
          phone: undefined,
          stream: undefined,
          guardianEmail: undefined,
          guardianRole: undefined,
          qualification: undefined,
          year: undefined,
          college: undefined,
          city: undefined,
          picture: null,
          loggedInAt: null,
          registrationStatus: "none",
          paymentId: null,
          paidAt: null,
          approvedAt: null,
        }),
    }),
    {
      name: "agileportal-auth",
      skipHydration: true,
      // Only persist these fields
      partialize: (s) => ({
        role: s.role,
        name: s.name,
        email: s.email,
        phone: s.phone,
        stream: s.stream,
        guardianEmail: s.guardianEmail,
        guardianRole: s.guardianRole,
        qualification: s.qualification,
        year: s.year,
        college: s.college,
        city: s.city,
        picture: s.picture,
        loggedInAt: s.loggedInAt,
        registrationStatus: s.registrationStatus,
        paymentId: s.paymentId,
        paidAt: s.paidAt,
        approvedAt: s.approvedAt,
      }),
    },
  ),
)


