"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  initialState,
  runQuarter,
  type Decisions,
  type GameState,
  type QuarterResult,
} from "./simulation-engine"
import { getConfigById, getConfigForStream, type SimulationConfig } from "./simulation-configs"

type SimStore = GameState & {
  configId: string
  startGame: (config?: SimulationConfig) => void
  resetGame: () => void
  advanceQuarter: (decisions: Decisions) => QuarterResult
  setConfig: (config: SimulationConfig) => void
}

export const useSimulation = create<SimStore>()(
  persist(
    (set, get) => ({
      ...initialState(getConfigForStream()),
      configId: getConfigForStream().id,

      startGame: (config) => {
        const c = config ?? getConfigById(get().configId) ?? getConfigForStream()
        set({ ...initialState(c), status: "running", configId: c.id })
      },

      resetGame: () => {
        const c = getConfigById(get().configId) ?? getConfigForStream()
        set({ ...initialState(c), configId: c.id })
      },

      setConfig: (config) => {
        set({ ...initialState(config), configId: config.id })
      },

      advanceQuarter: (decisions) => {
        const state = get()
        const config = getConfigById(state.configId) ?? getConfigForStream()
        if (state.status !== "running") {
          throw new Error("Game not running")
        }
        const result = runQuarter(state, decisions, config)
        const nextQuarter = state.currentQuarter + 1
        const isLast = state.currentQuarter >= config.totalQuarters
        const nextCash = result.cashAfter

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
        configId: s.configId,
      }),
    },
  ),
)
