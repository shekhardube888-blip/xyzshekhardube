import {
  Briefcase,
  GraduationCap,
  FlaskConical,
  TrendingUp,
  Building2,
  BarChart3,
  Users,
  Rocket,
  LineChart,
  Package,
  PenTool,
  Microscope,
  Globe,
  Cpu,
  Database,
  ShieldCheck,
  Brain,
  Award,
  Clock,
  MessageSquare,
  Library,
  HandHeart,
  CheckCircle2,
  LayoutDashboard,
  Mail,
  Phone,
  MessageCircle,
  Linkedin,
} from "lucide-react"

export type IconType = typeof Briefcase

export const NAV_LINKS = [
  { label: "Internship", href: "#programs" },
  { label: "Categories", href: "#categories" },
  { label: "Portal Login", href: "#login" },
  { label: "How It Works", href: "#how" },
  { label: "Why AgilePortal Enterprise", href: "#why" },
  { label: "Student Stories", href: "#stories" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
]

export const HERO_STATS = [
  { label: "6–8 Week Program", value: "6–8", suffix: "Weeks" },
  { label: "Real Industry Projects", value: "60+", suffix: "Projects" },
  { label: "Mentor Support", value: "Live", suffix: "Daily" },
  { label: "Verifiable Certificate", value: "UGC", suffix: "Aligned" },
  { label: "100% Online", value: "100%", suffix: "Online" },
]

export const GLANCE_STATS = [
  { label: "Students Enrolled", value: "800+", sub: "Across 80+ colleges" },
  { label: "Industry Projects", value: "60+", sub: "MBA · BBA · BSc catalog" },
  { label: "Program Duration", value: "6–8", sub: "Weeks · Live mentor-led cohorts" },
  { label: "Verifiable Certificate", value: "UGC", sub: "Aligned · Issued on completion" },
]

export type Category = {
  id: string
  title: string
  icon: IconType
  blurb: string
  tags: string[]
  subcategories: { name: string; projects: { title: string; level: "Beginner" | "Intermediate" | "Advanced" }[] }[]
  accent: string
  badge?: string
}

export const CATEGORIES: Category[] = [
  {
    id: "mba",
    title: "MBA / Management",
    icon: Briefcase,
    blurb: "Strategy, marketing, finance, operations, HR, business analytics",
    tags: ["Strategy", "Marketing", "Finance", "HR"],
    accent: "from-emerald-500/15 to-emerald-500/5 text-emerald-700",
    subcategories: [
      {
        name: "Marketing & Brand Strategy",
        projects: [
          { title: "D2C Brand Launch Playbook", level: "Intermediate" },
          { title: "Go-to-Market for SaaS Startup", level: "Advanced" },
          { title: "Social Listening & Brand Audit", level: "Beginner" },
        ],
      },
      {
        name: "Finance & Valuation",
        projects: [
          { title: "Equity Research DCF Model", level: "Advanced" },
          { title: "Working Capital Optimization", level: "Intermediate" },
          { title: "Startup Pitch Deck + Valuation", level: "Intermediate" },
        ],
      },
      {
        name: "Operations & Supply Chain",
        projects: [
          { title: "Warehouse Process Re-engineering", level: "Intermediate" },
          { title: "Lean Six Sigma Pilot", level: "Advanced" },
        ],
      },
    ],
  },
  {
    id: "bba",
    title: "BBA / Business",
    icon: Building2,
    blurb: "Entrepreneurship, digital marketing, HR, supply chain, retail",
    tags: ["Entrepreneurship", "Digital Mktg", "HR", "Retail"],
    accent: "from-amber-500/15 to-amber-500/5 text-amber-700",
    subcategories: [
      {
        name: "Entrepreneurship & Startup",
        projects: [
          { title: "B-Plan: Student-Led D2C Brand", level: "Beginner" },
          { title: "Lean Canvas for Hyperlocal Service", level: "Intermediate" },
        ],
      },
      {
        name: "Digital Marketing",
        projects: [
          { title: "Performance Marketing for Local SMB", level: "Intermediate" },
          { title: "SEO + Content Calendar", level: "Beginner" },
          { title: "Instagram Growth Strategy", level: "Beginner" },
        ],
      },
      {
        name: "Human Resources",
        projects: [
          { title: "Recruitment Process Redesign", level: "Intermediate" },
          { title: "Employee Engagement Survey", level: "Beginner" },
        ],
      },
    ],
  },
  {
    id: "bsc-cs",
    title: "BSc Computer Science",
    icon: Cpu,
    blurb: "Data science, full-stack web, cybersecurity, Python, ML basics",
    tags: ["Python", "Data Science", "Web Dev", "ML Basics"],
    accent: "from-teal-500/15 to-teal-500/5 text-teal-700",
    subcategories: [
      {
        name: "Data Science & Analytics",
        projects: [
          { title: "Sales Forecasting with Python", level: "Intermediate" },
          { title: "Customer Segmentation (K-Means)", level: "Intermediate" },
          { title: "Dashboard in Streamlit", level: "Beginner" },
        ],
      },
      {
        name: "Full-Stack Web Dev",
        projects: [
          { title: "Inventory Mgmt Web App (MERN)", level: "Advanced" },
          { title: "Restaurant Booking System", level: "Intermediate" },
        ],
      },
      {
        name: "Cybersecurity Fundamentals",
        projects: [
          { title: "Network Vulnerability Audit", level: "Intermediate" },
          { title: "Phishing Detection Browser Ext", level: "Advanced" },
        ],
      },
    ],
  },
  {
    id: "bsc-bio",
    title: "BSc Biotechnology",
    icon: FlaskConical,
    blurb: "Bioinformatics, lab analytics, pharma research, QC",
    tags: ["Bioinformatics", "Lab Tech", "Pharma", "QC"],
    accent: "from-rose-500/15 to-rose-500/5 text-rose-700",
    subcategories: [
      {
        name: "Bioinformatics",
        projects: [
          { title: "DNA Sequence Analysis Pipeline", level: "Intermediate" },
          { title: "Protein Structure Visualization", level: "Beginner" },
        ],
      },
      {
        name: "Pharma & QC",
        projects: [
          { title: "Stability Study Data Analysis", level: "Intermediate" },
          { title: "GMP Documentation Audit", level: "Beginner" },
        ],
      },
    ],
  },
  {
    id: "bsc-stats",
    title: "BSc Statistics / Maths",
    icon: BarChart3,
    blurb: "Actuarial, operations research, data analysis, R",
    tags: ["R", "Actuarial", "Ops Research", "Forecasting"],
    accent: "from-violet-500/15 to-violet-500/5 text-violet-700",
    subcategories: [
      {
        name: "Actuarial & Risk",
        projects: [
          { title: "Motor Insurance Pricing Model", level: "Advanced" },
          { title: "Mortality Table Analysis (R)", level: "Intermediate" },
        ],
      },
      {
        name: "Operations Research",
        projects: [
          { title: "Vehicle Routing Optimisation", level: "Intermediate" },
          { title: "Inventory Policy Simulation", level: "Beginner" },
        ],
      },
    ],
  },
  {
    id: "other",
    title: "Other Streams (v2.0)",
    icon: LayoutDashboard,
    blurb: "BSc Physics, Chemistry, General — coming soon",
    tags: ["Coming Soon"],
    accent: "from-slate-500/15 to-slate-500/5 text-slate-700",
    badge: "Coming Soon",
    subcategories: [],
  },
]

export type Step = {
  num: string
  title: string
  description: string
  icon: IconType
}

export const STEPS: Step[] = [
  {
    num: "01",
    title: "Register",
    description:
      "Sign in with Google and submit your student profile — no documents required, no fee charged at any stage. Your basic info, degree stream, semester, and area of interest is all we need to onboard you into the next available cohort.",
    icon: Users,
  },
  {
    num: "02",
    title: "Get Approved",
    description:
      "Our team verifies your enrollment and matches you to a track aligned with your degree stream and semester — MBA students are matched to marketing, finance, operations or HR pods; BBA students to entrepreneurship or digital marketing pods; BSc students to data science, biotech or statistics pods.",
    icon: CheckCircle2,
  },
  {
    num: "03",
    title: "Start Training",
    description:
      "Join live mentor-led sessions delivered online in evening batches. Recorded playbacks are available within two hours for revision. Sessions run 5 days a week, ~90 minutes each, designed around your college timetable so you never miss regular classes.",
    icon: Clock,
  },
  {
    num: "04",
    title: "Build Project",
    description:
      "Apply what you learn to a real industry project — shipped to GitHub or submitted as a strategy/analysis deliverable, demo-ready, and reviewable by your mentor. Every project is portfolio-grade and tied to a real business brief from our partner network.",
    icon: Rocket,
  },
  {
    num: "05",
    title: "Get Certified",
    description:
      "Earn a UGC-aligned, QR-verifiable digital certificate accepted by 80+ colleges across India. The certificate carries your project title, mentor signature, cohort ID, and verification URL — designed to meet most university internship-mandate requirements for academic credit conversion.",
    icon: Award,
  },
]

export type Program = {
  id: string
  emoji: string
  badge?: string
  track: string
  title: string
  level: string
  duration: string
  cost: string
  schedule: string
  description: string
  skills: string[]
  cta: string
  ctaVariant: "primary" | "secondary" | "outline"
  status: "open" | "soon"
}

export const PROGRAMS: Program[] = [
  {
    id: "mba-marketing",
    emoji: "📊",
    badge: "Most Popular",
    track: "MBA · Management",
    title: "Marketing & Strategy Internship",
    level: "Intermediate",
    duration: "8 Weeks",
    cost: "Free",
    schedule: "Daily Live Sessions",
    description:
      "A live online program where you'll master market research, brand positioning, GTM strategy, and digital marketing analytics. Build a complete marketing strategy project for a real D2C brand with expert mentoring at every step. Ideal for 1st and 2nd year MBA students looking to add a portfolio-grade deliverable to their CV.",
    skills: ["Market Research", "GTM Strategy", "Brand Audit", "Analytics"],
    cta: "Register Now",
    ctaVariant: "primary",
    status: "open",
  },
  {
    id: "bba-digital",
    emoji: "🚀",
    badge: "Most Popular",
    track: "BBA · Business",
    title: "Entrepreneurship & Digital Marketing Internship",
    level: "Beginner",
    duration: "6 Weeks",
    cost: "Free",
    schedule: "Daily Live Sessions",
    description:
      "Design and launch a student-led D2C brand from scratch — from lean canvas and brand identity to performance marketing on Instagram and Meta ads. Perfect for 1st and 2nd year BBA students who want to build a real, ship-ready business artefact by the end of the program.",
    skills: ["Lean Canvas", "Meta Ads", "SEO", "Brand Identity"],
    cta: "Register Now",
    ctaVariant: "primary",
    status: "open",
  },
  {
    id: "bsc-data",
    emoji: "🧠",
    badge: "Most Popular",
    track: "BSc · Computer Science",
    title: "Data Science & Analytics Internship",
    level: "Intermediate",
    duration: "8 Weeks",
    cost: "Free",
    schedule: "Daily Live Sessions",
    description:
      "Master the data science workflow end-to-end — data cleaning in Pandas, EDA, model building with scikit-learn, and shipping a Streamlit dashboard. You'll build a sales forecasting project on a real anonymised retail dataset and present it to your mentor by the end of week 8.",
    skills: ["Python", "Pandas", "scikit-learn", "Streamlit"],
    cta: "Register Now",
    ctaVariant: "primary",
    status: "open",
  },
  {
    id: "bsc-biotech",
    emoji: "🔬",
    badge: "Coming Soon",
    track: "BSc · Biotechnology",
    title: "Biotech Research & Bioinformatics Track",
    level: "Advanced",
    duration: "6 Weeks",
    cost: "Free",
    schedule: "TBA",
    description:
      "A research-focused track for BSc Biotech / Microbiology students — work on a real bioinformatics pipeline (DNA sequence analysis, protein structure visualization) and complete a pharma QC data analysis project. Co-mentored by working research scientists from partner labs.",
    skills: ["Bioinformatics", "R", "Lab Analytics", "GMP"],
    cta: "Get Notified",
    ctaVariant: "outline",
    status: "soon",
  },
]

export type Feature = {
  title: string
  description: string
  icon: IconType
}

export const FEATURES: Feature[] = [
  {
    title: "Industry Mentor",
    description:
      "Live sessions led by working professionals — marketing managers, product leads, data scientists, and biotech researchers — each with 8+ years of hands-on industry experience. No academic-only faculty.",
    icon: Users,
  },
  {
    title: "Real Projects",
    description:
      "Build portfolio-grade deliverables shipped to GitHub or as a polished business deliverable — real business briefs from our partner network, not toy demos or guided worksheets.",
    icon: Rocket,
  },
  {
    title: "Verifiable Certificate",
    description:
      "Earn a UGC-aligned, QR-secured digital certificate accepted by 80+ colleges across India. Every certificate carries your project title, mentor signature, and a public verification URL.",
    icon: ShieldCheck,
  },
  {
    title: "Placement Support",
    description:
      "Resume reviews, mock HR and case-interview rounds, and curated job referrals through our 30+ partner network of startups, agencies, research labs and analytics firms.",
    icon: TrendingUp,
  },
  {
    title: "Flexible Schedule",
    description:
      "Evening live sessions plus recorded playbacks within 2 hours — designed around MBA, BBA and BSc college timetables. You will never be asked to skip a regular class to attend.",
    icon: Clock,
  },
  {
    title: "Lifetime Access",
    description:
      "Retain lifetime access to course material, project code, business templates, and the mentor community alumni channel — even years after you complete your cohort.",
    icon: Library,
  },
]

export type Testimonial = {
  quote: string
  name: string
  initials: string
  program: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The Marketing & Strategy internship was the best thing I did in my 1st year MBA. The mentors were incredibly patient and the D2C brand strategy I built got me my first summer placement shortlist at an FMCG. Completely free and genuinely worth every hour.",
    name: "Aditya Sharma",
    initials: "AS",
    program: "MBA · Marketing · IIM Indore · Batch '25",
  },
  {
    quote:
      "I was sceptical about a free internship — thought it would be superficial. I was completely wrong. The Entrepreneurship & Digital Marketing program had daily live sessions, real Meta Ads labs, and I ended up launching a working D2C storefront. The certificate is on my CV and it gets noticed.",
    name: "Priya Menon",
    initials: "PM",
    program: "BBA · Digital Marketing · NMIMS Mumbai · Batch '25",
  },
  {
    quote:
      "The BBA Entrepreneurship track taught me more about running a real business than any college subject did. I pitched my student-led D2C brand at the college E-Cell and won seed funding. Highly recommend for non-MBA students who want a strong portfolio.",
    name: "Rahul Joshi",
    initials: "RJ",
    program: "BBA · Entrepreneurship · Symbiosis Pune · Batch '24",
  },
  {
    quote:
      "What I loved most was the doubt-clearing sessions — the data science mentor would stay back and explain until every student understood the Pandas / scikit-learn code. That's rare. My sales forecasting project won first prize at our college tech-fest analytics track.",
    name: "Sneha Kulkarni",
    initials: "SK",
    program: "BSc · Computer Science · Fergusson College · Batch '25",
  },
  {
    quote:
      "I joined the Data Science program during my 5th semester summer break. In 8 weeks I went from barely knowing Python to deploying a working Streamlit dashboard for retail sales forecasting. The 70/30 practical split is real — we spent most time actually building.",
    name: "Kartik Verma",
    initials: "KV",
    program: "BSc · Statistics · St. Xavier's Mumbai · Batch '24",
  },
  {
    quote:
      "The DISHA career workshop alone was worth it. They reviewed my resume, did a mock HR round, and helped me understand what companies actually look for in MBA freshers. I got my summer placement offer within 3 weeks of completing the program.",
    name: "Nidhi Patel",
    initials: "NP",
    program: "MBA · Operations · NMIMS Bangalore · Batch '24",
  },
]

export type AboutStat = { value: string; label: string }

export const ABOUT_STATS: AboutStat[] = [
  { value: "2018", label: "Founded" },
  { value: "10K+", label: "Students Trained" },
  { value: "500+", label: "Partner Colleges" },
  { value: "50+", label: "Expert Mentors" },
  { value: "4", label: "Program Tracks" },
  { value: "98%", label: "Completion Rate" },
]

export type FAQ = { q: string; a: string }

export const FAQS: FAQ[] = [
  {
    q: "Is the internship really free? Are there any hidden charges?",
    a: "Yes, completely free for student learners. There is no registration fee, no course fee, no certificate fee, and no hidden charges of any kind. AgilePortal Enterprise's mission is to make quality internship programs accessible to every MBA, BBA and BSc student in India, regardless of financial background. (Enterprise orgs pay a per-seat SaaS fee — see the Enterprise plan below.)",
  },
  {
    q: "Will my college accept this certificate for the internship credit requirement?",
    a: "Our merit certificates are UGC & AICTE-aligned and accepted by 80+ colleges across India. They are designed to meet most university internship-mandate requirements for academic credit conversion. We provide a verification URL, mentor signature, and project title on every certificate — but final acceptance is at your college's discretion. We're happy to share the curriculum and certificate sample with your placement cell if needed.",
  },
  {
    q: "What equipment or software do I need?",
    a: "MBA & BBA students need a laptop with a browser and Microsoft Excel or Google Sheets. BSc Computer Science students need Python 3.10+ installed (we'll guide you through setup on day 1). BSc Biotech students need R + a free bioinformatics account. A working internet connection (>= 5 Mbps) and a quiet space for live sessions is the only other requirement.",
  },
  {
    q: "What are the session timings? Can I attend if I have college classes?",
    a: "Live sessions are scheduled in the evening, typically 7:00 PM – 8:30 PM IST, 5 days a week (Mon–Fri). Sessions are designed around regular college timetables — you'll never be asked to skip a class. Recorded playbacks are uploaded within 2 hours of each session for revision or in case you miss a day.",
  },
  {
    q: "I'm an MBA / BBA / BSc student. Which program is right for me?",
    a: "MBA students (any specialization) → Marketing & Strategy Internship. BBA students (1st/2nd year) → Entrepreneurship & Digital Marketing Internship. BSc Computer Science or Statistics students → Data Science & Analytics Internship. BSc Biotech / Microbiology students → Biotech Research Track (currently waitlist). Still unsure? Use the Sign Up form and our team will recommend a track based on your degree and semester.",
  },
  {
    q: "How is the certificate issued? Is it digital or physical?",
    a: "Certificates are 100% digital. Within 7 days of completing your final project review, you receive a verifiable digital certificate (PDF + shareable URL) carrying your name, project title, mentor signature, cohort ID, and a QR code that links to a public verification page. No physical dispatch, no waiting — instant share on LinkedIn.",
  },
  {
    q: "What if I miss a few sessions? Will I still get the certificate?",
    a: "Yes. We require 75% live session attendance OR 90% recording-watched completion, plus submission of the final project, to issue the certificate. If you miss a session, the recording is available within 2 hours and counts toward your completion. We've designed this around the reality of college timetables and exam weeks.",
  },
  {
    q: "Can students from non-management, non-science backgrounds apply?",
    a: "Currently the tracks are tuned for MBA, BBA and BSc (CS / Stat / Biotech) students. If you are from a different stream (BA, BCom, BCA) and the project track interests you, you may still apply — our team reviews each application on a case-by-case basis. Use the Sign Up form and we will get back to you within 48 hours.",
  },
]

export const FOOTER_LINKS = {
  internships: [
    "MBA Marketing & Strategy",
    "BBA Entrepreneurship & Digital",
    "BSc Data Science & Analytics",
    "BSc Biotech Research Track",
  ],
  resources: [
    "AI Learning Assistant",
    "Skill Library",
    "Schedule & Batches",
    "End-to-End Data Science Guide",
    "FAQ",
  ],
  company: ["About Us", "Meet the Mentors", "Student Stories", "Why AgilePortal Enterprise", "How It Works"],
}

export const CONTACT = {
  brand: "AgilePortal Enterprise",
  tagline:
    "AgilePortal Enterprise is a free internship + enterprise L&D platform serving MBA, BBA and BSc students across India, plus enterprise orgs managing team training cohorts. Live mentoring, real projects, UGC-aligned certificates — at zero cost for students, per-seat SaaS for orgs.",
  website: "agileportal.in",
  email: "training@agileportal.in",
  phone: "+91 80955 57332",
  whatsapp: "+91 80955 57334",
  linkedin: "Jobs on LinkedIn",
  icons: { mail: Mail, phone: Phone, whatsapp: MessageCircle, linkedin: Linkedin },
}

export const SCROLL_TO_TOP_LABEL = "Back to top"
export const BUILT_WITH_NOTE =
  "AICTE-Aligned · UGC-Compliant · Mentor-Led · 100% Online"
