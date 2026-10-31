"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApprovalQueuePanel } from "./approval-queue-panel"
import {
  CheckCircle2,
  XCircle,
  Users,
  GraduationCap,
  Clock,
  TrendingUp,
} from "lucide-react"

type Application = {
  id: string
  name: string
  email: string
  stream: string
  track: string
  appliedAt: string
  status: "pending" | "approved" | "rejected"
}

const APPLICATIONS: Application[] = [
  {
    id: "APP-1024",
    name: "Aditya Sharma",
    email: "aditya.s@iiti.ac.in",
    stream: "MBA · Marketing",
    track: "Marketing & Strategy Internship",
    appliedAt: "2026-10-25 19:42",
    status: "pending",
  },
  {
    id: "APP-1023",
    name: "Priya Menon",
    email: "priya.m@nmims.edu",
    stream: "BBA · Digital Marketing",
    track: "Entrepreneurship & Digital Marketing",
    appliedAt: "2026-10-25 18:11",
    status: "pending",
  },
  {
    id: "APP-1022",
    name: "Kartik Verma",
    email: "kartik.v@xaviers.edu",
    stream: "BSc · Statistics",
    track: "Data Science & Analytics Internship",
    appliedAt: "2026-10-25 16:30",
    status: "approved",
  },
  {
    id: "APP-1021",
    name: "Sneha Kulkarni",
    email: "sneha.k@fergusson.edu",
    stream: "BSc · Computer Science",
    track: "Data Science & Analytics Internship",
    appliedAt: "2026-10-25 14:05",
    status: "pending",
  },
  {
    id: "APP-1020",
    name: "Rahul Joshi",
    email: "rahul.j@symbiosis.edu",
    stream: "BBA · Entrepreneurship",
    track: "Entrepreneurship & Digital Marketing",
    appliedAt: "2026-10-24 21:18",
    status: "approved",
  },
  {
    id: "APP-1019",
    name: "Nidhi Patel",
    email: "nidhi.p@nmims.edu",
    stream: "MBA · Operations",
    track: "Marketing & Strategy Internship",
    appliedAt: "2026-10-24 17:55",
    status: "rejected",
  },
]

const statusStyle: Record<Application["status"], string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
}

const KPIS = [
  { label: "Total Applications", value: "1,024", icon: Users, accent: "text-emerald-600" },
  { label: "Pending Review", value: "12", icon: Clock, accent: "text-amber-600" },
  { label: "Active Students", value: "807", icon: GraduationCap, accent: "text-teal-600" },
  { label: "Approval Rate", value: "94%", icon: TrendingUp, accent: "text-violet-600" },
]

export function AdminDashboard() {
  return (
    <section
      id="admin"
      className="border-b border-amber-200 bg-amber-50/40 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
              Admin Dashboard · Restricted
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Student applications &amp; review queue
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Logged in as admin. Approve, reject, or drill into any pending application below.
            </p>
          </div>
          <Badge className="border-amber-300 bg-amber-100 text-amber-800">
            Admin Mode · Demo Data
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {KPIS.map((k) => {
            const Icon = k.icon
            return (
              <Card key={k.label} className="border-amber-200 shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 ${k.accent}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xl font-bold leading-none">{k.value}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{k.label}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-6 border-amber-200">
          <CardHeader>
            <CardTitle className="text-base">Recent applications</CardTitle>
            <CardDescription>
              Latest 6 student submissions across all tracks. Demo data only — actions are not persisted.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-amber-50/60 hover:bg-amber-50/60">
                    <TableHead className="pl-6">App ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden md:table-cell">Stream</TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead className="hidden sm:table-cell">Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {APPLICATIONS.map((a) => (
                    <TableRow key={a.id} className="text-sm">
                      <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                        {a.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.email}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {a.stream}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{a.track}</TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {a.appliedAt}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] capitalize ${statusStyle[a.status]}`}
                        >
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            aria-label={`Approve ${a.name}`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            aria-label={`Reject ${a.name}`}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval queue — review student registrations, solutions, tests, certificates */}
      <ApprovalQueuePanel />
    </section>
  )
}
