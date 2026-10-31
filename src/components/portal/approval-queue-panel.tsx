"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  FileText,
  Award,
  RotateCcw,
  MessageSquare,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  useApprovalStore,
  type ApprovalRequest,
  type ApprovalType,
  type ApprovalStatus,
} from "./approval-store"

const typeIcon: Record<ApprovalType, typeof FileText> = {
  registration: UserPlus,
  weekly_solution: FileText,
  test_paper: Award,
  certificate: Award,
}

const typeLabel: Record<ApprovalType, string> = {
  registration: "Registration",
  weekly_solution: "Weekly Solution",
  test_paper: "Test Paper",
  certificate: "Certificate",
}

const statusStyle: Record<ApprovalStatus, string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-700",
  approved: "border-emerald-300 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-300 bg-rose-50 text-rose-700",
}

export function ApprovalQueuePanel() {
  const { requests, approve, reject, resetToDemo } = useApprovalStore()
  const [filter, setFilter] = useState<"all" | ApprovalStatus>("pending")
  const [typeFilter, setTypeFilter] = useState<"all" | ApprovalType>("all")
  const [commentFor, setCommentFor] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")

  const filtered = requests.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      (typeFilter === "all" || r.type === typeFilter),
  )

  const pendingCount = requests.filter((r) => r.status === "pending").length
  const approvedCount = requests.filter((r) => r.status === "approved").length
  const rejectedCount = requests.filter((r) => r.status === "rejected").length

  const handleApprove = (req: ApprovalRequest) => {
    approve(req.id, commentText || undefined)
    toastApprove(req)
    setCommentFor(null)
    setCommentText("")
  }

  const handleReject = (req: ApprovalRequest) => {
    reject(req.id, commentText || undefined)
    toastReject(req)
    setCommentFor(null)
    setCommentText("")
  }

  const { toast } = useToast()
  const toastApprove = (req: ApprovalRequest) =>
    toast({
      title: "Approved",
      description: `${req.studentName}'s ${typeLabel[req.type]} (${req.stage}) approved.`,
    })
  const toastReject = (req: ApprovalRequest) =>
    toast({
      title: "Rejected",
      description: `${req.studentName}'s ${typeLabel[req.type]} (${req.stage}) rejected.`,
      variant: "destructive",
    })

  return (
    <section className="border-t border-amber-200 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
              Approval Queue · Mentor Review
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Student approvals at every stage
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and approve/reject student registrations, weekly solutions, test
              papers, and certificate requests. Students see the status on their dashboard.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => resetToDemo()}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset to demo
          </Button>
        </div>

        {/* KPI row */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
          <StatPill label="Total" value={String(requests.length)} icon={ClipboardCheck} accent="text-violet-600" />
          <StatPill label="Pending" value={String(pendingCount)} icon={Clock} accent="text-amber-600" />
          <StatPill label="Approved" value={String(approvedCount)} icon={CheckCircle2} accent="text-emerald-600" />
          <StatPill label="Rejected" value={String(rejectedCount)} icon={XCircle} accent="text-rose-600" />
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Label className="text-xs text-muted-foreground">Status:</Label>
            <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1.5">
            <Label className="text-xs text-muted-foreground">Type:</Label>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="registration">Registration</SelectItem>
                <SelectItem value="weekly_solution">Weekly Solution</SelectItem>
                <SelectItem value="test_paper">Test Paper</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Queue list */}
        <div className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No approval requests match your filters.
              </CardContent>
            </Card>
          ) : (
            filtered.map((req) => {
              const Icon = typeIcon[req.type]
              return (
                <Card key={req.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      {/* Left: student + request info */}
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {req.studentName}
                            </p>
                            <Badge variant="outline" className="text-[10px]">
                              {typeLabel[req.type]}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${statusStyle[req.status]}`}
                            >
                              {req.status}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {req.studentEmail}
                            {req.stream && ` · ${req.stream}`}
                          </p>
                          <p className="mt-1 text-sm font-medium text-foreground">
                            {req.stage}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {req.detail}
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Submitted {timeAgo(req.submittedAt)}
                            {req.reviewedAt && ` · Reviewed ${timeAgo(req.reviewedAt)}`}
                          </p>
                          {req.mentorComment && (
                            <div className="mt-2 flex items-start gap-1.5 rounded-md border border-border bg-muted/40 p-2 text-xs">
                              <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                              <span><strong className="text-foreground">Mentor: </strong>{req.mentorComment}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: actions */}
                      {req.status === "pending" && (
                        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                          {commentFor === req.id ? (
                            <div className="w-full sm:w-[280px] space-y-2">
                              <Textarea
                                placeholder="Optional mentor comment (visible to student)..."
                                rows={2}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="text-xs"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => handleApprove(req)}
                                >
                                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-rose-300 text-rose-700 hover:bg-rose-50"
                                  onClick={() => handleReject(req)}
                                >
                                  <XCircle className="mr-1 h-3.5 w-3.5" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setCommentFor(null)
                                    setCommentText("")
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setCommentFor(req.id)
                                  setCommentText("")
                                }}
                              >
                                Review
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleApprove(req)}
                              >
                                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                Quick approve
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

function StatPill({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  icon: typeof FileText
  accent: string
}) {
  return (
    <Card className="border-amber-200">
      <CardContent className="flex items-center gap-2 p-3">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 ${accent}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-lg font-bold leading-none text-foreground">{value}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const hrs = Math.floor(diff / (1000 * 60 * 60))
  if (hrs < 1) return "just now"
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}
