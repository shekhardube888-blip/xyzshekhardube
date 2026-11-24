// D2C Brand Simulator — business simulation engine (MBA/BBA syllabus style).
// Now config-driven: accepts a SimulationConfig that defines the decision
// parameters, market context, AI competitors, and grade thresholds.

import type { SimulationConfig, DecisionParam } from "./simulation-configs"

export type Decisions = Record<string, number>

export type CompetitorResult = {
  name: string
  decisions: Decisions
  marketShare: number // %
}

export type QuarterResult = {
  quarter: number
  decisions: Decisions
  demand: number
  unitsSold: number
  revenue: number
  costs: {
    variable: number
    marketing: number
    rnd: number
    fixed: number
    total: number
  }
  profit: number
  marketShare: number // %
  brandEquityAfter: number // 0–100
  customerSatisfactionAfter: number // 0–100
  cashAfter: number
  competitors: CompetitorResult[]
  headline: string
}

export type GameState = {
  status: "intro" | "running" | "finished"
  currentQuarter: number
  cash: number
  brandEquity: number
  customerSatisfaction: number
  history: QuarterResult[]
}

export type FinalGrade = {
  grade: "A" | "B" | "C" | "D"
  summary: string
  metrics: {
    cash: number
    brandEquity: number
    avgMarketShare: number
    totalProfit: number
  }
}

// ─── Attractiveness model (config-driven) ───
function attractiveness(
  decisions: Decisions,
  brandEquity: number,
  config: SimulationConfig,
): number {
  let score = 0
  let totalWeight = 0
  for (const param of config.decisions) {
    if (param.weight <= 0) continue
    const raw = decisions[param.key] ?? param.default
    // Normalize to 0-100
    let normalized = Math.min(100, (raw / param.scale) * 100)
    // Inverted params (e.g., lower price = more attractive)
    if (param.inverted) {
      normalized = 100 - normalized
    }
    score += normalized * param.weight
    totalWeight += param.weight
  }
  // Add brand equity (always weight = remaining)
  const equityWeight = 1 - totalWeight
  score += brandEquity * equityWeight
  return score
}

// ─── Quarter computation (config-driven) ───
export function runQuarter(
  state: GameState,
  decisions: Decisions,
  config: SimulationConfig,
): QuarterResult {
  const quarter = state.currentQuarter

  // Compute attractiveness for student + all AI competitors
  const studentAttr = attractiveness(decisions, state.brandEquity, config)
  const aiResults = config.competitors.map((ai) => ({
    name: ai.name,
    decisions: ai.strategy,
    attractiveness: attractiveness(ai.strategy, ai.brandEquity, config),
  }))

  const totalAttr = studentAttr + aiResults.reduce((sum, ai) => sum + ai.attractiveness, 0)

  // Market share %
  const studentShare = totalAttr > 0 ? (studentAttr / totalAttr) * 100 : 0
  const competitors: CompetitorResult[] = aiResults.map((ai) => ({
    name: ai.name,
    decisions: ai.decisions,
    marketShare: totalAttr > 0 ? (ai.attractiveness / totalAttr) * 100 : 0,
  }))

  // Demand for student's brand
  const demand = Math.round((config.totalMarketDemand * studentShare) / 100)

  // Production/supply decision — find the "production" param
  const productionParam = config.decisions.find((d) => d.key === "production")
  const production = productionParam ? (decisions.production ?? productionParam.default) : demand
  const unitsSold = Math.min(demand, production)
  const stockout = Math.max(0, demand - production)

  // Revenue
  const priceParam = config.decisions.find((d) => d.key === "price")
  const price = priceParam ? (decisions.price ?? priceParam.default) : 100
  const revenue = unitsSold * price

  // Costs
  const variableCost = production * config.variableCostPerUnit
  const marketingParam = config.decisions.find((d) => d.key === "marketing")
  const marketingCost = marketingParam ? (decisions.marketing ?? marketingParam.default) : 0
  const rndParam = config.decisions.find((d) => d.key === "rnd")
  const rndCost = rndParam ? (decisions.rnd ?? rndParam.default) : 0
  const fixedCost = config.fixedCostPerRound
  const totalCosts = variableCost + marketingCost + rndCost + fixedCost

  // Profit
  const profit = revenue - totalCosts

  // Brand equity update: R&D builds equity, marketing builds equity, losses reduce it
  const rndScale = rndParam ? rndParam.scale : 100_000
  const mktScale = marketingParam ? marketingParam.scale : 100_000
  const equityChange =
    ((decisions.rnd ?? 0) / rndScale) * 2 +
    ((decisions.marketing ?? 0) / mktScale) * 1 -
    (profit < 0 ? 3 : 0)
  const brandEquityAfter = Math.max(0, Math.min(100, state.brandEquity + equityChange))

  // Customer satisfaction
  const priceVsQuality =
    (decisions.rnd ?? 0) / (rndParam?.scale ?? 100_000) -
    (price / (priceParam?.scale ?? 500))
  const stockoutPenalty = stockout > 0 ? -10 : 0
  const csatChange = priceVsQuality * 0.3 + stockoutPenalty + 2
  const csatAfter = Math.max(0, Math.min(100, state.customerSatisfaction + csatChange))

  const cashAfter = state.cash + profit

  // Headline
  const headline = buildHeadline({
    quarter,
    profit,
    studentShare,
    prevShare: state.history.length > 0 ? state.history[state.history.length - 1].marketShare : 0,
    stockout,
    cashAfter,
    profitLabel: config.profitLabel,
  })

  return {
    quarter,
    decisions,
    demand,
    unitsSold,
    revenue,
    costs: {
      variable: variableCost,
      marketing: marketingCost,
      rnd: rndCost,
      fixed: fixedCost,
      total: totalCosts,
    },
    profit,
    marketShare: studentShare,
    brandEquityAfter,
    customerSatisfactionAfter: csatAfter,
    cashAfter,
    competitors,
    headline,
  }
}

function buildHeadline(args: {
  quarter: number
  profit: number
  studentShare: number
  prevShare: number
  stockout: number
  cashAfter: number
  profitLabel: string
}): string {
  const shareDelta = args.studentShare - args.prevShare
  const profitStr = `${formatINR(Math.abs(args.profit))} ${args.profit >= 0 ? "surplus" : "loss"}`

  if (args.cashAfter < 0) {
    return `Q${args.quarter}: BANKRUPT — budget went negative. ${profitStr}.`
  }
  if (args.stockout > 0) {
    return `Q${args.quarter}: ${profitStr}. Lost ${args.stockout.toLocaleString()} demand to undersupply.`
  }
  if (shareDelta > 2) {
    return `Q${args.quarter}: ${profitStr}. Gained ${shareDelta.toFixed(1)}pp ${"share"}.`
  }
  if (shareDelta < -2) {
    return `Q${args.quarter}: ${profitStr}. Lost ${Math.abs(shareDelta).toFixed(1)}pp share.`
  }
  return `Q${args.quarter}: ${profitStr}. Share held at ${args.studentShare.toFixed(1)}%.`
}

// ─── Final grade (config-driven) ───
export function computeFinalGrade(state: GameState, config: SimulationConfig): FinalGrade {
  const cash = state.cash
  const be = state.brandEquity
  const avgShare =
    state.history.length > 0
      ? state.history.reduce((s, q) => s + q.marketShare, 0) / state.history.length
      : 0
  const totalProfit = state.history.reduce((s, q) => s + q.profit, 0)
  const metrics = { cash, brandEquity: be, avgMarketShare: avgShare, totalProfit }

  const t = config.gradeThresholds
  if (cash >= t.A.cash && be >= t.A.equity && avgShare >= t.A.share)
    return { grade: "A", summary: "Excellent — strong performance across all metrics.", metrics }
  if (cash >= t.B.cash && be >= t.B.equity && avgShare >= t.B.share)
    return { grade: "B", summary: "Good — solid fundamentals with room to grow.", metrics }
  if (cash >= t.C.cash && be >= t.C.equity)
    return { grade: "C", summary: "Acceptable — survived but needs improvement.", metrics }
  if (cash < 0)
    return { grade: "D", summary: "Bankrupt — ran out of budget before finishing.", metrics }
  return { grade: "D", summary: "Below acceptable thresholds.", metrics }
}

// ─── Helpers ───
export function formatINR(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? "−" : ""
  if (abs >= 10_000_000) return `${sign}Rs.${(abs / 10_000_000).toFixed(2)}Cr`
  if (abs >= 100_000) return `${sign}Rs.${(abs / 100_000).toFixed(1)}L`
  if (abs >= 1000) return `${sign}Rs.${(abs / 1000).toFixed(1)}K`
  return `${sign}Rs.${abs.toFixed(0)}`
}

export function initialState(config: SimulationConfig): GameState {
  return {
    status: "intro",
    currentQuarter: 1,
    cash: config.startingCash,
    brandEquity: config.startingBrandEquity,
    customerSatisfaction: config.startingCsat,
    history: [],
  }
}

// Re-export for backwards compat
export const SIM_TOTAL_QUARTERS = 8
