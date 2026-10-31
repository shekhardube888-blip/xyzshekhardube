// D2C Brand Simulator — business simulation engine (MBA/BBA syllabus style).
// Students run a fictional D2C brand across 8 quarters, making pricing /
// marketing / R&D / production / channel decisions each quarter. The engine
// computes demand, revenue, costs, profit, market share vs 3 AI competitors,
// brand equity, and customer satisfaction. Final grade A/B/C/D.

export type Decisions = {
  price: number // ₹ per unit (range 100–500)
  marketing: number // ₹ total spend (range 0–1,000,000)
  rnd: number // ₹ R&D investment (range 0–1,000,000)
  production: number // units produced (range 0–20,000)
  channelOnline: number // 0–100 (% online vs retail)
}

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
    production: number
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
  headline: string // one-line news-style summary for the quarter
}

export type GameState = {
  status: "intro" | "running" | "finished"
  currentQuarter: number // 1..8
  cash: number
  brandEquity: number
  customerSatisfaction: number
  history: QuarterResult[]
}

// ---- Constants ----

export const SIM_TOTAL_QUARTERS = 8
const TOTAL_MARKET_DEMAND = 50000 // units/quarter
const VARIABLE_COST_PER_UNIT = 100 // ₹
const FIXED_COST_PER_QUARTER = 500000 // ₹
const STARTING_CASH = 5_000_000 // ₹5M
const STARTING_BRAND_EQUITY = 50
const STARTING_CSAT = 50

export const SIM_DEFAULT_DECISIONS: Decisions = {
  price: 250,
  marketing: 400000,
  rnd: 250000,
  production: 10000,
  channelOnline: 70,
}

export const SIM_CONSTANTS = {
  TOTAL_MARKET_DEMAND,
  VARIABLE_COST_PER_UNIT,
  FIXED_COST_PER_QUARTER,
  STARTING_CASH,
  STARTING_BRAND_EQUITY,
  STARTING_CSAT,
}

type AICompetitor = {
  name: string
  strategy: Decisions
  brandEquity: number
}

const AI_COMPETITORS: AICompetitor[] = [
  {
    name: "ValueMart",
    strategy: { price: 150, marketing: 200000, rnd: 100000, production: 18000, channelOnline: 80 },
    brandEquity: 55,
  },
  {
    name: "PremiumCo",
    strategy: { price: 350, marketing: 800000, rnd: 600000, production: 5000, channelOnline: 40 },
    brandEquity: 75,
  },
  {
    name: "MidBrand",
    strategy: { price: 240, marketing: 500000, rnd: 300000, production: 12000, channelOnline: 60 },
    brandEquity: 65,
  },
]

export function getAICompetitors(): AICompetitor[] {
  return AI_COMPETITORS
}

// ---- Attractiveness model ----
// Combines price competitiveness, marketing, R&D quality, channel mix, and
// brand equity into a single 0–100 attractiveness score. Market share is
// then allocated proportionally to attractiveness across all 4 players.
function attractiveness(d: Decisions, brandEquity: number): number {
  // Lower price = higher attractiveness (₹100 → 80, ₹500 → 0)
  const priceScore = Math.max(0, 100 - d.price / 5)
  // Marketing: ₹0 → 0, ₹1,000,000 → 100
  const marketingScore = Math.min(100, d.marketing / 10000)
  // R&D quality: ₹0 → 0, ₹1,000,000 → 100
  const rndScore = Math.min(100, d.rnd / 10000)
  // Channel mix (online favors digital-native audience for D2C)
  const channelScore = d.channelOnline
  // Brand equity is itself 0–100
  const equityScore = brandEquity

  // Weighted sum
  return (
    priceScore * 0.25 +
    marketingScore * 0.25 +
    rndScore * 0.2 +
    channelScore * 0.1 +
    equityScore * 0.2
  )
}

// ---- Quarter computation ----

export function runQuarter(state: GameState, decisions: Decisions): QuarterResult {
  const quarter = state.currentQuarter

  // Compute attractiveness for student + all AI competitors
  const studentAttr = attractiveness(decisions, state.brandEquity)
  const aiResults = AI_COMPETITORS.map((ai) => ({
    name: ai.name,
    decisions: ai.strategy,
    attractiveness: attractiveness(ai.strategy, ai.brandEquity),
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
  const demand = Math.round((TOTAL_MARKET_DEMAND * studentShare) / 100)
  const unitsSold = Math.min(demand, decisions.production)
  const stockout = Math.max(0, demand - decisions.production)

  // Revenue
  const revenue = unitsSold * decisions.price

  // Costs
  const productionCost = decisions.production * VARIABLE_COST_PER_UNIT
  const marketingCost = decisions.marketing
  const rndCost = decisions.rnd
  const fixedCost = FIXED_COST_PER_QUARTER
  const totalCosts = productionCost + marketingCost + rndCost + fixedCost

  // Profit
  const profit = revenue - totalCosts

  // Brand equity update: R&D builds equity (+2 per ₹100K), marketing builds
  // equity (+1 per ₹100K), losses reduce it (−3 if profit < 0)
  const equityChange =
    (decisions.rnd / 100000) * 2 +
    (decisions.marketing / 100000) * 1 -
    (profit < 0 ? 3 : 0)
  const brandEquityAfter = Math.max(0, Math.min(100, state.brandEquity + equityChange))

  // Customer satisfaction: quality (R&D) vs price, stockout penalty, baseline drift
  const priceVsQuality = decisions.rnd / 10000 - decisions.price / 10
  const stockoutPenalty = stockout > 0 ? -10 : 0
  const csatChange = priceVsQuality * 0.3 + stockoutPenalty + 2
  const csatAfter = Math.max(0, Math.min(100, state.customerSatisfaction + csatChange))

  const cashAfter = state.cash + profit

  // Generate a one-line news headline
  const headline = buildHeadline({
    quarter,
    profit,
    studentShare,
    prevShare: state.history.length > 0 ? state.history[state.history.length - 1].marketShare : 0,
    stockout,
    cashAfter,
  })

  return {
    quarter,
    decisions,
    demand,
    unitsSold,
    revenue,
    costs: {
      production: productionCost,
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
}): string {
  const shareDelta = args.studentShare - args.prevShare
  const profitStr = `₹${(Math.abs(args.profit) / 100000).toFixed(1)}L ${args.profit >= 0 ? "profit" : "loss"}`

  if (args.cashAfter < 0) {
    return `Q${args.quarter}: BANKRUPT — cash went negative. ${profitStr}.`
  }
  if (args.stockout > 0) {
    return `Q${args.quarter}: ${profitStr}. Lost ${args.stockout.toLocaleString()} units to stockout.`
  }
  if (shareDelta > 2) {
    return `Q${args.quarter}: ${profitStr}. Gained ${shareDelta.toFixed(1)}pp market share.`
  }
  if (shareDelta < -2) {
    return `Q${args.quarter}: ${profitStr}. Lost ${Math.abs(shareDelta).toFixed(1)}pp market share.`
  }
  return `Q${args.quarter}: ${profitStr}. Market share held at ${args.studentShare.toFixed(1)}%.`
}

// ---- Final grade ----

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

export function computeFinalGrade(state: GameState): FinalGrade {
  const cash = state.cash
  const be = state.brandEquity
  const avgShare =
    state.history.length > 0
      ? state.history.reduce((s, q) => s + q.marketShare, 0) / state.history.length
      : 0
  const totalProfit = state.history.reduce((s, q) => s + q.profit, 0)
  const metrics = { cash, brandEquity: be, avgMarketShare: avgShare, totalProfit }

  if (cash >= 10_000_000 && be >= 75 && avgShare >= 25)
    return { grade: "A", summary: "Excellent — strong cash, brand equity, and market share.", metrics }
  if (cash >= 5_000_000 && be >= 60 && avgShare >= 15)
    return { grade: "B", summary: "Good — solid business fundamentals across the board.", metrics }
  if (cash >= 0 && be >= 45)
    return { grade: "C", summary: "Acceptable — survived 8 quarters but room to improve.", metrics }
  if (cash < 0)
    return { grade: "D", summary: "Bankrupt — ran out of cash before finishing.", metrics }
  return { grade: "D", summary: "Below acceptable thresholds on brand equity or cash.", metrics }
}

// ---- Helpers ----

export function formatINR(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? "−" : ""
  if (abs >= 10_000_000) return `${sign}₹${(abs / 10_000_000).toFixed(2)}Cr`
  if (abs >= 100_000) return `${sign}₹${(abs / 100_000).toFixed(1)}L`
  if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`
  return `${sign}₹${abs.toFixed(0)}`
}

export function initialState(): GameState {
  return {
    status: "intro",
    currentQuarter: 1,
    cash: STARTING_CASH,
    brandEquity: STARTING_BRAND_EQUITY,
    customerSatisfaction: STARTING_CSAT,
    history: [],
  }
}
