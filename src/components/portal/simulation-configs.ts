// Dynamic simulation configs — one per subject/track.
// Each config defines the decision parameters, market context, AI competitors,
// and grade thresholds for that subject's simulation game.

export type DecisionParam = {
  key: string
  label: string
  icon: string // lucide icon name
  min: number
  max: number
  step: number
  default: number
  unit: string // "₹", "units", "%", "people", etc.
  format: (v: number) => string
  hint: string
  // Weight in the attractiveness model (0-1, all weights sum to 1.0)
  weight: number
  // Whether lower values are more attractive (e.g., lower price = more attractive)
  inverted?: boolean
  // Scale factor for normalizing to 0-100 score: score = min(100, value / scale * 100)
  scale: number
}

export type AICompetitor = {
  name: string
  strategy: Record<string, number>
  brandEquity: number
  description: string
}

export type SimulationConfig = {
  id: string
  title: string
  subject: string
  track: "MBA" | "BBA" | "BSc"
  description: string
  industryContext: string
  totalQuarters: number
  startingCash: number
  startingBrandEquity: number
  startingCsat: number
  totalMarketDemand: number
  variableCostPerUnit: number
  fixedCostPerRound: number
  decisions: DecisionParam[]
  competitors: AICompetitor[]
  // Unit labels for the results display
  unitLabel: string // "units", "customers", "downloads", etc.
  revenueLabel: string // "Revenue", "MRR", "Grant", etc.
  profitLabel: string // "Profit", "Net Burn", "Surplus", etc.
  cashLabel: string // "Cash", "Runway Cash", "Budget", etc.
  shareLabel: string // "Market Share", "User Share", "Accuracy Rank", etc.
  // Grade thresholds
  gradeThresholds: {
    A: { cash: number; equity: number; share: number }
    B: { cash: number; equity: number; share: number }
    C: { cash: number; equity: number }
  }
}

// ─── Helper: format Indian Rupee ───
function fmtINR(v: number): string {
  const abs = Math.abs(v)
  const sign = v < 0 ? "−" : ""
  if (abs >= 10_000_000) return `${sign}Rs.${(abs / 10_000_000).toFixed(2)}Cr`
  if (abs >= 100_000) return `${sign}Rs.${(abs / 100_000).toFixed(1)}L`
  if (abs >= 1000) return `${sign}Rs.${(abs / 1000).toFixed(1)}K`
  return `${sign}Rs.${abs.toFixed(0)}`
}

function fmtNum(v: number): string {
  return v.toLocaleString()
}

function fmtPct(v: number): string {
  return `${v}%`
}

function fmtPlain(v: number): string {
  return String(v)
}

// ─── Config 1: MBA Marketing — D2C Brand Simulator ───
const MBA_MARKETING: SimulationConfig = {
  id: "mba-marketing-d2c",
  title: "D2C Brand Simulator",
  subject: "MBA · Marketing",
  track: "MBA",
  description:
    "Run a fictional D2C brand across 8 quarters. Make pricing, marketing, R&D, production, and channel decisions each quarter. Compete against 3 AI rivals for market share.",
  industryContext: "D2C personal-care brand",
  totalQuarters: 8,
  startingCash: 5_000_000,
  startingBrandEquity: 50,
  startingCsat: 50,
  totalMarketDemand: 50_000,
  variableCostPerUnit: 100,
  fixedCostPerRound: 500_000,
  unitLabel: "units",
  revenueLabel: "Revenue",
  profitLabel: "Profit",
  cashLabel: "Cash",
  shareLabel: "Market Share",
  decisions: [
    {
      key: "price", label: "Price per unit", icon: "Tag",
      min: 100, max: 500, step: 10, default: 250, unit: "Rs.",
      format: (v) => `Rs.${v}`, hint: "Lower price = higher demand, but lower revenue per unit. Variable cost is Rs.100/unit.",
      weight: 0.25, inverted: true, scale: 500,
    },
    {
      key: "marketing", label: "Marketing spend", icon: "Megaphone",
      min: 0, max: 1_000_000, step: 50_000, default: 400_000, unit: "Rs.",
      format: fmtINR, hint: "Boosts demand and brand equity. Rs.0 = no marketing push.",
      weight: 0.25, scale: 1_000_000,
    },
    {
      key: "rnd", label: "R&D investment", icon: "FlaskConical",
      min: 0, max: 1_000_000, step: 50_000, default: 250_000, unit: "Rs.",
      format: fmtINR, hint: "Improves product quality → higher csat + brand equity. Lets you charge a premium.",
      weight: 0.20, scale: 1_000_000,
    },
    {
      key: "production", label: "Production volume", icon: "Factory",
      min: 0, max: 20_000, step: 500, default: 10_000, unit: "units",
      format: (v) => `${v.toLocaleString()} units`, hint: "Match demand to avoid stockouts (lost sales) or overproduction (wasted cost).",
      weight: 0.0, scale: 20_000, // production doesn't affect attractiveness, only supply
    },
    {
      key: "channelOnline", label: "Channel mix (online %)", icon: "Truck",
      min: 0, max: 100, step: 5, default: 70, unit: "%",
      format: (v) => `${v}% online / ${100 - v}% retail`, hint: "Online channel favors digital-native D2C audience.",
      weight: 0.10, scale: 100,
    },
  ],
  competitors: [
    { name: "ValueMart", brandEquity: 55, description: "Aggressive low-price, high volume",
      strategy: { price: 150, marketing: 200_000, rnd: 100_000, production: 18_000, channelOnline: 80 } },
    { name: "PremiumCo", brandEquity: 75, description: "Premium pricing, high R&D + marketing",
      strategy: { price: 350, marketing: 800_000, rnd: 600_000, production: 5_000, channelOnline: 40 } },
    { name: "MidBrand", brandEquity: 65, description: "Balanced mid-market strategy",
      strategy: { price: 240, marketing: 500_000, rnd: 300_000, production: 12_000, channelOnline: 60 } },
  ],
  gradeThresholds: {
    A: { cash: 10_000_000, equity: 75, share: 25 },
    B: { cash: 5_000_000, equity: 60, share: 15 },
    C: { cash: 0, equity: 45 },
  },
}

// ─── Config 2: BBA Entrepreneurship — Startup Builder ───
const BBA_ENTREPRENEURSHIP: SimulationConfig = {
  id: "bba-startup-builder",
  title: "Startup Builder",
  subject: "BBA · Entrepreneurship",
  track: "BBA",
  description:
    "Build a SaaS startup across 8 quarters. Decide funding, hiring, marketing, product velocity, and customer success. Maximize valuation while managing burn rate.",
  industryContext: "B2B SaaS startup",
  totalQuarters: 8,
  startingCash: 5_000_000,
  startingBrandEquity: 40,
  startingCsat: 50,
  totalMarketDemand: 10_000, // potential customers
  variableCostPerUnit: 50, // per-customer delivery cost
  fixedCostPerRound: 400_000,
  unitLabel: "customers",
  revenueLabel: "MRR × Quarter",
  profitLabel: "Net Burn",
  cashLabel: "Runway Cash",
  shareLabel: "User Share",
  decisions: [
    {
      key: "price", label: "Subscription price / month", icon: "Tag",
      min: 200, max: 2000, step: 50, default: 800, unit: "Rs.",
      format: (v) => `Rs.${v}/mo`, hint: "Lower price = more users, but lower MRR per user. Delivery cost is Rs.50/user.",
      weight: 0.25, inverted: true, scale: 2000,
    },
    {
      key: "marketing", label: "Marketing spend", icon: "Megaphone",
      min: 0, max: 1_000_000, step: 50_000, default: 300_000, unit: "Rs.",
      format: fmtINR, hint: "Performance marketing + content. Drives user acquisition.",
      weight: 0.25, scale: 1_000_000,
    },
    {
      key: "rnd", label: "Engineering hires", icon: "FlaskConical",
      min: 1, max: 20, step: 1, default: 5, unit: "people",
      format: (v) => `${v} engineers`, hint: "More engineers = faster product velocity + better features. Cost: Rs.200K/engineer/quarter.",
      weight: 0.20, scale: 20,
    },
    {
      key: "production", label: "Sales hires", icon: "Factory",
      min: 0, max: 15, step: 1, default: 4, unit: "people",
      format: (v) => `${v} sales reps`, hint: "Sales reps drive conversion. Too few = lost deals, too many = high burn.",
      weight: 0.0, scale: 15,
    },
    {
      key: "channelOnline", label: "Customer success investment", icon: "Truck",
      min: 0, max: 100, step: 5, default: 50, unit: "%",
      format: (v) => `${v}% of revenue`, hint: "Higher CS investment = better retention + csat. Costs % of revenue.",
      weight: 0.10, scale: 100,
    },
  ],
  competitors: [
    { name: "BootstrappedCo", brandEquity: 45, description: "Lean, low burn, slow growth",
      strategy: { price: 500, marketing: 100_000, rnd: 3, production: 2, channelOnline: 30 } },
    { name: "VC-Backed", brandEquity: 70, description: "Aggressive growth, high burn",
      strategy: { price: 1200, marketing: 800_000, rnd: 12, production: 8, channelOnline: 60 } },
    { name: "ScaleUp", brandEquity: 60, description: "Balanced growth + profitability",
      strategy: { price: 800, marketing: 400_000, rnd: 6, production: 5, channelOnline: 50 } },
  ],
  gradeThresholds: {
    A: { cash: 8_000_000, equity: 70, share: 20 },
    B: { cash: 3_000_000, equity: 55, share: 12 },
    C: { cash: 0, equity: 40 },
  },
}

// ─── Config 3: BBA Digital Marketing — Campaign Manager ───
const BBA_DIGITAL_MARKETING: SimulationConfig = {
  id: "bba-campaign-manager",
  title: "Digital Campaign Manager",
  subject: "BBA · Digital Marketing",
  track: "BBA",
  description:
    "Manage digital marketing campaigns across 8 weeks. Allocate budget across Meta, Google, SEO, Email, and Influencer. Maximize ROAS (return on ad spend).",
  industryContext: "Digital marketing agency",
  totalQuarters: 8,
  startingCash: 2_000_000,
  startingBrandEquity: 50,
  startingCsat: 60,
  totalMarketDemand: 100_000, // total impressions
  variableCostPerUnit: 5, // cost per impression
  fixedCostPerRound: 100_000,
  unitLabel: "conversions",
  revenueLabel: "Conversion Revenue",
  profitLabel: "ROAS Surplus",
  cashLabel: "Budget",
  shareLabel: "Conversion Share",
  decisions: [
    {
      key: "price", label: "Avg CPC (cost per click)", icon: "Tag",
      min: 5, max: 50, step: 1, default: 20, unit: "Rs.",
      format: (v) => `Rs.${v}/click`, hint: "Lower CPC = more clicks for same budget, but may indicate lower-quality traffic.",
      weight: 0.20, inverted: true, scale: 50,
    },
    {
      key: "marketing", label: "Total ad budget", icon: "Megaphone",
      min: 100_000, max: 1_000_000, step: 50_000, default: 500_000, unit: "Rs.",
      format: fmtINR, hint: "Total budget across all channels. Drives reach.",
      weight: 0.30, scale: 1_000_000,
    },
    {
      key: "rnd", label: "Creative testing budget", icon: "FlaskConical",
      min: 0, max: 200_000, step: 10_000, default: 80_000, unit: "Rs.",
      format: fmtINR, hint: "A/B test creatives → better CTR + conversion rate over time.",
      weight: 0.15, scale: 200_000,
    },
    {
      key: "production", label: "Campaign count", icon: "Factory",
      min: 1, max: 20, step: 1, default: 8, unit: "campaigns",
      format: (v) => `${v} campaigns`, hint: "More campaigns = broader reach, but spread thin reduces each one's impact.",
      weight: 0.0, scale: 20,
    },
    {
      key: "channelOnline", label: "Influencer budget %", icon: "Truck",
      min: 0, max: 100, step: 5, default: 30, unit: "%",
      format: (v) => `${v}% influencer / ${100 - v}% paid`, hint: "Influencer drives awareness; paid drives conversion. Balance is key.",
      weight: 0.15, scale: 100,
    },
  ],
  competitors: [
    { name: "PerformancePro", brandEquity: 65, description: "Data-driven, high ROAS focus",
      strategy: { price: 15, marketing: 600_000, rnd: 120_000, production: 12, channelOnline: 20 } },
    { name: "BrandBuilder", brandEquity: 70, description: "Brand-first, influencer-heavy",
      strategy: { price: 30, marketing: 400_000, rnd: 50_000, production: 4, channelOnline: 80 } },
    { name: "BalancedAgency", brandEquity: 60, description: "Balanced paid + organic + influencer",
      strategy: { price: 22, marketing: 500_000, rnd: 80_000, production: 8, channelOnline: 40 } },
  ],
  gradeThresholds: {
    A: { cash: 4_000_000, equity: 75, share: 30 },
    B: { cash: 2_000_000, equity: 60, share: 18 },
    C: { cash: 0, equity: 45 },
  },
}

// ─── Config 4: BSc Data Science — ML Pipeline Builder ───
const BSC_DATA_SCIENCE: SimulationConfig = {
  id: "bsc-ml-pipeline",
  title: "ML Pipeline Builder",
  subject: "BSc · Data Science",
  track: "BSc",
  description:
    "Build a machine learning pipeline across 8 iterations. Decide data size, model complexity, feature engineering, cross-validation, and ensemble size. Maximize accuracy vs 3 AI competitors.",
  industryContext: "Kaggle-style ML competition",
  totalQuarters: 8,
  startingCash: 10_000, // compute credits (in thousands)
  startingBrandEquity: 50, // reputation score
  startingCsat: 70, // model reliability
  totalMarketDemand: 100, // total accuracy points available (0-100%)
  variableCostPerUnit: 10, // compute cost per data sample (in credits)
  fixedCostPerRound: 500, // base compute cost per iteration
  unitLabel: "accuracy pts",
  revenueLabel: "Accuracy Gain",
  profitLabel: "Net Score",
  cashLabel: "Compute Credits",
  shareLabel: "Leaderboard Rank %",
  decisions: [
    {
      key: "price", label: "Data quality threshold", icon: "Tag",
      min: 50, max: 99, step: 1, default: 80, unit: "%",
      format: (v) => `${v}% quality`, hint: "Higher quality threshold = cleaner data but fewer samples. Balance is critical.",
      weight: 0.20, scale: 99,
    },
    {
      key: "marketing", label: "Training data size", icon: "Megaphone",
      min: 1000, max: 100_000, step: 1000, default: 20_000, unit: "samples",
      format: (v) => `${v.toLocaleString()} samples`, hint: "More data = better accuracy, but higher compute cost.",
      weight: 0.30, scale: 100_000,
    },
    {
      key: "rnd", label: "Model complexity (trees/layers)", icon: "FlaskConical",
      min: 10, max: 500, step: 10, default: 100, unit: "units",
      format: (v) => `${v} complexity`, hint: "More complex models → higher accuracy ceiling, but risk overfitting + compute cost.",
      weight: 0.25, scale: 500,
    },
    {
      key: "production", label: "Training epochs", icon: "Factory",
      min: 5, max: 100, step: 5, default: 30, unit: "epochs",
      format: (v) => `${v} epochs`, hint: "More epochs = better convergence, but diminishing returns + overfitting risk.",
      weight: 0.0, scale: 100,
    },
    {
      key: "channelOnline", label: "Cross-validation folds", icon: "Truck",
      min: 2, max: 10, step: 1, default: 5, unit: "folds",
      format: (v) => `${v}-fold CV`, hint: "More folds = more robust evaluation, but higher compute cost.",
      weight: 0.10, scale: 10,
    },
  ],
  competitors: [
    { name: "SimpleSimon", brandEquity: 50, description: "Simple models, fast iteration",
      strategy: { price: 70, marketing: 5_000, rnd: 50, production: 15, channelOnline: 3 } },
    { name: "DeepLearner", brandEquity: 75, description: "Complex deep learning, high compute",
      strategy: { price: 95, marketing: 80_000, rnd: 400, production: 80, channelOnline: 10 } },
    { name: "BalancedML", brandEquity: 65, description: "Balanced ensemble + solid data",
      strategy: { price: 85, marketing: 30_000, rnd: 150, production: 40, channelOnline: 5 } },
  ],
  gradeThresholds: {
    A: { cash: 15_000, equity: 80, share: 30 },
    B: { cash: 8_000, equity: 65, share: 18 },
    C: { cash: 0, equity: 50 },
  },
}

export const SIMULATION_CONFIGS: SimulationConfig[] = [
  MBA_MARKETING,
  BBA_ENTREPRENEURSHIP,
  BBA_DIGITAL_MARKETING,
  BSC_DATA_SCIENCE,
]

export function getConfigById(id: string): SimulationConfig | undefined {
  return SIMULATION_CONFIGS.find((c) => c.id === id)
}

// Auto-select a config based on the student's stream
export function getConfigForStream(stream?: string): SimulationConfig {
  if (!stream) return MBA_MARKETING
  const s = stream.toLowerCase()
  if (s.includes("entrepreneur")) return BBA_ENTREPRENEURSHIP
  if (s.includes("digital")) return BBA_DIGITAL_MARKETING
  if (s.includes("data science") || s.includes("computer") || s.includes("statistics"))
    return BSC_DATA_SCIENCE
  if (s.includes("mba")) return MBA_MARKETING
  return MBA_MARKETING
}
