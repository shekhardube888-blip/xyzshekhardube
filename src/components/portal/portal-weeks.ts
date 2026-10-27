// 8 weeks of MBA Marketing & Strategy internship content.
// Each week has: title, objective, brief, MCQ test (4 Qs), market scenario,
// solution prompt. All content is tuned for real D2C brand briefs.

export type Question = {
  q: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type Week = {
  id: number
  short: string // e.g. "W1"
  title: string
  objective: string
  estimatedMinutes: number
  task: string
  quiz: Question[]
  scenario: {
    brand: string
    brief: string
    asks: string[]
  }
  solutionPrompt: string
  minWords: number
  maxWords: number
}

export const WEEKS: Week[] = [
  {
    id: 1,
    short: "W1",
    title: "Brand Audit Fundamentals",
    objective: "Conduct a structured brand audit for a D2C competitor using the 4P + brand equity lens.",
    estimatedMinutes: 90,
    task: "Pick one D2C competitor in the personal-care or lifestyle-electronics space. Conduct a full brand audit covering: positioning, visual identity, content tone, distribution channels, and customer reviews. Submit a 1-page audit summary.",
    quiz: [
      {
        q: "Which framework decomposes a brand audit into Product, Price, Place, and Promotion?",
        options: ["SWOT", "4P Marketing Mix", "Porter's 5 Forces", "BCG Matrix"],
        correctIndex: 1,
        explanation: "The 4P Marketing Mix (Product / Price / Place / Promotion) is the standard decomposition for a brand audit.",
      },
      {
        q: "When auditing a D2C brand's online reviews, the most useful signal is:",
        options: [
          "Star rating only",
          "Recurrence of complaint themes (e.g. delivery, packaging) across reviews",
          "Total review count",
          "Length of individual reviews",
        ],
        correctIndex: 1,
        explanation: "Recurring complaint themes reveal systemic brand-experience gaps — far more actionable than aggregate ratings or review length.",
      },
      {
        q: "A 'reason to believe' (RTB) in a brand audit refers to:",
        options: [
          "The brand's revenue tier band",
          "The functional or emotional proof that backs the brand's promise",
          "A customer testimonial quote",
          "The brand's listed legal entity name",
        ],
        correctIndex: 1,
        explanation: "An RTB is the proof (functional or emotional) that justifies the brand's promise to the consumer.",
      },
      {
        q: "When benchmarking a D2C competitor's positioning, the cleanest comparison axis is:",
        options: [
          "Revenue",
          "Price-vs-premium perception on a 2x2",
          "Social media followers",
          "Warehouse footprint",
        ],
        correctIndex: 1,
        explanation: "A price-vs-premium perception 2x2 plots how the market perceives each brand relative to others — the cleanest positioning comparison.",
      },
    ],
    scenario: {
      brand: "Loom Solar",
      brief:
        "Loom Solar is a 3-year-old D2C residential solar brand operating across North India. Over the last 6 months, its market share has slipped from ~12% to ~7% as 4 newer entrants (ZunSolar, GreenSurya, BrightVolt, EcoRays) have undercut it on price. Their retention rate has also dropped from 78% to 61%.",
      asks: [
        "Conduct a brand audit identifying the top 3 reasons for share erosion",
        "Recommend 2 positioning shifts to defend against the new entrants",
      ],
    },
    solutionPrompt:
      "Write a 250–400 word brand audit summary covering positioning, content tone, distribution, and reviews. End with 2 prioritised recommendations.",
    minWords: 250,
    maxWords: 400,
  },
  {
    id: 2,
    short: "W2",
    title: "Customer Persona Canvas",
    objective: "Build a customer persona canvas capturing demographics, pains, jobs-to-be-done, and triggers.",
    estimatedMinutes: 90,
    task: "Choose a D2C brand expanding into a new category. Build a customer persona canvas for its Ideal Customer Profile (ICP) covering: demographics, psychographics, jobs-to-be-done, pain points, and trigger moments.",
    quiz: [
      {
        q: "The 'Jobs-to-be-Done' framework is best described as:",
        options: [
          "A list of tasks the customer does at work",
          "Framing purchases as the customer 'hiring' a product to make progress in a situation",
          "A daily time-use survey of the customer",
          "A free-text field in CRM",
        ],
        correctIndex: 1,
        explanation: "JTBD frames purchases as customers 'hiring' a product to make progress in a specific situation — not as static demographic attributes.",
      },
      {
        q: "A 'trigger moment' in persona work refers to:",
        options: [
          "A weekly marketing email blast",
          "The situational cue that surfaces a need and pushes the customer to act",
          "A seasonal discount",
          "An ad campaign launch",
        ],
        correctIndex: 1,
        explanation: "A trigger moment is the situational cue (life event, friction point, time-bound need) that surfaces a need and pushes the customer to take action.",
      },
      {
        q: "When building a persona for a smart-home brand entering tier-2 India, the LEAST useful signal is:",
        options: [
          "In-app behavior analytics from existing tier-1 users",
          "Avg. monthly household income by city tier",
          "Smartphone brand share by state",
          "A 2-year-old national-level NPS survey",
        ],
        correctIndex: 3,
        explanation: "A 2-year-old national-level NPS survey is too aggregated and stale to inform persona design for a fast-evolving category entering tier-2 markets.",
      },
      {
        q: "An Ideal Customer Profile (ICP) for a B2B SaaS brand is BEST defined by:",
        options: [
          "Any company willing to pay",
          "Firmographic + technographic + behavioral fit that signals high LTV and low CAC",
          "LinkedIn industry tags",
          "Company size alone",
        ],
        correctIndex: 1,
        explanation: "A real ICP combines firmographic + technographic + behavioral fit — companies that have high LTV, low CAC, and a fast sales cycle.",
      },
    ],
    scenario: {
      brand: "Boat — Smart Home Expansion",
      brief:
        "Boat is the market leader in lifestyle audio. It wants to expand into smart-home devices (smart plugs, smart bulbs, smart speakers) targeting first-time buyers in tier-1 and tier-2 cities. Their core buyer today is 18–24, urban, value-conscious. The smart-home category is currently perceived as 'premium / techie' in India.",
      asks: [
        "Build the persona canvas for Boat's ICP for smart-home expansion",
        "Identify the top 2 trigger moments where this persona would buy",
      ],
    },
    solutionPrompt:
      "Write a 250–400 word persona canvas covering demographics, psychographics, JTBD, pains, and 2 trigger moments. Be concrete (not generic).",
    minWords: 250,
    maxWords: 400,
  },
  {
    id: 3,
    short: "W3",
    title: "Go-to-Market (GTM) Strategy",
    objective: "Draft a 4-week go-to-market plan covering channels, sequencing, and budget split.",
    estimatedMinutes: 100,
    task: "Build a GTM plan for a D2C brand entering a new region. Cover: channel mix (organic + paid + partnerships), sequencing (week-by-week), and a budget split with rationale.",
    quiz: [
      {
        q: "In a D2C GTM plan, the best channel to lead with for a brand-new (zero awareness) category is usually:",
        options: [
          "Branded search (Google Ads brand keywords)",
          "Performance marketing (Meta + Google)",
          "Influencer + content seeding",
          "Affiliate",
        ],
        correctIndex: 2,
        explanation: "For zero-awareness new categories, influencer + content seeding builds the demand pool before performance marketing can harvest it.",
      },
      {
        q: "A 'phased' GTM launch means:",
        options: [
          "Running all channels in parallel from day 1",
          "Sequencing channels by stage of the funnel (e.g. demand-gen → capture → retain)",
          "Launching region-by-region without channel change",
          "A 12-month launch plan",
        ],
        correctIndex: 1,
        explanation: "Phased GTM means sequencing channels by funnel stage — demand-gen first, capture second, retention third — not running everything in parallel.",
      },
      {
        q: "The CAC:LTV ratio a healthy D2C brand targets is roughly:",
        options: ["1:1", "1:3", "1:10", "10:1"],
        correctIndex: 1,
        explanation: "A healthy D2C CAC:LTV ratio is ~1:3 — for every ₹1 spent acquiring, the brand recovers ₹3 in lifetime gross profit.",
      },
      {
        q: "When entering a new region, the SAFEST channel split for week 1 of GTM is:",
        options: [
          "100% paid Meta ads",
          "70% influencer + content, 30% paid performance",
          "100% SEO",
          "100% affiliate",
        ],
        correctIndex: 1,
        explanation: "A 70/30 split favouring influencer + content builds regional awareness while paid performance captures the early signal — safer than all-paid or all-organic in week 1.",
      },
    ],
    scenario: {
      brand: "Wakefit — South India Tier-2 Entry",
      brief:
        "Wakefit is a Bangalore-based D2C mattress brand currently strong in tier-1 metros. It wants to enter tier-2 cities in Tamil Nadu and Kerala (Coimbatore, Madurai, Kochi, Trivandrum). Mattresses are a high-consideration, touch-and-feel category. Their current CAC in tier-1 is ₹2,400; market research suggests tier-2 CAC could be ₹3,800 if approached the same way.",
      asks: [
        "Design a 4-week GTM plan for the tier-2 entry",
        "Recommend one channel experiment that could bring tier-2 CAC below ₹3,000",
      ],
    },
    solutionPrompt:
      "Write a 300–450 word GTM plan covering channel mix, 4-week sequencing, budget split (% and rationale), and one CAC-lowering experiment.",
    minWords: 300,
    maxWords: 450,
  },
  {
    id: 4,
    short: "W4",
    title: "Performance Marketing Lab",
    objective: "Build a Meta Ads campaign structure with ad sets, audiences, and creative variants.",
    estimatedMinutes: 100,
    task: "Design a Meta Ads campaign structure for a D2C product launch. Include: campaign objective, 3 ad sets with audience + creative variants, and a measurement plan.",
    quiz: [
      {
        q: "On Meta Ads, the BEST objective for a brand-new product launch (zero awareness) is:",
        options: ["Reach", "Engagement", "Sales (formerly Conversions)", "Traffic"],
        correctIndex: 0,
        explanation: "For a zero-awareness launch, Reach first builds impressions to a wide audience before performance (Sales/Traffic) can harvest demand.",
      },
      {
        q: "An 'ad set' in Meta Ads Manager is structured around:",
        options: [
          "Creative assets",
          "Audience + placement + budget + schedule",
          "Campaign objective",
          "Pixel events",
        ],
        correctIndex: 1,
        explanation: "An ad set holds the audience + placement + budget + schedule at its level — creatives sit below it.",
      },
      {
        q: "For A/B testing creative variants on Meta, the recommended number of variants per ad set is roughly:",
        options: ["1", "3–4", "10+", "25"],
        correctIndex: 1,
        explanation: "Meta's algorithm needs ~3–4 distinct creative variants per ad set to optimise against each other meaningfully — too few starves it; too many fragment spend.",
      },
      {
        q: "The CAPI (Conversions API) is used to:",
        options: [
          "Send in-store purchase events back to Meta from server-side",
          "A/B test ad copy",
          "Refund ad spend",
          "Auto-generate creatives",
        ],
        correctIndex: 0,
        explanation: "CAPI sends conversion events server-side to Meta — useful for in-store / app / offline purchases that the pixel can't see.",
      },
    ],
    scenario: {
      brand: "Mamaearth — New Face Wash Launch",
      brief:
        "Mamaearth is launching a Vitamin C+ face wash targeted at 22–28-year-old working women in metros. The brand wants to acquire 50,000 first-time buyers in 4 weeks with a CAC ceiling of ₹220. Their typical Meta Ads CPA for similar launches is ₹180.",
      asks: [
        "Design the campaign structure with 3 ad sets",
        "Recommend the creative angle for the top-performing ad set",
      ],
    },
    solutionPrompt:
      "Write a 300–450 word campaign structure covering: campaign objective, 3 ad sets (audience + creative variant each), measurement plan, and the top ad set's creative angle.",
    minWords: 300,
    maxWords: 450,
  },
  {
    id: 5,
    short: "W5",
    title: "Brand Positioning Statement",
    objective: "Write a brand positioning statement using the classic 'For [target], [brand] is the [frame] that [benefit] because [RTB]' format.",
    estimatedMinutes: 80,
    task: "Pick a D2C brand entering a crowded category. Write a positioning statement, identify the frame of reference (category), and articulate the point-of-difference.",
    quiz: [
      {
        q: "The classic positioning statement format is:",
        options: [
          "We make the best product, for everyone, everywhere",
          "For [target audience], [brand] is the [frame of reference] that [point of difference] because [reason to believe]",
          "Tagline + Logo + Brand color",
          "Mission + Vision + Values",
        ],
        correctIndex: 1,
        explanation: "The classic positioning statement: 'For [target], [brand] is the [frame] that [POD] because [RTB].' — a single sentence that fixes who, what, why, and proof.",
      },
      {
        q: "'Frame of reference' in positioning refers to:",
        options: [
          "The brand's logo style",
          "The product category the brand competes in",
          "The brand's founding year",
          "The brand's price tier",
        ],
        correctIndex: 1,
        explanation: "Frame of reference = the category the brand competes in (e.g. 'energy drink' for Red Bull). It's the 'what' in the positioning statement.",
      },
      {
        q: "A 'point-of-parity' (POP) is:",
        options: [
          "A unique feature only the brand has",
          "A category feature consumers expect from any brand in the category",
          "The brand's tagline",
          "A discount offer",
        ],
        correctIndex: 1,
        explanation: "A point-of-parity is a feature consumers expect from ANY brand in the category — you need them to be considered, but they don't differentiate.",
      },
      {
        q: "When entering a crowded D2C category, the SAFEST positioning play is usually:",
        options: [
          "Cheaper-than-leader (price play)",
          "Point-of-difference on a single unmet benefit",
          "Copy the leader's positioning exactly",
          "Rebrand every quarter",
        ],
        correctIndex: 1,
        explanation: "In a crowded category, a focused POD on a single unmet benefit is safer than a price war or copy-cat positioning.",
      },
    ],
    scenario: {
      brand: "Boldcare — Men's Grooming Launch",
      brief:
        "Boldcare is a new D2C men's grooming brand launching in India. The category is dominated by Beardo (lifestyle / rugged positioning), The Man Company (premium / essential oils), and Bombay Shaving Company (ritual / process). The brand has a single differentiation: it's the only one clinically formulated with a dermatologist co-founder.",
      asks: [
        "Write a positioning statement for Boldcare",
        "Identify the single most important point-of-difference vs Beardo",
      ],
    },
    solutionPrompt:
      "Write a 250–400 word positioning deliverable: the statement (1 sentence), frame of reference, POD, POP, and the RTB. Then articulate how this beats Beardo.",
    minWords: 250,
    maxWords: 400,
  },
  {
    id: 6,
    short: "W6",
    title: "Content Calendar + SEO Map",
    objective: "Build a 30-day content calendar mapped to SEO keyword clusters and funnel stages.",
    estimatedMinutes: 100,
    task: "For a D2C brand, build a 30-day content calendar with 12 pieces mapped to SEO keyword clusters and funnel stages (TOFU / MOFU / BOFU).",
    quiz: [
      {
        q: "A 'keyword cluster' in SEO content planning is:",
        options: [
          "A single high-volume keyword",
          "A group of related keywords sharing search intent that one page can rank for",
          "A list of branded keywords",
          "A list of competitor brand names",
        ],
        correctIndex: 1,
        explanation: "A keyword cluster groups related keywords sharing search intent that one well-built page can rank for — more efficient than one keyword per page.",
      },
      {
        q: "TOFU content is best measured by:",
        options: ["Direct purchases", "Reach + organic impressions + brand recall", "Conversion rate", "ROAS"],
        correctIndex: 1,
        explanation: "TOFU (top-of-funnel) content is measured by reach, impressions, and recall — not by direct conversion, which is a BOFU metric.",
      },
      {
        q: "The ideal publishing cadence for a brand-new D2C content engine is roughly:",
        options: ["1 piece per quarter", "2–3 pieces per week", "10 pieces per day", "1 piece per year"],
        correctIndex: 1,
        explanation: "2–3 pieces per week balances SEO velocity, quality, and team capacity for a new D2C content engine.",
      },
      {
        q: "When mapping SEO keywords to funnel stages, 'best [product] under ₹X' queries are:",
        options: ["TOFU (awareness)", "MOFU (consideration)", "BOFU (decision / purchase)", "Brand queries"],
        correctIndex: 2,
        explanation: "Queries like 'best [product] under ₹X' signal high purchase intent — these are BOFU (decision-stage) queries, not awareness.",
      },
    ],
    scenario: {
      brand: "Zunaro — D2C Skincare",
      brief:
        "Zunaro is a 1-year-old D2C skincare brand. They have ~12 SKUs across face care, body care, and hair care. Currently they get 100% of traffic from paid Meta + Google ads. The founder wants to build an organic content engine to reduce dependency on paid acquisition. Current monthly organic visits: 1,200. Target: 25,000 monthly organic visits in 6 months.",
      asks: [
        "Build a 30-day content calendar with 12 pieces mapped to SEO clusters and funnel stages",
        "Identify the single highest-leverage content piece for month 1",
      ],
    },
    solutionPrompt:
      "Write a 300–450 word content plan: 12 content pieces (title + funnel stage + primary keyword cluster), the cadence, and the single highest-leverage piece for month 1.",
    minWords: 300,
    maxWords: 450,
  },
  {
    id: 7,
    short: "W7",
    title: "Pricing Strategy & Tiers",
    objective: "Build a 3-tier pricing strategy (Good-Better-Best) with rationale anchored in customer willingness-to-pay.",
    estimatedMinutes: 90,
    task: "For a D2C brand launching a premium line, design 3 pricing tiers (Good / Better / Best) with anchor pricing, and justify the price points against willingness-to-pay research.",
    quiz: [
      {
        q: "The 'Good-Better-Best' 3-tier pricing model is designed to:",
        options: [
          "Force customers to buy the cheapest tier",
          "Use the middle tier as the anchor most customers pick",
          "Make the brand look premium",
          "Discourage any purchase",
        ],
        correctIndex: 1,
        explanation: "Good-Better-Best uses the middle 'Better' tier as the anchor — most customers pick the middle option, and the 'Best' tier nudges them to upgrade.",
      },
      {
        q: "An 'anchor price' in pricing strategy refers to:",
        options: [
          "The cheapest price in a tier set",
          "The first price the customer sees, which becomes their reference for 'fair' pricing",
          "The competitor's price",
          "The MSRP",
        ],
        correctIndex: 1,
        explanation: "An anchor price is the first price a customer sees — it becomes their reference point for 'fair', and all subsequent prices are judged against it.",
      },
      {
        q: "Van Westendorp's price sensitivity meter asks customers about:",
        options: [
          "Their household income",
          "At what price a product is too cheap, a bargain, getting expensive, and too expensive",
          "Their favourite brand",
          "Their purchase frequency",
        ],
        correctIndex: 1,
        explanation: "Van Westendorp asks customers about 4 price points: too cheap / bargain / expensive / too expensive — and the intersection reveals the acceptable price range.",
      },
      {
        q: "For a D2C brand launching a premium line, the SAFEST price gap between 'Better' and 'Best' tiers is roughly:",
        options: ["1.1x", "1.5–2x", "5x", "Identical"],
        correctIndex: 1,
        explanation: "A 1.5–2x gap between 'Better' and 'Best' makes the upgrade feel meaningful without feeling like a different product — the safest tiering gap.",
      },
    ],
    scenario: {
      brand: "Plum — Premium Clean Beauty Line",
      brief:
        "Plum is a clean-beauty D2C brand known for affordable pricing (face wash at ₹299, serum at ₹595). They want to launch a premium sub-brand 'Plum Luxe' targeting working women 26–32, positioned as 'clinical-grade clean beauty'. Their existing customers are 18–22 and price-sensitive.",
      asks: [
        "Design 3 pricing tiers (Good / Better / Best) for the Plum Luxe serum",
        "Recommend the launch price for the 'Better' tier with rationale",
      ],
    },
    solutionPrompt:
      "Write a 250–400 word pricing strategy: 3 tiers with prices, anchor rationale, Van Westendorp-style price logic, and the launch 'Better' price justification.",
    minWords: 250,
    maxWords: 400,
  },
  {
    id: 8,
    short: "W8",
    title: "Capstone — Integrated Marketing Strategy",
    objective: "Present a complete 8-week integrated marketing strategy for a chosen D2C brand.",
    estimatedMinutes: 180,
    task: "Pick a real D2C brand of your choice. Build an integrated marketing strategy covering: positioning, persona, GTM, performance ads, content + SEO, and pricing. Present as a 6–10 slide deck.",
    quiz: [
      {
        q: "An 'integrated marketing strategy' means:",
        options: [
          "Running only TV ads",
          "Coordinating messaging across all channels so they reinforce one promise",
          "Doing PR + social + paid in silos",
          "Only running SEO",
        ],
        correctIndex: 1,
        explanation: "Integrated marketing = coordinating messaging across all channels so they reinforce one promise — not running each channel in isolation.",
      },
      {
        q: "The 'marketing funnel' (TOFU → MOFU → BOFU) maps to which customer journey stages?",
        options: [
          "Awareness → Consideration → Decision",
          "Lead → MQL → SQL",
          "Impressions → CTR → CPM",
          "SEO → SEM → Display",
        ],
        correctIndex: 0,
        explanation: "TOFU (awareness) → MOFU (consideration) → BOFU (decision) — the classic funnel stages a customer moves through.",
      },
      {
        q: "A 'north-star metric' for a D2C brand is BEST chosen as:",
        options: [
          "Impressions",
          "Follower count",
          "A composite growth metric like 'net new paying customers with positive contribution margin'",
          "Ad spend",
        ],
        correctIndex: 2,
        explanation: "A north-star for D2C should be a composite growth metric (e.g. net new paying customers with positive contribution margin) — not a vanity metric like impressions or followers.",
      },
      {
        q: "When presenting a marketing strategy deck to a hiring panel, the FIRST slide should be:",
        options: [
          "Appendix",
          "The ask + the one number you want them to remember",
          "Pricing",
          "Personas",
        ],
        correctIndex: 1,
        explanation: "Open with the ask + the one number you want the audience to remember — anchor the conversation before diving into supporting detail.",
      },
    ],
    scenario: {
      brand: "Capstone — Choose Your Own",
      brief:
        "For your capstone, pick a real Indian D2C brand (e.g. Mamaearth, Boat, Wakefit, Plum, Sugar Cosmetics, Bombay Shaving Company, Loom Solar, Zunaro). Build an integrated marketing strategy that combines everything you've learned in weeks 1–7: positioning, persona, GTM, performance ads, content + SEO, and pricing.",
      asks: [
        "Pick the brand + the specific strategic question you're answering",
        "Present the strategy as a 6–10 slide deck (title, ask, positioning, persona, GTM, ads, content+SEO, pricing, metrics, appendix)",
      ],
    },
    solutionPrompt:
      "Write a 400–600 word capstone summary: chosen brand, strategic ask, positioning statement, persona 1-liner, GTM channel mix, ad structure 1-liner, content + SEO 1-liner, pricing tier, and your single north-star metric.",
    minWords: 400,
    maxWords: 600,
  },
]

export const PASS_THRESHOLD = 3 // out of 4 (75%)
