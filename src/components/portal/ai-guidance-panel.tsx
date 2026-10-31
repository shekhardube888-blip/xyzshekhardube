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
  RefreshCw,
  Brain,
  Building2,
  Plug,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageSquareQuote,
  Wand2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Week } from "./portal-weeks"

type Guidance = {
  summary: string
  steps: { title: string; detail: string; aiToolExamples: string[] }[]
  industryExamples: { company: string; useCase: string; impact: string }[]
  erpIntegrations: { erp: string; integration: string; benefit: string }[]
  tryItPrompt: string
  caution: string
}

type Feedback = {
  verdict: "Strong" | "Solid" | "Needs work"
  oneLineSummary: string
  strengths: string[]
  gaps: string[]
  nextStep: string
}

type Phase = "idle" | "loading" | "ready" | "error"

const CACHE_KEY = "agileportal-ai-guidance-cache"

function loadCached(weekId: number): Guidance | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const map = JSON.parse(raw) as Record<number, Guidance>
    return map[weekId] ?? null
  } catch {
    return null
  }
}

function saveCached(weekId: number, g: Guidance) {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const map = raw ? (JSON.parse(raw) as Record<number, Guidance>) : {}
    map[weekId] = g
    localStorage.setItem(CACHE_KEY, JSON.stringify(map))
  } catch {
    /* ignore quota */
  }
}

export function AIGuidancePanel({ week }: { week: Week }) {
  const { toast } = useToast()
  const [phase, setPhase] = useState<Phase>("idle")
  const [guidance, setGuidance] = useState<Guidance | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Auto-load cached guidance on mount or when the active week changes,
  // so reloads + week switches show previously-generated guidance instantly
  // without a spinner.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage read
  useEffect(() => {
    const cached = loadCached(week.id)
    if (cached) {
      setGuidance(cached)
      setPhase("ready")
    } else {
      setGuidance(null)
      setPhase("idle")
    }
    setError(null)
  }, [week.id])

  const fetchGuidance = async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = loadCached(week.id)
      if (cached) {
        setGuidance(cached)
        setPhase("ready")
        return
      }
    }
    setPhase("loading")
    setError(null)
    try {
      const res = await fetch("/api/ai-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekId: week.id,
          weekTitle: week.title,
          weekObjective: week.objective,
          brand: week.scenario.brand,
          brief: week.scenario.brief,
          asks: week.scenario.asks,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }
      const data = (await res.json()) as Guidance
      setGuidance(data)
      saveCached(week.id, data)
      setPhase("ready")
      toast({
        title: "AI guidance ready",
        description: `Step-by-step AI usage guide for Week ${week.id} generated.`,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      setError(msg)
      setPhase("error")
      toast({
        title: "AI guidance failed",
        description: msg,
        variant: "destructive",
      })
    }
  }

  const copyPrompt = async () => {
    if (!guidance?.tryItPrompt) return
    try {
      await navigator.clipboard.writeText(guidance.tryItPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
      toast({ title: "Prompt copied", description: "Paste it into ChatGPT, Claude, or Gemini." })
    } catch {
      toast({ title: "Copy failed", description: "Select and copy the prompt manually." })
    }
  }

  return (
    <Card className="border-violet-200 bg-gradient-to-br from-violet-50/40 via-background to-background">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-violet-600" />
              AI Guidance — How AI is used in this domain
            </CardTitle>
            <CardDescription className="mt-1">
              Step-by-step AI usage, real industry examples, ERP integrations, and a
              copy-paste LLM prompt you can use right now.
            </CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0 border-violet-300 bg-violet-50 text-violet-700">
            <Brain className="mr-1 h-3 w-3" />
            LLM-powered
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {phase === "idle" && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-violet-300 bg-violet-50/40 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
              <Wand2 className="h-6 w-6 text-violet-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Get AI guidance for Week {week.id} — {week.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                The AI mentor will generate a 5-step guide on how AI &amp; LLMs are used
                in this domain in real industry — plus 3 industry examples, 3 ERP
                integrations, and a copy-paste prompt you can use to start applying AI.
              </p>
            </div>
            <Button
              onClick={() => fetchGuidance(false)}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              Generate AI guidance
            </Button>
          </div>
        )}

        {phase === "loading" && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <div className="flex items-center gap-2 text-xs text-violet-700">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Calling the LLM… typically 5–15 seconds.
            </div>
          </div>
        )}

        {phase === "error" && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>AI guidance failed</AlertTitle>
            <AlertDescription className="mt-1">{error}</AlertDescription>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => fetchGuidance(true)}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Retry
            </Button>
          </Alert>
        )}

        {phase === "ready" && guidance && (
          <GuidanceDisplay guidance={guidance} onCopyPrompt={copyPrompt} copied={copied} />
        )}
      </CardContent>

      {phase === "ready" && (
        <CardFooter className="justify-end border-t bg-muted/30 p-3">
          <Button variant="outline" size="sm" onClick={() => fetchGuidance(true)}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Regenerate
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

function GuidanceDisplay({
  guidance,
  onCopyPrompt,
  copied,
}: {
  guidance: Guidance
  onCopyPrompt: () => void
  copied: boolean
}) {
  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="rounded-lg border border-violet-200 bg-violet-50/60 p-3">
        <p className="flex items-start gap-2 text-sm text-foreground">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
          <span>
            <span className="font-semibold text-violet-800">In summary: </span>
            {guidance.summary}
          </span>
        </p>
      </div>

      {/* Steps */}
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-violet-700">
          <Brain className="h-3.5 w-3.5" />
          Step-by-step AI usage
        </p>
        <ol className="mt-3 space-y-3">
          {guidance.steps.map((s, i) => (
            <li key={i} className="rounded-lg border bg-background/60 p-3">
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                  {s.aiToolExamples?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.aiToolExamples.map((t, ti) => (
                        <Badge
                          key={ti}
                          variant="outline"
                          className="border-violet-200 bg-violet-50 text-[10px] text-violet-700"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Industry examples */}
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          <Building2 className="h-3.5 w-3.5" />
          How real companies use AI in this domain
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {guidance.industryExamples.map((ex, i) => (
            <li key={i} className="rounded-lg border bg-background/60 p-3">
              <p className="text-sm font-semibold text-foreground">{ex.company}</p>
              <p className="mt-1 text-xs text-muted-foreground">{ex.useCase}</p>
              <p className="mt-1.5 text-xs font-medium text-emerald-700">→ {ex.impact}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* ERP integrations */}
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700">
          <Plug className="h-3.5 w-3.5" />
          ERP + AI integrations (encouraged)
        </p>
        <ul className="mt-3 space-y-2">
          {guidance.erpIntegrations.map((e, i) => (
            <li key={i} className="rounded-lg border border-amber-200 bg-amber-50/40 p-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-amber-300 bg-background text-xs text-amber-700">
                  {e.erp}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-foreground">{e.integration}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-semibold text-amber-800">Benefit: </span>
                {e.benefit}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Try-it prompt */}
      <div className="rounded-lg border border-violet-300 bg-violet-50/60 p-3">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-violet-700">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            Try-it-yourself LLM prompt
          </p>
          <Button size="sm" variant="outline" onClick={onCopyPrompt} className="h-7 border-violet-300 text-violet-700 hover:bg-violet-100">
            {copied ? (
              <>
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-1 h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>
        </div>
        <pre className="mt-2 whitespace-pre-wrap rounded bg-background/80 p-3 text-xs text-foreground">
{guidance.tryItPrompt}
        </pre>
      </div>

      {/* Caution */}
      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <span className="font-semibold">Caution: </span>
          {guidance.caution}
        </span>
      </div>
    </div>
  )
}
