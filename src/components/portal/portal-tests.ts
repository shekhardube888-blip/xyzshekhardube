// Test paper catalog for AgilePortal Enterprise.
// 6 papers across MBA / BBA / BSc tracks. Each paper: 10 MCQs, 15-min timer,
// 30 marks total (3 per Q), 70% pass threshold.

export type Question = {
  id: string
  type: "mcq"
  q: string
  options: string[]
  correctIndex: number
  explanation: string
  marks: number
}

export type TestPaper = {
  id: string
  title: string
  subject: string
  track: "MBA" | "BBA" | "BSc"
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  durationMinutes: number
  totalMarks: number
  passThreshold: number // percentage (0-100)
  description: string
  topics: string[]
  questions: Question[]
}

export const PASS_THRESHOLD_PCT = 70

const q = (
  id: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  marks = 3,
): Question => ({ id, type: "mcq", q: question, options, correctIndex, explanation, marks })

export const TEST_PAPERS: TestPaper[] = [
  // ---------- MBA Marketing ----------
  {
    id: "tp-mba-brand",
    title: "Brand Audit Essentials",
    subject: "MBA · Marketing",
    track: "MBA",
    difficulty: "Intermediate",
    durationMinutes: 15,
    totalMarks: 30,
    passThreshold: PASS_THRESHOLD_PCT,
    description:
      "Test your grasp of brand audit frameworks, RTBs, POD/POP, and review-theme clustering — the foundations of week 1-2 of the MBA Marketing internship.",
    topics: ["4P Mix", "Brand Equity", "POD vs POP", "Reason to Believe", "Sentiment Analysis"],
    questions: [
      q("q1", "The 4P marketing mix decomposes a brand audit into:", [
        "Product, Price, Place, Promotion",
        "Plan, Pitch, Present, Persist",
        "People, Process, Platform, Profit",
        "Positioning, Packaging, Placement, Pricing",
      ], 0, "4P = Product, Price, Place, Promotion — the classic McCarthy decomposition for brand audits."),
      q("q2", "A 'reason to believe' (RTB) in positioning refers to:", [
        "The brand's revenue tier",
        "The functional or emotional proof backing the brand's promise",
        "A customer testimonial quote",
        "The brand's legal entity name",
      ], 1, "An RTB is the proof (functional or emotional) that justifies the brand's promise to the consumer."),
      q("q3", "A 'point-of-parity' (POP) is best described as:", [
        "A unique feature only the brand has",
        "A category feature consumers expect from any brand in the category",
        "The brand's tagline",
        "A seasonal discount",
      ], 1, "POP = features consumers expect from ANY brand in the category. Needed to be considered, but doesn't differentiate."),
      q("q4", "When auditing D2C customer reviews, the most actionable signal is:", [
        "Aggregate star rating",
        "Recurrence of complaint themes (delivery, packaging) across reviews",
        "Total review count",
        "Length of individual reviews",
      ], 1, "Recurring complaint themes reveal systemic experience gaps — far more actionable than aggregate stars or review length."),
      q("q5", "The cleanest 2x2 for benchmarking competitor positioning is:", [
        "Revenue vs profit",
        "Price-vs-premium perception",
        "Followers vs engagement",
        "Warehouse footprint vs SKU count",
      ], 1, "A price-vs-premium perception 2x2 plots how the market perceives each brand relative to others — the cleanest positioning comparison."),
      q("q6", "Brand equity (Aaker model) includes all EXCEPT:", [
        "Brand loyalty",
        "Perceived quality",
        "Brand associations",
        "Daily active users",
      ], 3, "Aaker's brand equity model: loyalty, perceived quality, associations, awareness — DAU is a product metric, not a brand equity pillar."),
      q("q7", "When a D2C brand's retention drops from 78% to 61%, the FIRST diagnostic action is:", [
        "Run a 50% discount campaign",
        "Cluster churned-customer reviews by complaint theme",
        "Rebrand completely",
        "Cut the marketing budget",
      ], 1, "Cluster churned-customer reviews by complaint theme — surfaces the systemic cause before tactical fixes."),
      q("q8", "A 'category frame of reference' in positioning refers to:", [
        "The brand's logo style",
        "The product category the brand competes in",
        "The founding year",
        "The price tier",
      ], 1, "Frame of reference = the category the brand competes in (e.g. 'energy drink' for Red Bull). The 'what' in positioning."),
      q("q9", "When entering a crowded D2C category, the SAFEST positioning play is usually:", [
        "Cheaper-than-leader (price war)",
        "Point-of-difference on a single unmet benefit",
        "Copy the leader exactly",
        "Rebrand every quarter",
      ], 1, "A focused POD on a single unmet benefit is safer than a price war or copy-cat positioning in a crowded category."),
      q("q10", "Sentiment analysis of brand mentions is MOST useful for tracking:", [
        "Quarterly revenue",
        "Brand perception shifts over time",
        "Inventory levels",
        "Employee attrition",
      ], 1, "Sentiment analysis tracks how brand perception shifts over time — useful for brand-audit before/after comparisons."),
    ],
  },
  {
    id: "tp-mba-gtm",
    title: "GTM & Performance Marketing",
    subject: "MBA · Marketing",
    track: "MBA",
    difficulty: "Intermediate",
    durationMinutes: 15,
    totalMarks: 30,
    passThreshold: PASS_THRESHOLD_PCT,
    description:
      "Covers go-to-market strategy, channel sequencing, Meta Ads structure, CAC:LTV ratios, and the CAPI — weeks 3-4 of the MBA Marketing internship.",
    topics: ["GTM", "Channel Sequencing", "Meta Ads", "CAC:LTV", "CAPI"],
    questions: [
      q("q1", "For a zero-awareness new D2C category, the BEST channel to lead GTM with is:", [
        "Branded search ads",
        "Performance marketing (Meta + Google)",
        "Influencer + content seeding",
        "Affiliate",
      ], 2, "For zero-awareness categories, influencer + content seeding builds the demand pool before performance marketing can harvest it."),
      q("q2", "A 'phased' GTM launch means:", [
        "All channels in parallel from day 1",
        "Sequencing channels by funnel stage (demand-gen → capture → retain)",
        "Region-by-region with no channel change",
        "A 12-month launch plan",
      ], 1, "Phased GTM sequences channels by funnel stage — demand-gen first, capture second, retention third."),
      q("q3", "A healthy D2C CAC:LTV ratio target is roughly:", [
        "1:1",
        "1:3",
        "1:10",
        "10:1",
      ], 1, "Healthy D2C CAC:LTV = ~1:3 — for every ₹1 acquiring, the brand recovers ₹3 in lifetime gross profit."),
      q("q4", "On Meta Ads, an 'ad set' is structured around:", [
        "Creative assets",
        "Audience + placement + budget + schedule",
        "Campaign objective",
        "Pixel events",
      ], 1, "An ad set holds audience + placement + budget + schedule at its level — creatives sit below it."),
      q("q5", "For A/B testing creative variants on Meta, the recommended variants per ad set is roughly:", [
        "1",
        "3-4",
        "10+",
        "25",
      ], 1, "~3-4 distinct creative variants per ad set lets Meta optimise meaningfully — too few starves it, too many fragment spend."),
      q("q6", "The Meta Conversions API (CAPI) is used to:", [
        "Send server-side conversion events back to Meta",
        "A/B test ad copy",
        "Refund ad spend",
        "Auto-generate creatives",
      ], 0, "CAPI sends conversion events server-side — useful for in-store / app / offline purchases the pixel can't see."),
      q("q7", "In week 1 of a new-region D2C GTM, the SAFEST channel split is:", [
        "100% paid Meta ads",
        "70% influencer + content, 30% paid performance",
        "100% SEO",
        "100% affiliate",
      ], 1, "70/30 favouring influencer + content builds regional awareness while paid captures early signal — safer than all-paid or all-organic in week 1."),
      q("q8", "The campaign objective 'Reach' on Meta is BEST used for:", [
        "Driving direct purchases",
        "Building impressions to a wide audience for a new product launch",
        "Retargeting past visitors",
        "Reducing cost per click",
      ], 1, "Reach builds impressions to a wide audience — ideal for zero-awareness launches before performance harvesting."),
      q("q9", "Van Westendorp pricing method asks customers about:", [
        "Their household income",
        "Prices that are too cheap / bargain / expensive / too expensive",
        "Favourite brands",
        "Purchase frequency",
      ], 1, "Van Westendorp asks 4 price points: too cheap / bargain / expensive / too expensive — intersection reveals acceptable range."),
      q("q10", "A 'north-star metric' for a D2C brand should ideally be:", [
        "Impressions",
        "Follower count",
        "Net new paying customers with positive contribution margin",
        "Ad spend",
      ], 2, "A D2C north-star should be a composite growth metric (net new paying customers with positive contribution margin) — not vanity metrics."),
    ],
  },
  // ---------- BBA ----------
  {
    id: "tp-bba-entrepreneurship",
    title: "Entrepreneurship & Lean Canvas",
    subject: "BBA · Entrepreneurship",
    track: "BBA",
    difficulty: "Beginner",
    durationMinutes: 15,
    totalMarks: 30,
    passThreshold: PASS_THRESHOLD_PCT,
    description:
      "Tests lean canvas, problem-solution fit, MVP, customer segments, and unit economics — the fundamentals every BBA founder-track student should know.",
    topics: ["Lean Canvas", "MVP", "Customer Segments", "Unit Economics", "Problem-Solution Fit"],
    questions: [
      q("q1", "The Lean Canvas has how many core blocks?", [
        "3",
        "5",
        "9",
        "12",
      ], 2, "Lean Canvas (Ash Maurya) has 9 blocks: problem, solution, key metrics, unique value prop, unfair advantage, channels, customer segments, cost structure, revenue streams."),
      q("q2", "An MVP (Minimum Viable Product) is BEST defined as:", [
        "The cheapest possible product",
        "The smallest product that lets you learn whether the problem-solution fit works",
        "A product with no features",
        "A beta with all planned features",
      ], 1, "An MVP is the smallest product that validates problem-solution fit with real customers — not the cheapest, not the most feature-rich."),
      q("q3", "'Problem-solution fit' means:", [
        "Your product solves the customer's problem in a way they'll pay for",
        "Your product looks polished",
        "You have a logo",
        "You filed a patent",
      ], 0, "Problem-solution fit = your product actually solves the customer's problem in a way they'll pay for. Pre-product-market fit."),
      q("q4", "'Customer segments' in Lean Canvas refers to:", [
        "The brand's color palette",
        "The distinct groups of people the business aims to serve",
        "Investor categories",
        "Geographic regions only",
      ], 1, "Customer segments = distinct groups the business serves — each with different needs, channels, and willingness to pay."),
      q("q5", "Contribution margin per unit is calculated as:", [
        "Revenue per unit minus variable cost per unit",
        "Revenue per unit minus fixed cost",
        "Total revenue divided by units sold",
        "Total profit divided by total cost",
      ], 0, "Contribution margin per unit = price minus variable cost per unit — the contribution each sale makes toward fixed costs and profit."),
      q("q6", "The 'unfair advantage' block in Lean Canvas refers to:", [
        "A large marketing budget",
        "Something competitors cannot easily copy or buy",
        "Having more employees",
        "A catchy brand name",
      ], 1, "Unfair advantage = something competitors cannot easily copy or buy (network effect, exclusive data, IP, founder expertise)."),
      q("q7", "A 'pivot' in startup language means:", [
        "Closing the company",
        "A structured change in strategy based on validated learning",
        "Hiring a new CEO",
        "Rebranding",
      ], 1, "A pivot = a structured change in strategy (customer segment, value prop, channel) based on validated learning — not random rebranding."),
      q("q8", "When sizing a market, 'TAM' refers to:", [
        "Total Active Members",
        "Total Addressable Market",
        "Targeted Audience Mix",
        "Total Annual Margin",
      ], 1, "TAM = Total Addressable Market — the total revenue opportunity if 100% market share were achieved."),
      q("q9", "The LEAST useful signal for validating a BBA student's startup idea is:", [
        "100 signup emails from a landing page test",
        "5 paying pilot customers",
        "A friend saying 'I'd totally use that'",
        "A 30% open rate on a cold outreach email",
      ], 2, "A friend's verbal encouragement is the least useful signal — vanity. Real validation = signups, paying customers, or engagement metrics."),
      q("q10", "Burn rate refers to:", [
        "How fast inventory sells",
        "The rate at which a startup spends cash per month",
        "Employee attrition rate",
        "Server costs",
      ], 1, "Burn rate = the rate at which a startup spends cash per month — divided by runway, tells you how many months until cash-out."),
    ],
  },
  {
    id: "tp-bba-digital",
    title: "Digital Marketing Fundamentals",
    subject: "BBA · Digital Marketing",
    track: "BBA",
    difficulty: "Beginner",
    durationMinutes: 15,
    totalMarks: 30,
    passThreshold: PASS_THRESHOLD_PCT,
    description:
      "Covers SEO vs SEM, funnel stages, Meta Ads basics, content cadence, and email automation — the BBA Digital Marketing internship essentials.",
    topics: ["SEO vs SEM", "Funnel Stages", "Meta Ads", "Content Cadence", "Email Automation"],
    questions: [
      q("q1", "SEO differs from SEM in that SEO is:", [
        "Always free",
        "Optimisation for organic search results (unpaid), while SEM is paid search ads",
        "Optimisation for social media",
        "Optimisation for email",
      ], 1, "SEO = organic search optimisation (unpaid rankings). SEM = search engine marketing (paid ads like Google Ads)."),
      q("q2", "TOFU content is BEST measured by:", [
        "Direct purchases",
        "Reach + organic impressions + brand recall",
        "Conversion rate",
        "ROAS",
      ], 1, "TOFU (top-of-funnel) is measured by reach, impressions, recall — not direct conversion (which is BOFU)."),
      q("q3", "A 'keyword cluster' in SEO refers to:", [
        "A single high-volume keyword",
        "A group of related keywords sharing search intent that one page can rank for",
        "A list of branded keywords",
        "A list of competitor brand names",
      ], 1, "A keyword cluster = related keywords sharing intent that one well-built page can rank for — more efficient than 1 keyword per page."),
      q("q4", "An ideal publishing cadence for a new D2C content engine is roughly:", [
        "1 piece per quarter",
        "2-3 pieces per week",
        "10 pieces per day",
        "1 piece per year",
      ], 1, "2-3 pieces per week balances SEO velocity, quality, and team capacity for a new D2C content engine."),
      q("q5", "A 'drip email campaign' refers to:", [
        "Sending 1 email per year",
        "A sequence of pre-scheduled emails triggered by a user action",
        "Spam",
        "Internal team updates",
      ], 1, "A drip campaign = a sequence of pre-scheduled emails triggered by a user action (signup, cart abandon, etc.) — automated nurture."),
      q("q6", "CTR (Click-Through Rate) is calculated as:", [
        "Impressions divided by clicks",
        "Clicks divided by impressions, times 100",
        "Total cost divided by clicks",
        "Conversions divided by clicks",
      ], 1, "CTR = (clicks / impressions) × 100 — the % of impressions that resulted in a click."),
      q("q7", "ROAS (Return on Ad Spend) of 4x means:", [
        "The campaign lost money",
        "₹4 in revenue for every ₹1 spent on ads",
        "4% click rate",
        "4x more impressions",
      ], 1, "ROAS 4x = ₹4 revenue for every ₹1 ad spend. ROAS = revenue / ad spend."),
      q("q8", "On Meta Ads, the BEST objective for retargeting past website visitors is:", [
        "Reach",
        "Sales (Conversions)",
        "Video Views",
        "Brand Awareness",
      ], 1, "For retargeting (high-intent audience), Sales/Conversions objective harvests the existing demand — not Reach (which is for cold audiences)."),
      q("q9", "A 'BOFU' content piece for a skincare D2C brand would be:", [
        "'Why skincare matters' blog post",
        "'Best vitamin C serum under ₹500' comparison page",
        "A founder interview",
        "An industry trend report",
      ], 1, "BOFU = decision-stage. 'Best serum under ₹500' has high purchase intent — BOFU. The others are TOFU/MOFU."),
      q("q10", "GA4 (Google Analytics 4) primarily tracks:", [
        "Only e-commerce purchases",
        "Events across web + app in a unified property",
        "Ad spend",
        "SEO rankings",
      ], 1, "GA4 = event-based tracking across web + app in a unified property — a shift from UA's session-based model."),
    ],
  },
  // ---------- BSc ----------
  {
    id: "tp-bsc-ds",
    title: "Data Science with Python",
    subject: "BSc · Computer Science",
    track: "BSc",
    difficulty: "Intermediate",
    durationMinutes: 15,
    totalMarks: 30,
    passThreshold: PASS_THRESHOLD_PCT,
    description:
      "Tests Pandas, NumPy, scikit-learn basics, train/test split, evaluation metrics, and Streamlit — core skills for the BSc Data Science internship.",
    topics: ["Pandas", "NumPy", "scikit-learn", "Train/Test Split", "Evaluation", "Streamlit"],
    questions: [
      q("q1", "In Pandas, the method to drop rows with missing values is:", [
        ".drop_na()",
        ".dropna()",
        ".remove_na()",
        ".fillna(drop=True)",
      ], 1, "DataFrame.dropna() drops rows (or columns) with NaN values. The companion .fillna() fills them."),
      q("q2", "Train/test split in scikit-learn is done via:", [
        "sklearn.split(X, y)",
        "sklearn.model_selection.train_test_split(X, y)",
        "sklearn.split_data(X, y)",
        "pandas.train_test_split(X, y)",
      ], 1, "sklearn.model_selection.train_test_split(X, y, test_size=0.2, random_state=42) — the canonical split."),
      q("q3", "Which metric is BEST for an imbalanced classification problem?", [
        "Accuracy",
        "F1 score",
        "Mean Absolute Error",
        "R²",
      ], 1, "F1 = harmonic mean of precision + recall — better than accuracy for imbalanced classes (where accuracy can be misleading)."),
      q("q4", "One-hot encoding is used to:", [
        "Normalise numeric features",
        "Convert categorical variables into binary columns",
        "Drop missing values",
        "Train a model",
      ], 1, "One-hot encoding converts a categorical column into N binary columns (one per category) — required for most ML models."),
      q("q5", "In scikit-learn, the standard pipeline order is:", [
        "Train → Evaluate → Split",
        "Split → Preprocess → Train → Evaluate",
        "Preprocess → Split → Evaluate → Train",
        "Evaluate → Train → Split",
      ], 1, "Standard ML pipeline: Split first → Preprocess (fit on train only) → Train → Evaluate on held-out test."),
      q("q6", "pd.DataFrame.groupby('col').mean() returns:", [
        "A single number",
        "A Series of mean values per group",
        "An error",
        "A list",
      ], 1, "groupby('col').mean() returns a Series (or DataFrame) of mean values per unique value in 'col'."),
      q("q7", "R² (R-squared) in regression measures:", [
        "Error magnitude",
        "The proportion of variance in the target explained by the model",
        "Number of features",
        "Training time",
      ], 1, "R² = proportion of variance in y explained by the model. Range 0-1 (can be negative if model worse than mean)."),
      q("q8", "Standardising features (StandardScaler) is important for:", [
        "Tree-based models",
        "Distance-based models (k-NN, SVM, logistic regression with regularization)",
        "Computing accuracy",
        "Plotting",
      ], 1, "Distance/regularisation-based models need standardised features (mean 0, std 1) — tree models don't."),
      q("q9", "A Streamlit app is run via the command:", [
        "python app.py",
        "streamlit run app.py",
        "npm run streamlit",
        "streamlit serve app",
      ], 1, "streamlit run app.py — the canonical Streamlit launch command."),
      q("q10", "Cross-validation with k=5 splits the data into:", [
        "5 equal folds, trains on 4 and tests on 1, rotating",
        "5 train and 5 test sets",
        "A 50/50 split repeated 5 times",
        "5 random samples",
      ], 0, "5-fold CV: split into 5 folds, train on 4 + test on 1, rotate so each fold is the test fold once. Robust evaluation."),
    ],
  },
  {
    id: "tp-bsc-stats",
    title: "Statistics for Analytics",
    subject: "BSc · Statistics",
    track: "BSc",
    difficulty: "Intermediate",
    durationMinutes: 15,
    totalMarks: 30,
    passThreshold: PASS_THRESHOLD_PCT,
    description:
      "Tests probability distributions, hypothesis testing, p-values, correlation, regression, and sampling — fundamentals for BSc Statistics / Analytics roles.",
    topics: ["Distributions", "Hypothesis Testing", "p-values", "Correlation", "Regression", "Sampling"],
    questions: [
      q("q1", "A p-value of 0.03 (at α=0.05) means:", [
        "There's a 3% probability the null hypothesis is true",
        "There's a 3% chance of observing data this extreme if the null were true — reject the null",
        "The result is definitely practically significant",
        "The sample size was 3",
      ], 1, "p-value = P(data this extreme | null true). p=0.03 < α=0.05 → reject null. Not the probability the null is true."),
      q("q2", "The normal distribution is fully described by:", [
        "Mean and median",
        "Mean and standard deviation",
        "Mode and range",
        "Sample size",
      ], 1, "Normal distribution N(μ, σ²) is fully described by mean (μ) and standard deviation (σ)."),
      q("q3", "Correlation coefficient r ranges from:", [
        "0 to 1",
        "-1 to +1",
        "0 to 100",
        "-∞ to +∞",
      ], 1, "Pearson correlation r ∈ [-1, +1]. -1 = perfect negative, +1 = perfect positive, 0 = no linear correlation."),
      q("q4", "Correlation does NOT imply:", [
        "Causation",
        "Linear relationship",
        "Strength of association",
        "Direction of relationship",
      ], 0, "Correlation does NOT imply causation. A correlation can exist without one variable causing the other (confounder, reverse causality, etc.)."),
      q("q5", "Type I error (false positive) is when you:", [
        "Reject a true null hypothesis",
        "Fail to reject a false null hypothesis",
        "Set α too low",
        "Increase sample size",
      ], 0, "Type I error = rejecting a true null (false positive). Type II error = failing to reject a false null (false negative)."),
      q("q6", "Increasing sample size (with other things equal) typically:", [
        "Increases p-value",
        "Decreases the standard error of the mean",
        "Increases variance",
        "Has no effect",
      ], 1, "SEM = σ/√n. Increasing n decreases SEM → tighter confidence intervals → more statistical power."),
      q("q7", "Simple linear regression fits the line:", [
        "y = ax² + bx + c",
        "y = mx + c (or y = β₀ + β₁x)",
        "y = log(x)",
        "y = a^x",
      ], 1, "Simple linear regression: y = β₀ + β₁x (intercept + slope). The line of best fit minimising squared residuals."),
      q("q8", "A 95% confidence interval for the mean means:", [
        "95% of the sample is in the interval",
        "If we repeated the experiment many times, 95% of such intervals would contain the true mean",
        "There's a 95% probability the true mean is in this specific interval",
        "The mean is definitely 95",
      ], 1, "Frequentist CI: across many repeated samples, 95% of computed intervals would contain the true mean. Not a probability about a specific interval."),
      q("q9", "Stratified random sampling is BEST when:", [
        "The population is homogeneous",
        "The population has distinct subgroups you want represented proportionally",
        "Sample size is very large",
        "There's no budget",
      ], 1, "Stratified sampling ensures subgroups (strata) are proportionally represented — important when subgroups differ meaningfully."),
      q("q10", "The central limit theorem (CLT) states that, for large n, the sampling distribution of the mean is approximately:", [
        "Uniform",
        "Normal",
        "Exponential",
        "Bimodal",
      ], 1, "CLT: regardless of the population distribution, the sampling distribution of the mean approaches normal as n → ∞ (typically n ≥ 30)."),
    ],
  },
]

// Helper used by the runner UI
export function getPaperById(id: string): TestPaper | undefined {
  return TEST_PAPERS.find((p) => p.id === id)
}
