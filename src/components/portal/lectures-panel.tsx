"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Sparkles,
  Loader2,
  FileText,
  Presentation,
  Download,
  AlertTriangle,
  RefreshCw,
  Clock,
  BookOpen,
  CheckCircle2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { WEEKS } from "./portal-weeks"
import { useAuth } from "./auth-store"

type LectureSection = {
  heading: string
  content: string
  keyPoints: string[]
}

type Lecture = {
  title: string
  subtitle: string
  durationMinutes: number
  sections: LectureSection[]
  summary: string
  glossary: { term: string; definition: string }[]
}

type LectureState = {
  status: "idle" | "loading" | "ready" | "error"
  lecture: Lecture | null
  error: string | null
}

const CACHE_KEY = "agileportal-lecture-cache"

function loadCached(weekId: number): Lecture | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const map = JSON.parse(raw) as Record<number, Lecture>
    return map[weekId] ?? null
  } catch {
    return null
  }
}

function saveCached(weekId: number, lecture: Lecture) {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const map = raw ? JSON.parse(raw) : {}
    map[weekId] = lecture
    localStorage.setItem(CACHE_KEY, JSON.stringify(map))
  } catch {
    /* ignore quota */
  }
}

export function LecturesPanel() {
  const { stream } = useAuth()
  const { toast } = useToast()
  const [activeWeekId, setActiveWeekId] = useState(1)
  const [state, setState] = useState<LectureState>({ status: "idle", lecture: null, error: null })
  const [downloading, setDownloading] = useState<"pdf" | "ppt" | null>(null)

  // Auto-load cached lecture on week change
  useEffect(() => {
    const cached = loadCached(activeWeekId)
    if (cached) {
      setState({ status: "ready", lecture: cached, error: null })
    } else {
      setState({ status: "idle", lecture: null, error: null })
    }
  }, [activeWeekId])

  const generateLecture = async (forceRefresh = false) => {
    const week = WEEKS.find((w) => w.id === activeWeekId)
    if (!week) return

    if (!forceRefresh) {
      const cached = loadCached(activeWeekId)
      if (cached) {
        setState({ status: "ready", lecture: cached, error: null })
        return
      }
    }

    setState({ status: "loading", lecture: null, error: null })
    try {
      const res = await fetch("/api/generate-lecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekId: week.id,
          weekTitle: week.title,
          weekObjective: week.objective,
          stream: stream || "MBA · Marketing",
          brand: week.scenario.brand,
          brief: week.scenario.brief,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }
      const data = (await res.json()) as Lecture
      setState({ status: "ready", lecture: data, error: null })
      saveCached(activeWeekId, data)
      toast({
        title: "Lecture generated!",
        description: `${data.title} — ${data.sections.length} sections, ~${data.durationMinutes} min.`,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      setState({ status: "error", lecture: null, error: msg })
      toast({ title: "Generation failed", description: msg, variant: "destructive" })
    }
  }

  const downloadFile = async (format: "pdf" | "ppt") => {
    if (!state.lecture) return
    setDownloading(format)
    try {
      const res = await fetch("/api/generate-lecture-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lecture: state.lecture,
          weekId: activeWeekId,
          format,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Download failed" }))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = res.headers.get("Content-Disposition")?.split('"')[1] ?? `lecture-w${activeWeekId}.${format === "pdf" ? "pdf" : "pptx"}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({
        title: `${format.toUpperCase()} downloaded`,
        description: `Lecture for Week ${activeWeekId} saved as ${format.toUpperCase()}.`,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      toast({ title: "Download failed", description: msg, variant: "destructive" })
    } finally {
      setDownloading(null)
    }
  }

  const activeWeek = WEEKS.find((w) => w.id === activeWeekId) ?? WEEKS[0]

  return (
    <section className="border-t border-violet-200 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
              AI-Generated Lectures · PDF + PPT Downloads
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Lecture materials for each week
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate a structured lecture for any week using the AI mentor. Each lecture has 5
              sections, key points, a summary, and a glossary. Download as PDF or PowerPoint.
            </p>
          </div>
          <Badge className="border-violet-300 bg-violet-100 text-violet-800">
            <Sparkles className="mr-1 h-3 w-3" />
            LLM-powered
          </Badge>
        </div>

        {/* Week selector */}
        <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {WEEKS.map((w) => {
            const cached = loadCached(w.id)
            const isActive = w.id === activeWeekId
            return (
              <button
                key={w.id}
                onClick={() => setActiveWeekId(w.id)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-all ${
                  isActive
                    ? "border-violet-500 bg-violet-50 ring-1 ring-violet-300"
                    : "border-border bg-background hover:border-violet-300 hover:bg-violet-50/50"
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                  W{w.id}
                </span>
                {cached ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : null}
                <span className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">
                  {w.title}
                </span>
              </button>
            )
          })}
        </div>

        {/* Active week content */}
        <div className="mt-6">
          {state.status === "idle" && (
            <Card className="border-violet-200">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <BookOpen className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Generate lecture for Week {activeWeek.id}: {activeWeek.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The AI mentor will create a {activeWeek.objective.toLowerCase()} lecture with 5
                    structured sections, key points, a summary, and a glossary. Takes ~10 seconds.
                  </p>
                </div>
                <Button onClick={() => generateLecture(false)} className="bg-violet-600 hover:bg-violet-700">
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Generate lecture
                </Button>
              </CardContent>
            </Card>
          )}

          {state.status === "loading" && (
            <Card className="border-violet-200">
              <CardContent className="space-y-3 p-6">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <div className="flex items-center gap-2 text-xs text-violet-700">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Calling the LLM… typically 5–15 seconds.
                </div>
              </CardContent>
            </Card>
          )}

          {state.status === "error" && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Lecture generation failed</AlertTitle>
              <AlertDescription className="mt-1">{state.error}</AlertDescription>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => generateLecture(true)}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry
              </Button>
            </Alert>
          )}

          {state.status === "ready" && state.lecture && (
            <Card className="border-violet-200">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{state.lecture.title}</CardTitle>
                    <CardDescription className="mt-1">{state.lecture.subtitle}</CardDescription>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {state.lecture.durationMinutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {state.lecture.sections.length} sections
                      </span>
                      <span>Week {activeWeek.id}: {activeWeek.title}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Sections */}
                {state.lecture.sections.map((section, i) => (
                  <div key={i} className="rounded-lg border bg-background/60 p-3">
                    <p className="text-sm font-semibold text-foreground">
                      {i + 1}. {section.heading}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{section.content}</p>
                    {section.keyPoints?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {section.keyPoints.map((kp, ki) => (
                          <li key={ki} className="flex items-start gap-1.5 text-xs text-foreground">
                            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-violet-600" />
                            {kp}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {/* Summary */}
                <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Summary</p>
                  <p className="mt-1 text-sm text-foreground">{state.lecture.summary}</p>
                </div>

                {/* Glossary */}
                {state.lecture.glossary?.length > 0 && (
                  <div className="rounded-lg border bg-background/60 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Glossary</p>
                    <dl className="mt-2 space-y-1.5">
                      {state.lecture.glossary.map((item, gi) => (
                        <div key={gi} className="text-xs">
                          <dt className="font-semibold text-foreground">{item.term}</dt>
                          <dd className="text-muted-foreground">{item.definition}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex-col gap-3 border-t bg-muted/30 p-4 sm:flex-row sm:justify-between">
                <div className="flex gap-2">
                  <Button
                    onClick={() => downloadFile("pdf")}
                    disabled={downloading !== null}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    {downloading === "pdf" ? (
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="mr-1.5 h-4 w-4" />
                    )}
                    Download PDF
                  </Button>
                  <Button
                    onClick={() => downloadFile("ppt")}
                    disabled={downloading !== null}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    {downloading === "ppt" ? (
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    ) : (
                      <Presentation className="mr-1.5 h-4 w-4" />
                    )}
                    Download PPT
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => generateLecture(true)}>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Regenerate
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
