"use client"

/* eslint-disable react-hooks/set-state-in-effect -- reset decisions on new game start; safe one-shot setState in effect */

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Trophy,
  Play,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  Award,
  Smile,
  Newspaper,
  Factory,
  Megaphone,
  FlaskConical,
  Tag,
  Truck,
  ChevronRight,
  Crown,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  SIM_TOTAL_QUARTERS,
  SIM_DEFAULT_DECISIONS,
  SIM_CONSTANTS,
  formatINR,
  computeFinalGrade,
  type Decisions,
  type QuarterResult,
} from "./simulation-engine"
import { useSimulation } from "./simulation-store"
import { useMounted } from "./use-test-progress"

export function SimulationGamePanel() {
  const mounted = useMounted()
  const { status, currentQuarter, cash, brandEquity, customerSatisfaction, history, startGame, resetGame } =
    useSimulation()
  const [decisions, setDecisions] = useState<Decisions>(SIM_DEFAULT_DECISIONS)
  const [lastResult, setLastResult] = useState<QuarterResult | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Reset decisions when a new game starts
  useEffect(() => {
    if (status === "running" && history.length === 0) {
      setDecisions(SIM_DEFAULT_DECISIONS)
    }
  }, [status, history.length])

  if (!mounted) return null

  // ---- Intro screen ----
  if (status === "intro") {
    return (
      <section className="border-t border-violet-200 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <IntroCard onStart={() => startGame()} />
        </div>
      </section>
    )
  }

  // ---- Finished screen ----
  if (status === "finished") {
    const grade = computeFinalGrade({
      status,
      currentQuarter,
      cash,
      brandEquity,
      customerSatisfaction,
      history,
    })
    return (
      <section className="border-t border-violet-200 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <FinishedCard
            grade={grade}
            history={history}
            cash={cash}
            brandEquity={brandEquity}
            onRestart={() => {
              resetGame()
              setLastResult(null)
              setShowResults(false)
            }}
          />
        </div>
      </section>
    )
  }

  // ---- Running screen ----
  const progressPct = ((currentQuarter - 1) / SIM_TOTAL_QUARTERS) * 100

  return (
    <section className="border-t border-violet-200 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
              D2C Brand Simulator · MBA/BBA Business Strategy Game
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Quarter {currentQuarter} of {SIM_TOTAL_QUARTERS}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Make this quarter&apos;s decisions and run the simulation to see your market share,
              profit, and brand-equity impact.
            </p>
          </div>
          <Badge className="border-violet-300 bg-violet-100 text-violet-800">
            <Crown className="mr-1 h-3 w-3" />
            Live Simulation
          </Badge>
        </div>

        {/* Progress + KPIs */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Game progress</span>
            <span>{currentQuarter - 1}/{SIM_TOTAL_QUARTERS} quarters completed</span>
          </div>
          <Progress value={progressPct} className="mt-1.5 h-2" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiPill label="Cash" value={formatINR(cash)} icon={Wallet} accent="text-emerald-600" danger={cash < 0} />
          <KpiPill label="Brand equity" value={`${brandEquity.toFixed(0)}/100`} icon={Award} accent="text-violet-600" />
          <KpiPill label="Customer sat." value={`${customerSatisfaction.toFixed(0)}/100`} icon={Smile} accent="text-amber-600" />
          <KpiPill label="Last share" value={`${history[history.length - 1]?.marketShare.toFixed(1) ?? "—"}%`} icon={Users} accent="text-teal-600" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* LEFT — Decision form */}
          <Card className="border-violet-200">
            <CardHeader>
              <CardTitle className="text-base">Decisions for Q{currentQuarter}</CardTitle>
              <CardDescription>
                Set 5 levers — the engine will compute demand, costs, profit, and market share.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <DecisionSlider
                label="Price per unit"
                icon={Tag}
                value={decisions.price}
                min={100}
                max={500}
                step={10}
                onChange={(v) => setDecisions((d) => ({ ...d, price: v }))}
                format={(v) => `₹${v}`}
                hint="Lower price = higher demand, but lower revenue per unit. Variable cost is ₹100/unit."
              />
              <DecisionSlider
                label="Marketing spend"
                icon={Megaphone}
                value={decisions.marketing}
                min={0}
                max={1_000_000}
                step={50_000}
                onChange={(v) => setDecisions((d) => ({ ...d, marketing: v }))}
                format={(v) => formatINR(v)}
                hint="Boosts demand and brand equity. ₹0 = no marketing push."
              />
              <DecisionSlider
                label="R&D investment"
                icon={FlaskConical}
                value={decisions.rnd}
                min={0}
                max={1_000_000}
                step={50_000}
                onChange={(v) => setDecisions((d) => ({ ...d, rnd: v }))}
                format={(v) => formatINR(v)}
                hint="Improves product quality → higher csat + brand equity. Lets you charge a premium."
              />
              <DecisionSlider
                label="Production volume"
                icon={Factory}
                value={decisions.production}
                min={0}
                max={20_000}
                step={500}
                onChange={(v) => setDecisions((d) => ({ ...d, production: v }))}
                format={(v) => `${v.toLocaleString()} units`}
                hint="Match demand to avoid stockouts (lost sales) or overproduction (wasted cost)."
              />
              <DecisionSlider
                label="Channel mix (online %)"
                icon={Truck}
                value={decisions.channelOnline}
                min={0}
                max={100}
                step={5}
                onChange={(v) => setDecisions((d) => ({ ...d, channelOnline: v }))}
                format={(v) => `${v}% online / ${100 - v}% retail`}
                hint="Online channel favors digital-native D2C audience in this simulation."
              />
            </CardContent>
            <CardFooter className="justify-between border-t bg-muted/30 p-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetGame()
                  setLastResult(null)
                  setShowResults(false)
                }}
              >
                <RotateCcw className="mr-1.5 h-4 w-4" />
                Restart
              </Button>
              <Button
                className="bg-violet-600 hover:bg-violet-700"
                onClick={() => {
                  const result = useSimulation.getState().advanceQuarter(decisions)
                  setLastResult(result)
                  setShowResults(true)
                }}
              >
                <Play className="mr-1.5 h-4 w-4" />
                Run Q{currentQuarter}
              </Button>
            </CardFooter>
          </Card>

          {/* RIGHT — Competitor preview + recent history */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI competitors this quarter</CardTitle>
                <CardDescription>
                  3 AI brands with fixed strategies. You compete against them for the 50,000-unit market.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "ValueMart", desc: "Aggressive low-price, high volume", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
                  { name: "PremiumCo", desc: "Premium pricing, high R&D + marketing", color: "bg-amber-100 text-amber-700 border-amber-200" },
                  { name: "MidBrand", desc: "Balanced mid-market strategy", color: "bg-teal-100 text-teal-700 border-teal-200" },
                ].map((c) => (
                  <div key={c.name} className="flex items-center gap-3 rounded-md border bg-background/60 p-3">
                    <Badge variant="outline" className={`text-[10px] ${c.color}`}>
                      {c.name}
                    </Badge>
                    <p className="flex-1 text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quarter history</CardTitle>
                <CardDescription>
                  {history.length === 0 ? "No quarters run yet." : `${history.length} quarter${history.length > 1 ? "s" : ""} completed.`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {history.length === 0 ? (
                  <p className="px-6 py-6 text-center text-xs text-muted-foreground">
                    Run Q{currentQuarter} to see your first results here.
                  </p>
                ) : (
                  <Accordion type="single" collapsible>
                    {[...history].reverse().map((q) => (
                      <AccordionItem key={q.quarter} value={`q${q.quarter}`} className="border-b">
                        <AccordionTrigger className="px-6 hover:no-underline">
                          <div className="flex flex-1 items-center gap-2 pr-3 text-left">
                            <Newspaper className="h-4 w-4 shrink-0 text-violet-600" />
                            <span className="flex-1 truncate text-sm text-foreground">
                              {q.headline}
                            </span>
                            <span
                              className={`text-xs font-semibold ${
                                q.profit >= 0 ? "text-emerald-700" : "text-rose-700"
                              }`}
                            >
                              {q.profit >= 0 ? "+" : ""}
                              {formatINR(q.profit)}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-3 text-xs text-muted-foreground">
                          <QuarterResultDetails q={q} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Results dialog after running a quarter */}
      {lastResult && (
        <ResultsDialog
          result={lastResult}
          open={showResults}
          onOpenChange={(o) => setShowResults(o)}
        />
      )}
    </section>
  )
}

// ---------- Intro ----------

function IntroCard({ onStart }: { onStart: () => void }) {
  return (
    <Card className="border-violet-200 bg-gradient-to-br from-violet-50/60 to-background">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
              Simulation Game · MBA/BBA Syllabus
            </p>
            <CardTitle className="mt-1 text-2xl">D2C Brand Simulator</CardTitle>
            <CardDescription className="mt-1">
              Run a fictional D2C brand across {SIM_TOTAL_QUARTERS} quarters. Make pricing,
              marketing, R&amp;D, production, and channel decisions each quarter — the engine
              computes your market share, profit, and brand equity vs 3 AI competitors.
            </CardDescription>
          </div>
          <Badge className="border-violet-300 bg-violet-100 text-violet-800">
            <Crown className="mr-1 h-3 w-3" />
            Strategy Sim
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill label="Quarters" value={`${SIM_TOTAL_QUARTERS}`} icon={Play} />
          <StatPill label="Starting cash" value={formatINR(SIM_CONSTANTS.STARTING_CASH)} icon={Wallet} />
          <StatPill label="Total market" value={`${(SIM_CONSTANTS.TOTAL_MARKET_DEMAND / 1000).toFixed(0)}K units/q`} icon={Users} />
          <StatPill label="AI rivals" value="3 brands" icon={Trophy} />
        </div>

        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            How grading works (final grade A/B/C/D)
          </p>
          <ul className="mt-2 space-y-1 text-xs text-foreground">
            <li><strong>A:</strong> Cash ≥ ₹1Cr · Brand equity ≥ 75 · Avg market share ≥ 25%</li>
            <li><strong>B:</strong> Cash ≥ ₹50L · Brand equity ≥ 60 · Avg market share ≥ 15%</li>
            <li><strong>C:</strong> Cash ≥ ₹0 · Brand equity ≥ 45</li>
            <li><strong>D:</strong> Bankrupt or below C thresholds</li>
          </ul>
        </div>

        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800">
          <Newspaper className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Each decision affects the next quarter. Stockouts lose sales permanently. Losses erode
            brand equity. Negative cash ends the game immediately (bankrupt).
          </span>
        </div>
      </CardContent>
      <CardFooter className="justify-end border-t bg-muted/30 p-3">
        <Button onClick={onStart} className="bg-violet-600 hover:bg-violet-700">
          <Play className="mr-1.5 h-4 w-4" />
          Start simulation
        </Button>
      </CardFooter>
    </Card>
  )
}

// ---------- Finished ----------

function FinishedCard({
  grade,
  history,
  cash,
  brandEquity,
  onRestart,
}: {
  grade: ReturnType<typeof computeFinalGrade>
  history: QuarterResult[]
  cash: number
  brandEquity: number
  onRestart: () => void
}) {
  const gradeColor: Record<string, string> = {
    A: "border-emerald-300 bg-emerald-50 text-emerald-700",
    B: "border-violet-300 bg-violet-50 text-violet-700",
    C: "border-amber-300 bg-amber-50 text-amber-700",
    D: "border-rose-300 bg-rose-50 text-rose-700",
  }
  return (
    <Card className={`border-2 ${gradeColor[grade.grade]}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide">Simulation complete</p>
            <CardTitle className="mt-1 flex items-center gap-3 text-3xl">
              <span className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold text-white ${
                grade.grade === "A" ? "bg-emerald-600"
                : grade.grade === "B" ? "bg-violet-600"
                : grade.grade === "C" ? "bg-amber-600"
                : "bg-rose-600"
              }`}>
                {grade.grade}
              </span>
              Final grade
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-foreground">
              {grade.summary}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill label="Final cash" value={formatINR(grade.metrics.cash)} icon={Wallet} />
          <StatPill label="Brand equity" value={`${grade.metrics.brandEquity.toFixed(0)}/100`} icon={Award} />
          <StatPill label="Avg market share" value={`${grade.metrics.avgMarketShare.toFixed(1)}%`} icon={Users} />
          <StatPill label="Total profit" value={formatINR(grade.metrics.totalProfit)} icon={grade.metrics.totalProfit >= 0 ? TrendingUp : TrendingDown} />
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="history" className="border-b">
            <AccordionTrigger className="hover:no-underline">
              <span className="text-sm font-semibold">Full quarter-by-quarter history ({history.length})</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {history.map((q) => (
                <div key={q.quarter} className="rounded-md border bg-background p-3">
                  <p className="text-xs font-semibold text-foreground">{q.headline}</p>
                  <QuarterResultDetails q={q} />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="justify-end border-t bg-muted/30 p-3">
        <Button onClick={onRestart} className="bg-violet-600 hover:bg-violet-700">
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Play again
        </Button>
      </CardFooter>
    </Card>
  )
}

// ---------- Results dialog (shown after each quarter) ----------

function ResultsDialog({
  result,
  open,
  onOpenChange,
}: {
  result: QuarterResult
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const profitable = result.profit >= 0
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 sm:rounded-xl">
        <DialogHeader className="border-b bg-violet-50/60 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Newspaper className="h-5 w-5 text-violet-600" />
            Q{result.quarter} results
          </DialogTitle>
          <DialogDescription className="text-sm text-foreground">
            {result.headline}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-6">
          {/* KPI grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatPill
              label="Profit"
              value={formatINR(result.profit)}
              icon={profitable ? TrendingUp : TrendingDown}
            />
            <StatPill label="Revenue" value={formatINR(result.revenue)} icon={Wallet} />
            <StatPill label="Market share" value={`${result.marketShare.toFixed(1)}%`} icon={Users} />
            <StatPill label="Units sold" value={`${result.unitsSold.toLocaleString()}`} icon={Factory} />
          </div>

          {/* Demand vs supply */}
          <div className="rounded-lg border bg-muted/40 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Demand</span>
              <strong className="text-foreground">{result.demand.toLocaleString()} units</strong>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-muted-foreground">Produced</span>
              <strong className="text-foreground">{result.decisions.production.toLocaleString()} units</strong>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-muted-foreground">Sold</span>
              <strong className="text-foreground">{result.unitsSold.toLocaleString()} units</strong>
            </div>
            {result.demand > result.decisions.production && (
              <p className="mt-2 rounded bg-rose-50 p-2 text-xs text-rose-700">
                ⚠ Stockout: lost {(result.demand - result.decisions.production).toLocaleString()} units of demand.
              </p>
            )}
          </div>

          {/* Costs breakdown */}
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Costs breakdown
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="flex justify-between"><span className="text-muted-foreground">Production ({result.decisions.production.toLocaleString()} × ₹100)</span><span>{formatINR(result.costs.production)}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Marketing</span><span>{formatINR(result.costs.marketing)}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">R&amp;D</span><span>{formatINR(result.costs.rnd)}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Fixed costs</span><span>{formatINR(result.costs.fixed)}</span></li>
              <li className="mt-1 flex justify-between border-t pt-1 font-semibold"><span>Total costs</span><span>{formatINR(result.costs.total)}</span></li>
            </ul>
          </div>

          {/* Competitor table */}
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Market share vs competitors
            </p>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="text-left font-medium">Brand</th>
                  <th className="text-right font-medium">Price</th>
                  <th className="text-right font-medium">Share</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t font-medium">
                  <td className="py-1.5 text-foreground">You</td>
                  <td className="text-right">₹{result.decisions.price}</td>
                  <td className="text-right text-emerald-700">{result.marketShare.toFixed(1)}%</td>
                </tr>
                {result.competitors.map((c) => (
                  <tr key={c.name} className="border-t">
                    <td className="py-1.5 text-muted-foreground">{c.name}</td>
                    <td className="text-right text-muted-foreground">₹{c.decisions.price}</td>
                    <td className="text-right text-muted-foreground">{c.marketShare.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Updated brand metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border bg-background p-2">
              <p className="text-[10px] uppercase text-muted-foreground">Cash after</p>
              <p className={`text-sm font-semibold ${result.cashAfter < 0 ? "text-rose-700" : "text-emerald-700"}`}>
                {formatINR(result.cashAfter)}
              </p>
            </div>
            <div className="rounded-lg border bg-background p-2">
              <p className="text-[10px] uppercase text-muted-foreground">Brand equity</p>
              <p className="text-sm font-semibold text-violet-700">{result.brandEquityAfter.toFixed(0)}/100</p>
            </div>
            <div className="rounded-lg border bg-background p-2">
              <p className="text-[10px] uppercase text-muted-foreground">CSAT</p>
              <p className="text-sm font-semibold text-amber-700">{result.customerSatisfactionAfter.toFixed(0)}/100</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t bg-muted/30 px-6 py-3">
          <Button onClick={() => onOpenChange(false)} className="bg-violet-600 hover:bg-violet-700">
            <ChevronRight className="mr-1.5 h-4 w-4" />
            Continue to next quarter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ---------- Sub-components ----------

function DecisionSlider({
  label,
  icon: Icon,
  value,
  min,
  max,
  step,
  onChange,
  format,
  hint,
}: {
  label: string
  icon: typeof Tag
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format: (v: number) => string
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-xs">
          <Icon className="h-3.5 w-3.5 text-violet-600" />
          {label}
        </Label>
        <span className="font-mono text-xs font-semibold text-foreground">{format(value)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
      />
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

function KpiPill({
  label,
  value,
  icon: Icon,
  accent,
  danger,
}: {
  label: string
  value: string
  icon: typeof Tag
  accent: string
  danger?: boolean
}) {
  return (
    <Card className={danger ? "border-rose-300" : "border-border"}>
      <CardContent className="flex items-center gap-2 p-3">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 ${danger ? "text-rose-600" : accent}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className={`text-sm font-bold leading-none ${danger ? "text-rose-700" : "text-foreground"}`}>{value}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StatPill({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof Tag
}) {
  return (
    <div className="rounded-lg border bg-background p-2.5 text-center">
      <Icon className="mx-auto h-4 w-4 text-violet-600" />
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}

function QuarterResultDetails({ q }: { q: QuarterResult }) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-3 text-xs">
        <span>Revenue: <strong className="text-foreground">{formatINR(q.revenue)}</strong></span>
        <span>Costs: <strong className="text-foreground">{formatINR(q.costs.total)}</strong></span>
        <span>Profit: <strong className={q.profit >= 0 ? "text-emerald-700" : "text-rose-700"}>{formatINR(q.profit)}</strong></span>
        <span>Share: <strong className="text-foreground">{q.marketShare.toFixed(1)}%</strong></span>
        <span>Units: <strong className="text-foreground">{q.unitsSold.toLocaleString()}/{q.demand.toLocaleString()}</strong></span>
      </div>
      <div className="text-[11px] text-muted-foreground">
        Decisions: Price ₹{q.decisions.price} · Mktg {formatINR(q.decisions.marketing)} · R&D {formatINR(q.decisions.rnd)} · Prod {q.decisions.production.toLocaleString()} · Online {q.decisions.channelOnline}%
      </div>
    </div>
  )
}
