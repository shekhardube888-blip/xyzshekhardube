"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Role = "guest" | "admin" | "google" | "student" | "super_admin" | null

export type Session = {
  role: Role
  name: string
  email: string
  stream?: string
  picture?: string | null
  loggedInAt: number | null
}

type AuthState = Session & {
  loginAsGuest: () => void
  loginAsAdmin: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  loginAsSuperAdmin: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  loginAsGoogle: (name: string, email: string, picture?: string | null) => void
  loginAsStudent: (name: string, email: string, stream?: string) => void
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
      stream: undefined,
      picture: null,
      loggedInAt: null,

      loginAsGuest: () =>
        set({
          role: "guest",
          name: GUEST_NAME,
          email: GUEST_EMAIL,
          stream: undefined,
          picture: null,
          loggedInAt: Date.now(),
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
        }),

      loginAsStudent: (name, email, stream) =>
        set({
          role: "student",
          name: name || "Student",
          email: email || "student@college.edu",
          stream: stream || "Unspecified",
          picture: null,
          loggedInAt: Date.now(),
        }),

      logout: () =>
        set({
          role: null,
          name: "",
          email: "",
          stream: undefined,
          picture: null,
          loggedInAt: null,
        }),
    }),
    {
      name: "agileportal-auth",
      // Only persist these fields
      partialize: (s) => ({
        role: s.role,
        name: s.name,
        email: s.email,
        stream: s.stream,
        picture: s.picture,
        loggedInAt: s.loggedInAt,
      }),
    },
  ),
)


