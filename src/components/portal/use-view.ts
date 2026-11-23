"use client"

import { create } from "zustand"

export type View = "marketing" | "login" | "dashboard"

type ViewState = {
  view: View
  setView: (v: View) => void
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
  view: "login",
  setView: (v) => set({ view: v }),
  goToLogin: () => set({ view: "login" }),
  goToMarketing: () => set({ view: "marketing" }),
  goToDashboard: () => set({ view: "dashboard" }),
}))
