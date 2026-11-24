"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Users, TrendingUp, Award, Clock, Mail, Phone, GraduationCap, BarChart3, CheckCircle2, XCircle,
} from "lucide-react"
import { useApprovalStore } from "./approval-store"
import { useEnrollmentStore } from "./enrollment-store"
import { useMounted } from "./use-test-progress"

// Demo student progress data — in production this would come from the database
// keyed by email+phone (primary key)
type StudentProgress = {
  id: string
  name: string
  email: string
  phone: string
  stream: string
  college: string
  city: string
  category: string
  subcategory: string
  startDate: string
  weeksCompleted: number
  weeksTotal: number
  testsPassed: number
  testsTotal: number
  testAvgScore: number
  simGrade: string
  simStatus: "completed" | "in-progress" | "not-started"
  certificateStatus: "issued" | "eligible" | "pending"
  guardianEmail: string
  enrollmentStatus: "active" | "completed"
}

const DEMO_STUDENTS: StudentProgress[] = [
  {
    id: "stu_1", name: "Aditya Sharma", email: "aditya.s@iiti.ac.in", phone: "9876543210",
    stream: "MBA · Marketing", college: "IIM Indore", city: "Indore",
    category: "MBA / Management", subcategory: "Marketing & Brand Strategy",
    startDate: "15 Oct 2026",
    weeksCompleted: 8, weeksTotal: 8, testsPassed: 6, testsTotal: 6, testAvgScore: 88,
    simGrade: "A", simStatus: "completed", certificateStatus: "issued",
    guardianEmail: "hod@iiti.ac.in", enrollmentStatus: "completed",
  },
  {
    id: "stu_2", name: "Priya Menon", email: "priya.m@nmims.edu", phone: "9876512345",
    stream: "BBA · Digital Marketing", college: "NMIMS Mumbai", city: "Mumbai",
    category: "BBA / Business", subcategory: "Digital Marketing",
    startDate: "18 Oct 2026",
    weeksCompleted: 6, weeksTotal: 8, testsPassed: 4, testsTotal: 6, testAvgScore: 78,
    simGrade: "B", simStatus: "completed", certificateStatus: "pending",
    guardianEmail: "parent.menon@gmail.com", enrollmentStatus: "active",
  },
  {
    id: "stu_3", name: "Kartik Verma", email: "kartik.v@xaviers.edu", phone: "9876509876",
    stream: "BSc · Statistics", college: "St. Xavier's Mumbai", city: "Mumbai",
    category: "BSc Statistics / Maths", subcategory: "Actuarial & Risk",
    startDate: "20 Oct 2026",
    weeksCompleted: 8, weeksTotal: 8, testsPassed: 5, testsTotal: 6, testAvgScore: 82,
    simGrade: "A", simStatus: "completed", certificateStatus: "issued",
    guardianEmail: "father.verma@gmail.com", enrollmentStatus: "completed",
  },
  {
    id: "stu_4", name: "Sneha Kulkarni", email: "sneha.k@fergusson.edu", phone: "9876498765",
    stream: "BSc · Computer Science", college: "Fergusson College", city: "Pune",
    category: "BSc Computer Science", subcategory: "Data Science & Analytics",
    startDate: "22 Oct 2026",
    weeksCompleted: 4, weeksTotal: 8, testsPassed: 2, testsTotal: 6, testAvgScore: 72,
    simGrade: "—", simStatus: "in-progress", certificateStatus: "pending",
    guardianEmail: "sneha.hod@fergusson.edu", enrollmentStatus: "active",
  },
  {
    id: "stu_5", name: "Rahul Joshi", email: "rahul.j@symbiosis.edu", phone: "9876487654",
    stream: "BBA · Entrepreneurship", college: "Symbiosis Pune", city: "Pune",
    category: "BBA / Business", subcategory: "Entrepreneurship & Startup",
    startDate: "10 Oct 2026",
    weeksCompleted: 8, weeksTotal: 8, testsPassed: 6, testsTotal: 6, testAvgScore: 91,
    simGrade: "A", simStatus: "completed", certificateStatus: "issued",
    guardianEmail: "rahul.parent@gmail.com", enrollmentStatus: "completed",
  },
  {
    id: "stu_6", name: "Nidhi Patel", email: "nidhi.p@nmims.edu", phone: "9876476543",
    stream: "MBA · Operations", college: "NMIMS Bangalore", city: "Bangalore",
    category: "MBA / Management", subcategory: "Operations & Supply Chain",
    startDate: "12 Oct 2026",
    weeksCompleted: 3, weeksTotal: 8, testsPassed: 1, testsTotal: 6, testAvgScore: 65,
    simGrade: "—", simStatus: "not-started", certificateStatus: "pending",
    guardianEmail: "nidhi.hod@nmims.edu", enrollmentStatus: "active",
  },
  {
    id: "stu_7", name: "Arjun Mehta", email: "arjun.mehta@iitb.ac.in", phone: "9876465432",
    stream: "MBA · Marketing", college: "IIT Bombay", city: "Mumbai",
    category: "MBA / Management", subcategory: "Marketing & Brand Strategy",
    startDate: "25 Oct 2026",
    weeksCompleted: 2, weeksTotal: 8, testsPassed: 1, testsTotal: 6, testAvgScore: 70,
    simGrade: "—", simStatus: "not-started", certificateStatus: "pending",
    guardianEmail: "arjun.parent@gmail.com", enrollmentStatus: "active",
  },
  {
    id: "stu_8", name: "Divya Reddy", email: "divya.r@nitt.edu", phone: "9876454321",
    stream: "BSc · Data Science", college: "NIT Trichy", city: "Trichy",
    category: "BSc Computer Science", subcategory: "Data Science & Analytics",
    startDate: "28 Oct 2026",
    weeksCompleted: 5, weeksTotal: 8, testsPassed: 3, testsTotal: 6, testAvgScore: 75,
    simGrade: "C", simStatus: "completed", certificateStatus: "pending",
    guardianEmail: "divya.hod@nitt.edu", enrollmentStatus: "active",
  },
]

export function StudentProgressPanel() {
  const mounted = useMounted()
  const approvalRequests = useApprovalStore((s) => s.requests)
  const enrollments = useEnrollmentStore((s) => s.enrollments)

  // Merge demo students with real students from the stores
  // Include ALL registrations (pending + approved) so admin sees everyone
  const realStudents: StudentProgress[] = mounted
    ? approvalRequests
        .filter((r) => r.type === "registration")
        .filter((r) => !DEMO_STUDENTS.some((d) => d.email.toLowerCase() === r.studentEmail.toLowerCase()))
        .map((r) => {
          const enr = enrollments.find(
            (e) => e.studentEmail.toLowerCase() === r.studentEmail.toLowerCase(),
          )
          // Parse details from the approval request
          const phoneMatch = r.detail.match(/Phone:\s*(\d+)/)
          const qualMatch = r.detail.match(/Qualification:\s*([^,]+)/)
          const yearMatch = r.detail.match(/Year:\s*([^,]+)/)
          const collegeMatch = r.detail.match(/College:\s*([^,]+)/)
          const cityMatch = r.detail.match(/City:\s*([^,]+)/)
          const catMatch = r.detail.match(/Auto-enrolled in:\s*([^.]+)/)
          const guardianMatch = r.detail.match(/Guardian \(([^)]+)\):\s*([^\s.]+)/)

          const catParts = catMatch ? catMatch[1].split("→").map((s) => s.trim()) : ["MBA / Management", "Marketing & Brand Strategy"]

          return {
            id: r.id,
            name: r.studentName,
            email: r.studentEmail,
            phone: phoneMatch ? phoneMatch[1] : "—",
            stream: r.stream || "—",
            qualification: qualMatch ? qualMatch[1].trim() : "—",
            year: yearMatch ? yearMatch[1].trim() : "—",
            college: collegeMatch ? collegeMatch[1].trim() : "—",
            city: cityMatch ? cityMatch[1].trim() : "—",
            category: catParts[0] || "MBA / Management",
            subcategory: catParts[1] || "Marketing & Brand Strategy",
            track: enr?.track || "MBA",
            guardianEmail: guardianMatch ? guardianMatch[2] : "—",
            guardianRole: guardianMatch ? guardianMatch[1] : "Parent",
            startDate: enr?.startDate ?? Date.now(),
            weeksCompleted: 0,
            weeksTotal: 8,
            testsPassed: 0,
            testsTotal: 6,
            testAvgScore: 0,
            simGrade: "—",
            simStatus: "not-started" as const,
            certificateStatus: "pending" as const,
            enrollmentStatus: "active" as const,
          }
        })
    : []

  const allStudents = [...DEMO_STUDENTS, ...realStudents]
  const totalStudents = allStudents.length
  const completedStudents = allStudents.filter((s) => s.enrollmentStatus === "completed").length
  const avgWeeks = Math.round(allStudents.reduce((sum, s) => sum + (s.weeksCompleted / s.weeksTotal) * 100, 0) / totalStudents)
  const avgTestScore = Math.round(allStudents.reduce((sum, s) => sum + s.testAvgScore, 0) / totalStudents)
  const certsIssued = allStudents.filter((s) => s.certificateStatus === "issued").length

  return (
    <section className="border-t border-amber-200 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
              Student Progress Dashboard · All Students
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              All student progress + reports
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Each student's internship is keyed by email + phone (primary key). Click any
              student to see their detailed progress breakdown.
            </p>
          </div>
          <Badge className="border-amber-300 bg-amber-100 text-amber-800">
            <BarChart3 className="mr-1 h-3 w-3" />
            {totalStudents} Students
          </Badge>
        </div>

        {/* Aggregate KPIs */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard label="Total Students" value={String(totalStudents)} icon={Users} accent="text-violet-600" />
          <KpiCard label="Completed" value={`${completedStudents}/${totalStudents}`} icon={CheckCircle2} accent="text-emerald-600" />
          <KpiCard label="Avg Completion" value={`${avgWeeks}%`} icon={TrendingUp} accent="text-amber-600" />
          <KpiCard label="Certificates Issued" value={String(certsIssued)} icon={Award} accent="text-teal-600" />
        </div>

        {/* Progress overview graph (simple bar visualization) */}
        <Card className="mt-6 border-amber-200">
          <CardHeader>
            <CardTitle className="text-base">Completion Progress by Student</CardTitle>
            <CardDescription>Weekly task completion % across all enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {allStudents.map((s) => {
                const pct = Math.round((s.weeksCompleted / s.weeksTotal) * 100)
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 truncate text-xs font-medium text-foreground">{s.name}</span>
                    <Progress value={pct} className="flex-1 h-4" />
                    <span className="w-16 shrink-0 text-right text-xs font-semibold text-foreground">
                      {s.weeksCompleted}/{s.weeksTotal}
                    </span>
                    {s.certificateStatus === "issued" && (
                      <Badge className="bg-emerald-600 text-white text-[9px]">Cert</Badge>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detailed student table */}
        <Card className="mt-6 border-amber-200">
          <CardHeader>
            <CardTitle className="text-base">Student Roster (keyed by Email + Phone)</CardTitle>
            <CardDescription>Click any row to expand the full progress report</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Accordion type="single" collapsible>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="pl-6">Student</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="text-center">Weeks</TableHead>
                    <TableHead className="text-center">Tests</TableHead>
                    <TableHead className="text-center">Sim</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allStudents.map((s) => {
                    const weekPct = Math.round((s.weeksCompleted / s.weeksTotal) * 100)
                    return (
                      <TableRow key={s.id} className="cursor-pointer">
                        <TableCell className="pl-6">
                          <AccordionItem value={s.id} className="border-b-0">
                            <AccordionTrigger className="py-2 hover:no-underline">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">{s.name}</span>
                                <span className="text-[10px] text-muted-foreground">{s.email} · {s.phone}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                              {/* Expanded detail */}
                              <div className="grid gap-4 sm:grid-cols-2">
                                {/* Left: student info */}
                                <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                                  <p className="text-xs font-semibold uppercase text-muted-foreground">Student Profile (Primary Key: Email + Phone)</p>
                                  <div className="space-y-1 text-xs">
                                    <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-muted-foreground" /> {s.email}</p>
                                    <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-muted-foreground" /> {s.phone}</p>
                                    <p className="flex items-center gap-1.5"><GraduationCap className="h-3 w-3 text-muted-foreground" /> {s.stream}</p>
                                    <p className="flex items-center gap-1.5"><Users className="h-3 w-3 text-muted-foreground" /> {s.college}, {s.city}</p>
                                    <p className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-muted-foreground" /> Started: {s.startDate}</p>
                                  </div>
                                  <div className="mt-2 border-t pt-2">
                                    <p className="text-[10px] text-muted-foreground">Category</p>
                                    <p className="text-xs font-medium text-foreground">{s.category} → {s.subcategory}</p>
                                  </div>
                                  <div className="mt-1">
                                    <p className="text-[10px] text-muted-foreground">Guardian (results emailed)</p>
                                    <p className="text-xs font-medium text-foreground">{s.guardianEmail}</p>
                                  </div>
                                </div>

                                {/* Right: progress breakdown */}
                                <div className="space-y-3">
                                  {/* Weekly tasks */}
                                  <div>
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground">Weekly Tasks</span>
                                      <span className="font-medium text-foreground">{s.weeksCompleted}/{s.weeksTotal} ({weekPct}%)</span>
                                    </div>
                                    <Progress value={weekPct} className="mt-1 h-2" />
                                  </div>
                                  {/* Tests */}
                                  <div>
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground">Test Papers</span>
                                      <span className="font-medium text-foreground">{s.testsPassed}/{s.testsTotal} passed · Avg: {s.testAvgScore}%</span>
                                    </div>
                                    <Progress value={(s.testsPassed / s.testsTotal) * 100} className="mt-1 h-2" />
                                  </div>
                                  {/* Simulation */}
                                  <div>
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground">Simulation</span>
                                      <span className="font-medium text-foreground">Grade: {s.simGrade}</span>
                                    </div>
                                    <Progress value={s.simStatus === "completed" ? 100 : s.simStatus === "in-progress" ? 50 : 0} className="mt-1 h-2" />
                                  </div>
                                  {/* Certificate */}
                                  <div className="flex items-center justify-between rounded-md border p-2">
                                    <span className="text-xs text-muted-foreground">Certificate</span>
                                    {s.certificateStatus === "issued" ? (
                                      <Badge className="bg-emerald-600 text-white text-[10px]">
                                        <CheckCircle2 className="mr-1 h-3 w-3" /> Issued
                                      </Badge>
                                    ) : s.weeksCompleted >= s.weeksTotal && s.testsPassed >= 4 ? (
                                      <Badge className="bg-amber-600 text-white text-[10px]">Eligible</Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-[10px] text-amber-700">
                                        <Clock className="mr-1 h-3 w-3" /> Pending
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                          {s.category}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-xs font-semibold ${weekPct >= 100 ? "text-emerald-700" : weekPct >= 50 ? "text-amber-700" : "text-rose-700"}`}>
                            {s.weeksCompleted}/{s.weeksTotal}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-xs font-semibold ${s.testsPassed >= 4 ? "text-emerald-700" : "text-amber-700"}`}>
                            {s.testsPassed}/{s.testsTotal}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-xs font-semibold text-foreground">{s.simGrade}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {s.enrollmentStatus === "completed" ? (
                            <Badge className="bg-emerald-600 text-white text-[9px]">Done</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[9px] text-amber-700">Active</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Accordion>
          </CardContent>
        </Card>

        {/* Summary report */}
        <Card className="mt-6 border-amber-200">
          <CardHeader>
            <CardTitle className="text-base">Aggregate Report</CardTitle>
            <CardDescription>Program-wide statistics across all {totalStudents} enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBlock label="Avg weekly completion" value={`${avgWeeks}%`} sub={`${completedStudents} fully complete`} />
              <StatBlock label="Avg test score" value={`${avgTestScore}%`} sub={`Across ${totalStudents} students`} />
              <StatBlock label="Simulation grades" value={`${allStudents.filter(s => s.simStatus === "completed").length}/${totalStudents}`} sub={`${allStudents.filter(s => s.simGrade === "A").length} grade A`} />
              <StatBlock label="Certificates" value={`${certsIssued}/${totalStudents}`} sub="Issued / Total" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function KpiCard({ label, value, icon: Icon, accent }: { label: string; value: string; icon: typeof Users; accent: string }) {
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

function StatBlock({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border bg-background p-3 text-center">
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground opacity-70">{sub}</p>
    </div>
  )
}
