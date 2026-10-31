"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  getDemoEntries,
  type LeaderboardEntry,
  type SortKey,
  sortEntries,
} from "./simulation-leaderboard"

type LeaderboardState = {
  entries: LeaderboardEntry[]
  /** ID of the most recent entry added by the current user (for "You" highlight) */
  lastUserEntryId: string | null
  sortKey: SortKey
  addUserEntry: (entry: Omit<LeaderboardEntry, "id">) => LeaderboardEntry
  setSortKey: (k: SortKey) => void
  resetToDemo: () => void
  getSorted: () => LeaderboardEntry[]
}

function uid(): string {
  return `user_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`
}

function initialState() {
  return {
    entries: getDemoEntries(),
    lastUserEntryId: null,
    sortKey: "grade" as SortKey,
  }
}

export const useLeaderboard = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      ...initialState(),

      addUserEntry: (entry) => {
        const newEntry: LeaderboardEntry = { ...entry, id: uid() }
        set((s) => ({
          entries: [...s.entries, newEntry],
          lastUserEntryId: newEntry.id,
        }))
        return newEntry
      },

      setSortKey: (k) => set({ sortKey: k }),

      resetToDemo: () => set(initialState()),

      getSorted: () => sortEntries(get().entries, get().sortKey),
    }),
    {
      name: "agileportal-leaderboard",
      partialize: (s) => ({
        entries: s.entries,
        lastUserEntryId: s.lastUserEntryId,
        sortKey: s.sortKey,
      }),
    },
  ),
)
