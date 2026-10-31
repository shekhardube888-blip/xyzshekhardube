"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  initialState,
  runQuarter,
  SIM_TOTAL_QUARTERS,
  type Decisions,
  type GameState,
  type QuarterResult,
} from "./simulation-engine"

type SimStore = GameState & {
  startGame: () => void
  resetGame: () => void
  advanceQuarter: (decisions: Decisions) => QuarterResult
}

export const useSimulation = create<SimStore>()(
  persist(
    (set, get) => ({
      ...initialState(),

      startGame: () => set({ ...initialState(), status: "running" }),

      resetGame: () => set({ ...initialState() }),

      advanceQuarter: (decisions) => {
        const state = get()
        if (state.status !== "running") {
          throw new Error("Game not running")
        }
        const result = runQuarter(state, decisions)
        const nextQuarter = state.currentQuarter + 1
        const isLast = state.currentQuarter >= SIM_TOTAL_QUARTERS
        const nextCash = result.cashAfter

        // If bankrupt, end the game immediately
        const finished = isLast || nextCash < 0

        set({
          currentQuarter: finished ? state.currentQuarter : nextQuarter,
          cash: nextCash,
          brandEquity: result.brandEquityAfter,
          customerSatisfaction: result.customerSatisfactionAfter,
          history: [...state.history, result],
          status: finished ? "finished" : "running",
        })

        return result
      },
    }),
    {
      name: "agileportal-simulation",
      partialize: (s) => ({
        status: s.status,
        currentQuarter: s.currentQuarter,
        cash: s.cash,
        brandEquity: s.brandEquity,
        customerSatisfaction: s.customerSatisfaction,
        history: s.history,
      }),
    },
  ),
)
