"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  Target,
  HelpCircle,
  Lightbulb,
  Upload,
  Lock,
  CheckCircle2,
  XCircle,
  Trophy,
  Building2,
  ListChecks,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { WEEKS, PASS_THRESHOLD, getWeeksForCategory, type Week } from "./portal-weeks"
import { useWeeklyProgress } from "./use-weekly-progress"
import { AIGuidancePanel } from "./ai-guidance-panel"
import { AISolutionFeedback } from "./ai-solution-feedback"
import { useApprovalStore } from "./approval-store"
import { useAuth } from "./auth-store"
import { useEnrollmentStore } from "./enrollment-store"

const QUESTIONS_PER_WEEK = 4

export function WeeklyTasksPanel() {
  const { toast } = useToast()
  const createApproval = useApprovalStore((s) => s.createRequest)
  const auth = useAuth()
  const { email } = auth
  const activeEnrollment = email ? useEnrollmentStore.getState().getActiveEnrollment(email) : null
  // Use category-specific weeks based on the active enrollment
  const WEEKS_FOR_CATEGORY = getWeeksForCategory(
    activeEnrollment?.category ?? auth.stream ?? "MBA",
    activeEnrollment?.subcategory,
  )
  const [activeWeekId, setActiveWeekId] = useState(1)
  const { mounted, getWeek, setAnswer, submitTest, submitSolution, completedWeeks } =
    useWeeklyProgress(QUESTIONS_PER_WEEK)

  // Unlock rule: week N is unlocked if week N-1 has BOTH test passed AND
  // solution submitted. Week 1 is always unlocked.
  const isUnlocked = (weekId: number): boolean => {
    if (weekId === 1) return true
    const prev = getWeek(weekId - 1)
    return prev.passed && prev.solution.submittedAt !== null
  }

  const activeWeek = useMemo(
    () => WEEKS_FOR_CATEGORY.find((w) => w.id === activeWeekId) ?? WEEKS_FOR_CATEGORY[0],
    [activeWeekId, WEEKS_FOR_CATEGORY],
  )

  const totalProgress = Math.round((completedWeeks / WEEKS_FOR_CATEGORY.length) * 100)

  const handleQuizSubmit = (week: Week) => {
    const correctIndexes = week.quiz.map((q) => q.correctIndex)
    const res = submitTest(week.id, correctIndexes)
    if (res.passed) {
      toast({
        title: `Week ${week.id} test passed!`,
        description: `You scored ${res.score}/${week.quiz.length}. Now submit the market scenario solution to unlock Week ${week.id + 1}.`,
      })
    } else {
      toast({
        title: `Week ${week.id} test — keep going`,
        description: `You scored ${res.score}/${week.quiz.length}. Pass threshold is ${PASS_THRESHOLD}. Re-attempt anytime.`,
        variant: "destructive",
      })
    }
  }

  const handleSolutionSubmit = (week: Week, text: string, url: string) => {
    submitSolution(week.id, text, url)
    const nextWeek = week.id + 1
    // Auto-create an approval request for the mentor to review
    createApproval({
      studentName: auth.name || "Anonymous Student",
      studentEmail: auth.email || "anonymous@agileportal.in",
      stream: auth.stream,
      type: "weekly_solution",
      stage: `Week ${week.id} — ${week.title}`,
      detail: `${text.trim().split(/\s+/).length}-word solution for ${week.scenario.brand}. ${url ? `Reference: ${url}` : "No reference link."}`,
    })
    toast({
      title: `Week ${week.id} solution submitted!`,
      description:
        nextWeek <= WEEKS_FOR_CATEGORY.length
          ? `Your market scenario solution is in review. Week ${nextWeek} is now unlocked — start the next task!`
          : `Capstone complete! Your final submission is in review.`,
    })
  }

  return (
    <section className="border-t border-emerald-200 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              Weekly Tasks · Tests · Market Scenarios
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Start your weekly internship work
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Each week unlocks after you pass the previous week&apos;s test AND submit your
              market scenario solution. Pass the test (≥ {PASS_THRESHOLD}/4 correct) and submit
              a {WEEKS_FOR_CATEGORY[0].minWords}–{WEEKS_FOR_CATEGORY[WEEKS_FOR_CATEGORY.length - 1].maxWords} word solution to advance.
            </p>
          </div>
          <Badge
            className="border-emerald-300 bg-emerald-100 text-emerald-800"
            variant="outline"
          >
            <Trophy className="mr-1 h-3 w-3" />
            {completedWeeks}/{WEEKS_FOR_CATEGORY.length} weeks complete
          </Badge>
        </div>

        {/* Overall progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Overall weekly-task completion</span>
            <span>{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} className="mt-1.5 h-2" />
        </div>

        {/* Week selector */}
        <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {WEEKS_FOR_CATEGORY.map((w) => {
            const unlocked = mounted ? isUnlocked(w.id) : false
            const wp = mounted ? getWeek(w.id) : null
            const weekComplete = wp?.passed && wp.solution.submittedAt !== null
            return (
              <button
                key={w.id}
                disabled={!unlocked}
                onClick={() => unlocked && setActiveWeekId(w.id)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-all ${
                  activeWeekId === w.id
                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-300"
                    : unlocked
                    ? "border-border bg-background hover:border-emerald-300 hover:bg-emerald-50/50"
                    : "border-border bg-muted/40 opacity-60 cursor-not-allowed"
                }`}
                title={unlocked ? w.title : "Locked — complete the previous week first"}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {w.short}
                </span>
                {weekComplete ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : !unlocked ? (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                ) : wp?.passed ? (
                  <span className="text-[10px] font-medium text-amber-600">Test passed</span>
                ) : null}
                <span className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">
                  {w.title}
                </span>
              </button>
            )
          })}
        </div>

        {/* Active week content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* LEFT — Task + Quiz */}
          <div className="space-y-6">
            <TaskCard week={activeWeek} />
            <QuizCard
              week={activeWeek}
              progress={mounted ? getWeek(activeWeek.id) : null}
              onAnswer={(qi, oi) => setAnswer(activeWeek.id, qi, oi)}
              onSubmit={() => handleQuizSubmit(activeWeek)}
            />
          </div>

          {/* RIGHT — Market scenario + Solution */}
          <div className="space-y-6">
            <ScenarioCard week={activeWeek} />
            <SolutionCard
              week={activeWeek}
              progress={mounted ? getWeek(activeWeek.id) : null}
              onSubmit={(text, url) => handleSolutionSubmit(activeWeek, text, url)}
            />
          </div>
        </div>

        {/* Full-width: AI guidance for this week */}
        <div className="mt-6">
          <AIGuidancePanel week={activeWeek} />
        </div>
      </div>
    </section>
  )
}

function TaskCard({ week }: { week: Week }) {
  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5 text-emerald-600" />
              Week {week.id} — {week.title}
            </CardTitle>
            <CardDescription className="mt-1">{week.objective}</CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            <Clock className="mr-1 h-3 w-3" />
            ~{week.estimatedMinutes} min
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-muted/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Task brief
          </p>
          <p className="mt-1 text-sm text-foreground">{week.task}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function QuizCard({
  week,
  progress,
  onAnswer,
  onSubmit,
}: {
  week: Week
  progress: { answers: number[]; score: number; passed: boolean } | null
  onAnswer: (qIndex: number, optionIndex: number) => void
  onSubmit: () => void
}) {
  const answers = progress?.answers ?? Array.from({ length: week.quiz.length }, () => -1)
  const allAnswered = answers.every((a) => a >= 0)
  const submitted = !!progress && (progress.passed || progress.score > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <HelpCircle className="h-5 w-5 text-violet-600" />
          Weekly test
        </CardTitle>
        <CardDescription>
          {week.quiz.length} questions · pass with ≥ {PASS_THRESHOLD} correct to advance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {week.quiz.map((q, qi) => {
          const picked = answers[qi]
          const showResult = submitted
          return (
            <div key={qi} className="rounded-lg border bg-background/60 p-4">
              <p className="text-sm font-medium text-foreground">
                <span className="text-muted-foreground">Q{qi + 1}.</span> {q.q}
              </p>
              <RadioGroup
                value={picked >= 0 ? String(picked) : ""}
                onValueChange={(val) => onAnswer(qi, Number(val))}
                className="mt-3 space-y-2"
                disabled={submitted}
              >
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.correctIndex
                  const isPicked = picked === oi
                  let optClass =
                    "flex items-center gap-2 rounded-md border p-2.5 text-sm transition-colors"
                  if (showResult && isCorrect) {
                    optClass += " border-emerald-400 bg-emerald-50"
                  } else if (showResult && isPicked && !isCorrect) {
                    optClass += " border-rose-400 bg-rose-50"
                  } else if (isPicked) {
                    optClass += " border-violet-300 bg-violet-50/40"
                  } else {
                    optClass += " hover:bg-muted/40"
                  }
                  return (
                    <Label key={oi} className={optClass} htmlFor={`w${week.id}-q${qi}-o${oi}`}>
                      <RadioGroupItem
                        id={`w${week.id}-q${qi}-o${oi}`}
                        value={String(oi)}
                        className="mt-0"
                      />
                      <span className="flex-1">{opt}</span>
                      {showResult && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      )}
                      {showResult && isPicked && !isCorrect && (
                        <XCircle className="h-4 w-4 text-rose-600" />
                      )}
                    </Label>
                  )
                })}
              </RadioGroup>
              {showResult && (
                <p className="mt-2 rounded bg-muted/60 p-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Explanation: </span>
                  {q.explanation}
                </p>
              )}
            </div>
          )
        })}
      </CardContent>
      <CardFooter className="justify-between border-t bg-muted/30 p-4">
        <div className="text-sm">
          {submitted ? (
            <span className={progress?.passed ? "text-emerald-700" : "text-rose-700"}>
              Score: <strong>{progress?.score}/{week.quiz.length}</strong> ·{" "}
              {progress?.passed ? "Passed" : "Below pass threshold"}
            </span>
          ) : (
            <span className="text-muted-foreground">
              {allAnswered
                ? "Ready to submit"
                : `${answers.filter((a) => a >= 0).length}/${week.quiz.length} answered`}
            </span>
          )}
        </div>
        <Button
          disabled={!allAnswered || submitted}
          onClick={onSubmit}
          className={submitted ? "bg-emerald-600 hover:bg-emerald-700" : "bg-violet-600 hover:bg-violet-700"}
        >
          {submitted ? (
            <>
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Submitted
            </>
          ) : (
            <>
              <Target className="mr-1.5 h-4 w-4" />
              Submit test
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

function ScenarioCard({ week }: { week: Week }) {
  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-5 w-5 text-amber-600" />
          Market Scenario
        </CardTitle>
        <CardDescription>
          Real Indian D2C brand brief — apply this week&apos;s concepts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">
              {week.scenario.brand}
            </p>
          </div>
          <p className="mt-2 text-sm text-foreground leading-relaxed">
            {week.scenario.brief}
          </p>
          <div className="mt-3 border-t border-amber-200 pt-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700">
              <ListChecks className="h-3.5 w-3.5" />
              The asks
            </p>
            <ul className="mt-2 space-y-1.5">
              {week.scenario.asks.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-800">
                    {i + 1}
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SolutionCard({
  week,
  progress,
  onSubmit,
}: {
  week: Week
  progress: { solution: { text: string; referenceUrl: string; submittedAt: number | null }; passed: boolean } | null
  onSubmit: (text: string, url: string) => void
}) {
  const [text, setText] = useState(progress?.solution.text ?? "")
  const [url, setUrl] = useState(progress?.solution.referenceUrl ?? "")
  const submittedAt = progress?.solution.submittedAt ?? null
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const withinRange = wordCount >= week.minWords && wordCount <= week.maxWords

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Upload className="h-5 w-5 text-emerald-600" />
          Submit your solution
        </CardTitle>
        <CardDescription>
          {week.minWords}–{week.maxWords} words · submit to unlock the next week
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-emerald-50/40 p-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Prompt
          </p>
          <p className="mt-1 text-foreground">{week.solutionPrompt}</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor={`sol-text-${week.id}`} className="text-xs">
              Your solution writeup
            </Label>
            <span
              className={`text-xs ${
                wordCount === 0
                  ? "text-muted-foreground"
                  : withinRange
                  ? "text-emerald-700"
                  : "text-amber-700"
              }`}
            >
              {wordCount} / {week.minWords}–{week.maxWords} words
            </span>
          </div>
          <Textarea
            id={`sol-text-${week.id}`}
            placeholder={`Write your solution here — aim for ${week.minWords}–${week.maxWords} words.`}
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submittedAt !== null}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`sol-url-${week.id}`} className="text-xs">
            Reference link (optional — Google Drive / GitHub / Notion)
          </Label>
          <Input
            id={`sol-url-${week.id}`}
            placeholder="https://drive.google.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={submittedAt !== null}
          />
        </div>

        {submittedAt !== null && (
          <>
            <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Submitted on {new Date(submittedAt).toLocaleString()}
              {!progress?.passed && (
                <span className="ml-auto text-amber-700">
                  · Note: pass the test above too to unlock the next week
                </span>
              )}
            </div>
            {/* AI mentor feedback — only after submission */}
            <AISolutionFeedback week={week} solutionText={text} />
          </>
        )}
      </CardContent>
      <CardFooter className="justify-between border-t bg-muted/30 p-4">
        <span className="text-xs text-muted-foreground">
          {submittedAt !== null ? (
            "Solution locked — already submitted"
          ) : !withinRange && wordCount > 0 ? (
            <span className="text-amber-700">
              Word count out of range — adjust before submitting
            </span>
          ) : (
            <span>Auto-saved locally as you type</span>
          )}
        </span>
        <Button
          disabled={submittedAt !== null || !withinRange}
          onClick={() => onSubmit(text, url)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Upload className="mr-1.5 h-4 w-4" />
          Submit solution
        </Button>
      </CardFooter>
    </Card>
  )
}
