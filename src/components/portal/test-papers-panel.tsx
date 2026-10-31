"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Send,
  Award,
  BarChart3,
  Timer,
  ListChecks,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TEST_PAPERS, PASS_THRESHOLD_PCT, type TestPaper } from "./portal-tests"
import {
  useTestProgress,
  useTestProgressHelpers,
  useMounted,
  type TestAttempt,
} from "./use-test-progress"

const trackColor: Record<TestPaper["track"], string> = {
  MBA: "bg-emerald-100 text-emerald-700 border-emerald-200",
  BBA: "bg-amber-100 text-amber-700 border-amber-200",
  BSc: "bg-teal-100 text-teal-700 border-teal-200",
}

const difficultyColor: Record<TestPaper["difficulty"], string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  Advanced: "bg-rose-50 text-rose-700 border-rose-200",
}

export function TestPapersPanel() {
  const mounted = useMounted()
  const { getBest, getLast, stats } = useTestProgressHelpers()
  const [activePaper, setActivePaper] = useState<TestPaper | null>(null)
  const [lastAttempt, setLastAttempt] = useState<TestAttempt | null>(null)

  const openRunner = (paper: TestPaper) => {
    setActivePaper(paper)
    setLastAttempt(null)
  }

  const closeRunner = () => {
    setActivePaper(null)
    setLastAttempt(null)
  }

  const onAttemptRecorded = (attempt: TestAttempt) => {
    setLastAttempt(attempt)
  }

  return (
    <section className="border-t border-emerald-200 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
              Test Papers · Timed exams on selected subjects &amp; internships
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Take a test paper
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {TEST_PAPERS.length} timed exams across MBA, BBA, and BSc tracks. Each paper:
              10 MCQs · 15-minute timer · auto-graded instantly · pass threshold{" "}
              {PASS_THRESHOLD_PCT}%.
            </p>
          </div>
          {mounted && (
            <div className="flex flex-wrap gap-3 text-xs">
              <Badge variant="outline" className="gap-1 border-violet-300 bg-violet-50 text-violet-700">
                <ListChecks className="h-3 w-3" />
                {stats.totalAttempts} attempts
              </Badge>
              <Badge variant="outline" className="gap-1 border-emerald-300 bg-emerald-50 text-emerald-700">
                <Trophy className="h-3 w-3" />
                {stats.uniquePassed}/{TEST_PAPERS.length} passed
              </Badge>
              <Badge variant="outline" className="gap-1 border-amber-300 bg-amber-50 text-amber-700">
                <BarChart3 className="h-3 w-3" />
                Avg score: {stats.avgScore}%
              </Badge>
            </div>
          )}
        </div>

        {/* Test paper grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEST_PAPERS.map((paper) => {
            const best = mounted ? getBest(paper.id) : null
            const last = mounted ? getLast(paper.id) : null
            return (
              <TestPaperCard
                key={paper.id}
                paper={paper}
                bestScore={best?.percentage}
                bestPassed={best?.passed}
                attemptsCount={best ? 1 : 0}
                lastAttemptedAt={last?.submittedAt}
                onStart={() => openRunner(paper)}
              />
            )
          })}
        </div>
      </div>

      {/* Test runner dialog */}
      {activePaper && (
        <TestRunnerDialog
          paper={activePaper}
          lastAttempt={lastAttempt}
          onClose={closeRunner}
          onAttemptRecorded={onAttemptRecorded}
        />
      )}
    </section>
  )
}

function TestPaperCard({
  paper,
  bestScore,
  bestPassed,
  attemptsCount,
  lastAttemptedAt,
  onStart,
}: {
  paper: TestPaper
  bestScore?: number
  bestPassed?: boolean
  attemptsCount: number
  lastAttemptedAt?: number
  onStart: () => void
}) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className={`text-[10px] ${trackColor[paper.track]}`}>
            {paper.track}
          </Badge>
          <Badge variant="outline" className={`text-[10px] ${difficultyColor[paper.difficulty]}`}>
            {paper.difficulty}
          </Badge>
        </div>
        <CardTitle className="mt-2 flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-violet-600" />
          {paper.title}
        </CardTitle>
        <CardDescription className="text-xs">{paper.subject}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground">{paper.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ListChecks className="h-3.5 w-3.5" />
            {paper.questions.length} questions
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {paper.durationMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Award className="h-3.5 w-3.5" />
            {paper.totalMarks} marks
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {paper.topics.slice(0, 4).map((t) => (
            <Badge key={t} variant="secondary" className="text-[10px] font-normal">
              {t}
            </Badge>
          ))}
        </div>

        {bestScore !== undefined && (
          <div
            className={`rounded-md border p-2 text-xs ${
              bestPassed
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Best: {bestScore}%
              </span>
              <span>{bestPassed ? "Passed" : "Below threshold"}</span>
            </div>
            {lastAttemptedAt && (
              <p className="mt-1 text-[10px] opacity-80">
                Last: {new Date(lastAttemptedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto border-t bg-muted/30 p-3">
        <Button
          onClick={onStart}
          className="w-full bg-violet-600 hover:bg-violet-700"
        >
          {bestScore !== undefined ? "Retake test" : "Start test"}
        </Button>
      </CardFooter>
    </Card>
  )
}

// ---------- Test runner + results (in a dialog) ----------

function TestRunnerDialog({
  paper,
  lastAttempt,
  onClose,
  onAttemptRecorded,
}: {
  paper: TestPaper
  lastAttempt: TestAttempt | null
  onClose: () => void
  onAttemptRecorded: (a: TestAttempt) => void
}) {
  const { toast } = useToast()
  const recordAttempt = useTestProgress((s) => s.recordAttempt)

  // Quiz state
  const [answers, setAnswers] = useState<number[]>(
    Array.from({ length: paper.questions.length }, () => -1),
  )
  const [currentIdx, setCurrentIdx] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [phase, setPhase] = useState<"intro" | "running" | "confirm-submit" | "results">("intro")
  const [submittedAttempt, setSubmittedAttempt] = useState<TestAttempt | null>(null)

  // Timer — counts down from durationMinutes
  const durationSec = paper.durationMinutes * 60
  const [timeLeft, setTimeLeft] = useState(durationSec)

  // Tick timer every second while running
  useEffect(() => {
    if (phase !== "running") return
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval)
          // Auto-submit when time runs out
          submitTest(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const startTest = () => {
    setAnswers(Array.from({ length: paper.questions.length }, () => -1))
    setCurrentIdx(0)
    setTimeLeft(durationSec)
    setStartedAt(Date.now())
    setPhase("running")
  }

  const setAnswer = (qIdx: number, optionIdx: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[qIdx] = optionIdx
      return next
    })
  }

  const submitTest = (auto = false) => {
    let score = 0
    paper.questions.forEach((question, i) => {
      if (answers[i] === question.correctIndex) {
        score += question.marks
      }
    })
    const percentage = Math.round((score / paper.totalMarks) * 100)
    const passed = percentage >= paper.passThreshold
    const timeTakenSec = startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0

    const attempt: TestAttempt = {
      paperId: paper.id,
      attemptId: `att_${Date.now().toString(36)}`,
      score,
      totalMarks: paper.totalMarks,
      percentage,
      passed,
      timeTakenSec,
      answers,
      submittedAt: Date.now(),
    }
    recordAttempt(attempt)
    setSubmittedAttempt(attempt)
    setPhase("results")
    onAttemptRecorded(attempt)
    toast({
      title: auto ? "Time up — auto-submitted!" : "Test submitted",
      description: `Scored ${score}/${paper.totalMarks} (${percentage}%) — ${passed ? "Passed" : "Below threshold"}.`,
      variant: passed ? "default" : "destructive",
    })
  }

  const retakeTest = () => {
    setSubmittedAttempt(null)
    setLastAttemptState(null)
    setPhase("intro")
  }

  // Hack: clearing lastAttempt state without prop mutation
  const [, setLastAttemptState] = useState<TestAttempt | null>(lastAttempt)
  void setLastAttemptState

  const answeredCount = answers.filter((a) => a >= 0).length
  const mm = Math.floor(timeLeft / 60)
  const ss = timeLeft % 60
  const timeStr = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
  const lowTime = timeLeft <= 60

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl p-0 sm:rounded-xl">
        {/* Header strip */}
        <div className="flex items-center justify-between gap-3 border-b bg-violet-50/60 px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
              {paper.subject}
            </p>
            <DialogTitle className="text-base font-semibold text-foreground">
              {paper.title}
            </DialogTitle>
          </div>
          {phase === "running" && (
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-mono font-semibold ${
                lowTime
                  ? "border-rose-300 bg-rose-50 text-rose-700"
                  : "border-violet-300 bg-background text-violet-700"
              }`}
            >
              <Timer className="h-4 w-4" />
              {timeStr}
            </div>
          )}
        </div>

        {/* Phase: intro */}
        {phase === "intro" && (
          <IntroPhase paper={paper} onStart={startTest} onClose={onClose} />
        )}

        {/* Phase: running */}
        {phase === "running" && (
          <RunningPhase
            paper={paper}
            currentIdx={currentIdx}
            setCurrentIdx={setCurrentIdx}
            answers={answers}
            setAnswer={setAnswer}
            answeredCount={answeredCount}
            onSubmit={() => setPhase("confirm-submit")}
          />
        )}

        {/* Phase: confirm-submit */}
        {phase === "confirm-submit" && (
          <ConfirmSubmitPhase
            paper={paper}
            answeredCount={answeredCount}
            onConfirm={() => submitTest(false)}
            onCancel={() => setPhase("running")}
          />
        )}

        {/* Phase: results */}
        {phase === "results" && submittedAttempt && (
          <ResultsPhase
            paper={paper}
            attempt={submittedAttempt}
            onRetake={retakeTest}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function IntroPhase({
  paper,
  onStart,
  onClose,
}: {
  paper: TestPaper
  onStart: () => void
  onClose: () => void
}) {
  return (
    <div className="space-y-4 p-6">
      <DialogDescription>
        {paper.description}
      </DialogDescription>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatPill label="Questions" value={String(paper.questions.length)} icon={ListChecks} />
        <StatPill label="Duration" value={`${paper.durationMinutes} min`} icon={Clock} />
        <StatPill label="Total marks" value={String(paper.totalMarks)} icon={Award} />
        <StatPill label="Pass mark" value={`${paper.passThreshold}%`} icon={Trophy} />
      </div>

      <div className="rounded-lg border bg-muted/40 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Topics covered
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {paper.topics.map((t) => (
            <Badge key={t} variant="secondary" className="text-[11px]">
              {t}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Once you start, the timer cannot be paused. The test auto-submits when time
          runs out. You can navigate between questions and change answers until you submit.
        </span>
      </div>

      <div className="flex justify-end gap-2 border-t pt-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onStart} className="bg-violet-600 hover:bg-violet-700">
          Start test · {paper.durationMinutes} min
        </Button>
      </div>
    </div>
  )
}

function RunningPhase({
  paper,
  currentIdx,
  setCurrentIdx,
  answers,
  setAnswer,
  answeredCount,
  onSubmit,
}: {
  paper: TestPaper
  currentIdx: number
  setCurrentIdx: (i: number) => void
  answers: number[]
  setAnswer: (qIdx: number, optionIdx: number) => void
  answeredCount: number
  onSubmit: () => void
}) {
  const question = paper.questions[currentIdx]
  const total = paper.questions.length

  return (
    <div className="grid gap-0 md:grid-cols-[200px_1fr]">
      {/* Question nav sidebar */}
      <div className="border-b bg-muted/30 p-4 md:border-b-0 md:border-r">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Questions
        </p>
        <div className="mt-2 grid grid-cols-5 gap-1.5 md:grid-cols-4">
          {paper.questions.map((q, i) => {
            const answered = answers[i] >= 0
            const isCurrent = i === currentIdx
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                className={`flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium transition-colors ${
                  isCurrent
                    ? "border-violet-500 bg-violet-600 text-white"
                    : answered
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
                aria-label={`Question ${i + 1}${answered ? " (answered)" : ""}`}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
        <div className="mt-3 border-t pt-3 text-xs text-muted-foreground">
          <p>Answered: <strong className="text-foreground">{answeredCount}</strong> / {total}</p>
          <p className="mt-1">Each Q: {paper.questions[0]?.marks ?? 1} marks</p>
        </div>
      </div>

      {/* Question display */}
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px]">
            Question {currentIdx + 1} of {total}
          </Badge>
          <Progress value={(answeredCount / total) * 100} className="h-1.5 w-32" />
        </div>

        <div>
          <p className="text-base font-medium text-foreground">
            {question.q}
          </p>
          <RadioGroup
            value={answers[currentIdx] >= 0 ? String(answers[currentIdx]) : ""}
            onValueChange={(val) => setAnswer(currentIdx, Number(val))}
            className="mt-4 space-y-2"
          >
            {question.options.map((opt, oi) => {
              const picked = answers[currentIdx] === oi
              return (
                <Label
                  key={oi}
                  htmlFor={`tp-${paper.id}-q${currentIdx}-o${oi}`}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors ${
                    picked
                      ? "border-violet-400 bg-violet-50"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <RadioGroupItem
                    id={`tp-${paper.id}-q${currentIdx}-o${oi}`}
                    value={String(oi)}
                    className="mt-0"
                  />
                  <span className="flex-1">{opt}</span>
                </Label>
              )
            })}
          </RadioGroup>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Previous
          </Button>
          <div className="flex gap-2">
            {currentIdx < total - 1 ? (
              <Button
                onClick={() => setCurrentIdx(Math.min(total - 1, currentIdx + 1))}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Next
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={onSubmit}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="mr-1.5 h-4 w-4" />
                Submit test
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfirmSubmitPhase({
  paper,
  answeredCount,
  onConfirm,
  onCancel,
}: {
  paper: TestPaper
  answeredCount: number
  onConfirm: () => void
  onCancel: () => void
}) {
  const unanswered = paper.questions.length - answeredCount
  return (
    <div className="space-y-4 p-6">
      <DialogDescription>
        You&apos;re about to submit this test paper.
      </DialogDescription>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatPill label="Answered" value={`${answeredCount}/${paper.questions.length}`} icon={CheckCircle2} />
        <StatPill label="Unanswered" value={String(unanswered)} icon={AlertTriangle} />
        <StatPill label="Total marks" value={String(paper.totalMarks)} icon={Award} />
      </div>
      {unanswered > 0 && (
        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            You have <strong>{unanswered}</strong> unanswered question{unanswered > 1 ? "s" : ""}.
            Unanswered questions score 0 — consider answering them before submitting.
          </span>
        </div>
      )}
      <div className="flex justify-end gap-2 border-t pt-3">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to test
        </Button>
        <Button onClick={onConfirm} className="bg-emerald-600 hover:bg-emerald-700">
          <Send className="mr-1.5 h-4 w-4" />
          Confirm submit
        </Button>
      </div>
    </div>
  )
}

function ResultsPhase({
  paper,
  attempt,
  onRetake,
  onClose,
}: {
  paper: TestPaper
  attempt: TestAttempt
  onRetake: () => void
  onClose: () => void
}) {
  const passed = attempt.passed
  const mm = Math.floor(attempt.timeTakenSec / 60)
  const ss = attempt.timeTakenSec % 60
  const timeStr = `${mm}m ${String(ss).padStart(2, "0")}s`

  return (
    <div className="space-y-4 p-6">
      {/* Score header */}
      <div
        className={`flex items-center gap-4 rounded-xl border-2 p-4 ${
          passed
            ? "border-emerald-300 bg-emerald-50"
            : "border-amber-300 bg-amber-50"
        }`}
      >
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${
            passed ? "bg-emerald-600" : "bg-amber-600"
          }`}
        >
          {passed ? (
            <Trophy className="h-7 w-7 text-white" />
          ) : (
            <RotateCcw className="h-7 w-7 text-white" />
          )}
        </div>
        <div className="flex-1">
          <p
            className={`text-xs font-semibold uppercase tracking-wide ${
              passed ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {passed ? "Passed" : "Below pass threshold"}
          </p>
          <p className="text-2xl font-bold text-foreground">
            {attempt.score} / {attempt.totalMarks}
          </p>
          <p className="text-sm text-muted-foreground">
            {attempt.percentage}% · pass mark {paper.passThreshold}%
          </p>
        </div>
        <div className="hidden text-right text-xs text-muted-foreground sm:block">
          <p className="flex items-center justify-end gap-1">
            <Clock className="h-3 w-3" />
            Time: {timeStr}
          </p>
        </div>
      </div>

      {/* Per-question review */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
          Answer review
        </p>
        <ul className="mt-3 space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {paper.questions.map((question, qi) => {
            const picked = attempt.answers[qi]
            const isCorrect = picked === question.correctIndex
            const wasUnanswered = picked < 0
            return (
              <li
                key={question.id}
                className={`rounded-lg border p-3 ${
                  isCorrect
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-rose-200 bg-rose-50/40"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      isCorrect ? "bg-emerald-600" : "bg-rose-600"
                    }`}
                  >
                    {qi + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{question.q}</p>
                    <div className="mt-2 space-y-1 text-xs">
                      {question.options.map((opt, oi) => {
                        const isCorrectOpt = oi === question.correctIndex
                        const isPickedOpt = oi === picked
                        let cls = "rounded border px-2 py-1 text-muted-foreground"
                        if (isCorrectOpt) {
                          cls = "rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-emerald-800"
                        } else if (isPickedOpt) {
                          cls = "rounded border border-rose-300 bg-rose-50 px-2 py-1 text-rose-800 line-through"
                        }
                        return (
                          <div key={oi} className={`flex items-center gap-2 ${cls}`}>
                            {isCorrectOpt && <CheckCircle2 className="h-3 w-3" />}
                            {isPickedOpt && !isCorrectOpt && <XCircle className="h-3 w-3" />}
                            <span>{opt}</span>
                            {isCorrectOpt && (
                              <span className="ml-auto font-semibold">Correct answer</span>
                            )}
                            {isPickedOpt && !isCorrectOpt && (
                              <span className="ml-auto font-semibold">Your answer</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <p className="mt-2 rounded bg-background/80 p-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Explanation: </span>
                      {question.explanation}
                      {wasUnanswered && (
                        <span className="ml-2 text-amber-700">· You didn&apos;t answer this one.</span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex justify-end gap-2 border-t pt-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onRetake} className="bg-violet-600 hover:bg-violet-700">
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Retake test
        </Button>
      </div>
    </div>
  )
}

function StatPill({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof Clock
}) {
  return (
    <div className="rounded-lg border bg-background p-2.5 text-center">
      <Icon className="mx-auto h-4 w-4 text-violet-600" />
      <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}
