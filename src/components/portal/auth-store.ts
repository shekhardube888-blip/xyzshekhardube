"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Role = "guest" | "admin" | "google" | null

export type Session = {
  role: Role
  name: string
  email: string
  picture?: string | null
  loggedInAt: number | null
}

type AuthState = Session & {
  loginAsGuest: () => void
  loginAsAdmin: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  loginAsGoogle: (name: string, email: string, picture?: string | null) => void
  logout: () => void
}

// Demo admin credentials (do NOT use in production — front-end only)
export const ADMIN_DEMO_EMAIL = "admin@agileportal.in"
export const ADMIN_DEMO_PASSWORD = "admin123"

const GUEST_NAME = "Guest User"
const GUEST_EMAIL = "guest@agileportal.in"
const ADMIN_NAME = "Admin (AgilePortal)"

export const useAuth = create<AuthState>()(
  persist(
    (set, _get) => ({
      role: null,
      name: "",
      email: "",
      picture: null,
      loggedInAt: null,

      loginAsGuest: () =>
        set({
          role: "guest",
          name: GUEST_NAME,
          email: GUEST_EMAIL,
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
          picture,
          loggedInAt: Date.now(),
        }),

      logout: () =>
        set({ role: null, name: "", email: "", picture: null, loggedInAt: null }),
    }),
    {
      name: "agileportal-auth",
      // Only persist these fields
      partialize: (s) => ({
        role: s.role,
        name: s.name,
        email: s.email,
        picture: s.picture,
        loggedInAt: s.loggedInAt,
      }),
    },
  ),
)

