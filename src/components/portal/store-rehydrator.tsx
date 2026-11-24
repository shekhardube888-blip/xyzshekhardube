"use client"

import { useEffect } from "react"
import { useAuth } from "./auth-store"
import { useApprovalStore } from "./approval-store"
import { useEnrollmentStore } from "./enrollment-store"
import { useOrgStore } from "./org-store"
import { useSimulation } from "./simulation-store"
import { useLeaderboard } from "./use-leaderboard"
import { useTestProgress } from "./use-test-progress"

/**
 * StoreRehydrator — renderless component that manually rehydrates all
 * persisted Zustand stores AFTER the client has mounted.
 *
 * This fixes hydration mismatches: all stores have `skipHydration: true`
 * so they use default state during SSR + client's first render. After
 * mount, this component calls `.persist.rehydrate()` on each store to
 * load persisted state from localStorage.
 *
 * Add to layout.tsx once — runs on every page.
 */
export function StoreRehydrator() {
  useEffect(() => {
    // Rehydrate all persisted stores on the client after mount
    const stores = [
      useAuth,
      useApprovalStore,
      useEnrollmentStore,
      useOrgStore,
      useSimulation,
      useLeaderboard,
      useTestProgress,
    ]
    for (const store of stores) {
      if (store.persist && typeof store.persist.rehydrate === "function") {
        store.persist.rehydrate()
      }
    }
  }, [])

  return null
}
