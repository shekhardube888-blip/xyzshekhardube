"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Sparkles,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MessageSquareQuote,
  ThumbsUp,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Week } from "./portal-weeks"

type Feedback = {
  verdict: "Strong" | "Solid" | "Needs work"
  oneLineSummary: string
  strengths: string[]
  gaps: string[]
  nextStep: string
}

type Phase = "idle" | "loading" | "ready" | "error"

const verdictStyle: Record<Feedback["verdict"], string> = {
  Strong: "border-emerald-300 bg-emerald-50 text-emerald-700",
  Solid: "border-violet-300 bg-violet-50 text-violet-700",
  "Needs work": "border-amber-300 bg-amber-50 text-amber-700",
}

export function AISolutionFeedback({
  week,
  solutionText,
}: {
  week: Week
  solutionText: string
}) {
  const { toast } = useToast()
  const [phase, setPhase] = useState<Phase>("idle")
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchFeedback = async () => {
    setPhase("loading")
    setError(null)
    try {
      const res = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekId: week.id,
          weekTitle: week.title,
          brand: week.scenario.brand,
          brief: week.scenario.brief,
          asks: week.scenario.asks,
          solutionText,
          minWords: week.minWords,
          maxWords: week.maxWords,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }
      const data = (await res.json()) as Feedback
      setFeedback(data)
      setPhase("ready")
      toast({
        title: "AI feedback ready",
        description: `Verdict: ${data.verdict}.`,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      setError(msg)
      setPhase("error")
      toast({
        title: "AI feedback failed",
        description: msg,
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-violet-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquareQuote className="h-5 w-5 text-violet-600" />
              AI mentor feedback on your solution
            </CardTitle>
            <CardDescription className="mt-1">
              The AI mentor reviews your submitted solution and gives you specific
              strengths, gaps, and a concrete next step.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {phase === "idle" && (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-violet-300 bg-violet-50/40 p-4">
            <p className="text-sm text-foreground">
              Submit your solution for AI review. You&apos;ll get a verdict
              (Strong / Solid / Needs work), 2–3 specific strengths, 2–3 specific
              gaps with hints, and a single next-step action.
            </p>
            <Button
              onClick={fetchFeedback}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              Get AI mentor feedback
            </Button>
          </div>
        )}

        {phase === "loading" && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <div className="flex items-center gap-2 text-xs text-violet-700">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Reviewing your submission… typically 5–15 seconds.
            </div>
          </div>
        )}

        {phase === "error" && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>AI feedback failed</AlertTitle>
            <AlertDescription className="mt-1">{error}</AlertDescription>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={fetchFeedback}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Retry
            </Button>
          </Alert>
        )}

        {phase === "ready" && feedback && (
          <div className="space-y-4">
            {/* Verdict */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={`text-xs ${verdictStyle[feedback.verdict]}`}>
                <CheckCircle2 className="mr-1 h-3 w-3" />
                {feedback.verdict}
              </Badge>
              <p className="flex-1 text-sm text-muted-foreground">{feedback.oneLineSummary}</p>
              <Button size="sm" variant="outline" onClick={fetchFeedback}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Re-review
              </Button>
            </div>

            {/* Strengths */}
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                <ThumbsUp className="h-3.5 w-3.5" />
                Strengths
              </p>
              <ul className="mt-2 space-y-1.5">
                {feedback.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50/40 p-2 text-sm text-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700">
                <AlertCircle className="h-3.5 w-3.5" />
                Gaps to address
              </p>
              <ul className="mt-2 space-y-1.5">
                {feedback.gaps.map((g, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50/40 p-2 text-sm text-foreground"
                  >
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Next step */}
            <div className="flex items-start gap-2 rounded-lg border border-violet-300 bg-violet-50/60 p-3 text-sm text-foreground">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
              <span>
                <span className="font-semibold text-violet-800">Your next step: </span>
                {feedback.nextStep}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
