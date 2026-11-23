"use client"

/* eslint-disable react-hooks/set-state-in-effect -- dialog open state synced from view store */

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  UserRound,
  Info,
  AlertCircle,
  BadgeCheck,
  ShieldCheck,
  Globe,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  useAuth,
  ADMIN_DEMO_EMAIL,
  ADMIN_DEMO_PASSWORD,
  SUPER_ADMIN_DEMO_EMAIL,
  SUPER_ADMIN_DEMO_PASSWORD,
} from "./auth-store"
import { useView } from "./use-view"
import { GoogleSignInButton } from "./google-account-picker"
import { EXISTING_STUDENTS, findExistingStudent } from "./existing-students"
import { useEnrollmentStore } from "./enrollment-store"

/**
 * Login popup dialog — same style as the Register popup.
 * Small window with emerald header, marketing page visible behind.
 * Works on mobile (responsive, scrollable).
 */
export function LoginDialog({ forceOpen }: { forceOpen?: boolean }) {
  const { toast } = useToast()
  const view = useView((s) => s.view)
  const goToMarketing = useView((s) => s.goToMarketing)
  const goToDashboard = useView((s) => s.goToDashboard)
  const {
    role,
    name,
    loginAsGuest,
    loginAsAdmin,
    loginAsSuperAdmin,
    loginAsStudent,
  } = useAuth()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (view === "login" || forceOpen) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [view, forceOpen])

  const handleClose = (openState: boolean) => {
    setOpen(openState)
    if (!openState) {
      goToMarketing()
    }
  }

  // Student fields
  const [studentEmail, setStudentEmail] = useState("")
  const [studentPhone, setStudentPhone] = useState("")
  const [studentError, setStudentError] = useState<string | null>(null)

  // Admin fields
  const [adminUser, setAdminUser] = useState("")
  const [adminPass, setAdminPass] = useState("")
  const [adminError, setAdminError] = useState<string | null>(null)

  // Super admin fields
  const [superUser, setSuperUser] = useState("")
  const [superPass, setSuperPass] = useState("")
  const [superError, setSuperError] = useState<string | null>(null)

  const submitStudentSignIn = () => {
    if (!studentEmail || !studentPhone) {
      setStudentError("Please enter both email and phone number.")
      return
    }
    const existing = findExistingStudent(studentEmail, studentPhone)
    if (existing) {
      loginAsStudent(existing.name, existing.email, existing.stream)
      useAuth.setState({
        phone: existing.phone,
        qualification: existing.qualification,
        year: existing.year,
        college: existing.college,
        city: existing.city,
        guardianEmail: existing.guardianEmail,
        guardianRole: existing.guardianRole,
      })
      const enrollments = useEnrollmentStore.getState().getEnrollmentsForStudent(existing.email)
      if (enrollments.length === 0) {
        useEnrollmentStore.getState().createEnrollment({
          studentEmail: existing.email,
          category: existing.category,
          subcategory: existing.subcategory,
          track: existing.track,
          startDate: existing.startDate,
        })
      }
      setStudentError(null)
      toast({ title: `Welcome back, ${existing.name.split(" ")[0]}!`, description: "Opening your dashboard…" })
      setStudentEmail("")
      setStudentPhone("")
      handleClose(false)
      goToDashboard()
    } else {
      setStudentError("No existing student found. Click Register Free to create an account.")
      toast({ title: "Student not found", description: "Register Free to create a new account.", variant: "destructive" })
    }
  }

  const handleAdminLogin = () => {
    setAdminError(null)
    const res = loginAsAdmin(adminUser, adminPass)
    if (res.ok) {
      toast({ title: "Admin signed in", description: "Opening admin dashboard…" })
      setAdminUser("")
      setAdminPass("")
      handleClose(false)
      goToDashboard()
    } else {
      setAdminError(res.error)
    }
  }

  const handleSuperAdminLogin = () => {
    setSuperError(null)
    const res = loginAsSuperAdmin(superUser, superPass)
    if (res.ok) {
      toast({ title: "Super Admin signed in", description: "Opening org management…" })
      setSuperUser("")
      setSuperPass("")
      handleClose(false)
      goToDashboard()
    } else {
      setSuperError(res.error)
    }
  }

  const TRUST_BADGES = [
    { label: "AICTE-Aligned", icon: BadgeCheck },
    { label: "Mentor-Led", icon: ShieldCheck },
    { label: "Certificate", icon: BadgeCheck },
    { label: "100% Online", icon: Globe },
  ]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 sm:rounded-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign in to AgilePortal Enterprise</DialogTitle>
          <DialogDescription>Choose your role and sign in.</DialogDescription>
        </DialogHeader>

        {/* Emerald header bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-emerald-600 px-4 py-2 text-white">
          <span className="text-sm font-semibold">AgilePortal Login</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleClose(false)}
            className="text-white hover:bg-white/20 h-7 px-2 text-xs"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Close
          </Button>
        </div>

        {/* Login content */}
        <div className="p-3">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="superadmin">Super Admin</TabsTrigger>
            </TabsList>

            {/* Student tab */}
            <TabsContent value="student" className="mt-4 space-y-3">
              <GoogleSignInButton />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or Email + Phone</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ld-email" className="text-xs">Student Email</Label>
                <Input
                  id="ld-email"
                  type="email"
                  placeholder="you@college.edu"
                  value={studentEmail}
                  onChange={(e) => { setStudentEmail(e.target.value); setStudentError(null) }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ld-phone" className="text-xs">Phone (10 digits)</Label>
                <Input
                  id="ld-phone"
                  type="tel"
                  placeholder="9876543210"
                  value={studentPhone}
                  onChange={(e) => { setStudentPhone(e.target.value); setStudentError(null) }}
                  onKeyDown={(e) => { if (e.key === "Enter") submitStudentSignIn() }}
                  maxLength={10}
                />
              </div>
              {studentError && (
                <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{studentError}</span>
                </div>
              )}
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={submitStudentSignIn}>
                Sign In
              </Button>

              {/* Existing students */}
              <div className="rounded-lg border bg-muted/30 p-2">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                  <UserRound className="h-3 w-3" />
                  Existing students ({EXISTING_STUDENTS.length}):
                </p>
                <ul className="mt-1 max-h-24 space-y-0.5 overflow-y-auto">
                  {EXISTING_STUDENTS.map((s) => (
                    <li key={s.id} className="flex items-center gap-1 text-[10px]">
                      <span className="font-medium text-foreground">{s.name}</span>
                      <span className="text-muted-foreground">{s.email}</span>
                      <span className="ml-auto font-mono text-muted-foreground">{s.phone}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guest + Register */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => { loginAsGuest(); toast({ title: "Welcome, Guest!" }); handleClose(false) }}>
                  <UserRound className="mr-1 h-3.5 w-3.5" />
                  Guest
                </Button>
                <Button variant="outline" size="sm" className="border-violet-300 text-violet-700 hover:bg-violet-50" onClick={() => { handleClose(false); useView.getState().setView("register" as any) }}>
                  Register Free
                </Button>
              </div>
            </TabsContent>

            {/* Admin tab */}
            <TabsContent value="admin" className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="ld-ad-user" className="text-xs">Admin Email</Label>
                <Input id="ld-ad-user" placeholder="admin@agileportal.in" value={adminUser} onChange={(e) => { setAdminUser(e.target.value); setAdminError(null) }} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ld-ad-pass" className="text-xs">Password</Label>
                <Input id="ld-ad-pass" type="password" placeholder="••••••••" value={adminPass} onChange={(e) => { setAdminPass(e.target.value); setAdminError(null) }} onKeyDown={(e) => { if (e.key === "Enter") handleAdminLogin() }} />
              </div>
              {adminError && (
                <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}
              <Button className="w-full" onClick={handleAdminLogin}>Sign In</Button>
              <div className="rounded-lg border bg-muted/40 p-2 text-[10px]">
                <p className="flex items-center gap-1 font-semibold"><Info className="h-3 w-3 text-amber-600" /> Demo credentials</p>
                <p className="mt-1 text-muted-foreground">{ADMIN_DEMO_EMAIL} / {ADMIN_DEMO_PASSWORD}</p>
              </div>
            </TabsContent>

            {/* Super Admin tab */}
            <TabsContent value="superadmin" className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="ld-sa-user" className="text-xs">Super Admin Email</Label>
                <Input id="ld-sa-user" placeholder="superadmin@agileportal.in" value={superUser} onChange={(e) => { setSuperUser(e.target.value); setSuperError(null) }} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ld-sa-pass" className="text-xs">Password</Label>
                <Input id="ld-sa-pass" type="password" placeholder="••••••••" value={superPass} onChange={(e) => { setSuperPass(e.target.value); setSuperError(null) }} onKeyDown={(e) => { if (e.key === "Enter") handleSuperAdminLogin() }} />
              </div>
              {superError && (
                <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{superError}</span>
                </div>
              )}
              <Button className="w-full bg-violet-600 hover:bg-violet-700" onClick={handleSuperAdminLogin}>Sign In</Button>
              <div className="rounded-lg border bg-muted/40 p-2 text-[10px]">
                <p className="flex items-center gap-1 font-semibold"><Info className="h-3 w-3 text-violet-600" /> Demo credentials</p>
                <p className="mt-1 text-muted-foreground">{SUPER_ADMIN_DEMO_EMAIL} / {SUPER_ADMIN_DEMO_PASSWORD}</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Trust badges */}
          <ul className="mt-3 grid grid-cols-4 gap-1">
            {TRUST_BADGES.map((b) => {
              const Icon = b.icon
              return (
                <li key={b.label} className="flex flex-col items-center gap-0.5 rounded border bg-background p-1 text-center">
                  <Icon className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-[8px] font-medium">{b.label}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
