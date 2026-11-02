"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Receipt,
  ArrowRight,
  Phone,
  Mail,
  User,
  BookOpen,
  Sparkles,
} from "lucide-react"
import { useAuth } from "./auth-store"
import { useApprovalStore } from "./approval-store"
import { useView } from "./use-view"
import { useToast } from "@/hooks/use-toast"
import { REGISTRATION_FEE } from "./payment-gateway"

export function PendingApproval() {
  const { name, email, phone, stream, paymentId, paidAt, registrationStatus, markApproved, markRejected, resetRegistration } = useAuth()
  const { requests } = useApprovalStore()
  const goToMarketing = useView((s) => s.goToMarketing)
  const goToDashboard = useView((s) => s.goToDashboard)
  const { toast } = useToast()
  const [checking, setChecking] = useState(false)

  // Sync: check if the admin has approved/rejected this student's registration
  const myRequest = requests.find(
    (r) =>
      r.studentEmail.toLowerCase() === (email ?? "").toLowerCase() &&
      r.type === "registration" &&
      r.stage.includes("Paid registration"),
  )

  // Auto-sync: if admin approved/rejected, update auth-store
  useEffect(() => {
    if (!myRequest) return
    if (myRequest.status === "approved" && registrationStatus === "paid") {
      markApproved()
      toast({
        title: "Approved! 🎉",
        description: "Your internship has been approved. Your dashboard is now unlocked.",
      })
    } else if (myRequest.status === "rejected" && registrationStatus === "paid") {
      markRejected()
      toast({
        title: "Registration rejected",
        description: myRequest.mentorComment || "Please contact support for details.",
        variant: "destructive",
      })
    }
  }, [myRequest, registrationStatus, markApproved, markRejected, toast])

  const handleCheckStatus = () => {
    setChecking(true)
    setTimeout(() => {
      setChecking(false)
      if (myRequest?.status === "approved") {
        toast({
          title: "Approved! 🎉",
          description: "Your internship has been approved.",
        })
      } else if (myRequest?.status === "rejected") {
        toast({
          title: "Registration rejected",
          description: myRequest?.mentorComment || "Contact support.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Still pending",
          description: "Admin hasn't approved your registration yet. Check back in a few minutes.",
        })
      }
    }, 800)
  }

  // If approved, auto-redirect to dashboard
  if (registrationStatus === "approved") {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-4 py-8">
        <Card className="w-full border-emerald-200 shadow-md">
          <CardHeader className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </span>
            <CardTitle className="mt-3 text-xl">Approved! Your internship starts now 🎉</CardTitle>
            <CardDescription>
              Welcome aboard, {name?.split(" ")[0]}! Your registration has been approved. Your
              full dashboard is unlocked — weekly tasks, test papers, and the simulation are ready.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What&apos;s next</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span><strong>Weekly Tasks</strong> — start with Week 1: Brand Audit Fundamentals</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                  <span><strong>Test Papers</strong> — 6 timed exams across MBA/BBA/BSc tracks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span><strong>Simulation</strong> — D2C Brand Simulator, 8 quarters, AI competitors</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/30 p-4">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={goToDashboard}
            >
              Start my internship
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // If rejected
  if (registrationStatus === "rejected") {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-4 py-8">
        <Card className="w-full border-rose-200 shadow-md">
          <CardHeader className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <XCircle className="h-9 w-9 text-rose-600" />
            </span>
            <CardTitle className="mt-3 text-xl">Registration rejected</CardTitle>
            <CardDescription>
              Your registration was not approved at this time. Please see the mentor comment below
              or contact support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {myRequest?.mentorComment && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                <strong>Mentor comment: </strong>{myRequest.mentorComment}
              </div>
            )}
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Your details</p>
              <p className="mt-1">{name} · {email}</p>
              <p className="text-muted-foreground">{stream}</p>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 border-t bg-muted/30 p-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                resetRegistration()
                goToMarketing()
              }}
            >
              Start over
            </Button>
            <Button variant="ghost" size="sm" onClick={goToMarketing} className="w-full">
              Back to home
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Pending (paid but not approved yet)
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-4 py-8">
      <Card className="w-full border-amber-200 shadow-md">
        <CardHeader className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-9 w-9 text-amber-600" />
          </span>
          <CardTitle className="mt-3 text-xl">Awaiting admin approval</CardTitle>
          <CardDescription>
            Your payment of ₹{REGISTRATION_FEE} was received. The admin team is reviewing your
            registration — this typically takes under 24 hours.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Receipt */}
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Receipt className="h-3.5 w-3.5" />
              Payment receipt
            </p>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Receipt ID</dt><dd className="font-mono font-medium">{paymentId}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Amount</dt><dd className="font-medium">₹{REGISTRATION_FEE}</dd></div>
              {paidAt && (
                <div className="flex justify-between"><dt className="text-muted-foreground">Paid on</dt><dd className="font-medium">{new Date(paidAt).toLocaleString()}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd><Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">Pending review</Badge></dd></div>
            </dl>
          </div>

          {/* Registration details */}
          <div className="rounded-lg border p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Registration details</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-muted-foreground" /><span>{name}</span></li>
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /><span>{email}</span></li>
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /><span>{phone}</span></li>
              <li className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-muted-foreground" /><span>{stream}</span></li>
            </ul>
          </div>

          {/* What happens next */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 text-sm">
            <p className="font-semibold text-emerald-800">Once approved, you&apos;ll unlock:</p>
            <ul className="mt-1.5 space-y-1 text-emerald-700">
              <li>• 8 weeks of mentor-led tasks + market scenarios</li>
              <li>• 6 timed test papers across MBA/BBA/BSc tracks</li>
              <li>• D2C Brand Simulator (8 quarters vs AI competitors)</li>
              <li>• AI mentor chatbot + cohort leaderboard</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 border-t bg-muted/30 p-4">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={handleCheckStatus}
            disabled={checking}
          >
            {checking ? (
              <>
                <RefreshCw className="mr-1.5 h-4 w-4 animate-spin" />
                Checking…
              </>
            ) : (
              <>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Check approval status
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={goToMarketing} className="w-full">
            Back to home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
