"use client"

import { create } from "zustand"

export type View = "marketing" | "login" | "dashboard" | "register"

export type SectionKey = "programs" | "categories" | "how" | "why" | "stories" | "about" | "faq" | null

type ViewState = {
  view: View
  openSection: SectionKey
  setView: (v: View) => void
  setOpenSection: (s: SectionKey) => void
  /** Convenience: jump to login view */
  goToLogin: () => void
  /** Convenience: jump back to marketing landing */
  goToMarketing: () => void
  /** Convenience: jump to the role-specific dashboard */
  goToDashboard: () => void
}

/**
 * Tiny view-router store. The portal is a single Next.js route (`/`) but
 * visually behaves like a 3-page SPA:
 *   - "marketing": landing page (hero, categories, programs, FAQ, etc.)
 *   - "login":     clean centered login card (no marketing clutter)
 *   - "dashboard": role-specific work surface (Student / Admin / Super Admin)
 *
 * Use this store together with the auth-store: when login succeeds, the
 * login handler calls `goToDashboard()`. When logout fires, the handler
 * calls `goToMarketing()`. The user can always switch back via the navbar.
 */
export const useView = create<ViewState>((set) => ({
  view: "marketing",
  openSection: null,
  setView: (v) => set({ view: v }),
  setOpenSection: (s) => set({ openSection: s }),
  goToLogin: () => set({ view: "login" }),
  goToMarketing: () => set({ view: "marketing", openSection: null }),
  goToDashboard: () => set({ view: "dashboard", openSection: null }),
}))
