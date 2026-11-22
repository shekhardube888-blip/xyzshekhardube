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

// Helper for constructing Question objects concisely
function q(
  _id: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
): Question {
  return { q: question, options, correctIndex, explanation }
}

// ─── BBA Entrepreneurship track (8 weeks) ───

const BBA_ENTREPRENEUR_WEEKS: Week[] = [
  {
    id: 1, short: "W1", title: "Lean Canvas & Problem-Solution Fit",
    objective: "Build a Lean Canvas for your startup idea and validate problem-solution fit.",
    estimatedMinutes: 90,
    task: "Pick a problem you've personally experienced. Build a full Lean Canvas (9 blocks) for a startup idea that solves it. Identify your top 3 customer segments and the #1 trigger moment.",
    quiz: [
      q("q1", "The Lean Canvas has how many core blocks?", ["3", "5", "9", "12"], 2, "9 blocks: problem, solution, key metrics, UVP, unfair advantage, channels, customer segments, cost structure, revenue streams."),
      q("q2", "An MVP is BEST defined as:", ["The cheapest possible product", "The smallest product that validates problem-solution fit", "A product with no features", "A beta with all features"], 1, "MVP = smallest product that validates problem-solution fit with real customers."),
      q("q3", "'Problem-solution fit' means:", ["Your product solves the customer's problem in a way they'll pay for", "Your product looks polished", "You have a logo", "You filed a patent"], 0, "Problem-solution fit = your product actually solves the customer's problem."),
      q("q4", "When sizing a market, 'TAM' refers to:", ["Total Active Members", "Total Addressable Market", "Targeted Audience Mix", "Total Annual Margin"], 1, "TAM = Total Addressable Market."),
    ],
    scenario: {
      brand: "Student D2C Snack Brand",
      brief: "You're a BBA student who noticed college students in your hostel can't get healthy late-night snacks. The hostel canteen closes at 9 PM; food delivery apps charge ₹40+ delivery fees making a ₹80 snack cost ₹120+. You want to start a D2C healthy snack brand for hostel students.",
      asks: ["Build a Lean Canvas for this idea", "Identify the #1 trigger moment where a student would buy"],
    },
    solutionPrompt: "Write a 250-400 word Lean Canvas summary: the problem, your solution, UVP, top customer segment, the unfair advantage, and the #1 trigger moment.",
    minWords: 250, maxWords: 400,
  },
  {
    id: 2, short: "W2", title: "Customer Discovery & Interviews",
    objective: "Conduct structured customer discovery interviews to validate your assumptions.",
    estimatedMinutes: 90,
    task: "Design a customer interview script with 10 questions (open-ended, not leading). Interview 5 potential customers. Summarize the top 3 insights + what surprised you.",
    quiz: [
      q("q1", "The BEST customer discovery question format is:", ["Would you use this product?", "Tell me about the last time you had this problem."], 1, "Open-ended 'tell me about...' questions avoid leading the customer."),
      q("q2", "A 'leading question' in customer interviews is one that:", ["Is too long", "Suggests the answer you want to hear", "Has multiple parts", "Is about pricing"], 1, "Leading questions suggest the desired answer, biasing responses."),
      q("q3", "How many customer interviews should you do before drawing conclusions?", ["3", "5-10 minimum", "50+", "100+"], 1, "5-10 interviews surface the major patterns; 20+ for statistical confidence."),
      q("q4", "The 'Mom Test' principle says:", ["Ask your mom for feedback", "Ask about the customer's life and past behavior, not about your idea", "Always get parental approval", "Only interview family members"], 1, "The Mom Test: ask about past behavior, not hypothetical future use of your idea."),
    ],
    scenario: {
      brand: "Hostel Snack Brand — Customer Discovery",
      brief: "You've built your Lean Canvas. Now you need to validate whether hostel students actually want healthy late-night snacks. Your top assumption: 'Students will pay ₹50-70 for a healthy snack delivered to their hostel room after 9 PM.'",
      asks: ["Write a 10-question customer interview script", "Identify the top 3 assumptions you're testing"],
    },
    solutionPrompt: "Write a 250-400 word interview plan: the 10 questions, the 3 assumptions being tested, and how you'll know if each is validated.",
    minWords: 250, maxWords: 400,
  },
  {
    id: 3, short: "W3", title: "MVP Design & Prototyping",
    objective: "Design a minimum viable product that tests your core hypothesis.",
    estimatedMinutes: 100,
    task: "Design your MVP: what's the single core feature? What's the fastest way to test it? Build a wireframe or landing page mock. Define success metrics for the MVP test.",
    quiz: [
      q("q1", "The 'conceirge MVP' approach means:", ["Building a full app first", "Manually delivering the service to early customers before automating", "Using AI to build the product", "Outsourcing to a consultant"], 1, "Concierge MVP = manually deliver the service before building automation."),
      q("q2", "An MVP success metric should be:", ["Number of signups", "A metric that directly validates your core hypothesis", "App store rating", "Social media followers"], 1, "MVP metrics must directly test the core hypothesis, not vanity metrics."),
      q("q3", "When building an MVP, you should:", ["Build all features before launching", "Cut features ruthlessly — ship the single core feature", "Wait until it's perfect", "Hire a designer first"], 1, "Cut ruthlessly — ship the single core feature that tests the hypothesis."),
      q("q4", "A 'landing page MVP' tests:", ["Whether your app works", "Whether people are interested enough to give their email", "Your pricing model", "Your backend infrastructure"], 1, "Landing page MVP tests demand — are people interested enough to give their email?"),
    ],
    scenario: {
      brand: "Hostel Snack Brand — MVP Design",
      brief: "You validated that students want healthy late-night snacks. Now design the MVP. Your constraint: you have ₹5,000 budget and 2 weeks. You can't build a full app yet.",
      asks: ["Design the MVP (what's the single core feature?)", "Define the success metric + target threshold"],
    },
    solutionPrompt: "Write a 300-450 word MVP plan: the core feature, how you'll deliver it (concierge/landing page/etc.), success metric, target threshold, and budget breakdown.",
    minWords: 300, maxWords: 450,
  },
  {
    id: 4, short: "W4", title: "Pricing & Unit Economics",
    objective: "Set your pricing and calculate unit economics (CAC, LTV, contribution margin).",
    estimatedMinutes: 100,
    task: "Calculate your unit economics: cost per unit, contribution margin, estimated CAC, estimated LTV. Set your pricing using the Van Westendorp method.",
    quiz: [
      q("q1", "Contribution margin per unit is:", ["Revenue minus fixed cost", "Price minus variable cost per unit", "Total revenue divided by units", "Profit divided by revenue"], 1, "Contribution margin = price - variable cost per unit."),
      q("q2", "A healthy D2C CAC:LTV ratio target is roughly:", ["1:1", "1:3", "1:10", "10:1"], 1, "1:3 — for every ₹1 acquiring, recover ₹3 in lifetime gross profit."),
      q("q3", "Burn rate refers to:", ["How fast inventory sells", "The rate at which a startup spends cash per month", "Employee attrition", "Server costs"], 1, "Burn rate = monthly cash spend."),
      q("q4", "The Van Westendorp method asks customers about:", ["Their income", "4 price points: too cheap / bargain / expensive / too expensive", "Favourite brands", "Purchase frequency"], 1, "Van Westendorp asks 4 price sensitivity points."),
    ],
    scenario: {
      brand: "Hostel Snack Brand — Unit Economics",
      brief: "Your MVP (a WhatsApp-based ordering system) worked. Students order via WhatsApp, you deliver snacks to their room. Your cost per snack: ₹35 (ingredients + packaging). You're considering pricing at ₹60, ₹70, or ₹80 per snack. Your monthly WhatsApp marketing cost is ₹2,000. You get ~100 orders/month.",
      asks: ["Calculate contribution margin at each price point", "Recommend the final price with rationale"],
    },
    solutionPrompt: "Write a 300-450 word unit economics analysis: cost breakdown, contribution margin at each price, CAC estimate, LTV estimate, and recommended price.",
    minWords: 300, maxWords: 450,
  },
  {
    id: 5, short: "W5", title: "Go-to-Market Strategy",
    objective: "Design a GTM plan for your startup's first 100 customers.",
    estimatedMinutes: 100,
    task: "Build a 4-week GTM plan to acquire your first 100 customers. Cover: channel mix, weekly sequencing, budget, and the single most important metric to track.",
    quiz: [
      q("q1", "For acquiring your first 100 customers, the BEST channel is usually:", ["TV ads", "Direct sales / personal outreach", "SEO", "Billboard"], 1, "Direct sales / personal outreach — for the first 100, founders sell directly."),
      q("q2", "A 'phased' GTM launch means:", ["All channels in parallel", "Sequencing channels by funnel stage", "Region-by-region only", "A 12-month plan"], 1, "Phased GTM = sequence by funnel stage."),
      q("q3", "The 'do things that don't scale' principle means:", ["Build scalable infrastructure first", "Manually acquire early customers before automating", "Avoid growth", "Only use paid ads"], 1, "Paul Graham's principle: manually acquire early customers before automating."),
      q("q4", "For a hostel snack brand, the highest-leverage GTM channel is likely:", ["Google Ads", "WhatsApp groups + word-of-mouth", "TV", "Print flyers city-wide"], 1, "WhatsApp groups + word-of-mouth — the customers are already in WhatsApp groups."),
    ],
    scenario: {
      brand: "Hostel Snack Brand — First 100 Customers",
      brief: "You've validated demand and set pricing at ₹70/snack. Now you need your first 100 paying customers. Your constraints: ₹3,000 marketing budget, 4 weeks, you live in a hostel with 200 students across 4 blocks.",
      asks: ["Design a 4-week GTM plan", "Identify the single most important metric to track weekly"],
    },
    solutionPrompt: "Write a 300-450 word GTM plan: channel mix, 4-week sequencing, budget allocation, and the #1 weekly metric.",
    minWords: 300, maxWords: 450,
  },
  {
    id: 6, short: "W6", title: "Fundraising & Pitch Deck",
    objective: "Build a 10-slide pitch deck and practice your 3-minute pitch.",
    estimatedMinutes: 120,
    task: "Build a 10-slide pitch deck covering: problem, solution, market size, product, traction, business model, competition, team, financials, ask. Write your 3-minute pitch script.",
    quiz: [
      q("q1", "A pitch deck 'ask' slide should include:", ["Your personal salary", "How much you're raising + what you'll use it for", "Your favorite color", "Your resume"], 1, "Ask slide = how much + use of funds."),
      q("q2", "The 'traction' slide is MOST convincing when it shows:", ["Your idea", "Real numbers — revenue, users, growth rate", "A nice logo", "Market research"], 1, "Traction = real numbers (revenue, users, growth rate)."),
      q("q3", "A 'seed round' typically raises:", ["₹10L-₹2Cr", "₹50Cr+", "₹10", "₹100Cr"], 0, "Seed round: ₹10L-₹2Cr typically for Indian early-stage startups."),
      q("q4", "When pitching, the #1 mistake is:", ["Having too few slides", "Spending too long on the problem and not enough on traction/ask", "Using bullet points", "Having a dark background"], 1, "Spending too long on problem, not enough on traction/ask."),
    ],
    scenario: {
      brand: "Hostel Snack Brand — Pitch",
      brief: "You have 50 paying customers, ₹70/snack pricing, ₹35 contribution margin, and ₹3,500 monthly revenue. You want to raise ₹5L seed to expand to 3 more hostels. Build your pitch deck.",
      asks: ["Write the 10 slide titles + 1-line content each", "Write the 3-minute pitch script"],
    },
    solutionPrompt: "Write a 400-550 word pitch: 10 slide titles with 1-line content each, then a 3-minute pitch script.",
    minWords: 400, maxWords: 550,
  },
  {
    id: 7, short: "W7", title: "Operations & Scaling",
    objective: "Design your operations playbook for scaling from 100 to 1,000 customers.",
    estimatedMinutes: 100,
    task: "Build an operations playbook covering: supply chain, fulfillment process, quality control, customer support, and the #1 bottleneck to solve before scaling.",
    quiz: [
      q("q1", "When scaling from 100 to 1,000 customers, the #1 priority is:", ["More marketing", "Fixing the operations bottleneck", "Hiring a CEO", "Rebranding"], 1, "Fix operations bottlenecks first — scaling a broken process creates more problems."),
      q("q2", "A 'standard operating procedure' (SOP) is:", ["A legal document", "A documented step-by-step process for repeatable tasks", "A marketing strategy", "A financial model"], 1, "SOP = documented step-by-step process for repeatable tasks."),
      q("q3", "The 'batch size' in operations refers to:", ["How many customers you have", "How many units you produce/deliver in one cycle", "Your team size", "Your office size"], 1, "Batch size = units per production/delivery cycle."),
      q("q4", "For a hostel snack brand scaling to 3 hostels, the #1 bottleneck is likely:", ["Website design", "Last-mile delivery logistics", "Social media", "Legal structure"], 1, "Last-mile delivery logistics across multiple hostels."),
    ],
    scenario: {
      brand: "Hostel Snack Brand — Scale to 3 Hostels",
      brief: "You've proven the model in 1 hostel with 100 customers. Now you're expanding to 3 hostels (600 students total). Your current ops: you cook snacks in your hostel kitchen, deliver via WhatsApp orders, takes 30 min per delivery.",
      asks: ["Design the operations playbook for 3 hostels", "Identify the #1 bottleneck + how you'll solve it"],
    },
    solutionPrompt: "Write a 350-500 word ops playbook: supply chain, fulfillment process, quality control, customer support, and the #1 bottleneck + solution.",
    minWords: 350, maxWords: 500,
  },
  {
    id: 8, short: "W8", title: "Capstone — Full Startup Plan",
    objective: "Present a complete startup plan integrating all 7 weeks.",
    estimatedMinutes: 180,
    task: "Compile your full startup plan: Lean Canvas, customer insights, MVP results, unit economics, GTM plan, pitch deck summary, and operations playbook. Present as a 10-slide deck.",
    quiz: [
      q("q1", "An 'integrated startup plan' means:", ["Running only marketing", "Coordinating all aspects (problem, product, GTM, finance, ops) into one coherent strategy", "Doing PR + social in silos", "Only running SEO"], 1, "Integrated = all aspects coordinated into one coherent strategy."),
      q("q2", "The 'north-star metric' for a D2C startup should ideally be:", ["Impressions", "Net new paying customers with positive contribution margin", "Follower count", "Ad spend"], 1, "North-star = net new paying customers with positive contribution margin."),
      q("q3", "When presenting your startup plan to investors, the FIRST slide should be:", ["Appendix", "The problem + why now", "Pricing", "Team"], 1, "Open with the problem + why now — anchor the conversation."),
      q("q4", "The biggest risk for a hostel snack brand scaling to 3 hostels is:", ["Logo redesign", "Operations breaking under scale + quality degradation", "Having too many customers", "Office space"], 1, "Operations breaking under scale + quality degradation is the biggest risk."),
    ],
    scenario: {
      brand: "Capstone — Your Startup Plan",
      brief: "Compile everything from weeks 1-7 into a complete startup plan for your hostel snack brand. You're presenting to a seed investor who might invest ₹5L.",
      asks: ["Present the full plan as a 10-slide deck", "End with the ask: ₹5L for X% equity, use of funds, milestones"],
    },
    solutionPrompt: "Write a 500-650 word capstone: problem, solution, market, MVP traction, unit economics, GTM, pitch summary, ops plan, and the ask (₹5L for X% equity + milestones).",
    minWords: 500, maxWords: 650,
  },
]

// ─── BSc Data Science track (8 weeks) ───

const BSC_DS_WEEKS: Week[] = [
  {
    id: 1, short: "W1", title: "Python & Pandas Fundamentals",
    objective: "Master Python data structures + Pandas DataFrame operations for data cleaning.",
    estimatedMinutes: 120,
    task: "Load a CSV dataset into Pandas. Clean it: handle missing values, fix data types, remove duplicates. Produce a summary of the cleaned dataset (shape, dtypes, missing values before/after).",
    quiz: [
      q("q1", "In Pandas, the method to drop rows with missing values is:", [".drop_na()", ".dropna()", ".remove_na()", ".fillna(drop=True)"], 1, "DataFrame.dropna() drops rows/columns with NaN."),
      q("q2", "pd.DataFrame.groupby('col').mean() returns:", ["A single number", "A Series of mean values per group", "An error", "A list"], 1, "groupby().mean() returns mean per group."),
      q("q3", "To check the shape of a DataFrame, use:", ["df.size()", "df.shape", "df.dimensions", "len(df)"], 1, "df.shape returns (rows, cols) tuple."),
      q("q4", "The dtype 'object' in Pandas usually indicates:", ["Numeric data", "String/mixed-type data", "DateTime", "Boolean"], 1, "object dtype = string or mixed-type column."),
    ],
    scenario: {
      brand: "E-commerce Sales Dataset",
      brief: "You're given a messy e-commerce sales CSV with 10,000 rows. Columns: order_id, customer_email, product, quantity, price, order_date, city. Issues: 200 rows have missing prices, 50 duplicate order_ids, order_date is stored as string, some emails are malformed.",
      asks: ["Write the cleaning pipeline", "Report: how many valid rows remain after cleaning?"],
    },
    solutionPrompt: "Write a 300-450 word data cleaning report: issues found, steps taken, code snippets (Pandas), and final dataset summary.",
    minWords: 300, maxWords: 450,
  },
  {
    id: 2, short: "W2", title: "Exploratory Data Analysis (EDA)",
    objective: "Perform comprehensive EDA: distributions, correlations, outliers, and insights.",
    estimatedMinutes: 120,
    task: "Perform EDA on the cleaned dataset: plot distributions of key variables, compute correlations, identify outliers, and surface 3 business insights.",
    quiz: [
      q("q1", "A boxplot is BEST used for:", ["Showing trends over time", "Identifying outliers + distribution shape", "Showing correlations", "Counting categories"], 1, "Boxplots show outliers + distribution shape."),
      q("q2", "A correlation coefficient of -0.8 means:", ["No correlation", "Strong negative correlation", "Strong positive correlation", "Weak correlation"], 1, "-0.8 = strong negative correlation."),
      q("q3", "When doing EDA, you should ALWAYS:", ["Build a ML model first", "Visualize the data before modeling", "Skip to conclusions", "Delete all outliers"], 1, "Always visualize before modeling."),
      q("q4", "The 'describe()' method in Pandas returns:", ["A text description of the data", "Summary statistics (count, mean, std, min, max, quartiles)", "The data types", "The first 5 rows"], 1, "describe() returns summary statistics."),
    ],
    scenario: {
      brand: "E-commerce EDA",
      brief: "Your cleaned dataset has 9,750 valid rows. You need to understand: which products sell most, which cities have highest revenue, is there a seasonal pattern, and are there outlier orders (very high quantity or price).",
      asks: ["Perform EDA + generate 4 key visualizations", "Surface 3 business insights for the e-commerce team"],
    },
    solutionPrompt: "Write a 350-500 word EDA report: 4 visualizations described, 3 insights with supporting numbers, and 1 recommendation.",
    minWords: 350, maxWords: 500,
  },
  {
    id: 3, short: "W3", title: "Feature Engineering",
    objective: "Engineer features that improve model performance for a classification task.",
    estimatedMinutes: 120,
    task: "Engineer 5 new features from the e-commerce dataset (e.g., day_of_week, is_weekend, price_per_unit, customer_lifetime_value, order_frequency). Explain why each feature might be predictive.",
    quiz: [
      q("q1", "One-hot encoding is used to:", ["Normalize numeric features", "Convert categorical variables into binary columns", "Drop missing values", "Train a model"], 1, "One-hot encoding converts categories to binary columns."),
      q("q2", "Feature scaling (StandardScaler) is important for:", ["Tree-based models", "Distance-based models (k-NN, SVM, regularized regression)", "Computing accuracy", "Plotting"], 1, "Distance/regularization-based models need scaled features."),
      q("q3", "A 'derived feature' is:", ["A feature from the original dataset", "A feature computed from existing data (e.g., day_of_week from date)", "A feature selected by the model", "A feature dropped during cleaning"], 1, "Derived features are computed from existing data."),
      q("q4", "When engineering features, the biggest risk is:", ["Having too few features", "Data leakage — using target information in features", "Using too many libraries", "Having too much data"], 1, "Data leakage = using target info in features → inflated model performance."),
    ],
    scenario: {
      brand: "Churn Prediction Feature Engineering",
      brief: "The e-commerce company wants to predict which customers will churn (stop buying) in the next 30 days. You have: order history, customer email, city, order dates, product categories, prices. Engineer features that predict churn.",
      asks: ["Engineer 5 churn-predictive features", "Explain why each feature might predict churn"],
    },
    solutionPrompt: "Write a 300-450 word feature engineering plan: 5 features (name, formula/computation, why it predicts churn), and the data type of each.",
    minWords: 300, maxWords: 450,
  },
  {
    id: 4, short: "W4", title: "Model Building with scikit-learn",
    objective: "Build, train, and evaluate a classification model using scikit-learn.",
    estimatedMinutes: 150,
    task: "Build a logistic regression + a random forest model for churn prediction. Compare their performance (accuracy, precision, recall, F1). Use 5-fold cross-validation.",
    quiz: [
      q("q1", "Train/test split in scikit-learn is done via:", ["sklearn.split(X, y)", "sklearn.model_selection.train_test_split(X, y)", "sklearn.split_data(X, y)", "pandas.train_test_split(X, y)"], 1, "sklearn.model_selection.train_test_split()."),
      q("q2", "For an imbalanced classification problem, the BEST metric is:", ["Accuracy", "F1 score", "Mean Absolute Error", "R²"], 1, "F1 score handles imbalance better than accuracy."),
      q("q3", "5-fold cross-validation means:", ["5 train + 5 test sets", "Split into 5 folds, train on 4 + test on 1, rotate", "50/50 split 5 times", "5 random samples"], 1, "5-fold CV: 5 folds, rotate test fold."),
      q("q4", "Random Forest typically outperforms Logistic Regression when:", ["Data is linearly separable", "Data has complex non-linear patterns + feature interactions", "Sample size is very small", "There's no missing data"], 1, "Random Forest handles non-linear patterns + interactions."),
    ],
    scenario: {
      brand: "Churn Prediction Model",
      brief: "Using your engineered features, build a churn prediction model. The dataset has 9,750 rows with 15% churn rate (imbalanced). The business wants to identify at-risk customers so they can send retention offers.",
      asks: ["Compare Logistic Regression vs Random Forest", "Recommend the final model + the threshold for sending retention offers"],
    },
    solutionPrompt: "Write a 400-550 word model report: data split, features used, both models' metrics (accuracy, precision, recall, F1), cross-validation results, and the recommended model + threshold.",
    minWords: 400, maxWords: 550,
  },
  {
    id: 5, short: "W5", title: "Model Evaluation & Tuning",
    objective: "Evaluate model performance comprehensively and tune hyperparameters.",
    estimatedMinutes: 150,
    task: "Generate a confusion matrix, ROC curve, and precision-recall curve for your model. Tune hyperparameters using GridSearchCV. Report the best model + its improved metrics.",
    quiz: [
      q("q1", "A confusion matrix shows:", ["Model accuracy only", "True positives, false positives, true negatives, false negatives", "Feature importance", "Training time"], 1, "Confusion matrix: TP, FP, TN, FN."),
      q("q2", "The ROC curve plots:", ["Precision vs Recall", "True Positive Rate vs False Positive Rate", "Accuracy vs Threshold", "F1 vs Threshold"], 1, "ROC: TPR vs FPR at different thresholds."),
      q("q3", "GridSearchCV is used for:", ["Splitting data", "Hyperparameter tuning — tries all combinations", "Feature selection", "Cross-validation only"], 1, "GridSearchCV tries all hyperparameter combinations."),
      q("q4", "If your model has high precision but low recall, it means:", ["It catches most positives but with many false alarms", "It's conservative — few false alarms but misses many actual positives", "The model is perfect", "The model is broken"], 1, "High precision + low recall = conservative — misses actual positives."),
    ],
    scenario: {
      brand: "Churn Model — Evaluation & Tuning",
      brief: "Your Random Forest model has 85% accuracy but only 40% recall for churners. The business says: 'We'd rather send retention offers to some non-churners (false positives) than miss actual churners.' Tune the model to improve recall while keeping precision above 50%.",
      asks: ["Tune the model + threshold to achieve recall ≥ 70% with precision ≥ 50%", "Show the confusion matrix before + after tuning"],
    },
    solutionPrompt: "Write a 400-550 word evaluation report: confusion matrix (before/after), ROC curve description, tuning approach, final metrics, and the business recommendation for the retention offer threshold.",
    minWords: 400, maxWords: 550,
  },
  {
    id: 6, short: "W6", title: "Time Series Forecasting",
    objective: "Build a time series forecast for monthly revenue.",
    estimatedMinutes: 150,
    task: "Build a monthly revenue forecast for the next 3 months using the e-commerce order history. Compare a simple moving average vs an exponential smoothing model. Report confidence intervals.",
    quiz: [
      q("q1", "Time series data must be checked for:", ["Missing values only", "Stationarity — constant mean and variance over time", "Data types", "Correlation"], 1, "Check stationarity — many models require it."),
      q("q2", "The ADF (Augmented Dickey-Fuller) test checks:", ["Model accuracy", "Whether a time series is stationary", "Feature importance", "Correlation between two series"], 1, "ADF test: H0 = series is non-stationary. p < 0.05 → stationary."),
      q("q3", "Exponential smoothing gives more weight to:", ["The oldest observations", "Recent observations", "All observations equally", "The middle observations"], 1, "Exponential smoothing weights recent observations more."),
      q("q4", "A 95% confidence interval for a forecast means:", ["95% of the data is in the interval", "Across many repeated samples, 95% of such intervals contain the true value", "The forecast is 95% accurate", "95% of predictions will be correct"], 1, "Frequentist CI: 95% of repeated intervals contain the true value."),
    ],
    scenario: {
      brand: "Revenue Forecast",
      brief: "The e-commerce company has 12 months of monthly revenue data. They want a 3-month forecast to plan inventory + marketing spend. Revenue has been growing 5-8% month-over-month with a seasonal dip in February.",
      asks: ["Build the 3-month forecast with confidence intervals", "Recommend inventory + marketing implications"],
    },
    solutionPrompt: "Write a 400-550 word forecast report: model choice, forecast values + CIs for 3 months, seasonal pattern observed, and 2 business recommendations.",
    minWords: 400, maxWords: 550,
  },
  {
    id: 7, short: "W7", title: "Dashboard & Deployment",
    objective: "Build a Streamlit dashboard that displays your model + insights.",
    estimatedMinutes: 120,
    task: "Build a Streamlit dashboard with: EDA visualizations, model performance metrics, churn predictions for new customers, and a revenue forecast chart. Deploy to Streamlit Cloud.",
    quiz: [
      q("q1", "A Streamlit app is run via:", ["python app.py", "streamlit run app.py", "npm run streamlit", "streamlit serve app"], 1, "streamlit run app.py."),
      q("q2", "In Streamlit, to display a DataFrame, use:", ["print(df)", "st.dataframe(df)", "st.show(df)", "console.log(df)"], 1, "st.dataframe(df) renders an interactive table."),
      q("q3", "To create a sidebar in Streamlit, use:", ["st.sidebar.write()", "st.menu()", "st.navigation()", "st.aside()"], 0, "st.sidebar.write() or st.sidebar.selectbox() etc."),
      q("q4", "When deploying a model to production, the BIGGEST risk is:", ["Using the wrong color scheme", "Training-serving skew — features differ between training + production", "Having too many users", "The dashboard being too fast"], 1, "Training-serving skew = production features differ from training."),
    ],
    scenario: {
      brand: "Dashboard Deployment",
      brief: "The e-commerce team wants a dashboard where they can: see churn predictions for any customer, view monthly revenue forecast, and explore EDA insights. They're non-technical and need it deployed online.",
      asks: ["Design the dashboard layout (4 sections)", "Write the deployment plan"],
    },
    solutionPrompt: "Write a 350-500 word dashboard plan: layout (4 sections), Streamlit code snippets, deployment steps, and how to handle new customer predictions.",
    minWords: 350, maxWords: 500,
  },
  {
    id: 8, short: "W8", title: "Capstone — Full ML Pipeline",
    objective: "Present a complete end-to-end ML pipeline from data to deployment.",
    estimatedMinutes: 180,
    task: "Compile your full ML pipeline: data cleaning → EDA → feature engineering → model building → evaluation → tuning → forecasting → dashboard. Present as a 10-slide technical presentation.",
    quiz: [
      q("q1", "An end-to-end ML pipeline includes:", ["Only the model", "Data ingestion → cleaning → features → model → evaluation → deployment", "Only data cleaning", "Only the dashboard"], 1, "End-to-end: data → features → model → evaluation → deployment."),
      q("q2", "The 'north-star metric' for an ML churn prediction project should be:", ["Model accuracy", "Reduction in actual churn rate after deploying retention offers", "F1 score", "Number of features"], 1, "North-star = business impact (reduced churn), not model metrics."),
      q("q3", "When presenting an ML project to stakeholders, you should:", ["Show all the math", "Lead with business impact, then model performance, then technical details", "Skip the results", "Only show code"], 1, "Lead with business impact → model performance → technical details."),
      q("q4", "The BIGGEST ethical risk in churn prediction is:", ["Using too many features", "Bias in the data leading to unfair retention offers (e.g., offering discounts only to high-value customers)", "Using Python", "Having too much data"], 1, "Bias → unfair offers (only high-value customers get retention)."),
    ],
    scenario: {
      brand: "Capstone — Full ML Pipeline",
      brief: "Present your complete ML pipeline to the e-commerce leadership team. They want to understand: what data you used, what model you built, how accurate it is, what business impact it will have, and how you deployed it.",
      asks: ["Present the full pipeline as 10 slides", "End with the expected business impact (churn reduction + revenue saved)"],
    },
    solutionPrompt: "Write a 500-650 word capstone: data, EDA insights, features, model + metrics, tuning results, forecast, dashboard, deployment, and expected business impact.",
    minWords: 500, maxWords: 650,
  },
]

// ─── Category → weeks mapping ───

export function getWeeksForCategory(category: string, subcategory?: string): Week[] {
  const cat = (category || "").toLowerCase()
  const sub = (subcategory || "").toLowerCase()
  if (cat.includes("mba") || cat.includes("management")) return WEEKS
  if (cat.includes("bba")) {
    if (sub.includes("entrepreneur")) return BBA_ENTREPRENEUR_WEEKS
    // BBA Digital Marketing, BBA HR, etc. — use entrepreneur for now
    return BBA_ENTREPRENEUR_WEEKS
  }
  if (cat.includes("computer science") || cat.includes("data science")) return BSC_DS_WEEKS
  if (cat.includes("biotech")) return BSC_DS_WEEKS // closest available
  if (cat.includes("statistic")) return BSC_DS_WEEKS // closest available
  return WEEKS // default to MBA Marketing
}
