"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BadgeCheck,
  ShieldCheck,
  Globe,
  UserRound,
  Info,
  AlertCircle,
  LogOut,
  ArrowLeft,
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
import { RegistrationWizard } from "./registration-wizard"

const TRUST_BADGES = [
  { label: "AICTE-Aligned", icon: BadgeCheck },
  { label: "Mentor-Led", icon: ShieldCheck },
  { label: "Certificate", icon: BadgeCheck },
  { label: "100% Online", icon: Globe },
]

export function Login() {
  const { toast } = useToast()
  const goToDashboard = useView((s) => s.goToDashboard)
  const goToMarketing = useView((s) => s.goToMarketing)
  const {
    role,
    name,
    email,
    stream,
    loginAsGuest,
    loginAsAdmin,
    loginAsSuperAdmin,
    loginAsStudent,
    logout,
  } = useAuth()

  const [showRegister, setShowRegister] = useState(false)

  // Student sign-in fields
  const [studentEmail, setStudentEmail] = useState("")
  const [studentPassword, setStudentPassword] = useState("")

  // Admin fields
  const [adminUser, setAdminUser] = useState("")
  const [adminPass, setAdminPass] = useState("")
  const [adminError, setAdminError] = useState<string | null>(null)

  // Super Admin fields
  const [superUser, setSuperUser] = useState("")
  const [superPass, setSuperPass] = useState("")
  const [superError, setSuperError] = useState<string | null>(null)

  // ─── Handlers ───

  const submitStudentSignIn = () => {
    if (!studentEmail || !studentPassword) {
      toast({ title: "Missing details", description: "Please enter your email and password." })
      return
    }
    const handle = studentEmail.split("@")[0] || "Student"
    const pretty = handle
      .split(/[._-]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
    loginAsStudent(pretty, studentEmail, "View in dashboard")
    toast({ title: `Welcome back, ${pretty.split(" ")[0]}!`, description: "Opening your dashboard…" })
    setStudentEmail("")
    setStudentPassword("")
    goToDashboard()
  }

  const handleGuestLogin = () => {
    loginAsGuest()
    toast({ title: "Welcome, Guest!", description: "You can browse all programs freely." })
  }

  const handleAdminLogin = () => {
    setAdminError(null)
    const res = loginAsAdmin(adminUser, adminPass)
    if (res.ok) {
      toast({ title: "Admin signed in", description: "Opening the admin dashboard…" })
      setAdminUser("")
      setAdminPass("")
      goToDashboard()
    } else {
      setAdminError(res.error)
      toast({ title: "Admin login failed", description: res.error, variant: "destructive" })
    }
  }

  const handleSuperAdminLogin = () => {
    setSuperError(null)
    const res = loginAsSuperAdmin(superUser, superPass)
    if (res.ok) {
      toast({ title: "Super Admin signed in", description: "Opening org management…" })
      setSuperUser("")
      setSuperPass("")
      goToDashboard()
    } else {
      setSuperError(res.error)
      toast({ title: "Super Admin login failed", description: res.error, variant: "destructive" })
    }
  }

  const handleLogout = () => {
    const wasGoogle = role === "google"
    logout()
    if (wasGoogle) {
      signOut({ redirect: false }).catch(() => {})
    }
    toast({ title: "Logged out", description: "Returning to the landing page." })
    useView.getState().goToMarketing()
  }

  // ─── If Register Free is clicked, show the Registration Wizard ───
  if (showRegister) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col justify-center px-4 py-8 sm:px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRegister(false)}
          className="mb-4 w-fit"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Login
        </Button>
        <RegistrationWizard />
      </div>
    )
  }

  // ─── Login card with 3 tabs ───
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>AgilePortal Enterprise</CardTitle>
          <CardDescription>
            Sign in to access your dashboard. New student? Click Register Free below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="superadmin">Super Admin</TabsTrigger>
            </TabsList>

            {/* ─── Student tab ─── */}
            <TabsContent value="student" className="mt-6 space-y-4">
              <GoogleSignInButton />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signin-email" className="text-xs">Student Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@college.edu"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signin-pass" className="text-xs">Password</Label>
                <Input
                  id="signin-pass"
                  type="password"
                  placeholder="••••••••"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submitStudentSignIn() }}
                />
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={submitStudentSignIn}
              >
                Sign In
              </Button>

              {/* Guest */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <UserRound className="h-3.5 w-3.5" />
                  Just exploring?
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full border-emerald-300 bg-background text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                  onClick={handleGuestLogin}
                >
                  <UserRound className="mr-1.5 h-4 w-4" />
                  Continue as Guest
                </Button>
              </div>

              {/* Register Free */}
              <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-violet-700">
                  <Info className="h-3.5 w-3.5" />
                  New student?
                </p>
                <p className="mt-1 text-xs text-violet-700/80">
                  Register with ₹1,499 fee → select category → schedule → start internship.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full border-violet-300 bg-background text-violet-700 hover:bg-violet-100 hover:text-violet-800"
                  onClick={() => setShowRegister(true)}
                >
                  Register Free
                </Button>
              </div>
            </TabsContent>

            {/* ─── Admin tab ─── */}
            <TabsContent value="admin" className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ad-user" className="text-xs">Admin Email</Label>
                <Input
                  id="ad-user"
                  placeholder="admin@agileportal.in"
                  value={adminUser}
                  onChange={(e) => { setAdminUser(e.target.value); setAdminError(null) }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ad-pass" className="text-xs">Password</Label>
                <Input
                  id="ad-pass"
                  type="password"
                  placeholder="••••••••"
                  value={adminPass}
                  onChange={(e) => { setAdminPass(e.target.value); setAdminError(null) }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAdminLogin() }}
                />
              </div>
              {adminError && (
                <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}
              <Button className="w-full" onClick={handleAdminLogin}>
                Sign In
              </Button>
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold">
                  <Info className="h-3.5 w-3.5 text-amber-600" />
                  Demo admin credentials
                </p>
                <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between gap-2">
                    <dt>Email</dt>
                    <dd className="font-mono text-foreground">{ADMIN_DEMO_EMAIL}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Password</dt>
                    <dd className="font-mono text-foreground">{ADMIN_DEMO_PASSWORD}</dd>
                  </div>
                </dl>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Admin login only. Students use the Student tab.
              </p>
            </TabsContent>

            {/* ─── Super Admin tab ─── */}
            <TabsContent value="superadmin" className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="sa-user" className="text-xs">Super Admin Email</Label>
                <Input
                  id="sa-user"
                  placeholder="superadmin@agileportal.in"
                  value={superUser}
                  onChange={(e) => { setSuperUser(e.target.value); setSuperError(null) }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sa-pass" className="text-xs">Password</Label>
                <Input
                  id="sa-pass"
                  type="password"
                  placeholder="••••••••"
                  value={superPass}
                  onChange={(e) => { setSuperPass(e.target.value); setSuperError(null) }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSuperAdminLogin() }}
                />
              </div>
              {superError && (
                <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{superError}</span>
                </div>
              )}
              <Button
                className="w-full bg-violet-600 hover:bg-violet-700"
                onClick={handleSuperAdminLogin}
              >
                Sign In
              </Button>
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold">
                  <Info className="h-3.5 w-3.5 text-violet-600" />
                  Demo super-admin credentials
                </p>
                <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between gap-2">
                    <dt>Email</dt>
                    <dd className="font-mono text-foreground">{SUPER_ADMIN_DEMO_EMAIL}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Password</dt>
                    <dd className="font-mono text-foreground">{SUPER_ADMIN_DEMO_PASSWORD}</dd>
                  </div>
                </dl>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Super Admin only — enterprise tier. Use the Student tab for student access.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">
            By continuing you agree to AgilePortal Enterprise&apos;s Terms &amp; Privacy Policy.
          </p>
        </CardFooter>
      </Card>

      {/* Already-signed-in panel */}
      {role && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Signed in as {name}</p>
            <p className="text-xs text-muted-foreground">
              Role: <span className="font-mono">{role}</span> · {email}
              {stream && role !== "guest" && role !== "admin" && (
                <> · Stream: <span className="font-medium text-foreground">{stream}</span></>
              )}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
          >
            <LogOut className="mr-1.5 h-4 w-4" />
            Logout
          </Button>
        </div>
      )}

      {/* Trust badges */}
      <ul className="mt-6 grid grid-cols-4 gap-2">
        {TRUST_BADGES.map((b) => {
          const Icon = b.icon
          return (
            <li key={b.label} className="flex flex-col items-center gap-1 rounded-lg border bg-background p-2 text-center">
              <Icon className="h-4 w-4 text-emerald-600" />
              <span className="text-[10px] font-medium">{b.label}</span>
            </li>
          )
        })}
      </ul>

      <Button variant="ghost" size="sm" onClick={goToMarketing} className="mt-4 w-full">
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        Back to home
      </Button>
    </div>
  )
}
