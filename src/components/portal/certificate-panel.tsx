"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Award,
  Trophy,
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Mail,
  Lock,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-store"
import { useWeeklyProgress } from "./use-weekly-progress"
import { useTestProgressHelpers, useMounted } from "./use-test-progress"
import { useEnrollmentStore } from "./enrollment-store"
import { useSimulation } from "./simulation-store"
import { SIM_TOTAL_QUARTERS, computeFinalGrade } from "./simulation-engine"
import { getConfigForStream } from "./simulation-configs"

function generateCertId(): string {
  return `CERT_${Date.now().toString(36).toUpperCase()}`
}

function formatDate(ts?: number | null): string {
  if (!ts) return "—"
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export function CertificatePanel() {
  const { toast } = useToast()
  const { role, name, email, stream, college, city, guardianEmail, guardianRole } = useAuth()
  const { completedWeeks } = useWeeklyProgress(4)
  const { stats: testStats } = useTestProgressHelpers()
  const { status: simStatus, currentQuarter, cash, brandEquity, customerSatisfaction, history } = useSimulation()
  const activeEnrollment = email ? useEnrollmentStore.getState().getActiveEnrollment(email) : null

  const [downloading, setDownloading] = useState<"certificate" | "letter" | null>(null)

  // ─── Completion check ───
  const weeksDone = completedWeeks
  const weeksRequired = SIM_TOTAL_QUARTERS
  const testsPassed = testStats.uniquePassed
  const testsRequired = 4 // out of 6
  const simDone = simStatus === "finished"

  const allComplete = weeksDone >= weeksRequired && testsPassed >= testsRequired && simDone

  // Simulation grade
  const simGrade = simDone && history.length > 0
    ? computeFinalGrade({
        status: simStatus,
        currentQuarter,
        cash: history[history.length - 1].cashAfter,
        brandEquity: history[history.length - 1].brandEquityAfter,
        customerSatisfaction: history[history.length - 1].customerSatisfactionAfter,
        history,
      }, getConfigForStream()).grade
    : undefined

  const isStudent = role === "student" || role === "google"
  const isAdmin = role === "admin"
  const isSuperAdmin = role === "super_admin"

  // ─── Certificate data ───
  const certData = {
    studentName: name || "Student",
    studentEmail: email || "",
    category: activeEnrollment?.category || stream || "MBA / Management",
    subcategory: activeEnrollment?.subcategory || "Marketing & Brand Strategy",
    college: college || "—",
    city: city || "—",
    stream: stream || "—",
    startDate: formatDate(activeEnrollment?.startDate),
    completionDate: allComplete ? formatDate(Date.now()) : "—",
    issueDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    certificateId: generateCertId(),
    metrics: {
      weeksCompleted: weeksDone,
      weeksRequired,
      testsPassed,
      testsRequired,
      simGrade: simGrade || "Not attempted",
    },
    guardianEmail,
    override: false,
  }

  // ─── Download handlers ───
  const downloadDoc = async (type: "certificate" | "letter", override = false) => {
    setDownloading(type)
    try {
      const data = { ...certData, override }
      const res = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, type }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Download failed" }))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = res.headers.get("Content-Disposition")?.split('"')[1] ?? `${type}-${certData.certificateId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({
        title: type === "certificate" ? "Certificate downloaded" : "Letter downloaded",
        description: type === "certificate"
          ? `Certificate ID: ${certData.certificateId}`
          : `Letter ID: ${certData.certificateId}`,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      toast({ title: "Download failed", description: msg, variant: "destructive" })
    } finally {
      setDownloading(null)
    }
  }

  return (
    <Card className={`border-2 ${allComplete ? "border-emerald-300" : "border-amber-200"}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-5 w-5 text-emerald-600" />
              Certificate & Documents
            </CardTitle>
            <CardDescription className="mt-1">
              {allComplete
                ? "All requirements met — your certificate is ready to print."
                : "Complete all weekly tasks + tests + simulation to unlock your certificate."}
            </CardDescription>
          </div>
          {allComplete ? (
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Ready
            </Badge>
          ) : (
            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
              <Clock className="mr-1 h-3 w-3" />
              In Progress
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Completion status */}
        <div className="grid grid-cols-3 gap-3">
          <CompletionPill
            label="Weekly Tasks"
            done={weeksDone}
            required={weeksRequired}
          />
          <CompletionPill
            label="Test Papers"
            done={testsPassed}
            required={testsRequired}
          />
          <CompletionPill
            label="Simulation"
            done={simDone ? 1 : 0}
            required={1}
            grade={simGrade}
          />
        </div>

        {/* Missing requirements */}
        {!allComplete && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <p className="flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              Missing requirements:
            </p>
            <ul className="mt-1.5 space-y-0.5 text-xs">
              {weeksDone < weeksRequired && (
                <li>• Complete {weeksRequired - weeksDone} more weekly task(s) ({weeksDone}/{weeksRequired} done)</li>
              )}
              {testsPassed < testsRequired && (
                <li>• Pass {testsRequired - testsPassed} more test paper(s) ({testsPassed}/{testsRequired} passed)</li>
              )}
              {!simDone && (
                <li>• Complete the D2C Brand Simulator (8 quarters)</li>
              )}
            </ul>
          </div>
        )}

        {/* Student details on cert */}
        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Certificate details</p>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div><dt className="text-muted-foreground">Name</dt><dd className="font-medium text-foreground">{certData.studentName}</dd></div>
            <div><dt className="text-muted-foreground">Category</dt><dd className="font-medium text-foreground">{certData.category}</dd></div>
            <div><dt className="text-muted-foreground">College</dt><dd className="font-medium text-foreground">{certData.college}</dd></div>
            <div><dt className="text-muted-foreground">City</dt><dd className="font-medium text-foreground">{certData.city}</dd></div>
            {guardianEmail && (
              <div className="col-span-2"><dt className="text-muted-foreground">Guardian ({guardianRole})</dt><dd className="font-medium text-foreground">{guardianEmail}</dd></div>
            )}
          </dl>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t bg-muted/30 p-4">
        {/* ─── Student / Admin: can only print if completed ─── */}
        {(isStudent || isAdmin) && (
          <>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => downloadDoc("certificate")}
              disabled={!allComplete || downloading !== null}
            >
              {downloading === "certificate" ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-1.5 h-4 w-4" />
              )}
              Print Certificate
            </Button>
            {!allComplete && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                Certificate unlocks when all tasks + tests + simulation are complete
              </p>
            )}
            {allComplete && guardianEmail && (
              <p className="flex items-center gap-1 text-xs text-emerald-700">
                <Mail className="h-3 w-3" />
                A copy will be emailed to {guardianRole}: {guardianEmail}
              </p>
            )}
          </>
        )}

        {/* ─── Super Admin: can override + print letter ─── */}
        {isSuperAdmin && (
          <>
            <div className="grid w-full grid-cols-2 gap-2">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => downloadDoc("certificate", true)}
                disabled={downloading !== null}
              >
                {downloading === "certificate" ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Award className="mr-1.5 h-4 w-4" />
                )}
                Print Certificate
                {!allComplete && " (Override)"}
              </Button>
              <Button
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                onClick={() => downloadDoc("letter")}
                disabled={downloading !== null}
              >
                {downloading === "letter" ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-1.5 h-4 w-4" />
                )}
                Participation Letter
              </Button>
            </div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-violet-600" />
              Super Admin can print certificate (override) + participation letter regardless of completion status
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

function CompletionPill({
  label,
  done,
  required,
  grade,
}: {
  label: string
  done: number
  required: number
  grade?: string
}) {
  const isDone = done >= required
  const pct = Math.round((done / required) * 100)
  return (
    <div className={`rounded-lg border p-3 text-center ${isDone ? "border-emerald-200 bg-emerald-50/40" : "border-amber-200 bg-amber-50/20"}`}>
      {isDone ? (
        <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-600" />
      ) : (
        <Clock className="mx-auto h-5 w-5 text-amber-600" />
      )}
      <p className="mt-1 text-sm font-bold text-foreground">
        {grade ? grade : `${done}/${required}`}
      </p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      {!isDone && (
        <Progress value={pct} className="mt-1.5 h-1" />
      )}
    </div>
  )
}
