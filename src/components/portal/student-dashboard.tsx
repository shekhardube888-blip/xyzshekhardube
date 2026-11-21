"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  Trophy,
  Calendar,
  Video,
  MessageCircle,
  Mail,
  Upload,
  FileText,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  ListChecks,
  Target,
  Crown,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-store"
import { WeeklyTasksPanel } from "./weekly-tasks-panel"
import { TestPapersPanel } from "./test-papers-panel"
import { SimulationGamePanel } from "./simulation-game-panel"
import { LeaderboardPanel } from "./leaderboard-panel"
import { useWeeklyProgress } from "./use-weekly-progress"
import { useTestProgressHelpers, useMounted } from "./use-test-progress"
import { useSimulation } from "./simulation-store"
import { SIM_TOTAL_QUARTERS } from "./simulation-engine"

// Demo per-student data — would be fetched from /api/student/me in v2.
const PROGRAM_WEEKS = 8
const COMPLETED_WEEKS = 3
const PROGRAM = {
  title: "Marketing & Strategy Internship",
  track: "MBA · Management",
  cohort: "MBA-MKT-2025-W41",
  mentor: {
    name: "Rohit Khanna",
    role: "Ex-ITC · 11 yrs brand strategy",
    initials: "RK",
    color: "bg-emerald-500",
  },
}

const KPIS = [
  { label: "Program Week", value: "4 / 8", icon: GraduationCap, accent: "text-emerald-600" },
  { label: "Project Progress", value: "38%", icon: BookOpen, accent: "text-teal-600" },
  { label: "Sessions Attended", value: "12 / 16", icon: Video, accent: "text-violet-600" },
  { label: "Certificate Status", value: "Pending", icon: Trophy, accent: "text-amber-600" },
]

type Session = {
  day: string
  date: string
  time: string
  topic: string
  mentor: string
  status: "upcoming" | "live" | "completed"
}

const SESSIONS: Session[] = [
  {
    day: "Mon",
    date: "27 Oct",
    time: "7:00 PM",
    topic: "Brand positioning frameworks",
    mentor: "Rohit Khanna",
    status: "live",
  },
  {
    day: "Tue",
    date: "28 Oct",
    time: "7:00 PM",
    topic: "Go-to-market for D2C brands",
    mentor: "Rohit Khanna",
    status: "upcoming",
  },
  {
    day: "Wed",
    date: "29 Oct",
    time: "7:00 PM",
    topic: "Performance marketing lab (Meta Ads)",
    mentor: "Anjali Rao",
    status: "upcoming",
  },
  {
    day: "Thu",
    date: "30 Oct",
    time: "7:00 PM",
    topic: "Brand audit — D2C case study",
    mentor: "Rohit Khanna",
    status: "upcoming",
  },
]

const DELIVERABLES = [
  {
    title: "Week 1 — Brand audit deck",
    status: "submitted" as const,
    submittedAt: "2026-10-08",
  },
  {
    title: "Week 2 — Customer persona canvas",
    status: "submitted" as const,
    submittedAt: "2026-10-15",
  },
  {
    title: "Week 3 — GTM strategy draft",
    status: "in-review" as const,
    submittedAt: "2026-10-22",
  },
  {
    title: "Week 4 — Performance marketing report",
    status: "pending" as const,
    submittedAt: null,
  },
]

const deliverableStatus = {
  submitted: { label: "Submitted", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  "in-review": { label: "In review", color: "bg-amber-100 text-amber-700 border-amber-200" },
  pending: { label: "Pending", color: "bg-slate-100 text-slate-700 border-slate-200" },
}

export function StudentDashboard() {
  const { name, email, stream, college, city, year, qualification, guardianEmail, guardianRole } = useAuth()
  const { toast } = useToast()
  const [deliverableTitle, setDeliverableTitle] = useState("")
  const [deliverableUrl, setDeliverableUrl] = useState("")
  const [deliverableNotes, setDeliverableNotes] = useState("")
  const [activeTab, setActiveTab] = useState<string>("overview")

  // Pull stats from each sub-feature to drive the Overview quick-jump cards
  const mounted = useMounted()
  const { completedWeeks: weeklyCompleted } = useWeeklyProgress(4)
  const { stats: testStats } = useTestProgressHelpers()
  const { status: simStatus, currentQuarter: simQuarter, history: simHistory } = useSimulation()

  const progressPct = Math.round((COMPLETED_WEEKS / PROGRAM_WEEKS) * 100)

  const handleSubmitDeliverable = () => {
    if (!deliverableTitle || !deliverableUrl) {
      toast({
        title: "Please fill in title + URL",
        description: "Both the deliverable title and a link (Google Drive / GitHub) are required.",
      })
      return
    }
    toast({
      title: "Deliverable submitted",
      description: `"${deliverableTitle}" sent to ${PROGRAM.mentor.name} for review.`,
    })
    setDeliverableTitle("")
    setDeliverableUrl("")
    setDeliverableNotes("")
  }

  return (
    <section
      id="student"
      className="border-b border-emerald-200 bg-emerald-50/40 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              Student Dashboard · Welcome
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Hi {name?.split(" ")[0]}, here&apos;s your progress
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {PROGRAM.title} · {PROGRAM.cohort}
              {stream && ` · ${stream}`}
              {qualification && ` · ${qualification}`}
              {year && ` · ${year}`}
              {college && ` · ${college}`}
              {city && ` · ${city}`}
              {guardianEmail && ` · ${guardianRole || "Guardian"}: ${guardianEmail}`}
            </p>
          </div>
          <Badge className="border-emerald-300 bg-emerald-100 text-emerald-800">
            Live Cohort · Week {COMPLETED_WEEKS + 1} of {PROGRAM_WEEKS}
          </Badge>
        </div>

        {/* KPI cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {KPIS.map((k) => {
            const Icon = k.icon
            return (
              <Card key={k.label} className="border-emerald-200 shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 ${k.accent}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xl font-bold leading-none">{k.value}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{k.label}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Tasks</TabsTrigger>
            <TabsTrigger value="tests">Test Papers</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT — Program track + progress */}
          <Card className="lg:col-span-2 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-base">My program track</CardTitle>
              <CardDescription>
                Live mentor-led cohort. Project deliverables are due weekly — submit them in the box below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Overall progress</span>
                  <span className="text-muted-foreground">
                    {COMPLETED_WEEKS} of {PROGRAM_WEEKS} weeks · {progressPct}%
                  </span>
                </div>
                <Progress value={progressPct} className="mt-2 h-2" />
                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                  {Array.from({ length: PROGRAM_WEEKS }).map((_, i) => (
                    <span
                      key={i}
                      className={`rounded px-1.5 py-0.5 ${
                        i < COMPLETED_WEEKS
                          ? "bg-emerald-100 text-emerald-700"
                          : i === COMPLETED_WEEKS
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      W{i + 1}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deliverables list */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Weekly deliverables
                </p>
                <ul className="mt-3 space-y-2">
                  {DELIVERABLES.map((d) => {
                    const s = deliverableStatus[d.status]
                    return (
                      <li
                        key={d.title}
                        className="flex items-start justify-between gap-3 rounded-lg border bg-background/60 p-3"
                      >
                        <div className="flex items-start gap-2">
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{d.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {d.submittedAt ? `Submitted ${d.submittedAt}` : "Not yet submitted"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`shrink-0 text-[10px] ${s.color}`}>
                          {s.label}
                        </Badge>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Submit deliverable */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Submit a new deliverable
                </p>
                <div className="mt-3 grid gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="d-title" className="text-xs">Deliverable title</Label>
                    <Input
                      id="d-title"
                      placeholder="e.g. Week 4 — Performance marketing report"
                      value={deliverableTitle}
                      onChange={(e) => setDeliverableTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="d-url" className="text-xs">Link (Google Drive / GitHub / Notion)</Label>
                    <Input
                      id="d-url"
                      placeholder="https://drive.google.com/..."
                      value={deliverableUrl}
                      onChange={(e) => setDeliverableUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="d-notes" className="text-xs">Notes for mentor (optional)</Label>
                    <Textarea
                      id="d-notes"
                      placeholder="Anything you want the mentor to focus on while reviewing?"
                      rows={2}
                      value={deliverableNotes}
                      onChange={(e) => setDeliverableNotes(e.target.value)}
                    />
                  </div>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleSubmitDeliverable}
                  >
                    <Upload className="mr-1.5 h-4 w-4" />
                    Submit deliverable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RIGHT — Certificate + Mentor + Upcoming sessions */}
          <div className="space-y-6">
            {/* Certificate */}
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="h-5 w-5 text-amber-600" />
                  Your certificate
                </CardTitle>
                <CardDescription>
                  Issued on cohort completion. Verifiable, QR-secured.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/40 p-4 text-center">
                  <Trophy className="mx-auto h-8 w-8 text-amber-500" />
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    Certificate of Completion
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Marketing &amp; Strategy Internship
                  </p>
                  <Badge variant="outline" className="mt-2 border-amber-300 bg-background text-amber-700">
                    Pending — complete all 8 weeks
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                  onClick={() =>
                    toast({
                      title: "Not available yet",
                      description: "Certificate is issued in week 8 after final project review.",
                    })
                  }
                >
                  Preview sample certificate
                </Button>
              </CardContent>
            </Card>

            {/* Mentor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your mentor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className={`h-12 w-12 ${PROGRAM.mentor.color}`}>
                    <AvatarFallback className="bg-transparent text-sm font-semibold text-white">
                      {PROGRAM.mentor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{PROGRAM.mentor.name}</p>
                    <p className="text-xs text-muted-foreground">{PROGRAM.mentor.role}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast({
                        title: "Opening doubt thread…",
                        description: `Starting a 1-1 thread with ${PROGRAM.mentor.name}.`,
                      })
                    }
                  >
                    <MessageCircle className="mr-1.5 h-4 w-4" />
                    Ask doubt
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast({
                        title: "Email draft opened",
                        description: `Composing email to ${PROGRAM.mentor.name.toLowerCase().replace(/\s+/g, ".")}@agileportal.in`,
                      })
                    }
                  >
                    <Mail className="mr-1.5 h-4 w-4" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Upcoming sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-border">
                  {SESSIONS.map((s) => (
                    <li key={`${s.day}-${s.topic}`} className="flex items-start gap-3 px-6 py-3">
                      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-muted text-center">
                        <span className="text-[10px] font-medium uppercase text-muted-foreground">{s.day}</span>
                        <span className="text-sm font-bold leading-none">{s.date.split(" ")[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{s.topic}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.time} · {s.mentor}
                        </p>
                      </div>
                      {s.status === "live" ? (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-7 px-2 text-xs">
                          <Video className="mr-1 h-3 w-3" />
                          Join live
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          <Clock className="mr-1 h-3 w-3" />
                          Upcoming
                        </Badge>
                      )}
                    </li>
                  ))}
                </ul>
                <CardFooter className="justify-center border-t bg-muted/30 p-3">
                  <Button variant="ghost" size="sm" asChild>
                    <a href="#how">
                      View full schedule
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          </div>
        </div>

            {/* Quick-jump cards — let students jump to any tab from Overview */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <QuickJumpCard
                title="Weekly Tasks"
                icon={Target}
                stat={mounted ? `${weeklyCompleted}/${SIM_TOTAL_QUARTERS} weeks` : "—"}
                description="Tasks, tests, market scenarios + AI guidance"
                onClick={() => setActiveTab("weekly")}
                accent="text-emerald-600 bg-emerald-50"
              />
              <QuickJumpCard
                title="Test Papers"
                icon={ListChecks}
                stat={mounted ? `${testStats.uniquePassed}/${6} passed` : "—"}
                description="6 timed MCQ exams across MBA / BBA / BSc"
                onClick={() => setActiveTab("tests")}
                accent="text-violet-600 bg-violet-50"
              />
              <QuickJumpCard
                title="Simulation"
                icon={Crown}
                stat={
                  mounted
                    ? simStatus === "finished"
                      ? `Grade: ${simHistory.length > 0 ? "View" : "—"}`
                      : simStatus === "running"
                      ? `Q${simQuarter} of ${SIM_TOTAL_QUARTERS}`
                      : "Not started"
                    : "—"
                }
                description="D2C Brand Simulator · 8 quarters"
                onClick={() => setActiveTab("simulation")}
                accent="text-amber-600 bg-amber-50"
              />
              <QuickJumpCard
                title="Leaderboard"
                icon={Trophy}
                stat={mounted ? "Cohort rank" : "—"}
                description="Compare your grade vs peers"
                onClick={() => setActiveTab("leaderboard")}
                accent="text-teal-600 bg-teal-50"
              />
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-6">
            <WeeklyTasksPanel />
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <TestPapersPanel />
          </TabsContent>

          <TabsContent value="simulation" className="mt-6">
            <SimulationGamePanel />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <LeaderboardPanel />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

// Quick-jump card component used in the Overview tab
function QuickJumpCard({
  title,
  icon: Icon,
  stat,
  description,
  onClick,
  accent,
}: {
  title: string
  icon: typeof Target
  stat: string
  description: string
  onClick: () => void
  accent: string
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-start gap-3 rounded-xl border bg-background p-4 text-left transition-all hover:border-violet-300 hover:shadow-md"
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
        <p className="mt-0.5 text-xs font-medium text-foreground">{stat}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{description}</p>
      </div>
    </button>
  )
}
