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
import { CATEGORIES } from "./portal-data"
import { useEnrollmentStore } from "./enrollment-store"
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
  BookOpen,
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

type Step = "details" | "category" | "schedule" | "payment" | "confirmation"

const GUARDIAN_ROLES = ["Parent", "Teacher", "HOD", "Mentor", "Guardian"]
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year / Final", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"]

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
  const [formGuardianEmail, setFormGuardianEmail] = useState("")
  const [formGuardianRole, setFormGuardianRole] = useState("Parent")
  const [formQualification, setFormQualification] = useState("")
  const [formYear, setFormYear] = useState("")
  const [formCollege, setFormCollege] = useState("")
  const [formCity, setFormCity] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formSubcategory, setFormSubcategory] = useState("")
  const [formStartDate, setFormStartDate] = useState("")
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const createEnrollment = useEnrollmentStore((s) => s.createEnrollment)

  const handleDetailsSubmit = () => {
    if (!formName || !formEmail || !formPhone || !formStream || !formCollege || !formCity || !formQualification || !formYear) {
      toast({
        title: "Please fill all required fields",
        description: "Name, email, phone, stream, qualification, year, college, and city are required.",
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
    if (formGuardianEmail && !formGuardianEmail.includes("@")) {
      toast({ title: "Invalid guardian email", description: "Enter a valid email or leave blank.", variant: "destructive" })
      return
    }
    registerStudent({
      name: formName,
      email: formEmail,
      phone: formPhone,
      stream: formStream,
      guardianEmail: formGuardianEmail || undefined,
      guardianRole: formGuardianRole || undefined,
      qualification: formQualification,
      year: formYear,
      college: formCollege,
      city: formCity,
    })
    setStep("category")
  }

  const handleCategorySubmit = () => {
    if (!formCategory || !formSubcategory) {
      toast({ title: "Select category + subcategory", variant: "destructive" })
      return
    }
    // Default start date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setFormStartDate(tomorrow.toISOString().split("T")[0])
    setStep("schedule")
  }

  const handleScheduleSubmit = () => {
    if (!formStartDate) {
      toast({ title: "Select a start date", variant: "destructive" })
      return
    }
    setStep("payment")
  }

  const handlePaid = (result: PaymentResult) => {
    setPaymentResult(result)
    markPaid(result.paymentId)
    // Auto-create an approval request for the admin
    const startDateStr = formStartDate ? new Date(formStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBD"
    createApproval({
      studentName: formName,
      studentEmail: formEmail,
      stream: formStream,
      type: "registration",
      stage: "Paid registration — ₹" + REGISTRATION_FEE + " fee",
      detail: `Paid ₹${REGISTRATION_FEE} via ${result.method}. Phone: ${formPhone}. Qualification: ${formQualification}, Year: ${formYear}, College: ${formCollege}, City: ${formCity}. Category: ${formCategory} → ${formSubcategory}. Start date: ${startDateStr}. Guardian (${formGuardianRole}): ${formGuardianEmail || "not provided"}. Results will be emailed to guardian on completion.`,
    })
    // Create the enrollment with start date
    const cat = CATEGORIES.find((c) => c.title === formCategory)
    const track = cat?.title.includes("MBA") ? "MBA" : cat?.title.includes("BBA") ? "BBA" : "BSc"
    createEnrollment({
      studentEmail: formEmail,
      category: formCategory,
      subcategory: formSubcategory,
      track: track ?? "MBA",
      startDate: formStartDate ? new Date(formStartDate).getTime() : undefined,
    })
    setStep("confirmation")
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator — 5 steps */}
      <div className="flex items-center justify-center gap-2">
        <StepDot active={step === "details"} done={step !== "details"} label="1" icon={User} />
        <div className={`h-0.5 w-8 ${step !== "details" ? "bg-emerald-500" : "bg-border"}`} />
        <StepDot active={step === "category"} done={step === "schedule" || step === "payment" || step === "confirmation"} label="2" icon={BookOpen} />
        <div className={`h-0.5 w-8 ${step === "schedule" || step === "payment" || step === "confirmation" ? "bg-emerald-500" : "bg-border"}`} />
        <StepDot active={step === "schedule"} done={step === "payment" || step === "confirmation"} label="3" icon={Clock} />
        <div className={`h-0.5 w-8 ${step === "payment" || step === "confirmation" ? "bg-emerald-500" : "bg-border"}`} />
        <StepDot active={step === "payment"} done={step === "confirmation"} label="4" icon={CreditCard} />
        <div className={`h-0.5 w-8 ${step === "confirmation" ? "bg-emerald-500" : "bg-border"}`} />
        <StepDot active={step === "confirmation"} done={false} label="5" icon={CheckCircle2} />
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
              <Label htmlFor="reg-name" className="text-xs">Full name *</Label>
              <Input
                id="reg-name"
                placeholder="e.g. Ananya Iyer"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-email" className="text-xs">Email *</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@college.edu"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-phone" className="text-xs">Phone (10 digits) *</Label>
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
              <Label className="text-xs">Degree stream *</Label>
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

            {/* Academic details */}
            <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Academic Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-qualification" className="text-xs">Qualification *</Label>
                  <Select value={formQualification} onValueChange={setFormQualification}>
                    <SelectTrigger id="reg-qualification">
                      <SelectValue placeholder="MBA / BBA / BSc" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MBA">MBA</SelectItem>
                      <SelectItem value="BBA">BBA</SelectItem>
                      <SelectItem value="BSc">BSc</SelectItem>
                      <SelectItem value="MCA">MCA</SelectItem>
                      <SelectItem value="MSc">MSc</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-year" className="text-xs">Year / Semester *</Label>
                  <Select value={formYear} onValueChange={setFormYear}>
                    <SelectTrigger id="reg-year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-college" className="text-xs">College name *</Label>
                <Input
                  id="reg-college"
                  placeholder="e.g. IIM Bangalore"
                  value={formCollege}
                  onChange={(e) => setFormCollege(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-city" className="text-xs">City *</Label>
                <Input
                  id="reg-city"
                  placeholder="e.g. Bangalore"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                />
              </div>
            </div>

            {/* Guardian / Teacher / HOD */}
            <div className="rounded-lg border border-violet-200 bg-violet-50/30 p-3 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                Guardian / Teacher / HOD (results will be emailed)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-grd-role" className="text-xs">Relationship</Label>
                  <Select value={formGuardianRole} onValueChange={setFormGuardianRole}>
                    <SelectTrigger id="reg-grd-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GUARDIAN_ROLES.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-grd-email" className="text-xs">Email (optional)</Label>
                  <Input
                    id="reg-grd-email"
                    type="email"
                    placeholder="hod@college.edu"
                    value={formGuardianEmail}
                    onChange={(e) => setFormGuardianEmail(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                When your internship completes, your final results + certificate will be
                automatically emailed to this address.
              </p>
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

      {/* Step 2: Category selection */}
      {step === "category" && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Select your internship category</CardTitle>
            <CardDescription>
              Pick one category and one subcategory. You can enroll in additional categories after
              completing this internship.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category grid */}
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.filter((c) => !c.badge).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setFormCategory(cat.title); setFormSubcategory("") }}
                  className={`rounded-lg border p-3 text-left transition-all ${
                    formCategory === cat.title
                      ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-300"
                      : "border-border bg-background hover:border-emerald-300 hover:bg-emerald-50/50"
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground">{cat.title}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{cat.blurb}</p>
                </button>
              ))}
            </div>

            {/* Subcategory dropdown */}
            {formCategory && (
              <div className="space-y-1.5">
                <Label className="text-xs">Subcategory</Label>
                <Select value={formSubcategory} onValueChange={setFormSubcategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.find((c) => c.title === formCategory)?.subcategories.map((s) => (
                      <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formSubcategory && (
                  <div className="mt-2 rounded-md border bg-muted/40 p-3">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Projects in this subcategory</p>
                    <ul className="mt-2 space-y-1">
                      {CATEGORIES.find((c) => c.title === formCategory)
                        ?.subcategories.find((s) => s.name === formSubcategory)
                        ?.projects.map((p, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-foreground">
                            <ArrowRight className="h-3 w-3 text-emerald-600" />
                            {p.title}
                            <Badge variant="outline" className="text-[9px]">{p.level}</Badge>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 border-t bg-muted/30 p-4">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={handleCategorySubmit}
              disabled={!formCategory || !formSubcategory}
            >
              Continue to payment
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setStep("details")} className="w-full">
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              Back to details
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Schedule */}
      {step === "schedule" && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Schedule your internship</CardTitle>
            <CardDescription>
              Pick a start date for your {formCategory} → {formSubcategory} internship.
              The 8-week program runs from your selected start date.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary of selected category */}
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Selected track</p>
              <p className="mt-1 text-sm font-medium text-foreground">{formCategory} → {formSubcategory}</p>
            </div>

            {/* Date picker */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-start-date" className="text-xs">Internship start date *</Label>
              <Input
                id="reg-start-date"
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              <p className="text-[11px] text-muted-foreground">
                The internship starts on this date. Weekly tasks unlock sequentially —
                Week 1 on the start date, Week 2 after 7 days, etc.
              </p>
            </div>

            {/* Schedule preview */}
            {formStartDate && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Schedule preview</p>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Start date</dt>
                    <dd className="font-medium">{new Date(formStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd className="font-medium">8 weeks</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">End date (approx)</dt>
                    <dd className="font-medium">
                      {new Date(new Date(formStartDate).getTime() + 56 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Weekly commitment</dt>
                    <dd className="font-medium">~90-180 min/week</dd>
                  </div>
                </dl>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 border-t bg-muted/30 p-4">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={handleScheduleSubmit}
              disabled={!formStartDate}
            >
              Continue to payment
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setStep("category")} className="w-full">
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              Back to category
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Payment */}
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
