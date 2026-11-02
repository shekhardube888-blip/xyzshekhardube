"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  User,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Clock,
  Receipt,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-store"
import { useApprovalStore } from "./approval-store"
import { useView } from "./use-view"
import { PaymentGateway, type PaymentResult, REGISTRATION_FEE } from "./payment-gateway"

const STREAMS = [
  "MBA · Marketing",
  "MBA · Finance",
  "MBA · Operations",
  "MBA · HR",
  "BBA · Entrepreneurship",
  "BBA · Digital Marketing",
  "BBA · HR",
  "BBA · Supply Chain",
  "BSc · Computer Science",
  "BSc · Data Science",
  "BSc · Statistics",
  "BSc · Biotechnology",
]

type Step = "details" | "payment" | "confirmation"

export function RegistrationWizard() {
  const { toast } = useToast()
  const { registerStudent, markPaid, name, email, phone, stream } = useAuth()
  const createApproval = useApprovalStore((s) => s.createRequest)
  const goToDashboard = useView((s) => s.goToDashboard)
  const goToMarketing = useView((s) => s.goToMarketing)
  const [step, setStep] = useState<Step>("details")

  // Form state
  const [formName, setFormName] = useState(name && name !== "Guest User" ? name : "")
  const [formEmail, setFormEmail] = useState(email && email !== "guest@agileportal.in" ? email : "")
  const [formPhone, setFormPhone] = useState(phone ?? "")
  const [formStream, setFormStream] = useState(stream ?? "")
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)

  const handleDetailsSubmit = () => {
    if (!formName || !formEmail || !formPhone || !formStream) {
      toast({
        title: "Please fill all fields",
        description: "Name, email, phone, and degree stream are all required.",
      })
      return
    }
    if (!formEmail.includes("@")) {
      toast({ title: "Invalid email", variant: "destructive" })
      return
    }
    if (formPhone.replace(/\D/g, "").length < 10) {
      toast({ title: "Invalid phone", description: "Enter a 10-digit phone number.", variant: "destructive" })
      return
    }
    registerStudent(formName, formEmail, formPhone, formStream)
    setStep("payment")
  }

  const handlePaid = (result: PaymentResult) => {
    setPaymentResult(result)
    markPaid(result.paymentId)
    // Auto-create an approval request for the admin
    createApproval({
      studentName: formName,
      studentEmail: formEmail,
      stream: formStream,
      type: "registration",
      stage: "Paid registration — ₹" + REGISTRATION_FEE + " fee",
      detail: `Paid ₹${REGISTRATION_FEE} via ${result.method}. Phone: ${formPhone}. Stream: ${formStream}. Awaiting admin approval to start internship.`,
    })
    setStep("confirmation")
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        <StepDot active={step === "details"} done={step !== "details"} label="1" icon={User} />
        <div className={`h-0.5 w-8 ${step !== "details" ? "bg-emerald-500" : "bg-border"}`} />
        <StepDot active={step === "payment"} done={step === "confirmation"} label="2" icon={CreditCard} />
        <div className={`h-0.5 w-8 ${step === "confirmation" ? "bg-emerald-500" : "bg-border"}`} />
        <StepDot active={step === "confirmation"} done={false} label="3" icon={CheckCircle2} />
      </div>

      {/* Step 1: Details */}
      {step === "details" && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Register for your internship</CardTitle>
            <CardDescription>
              Fill in your details to get started. After payment of ₹{REGISTRATION_FEE}, admin will
              approve your registration and your internship starts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name" className="text-xs">Full name</Label>
              <Input
                id="reg-name"
                placeholder="e.g. Ananya Iyer"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-email" className="text-xs">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@college.edu"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-phone" className="text-xs">Phone (10 digits)</Label>
              <Input
                id="reg-phone"
                type="tel"
                placeholder="9876543210"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                maxLength={10}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Degree stream</Label>
              <Select value={formStream} onValueChange={setFormStream}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your stream" />
                </SelectTrigger>
                <SelectContent>
                  {STREAMS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 border-t bg-muted/30 p-4">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={handleDetailsSubmit}
            >
              Continue to payment
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToMarketing} className="w-full">
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              Back to home
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Payment */}
      {step === "payment" && (
        <div className="space-y-4">
          <PaymentGateway onPaid={handlePaid} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep("details")}
            className="w-full"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Back to details
          </Button>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === "confirmation" && paymentResult && (
        <Card className="border-emerald-200 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </span>
              <div>
                <CardTitle className="text-lg">Registration submitted!</CardTitle>
                <CardDescription>
                  Your payment of ₹{REGISTRATION_FEE} was received. Admin will review and approve
                  your internship shortly.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Receipt */}
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Receipt className="h-3.5 w-3.5" />
                Payment receipt
              </p>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Receipt ID</dt><dd className="font-mono font-medium">{paymentResult.paymentId}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Amount</dt><dd className="font-medium">₹{paymentResult.amount}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Method</dt><dd className="font-medium capitalize">{paymentResult.method}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Date</dt><dd className="font-medium">{new Date(paymentResult.paidAt).toLocaleString()}</dd></div>
              </dl>
            </div>

            {/* Registration summary */}
            <div className="rounded-lg border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Registration details</p>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Name</dt><dd className="font-medium">{formName}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{formEmail}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Phone</dt><dd className="font-medium">{formPhone}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Stream</dt><dd className="font-medium">{formStream}</dd></div>
              </dl>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <Clock className="h-4 w-4 shrink-0" />
              <span>
                <strong>Awaiting admin approval.</strong> Once approved, your internship dashboard
                unlocks with all 8 weekly tasks, test papers, and the D2C Brand Simulator.
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 border-t bg-muted/30 p-4">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={goToDashboard}
            >
              Go to my dashboard
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <p className="text-[10px] text-muted-foreground">
              You&apos;ll see a &quot;pending approval&quot; screen until the admin approves.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

function StepDot({
  active,
  done,
  label,
  icon: Icon,
}: {
  active: boolean
  done: boolean
  label: string
  icon: typeof User
}) {
  if (done) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
        <CheckCircle2 className="h-4 w-4" />
      </span>
    )
  }
  if (active) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Icon className="h-4 w-4" />
      </span>
    )
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background text-muted-foreground">
      <Icon className="h-4 w-4" />
    </span>
  )
}
