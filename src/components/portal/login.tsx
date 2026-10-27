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
  Clock,
  Globe,
  UserRound,
  Info,
  AlertCircle,
  LogOut,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  useAuth,
  ADMIN_DEMO_EMAIL,
  ADMIN_DEMO_PASSWORD,
} from "./auth-store"
import { GoogleSignInButton } from "./google-account-picker"

const TRUST_BADGES = [
  { label: "AICTE-Aligned", icon: BadgeCheck },
  { label: "Mentor-Led", icon: ShieldCheck },
  { label: "Certificate", icon: BadgeCheck },
  { label: "100% Online", icon: Globe },
]

export function Login() {
  const { toast } = useToast()
  const {
    role,
    name,
    email,
    stream,
    loginAsGuest,
    loginAsAdmin,
    loginAsStudent,
    logout,
  } = useAuth()

  // Sign In tab
  const [studentEmail, setStudentEmail] = useState("")
  const [studentPassword, setStudentPassword] = useState("")

  // Sign Up tab
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupStream, setSignupStream] = useState("")

  // Admin tab
  const [adminUser, setAdminUser] = useState("")
  const [adminPass, setAdminPass] = useState("")
  const [adminError, setAdminError] = useState<string | null>(null)

  const submitStudentSignIn = () => {
    if (!studentEmail || !studentPassword) {
      toast({
        title: "Missing details",
        description: "Please enter your email and password to sign in.",
      })
      return
    }
    // Sign in as student. The "password" is not validated — this is a
    // front-end demo until the v2 backend with real NextAuth credentials
    // is wired. We derive a friendly display name from the email handle.
    const handle = studentEmail.split("@")[0] || "Student"
    const pretty = handle
      .split(/[._-]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
    loginAsStudent(pretty, studentEmail, "View in dashboard")
    toast({
      title: `Welcome back, ${pretty.split(" ")[0]}!`,
      description: "Student dashboard is now visible above this section.",
    })
    setStudentEmail("")
    setStudentPassword("")
  }

  const submitSignup = () => {
    if (!signupName || !signupEmail || !signupStream) {
      toast({
        title: "Please complete the form",
        description: "Name, email and degree stream are all required.",
      })
      return
    }
    loginAsStudent(signupName, signupEmail, signupStream)
    toast({
      title: `Welcome aboard, ${signupName.split(" ")[0]}!`,
      description: `You're registered for ${signupStream}. Student dashboard is now visible.`,
    })
    setSignupName("")
    setSignupEmail("")
    setSignupStream("")
  }

  const handleGuestLogin = () => {
    loginAsGuest()
    toast({
      title: "Welcome, Guest!",
      description: "You can browse all programs, projects and testimonials freely.",
    })
  }

  const handleAdminLogin = () => {
    setAdminError(null)
    const res = loginAsAdmin(adminUser, adminPass)
    if (res.ok) {
      toast({
        title: "Admin signed in",
        description: "Welcome back. Admin Dashboard is now visible above this section.",
      })
      setAdminUser("")
      setAdminPass("")
    } else {
      setAdminError(res.error)
      toast({
        title: "Admin login failed",
        description: res.error,
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    const wasGoogle = role === "google"
    logout()
    if (wasGoogle) {
      // Also clear the NextAuth session if there is one
      signOut({ redirect: false }).catch(() => {
        /* ignore — signOut can fail when there's no NextAuth session, that's fine */
      })
    }
    toast({
      title: "Logged out",
      description: "Session cleared. You can browse as guest or sign back in any time.",
    })
  }

  return (
    <section id="login" className="border-b bg-muted/30 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
              Portal Login
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Sign in to access your dashboard
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Students: sign in with Google, email + password, or continue as a guest to
              browse. Admin: use the demo credentials shown in the Admin tab. New here?
              Use the Sign Up tab to register as a student — onboarding takes under 60
              seconds.
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TRUST_BADGES.map((b) => {
                const Icon = b.icon
                return (
                  <li
                    key={b.label}
                    className="flex flex-col items-center gap-2 rounded-lg border bg-background p-3 text-center"
                  >
                    <Icon className="h-5 w-5 text-emerald-600" />
                    <span className="text-xs font-medium">{b.label}</span>
                  </li>
                )
              })}
            </ul>

            {role && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Signed in as {name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Role: <span className="font-mono">{role}</span> · {email}
                    {stream && role !== "guest" && role !== "admin" && (
                      <> · Stream: <span className="font-medium text-foreground">{stream}</span></>
                    )}
                  </p>
                  {role === "student" && (
                    <p className="mt-1 text-xs text-emerald-700">
                      Your dashboard is visible above the Categories section.
                    </p>
                  )}
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
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>AgilePortal Access</CardTitle>
              <CardDescription>
                Pick a tab to sign in or register. Students are 100% free.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-6 space-y-4">
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
                    <Label htmlFor="signin-email">Student Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@college.edu"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signin-pass">Password</Label>
                    <Input
                      id="signin-pass"
                      type="password"
                      placeholder="••••••••"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={submitStudentSignIn}
                  >
                    Sign In
                  </Button>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <UserRound className="h-3.5 w-3.5" />
                      Just exploring?
                    </p>
                    <p className="mt-1 text-xs text-emerald-700/80">
                      Continue as a guest — browse all categories, programs and projects
                      without registering.
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
                  <p className="text-center text-xs text-muted-foreground">
                    Don&apos;t have an account? Switch to the Sign Up tab.
                  </p>
                </TabsContent>

                <TabsContent value="signup" className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="su-name">Full Name</Label>
                    <Input
                      id="su-name"
                      placeholder="Aditya Sharma"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-email">Student Email</Label>
                    <Input
                      id="su-email"
                      type="email"
                      placeholder="you@college.edu"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-stream">Degree Stream</Label>
                    <Input
                      id="su-stream"
                      placeholder="MBA / BBA / BSc — specialization"
                      value={signupStream}
                      onChange={(e) => setSignupStream(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={submitSignup}
                  >
                    Register Free
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    No documents · No fee · Onboarding in under 60 seconds
                  </p>
                </TabsContent>

                <TabsContent value="admin" className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ad-user">Admin Username / Email</Label>
                    <Input
                      id="ad-user"
                      placeholder="admin@agileportal.in"
                      value={adminUser}
                      onChange={(e) => {
                        setAdminUser(e.target.value)
                        setAdminError(null)
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ad-pass">Admin Password</Label>
                    <Input
                      id="ad-pass"
                      type="password"
                      placeholder="••••••••"
                      value={adminPass}
                      onChange={(e) => {
                        setAdminPass(e.target.value)
                        setAdminError(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAdminLogin()
                      }}
                    />
                  </div>
                  {adminError && (
                    <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{adminError}</span>
                    </div>
                  )}
                  <Button
                    className="w-full"
                    onClick={handleAdminLogin}
                  >
                    Sign In
                  </Button>

                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold">
                      <Info className="h-3.5 w-3.5 text-emerald-600" />
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
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      On success the Admin Dashboard section appears above this card.
                    </p>
                  </div>

                  <p className="text-center text-xs text-muted-foreground">
                    Admin login only. Students use Google Sign-In, Guest mode, or the Sign Up tab.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-xs text-muted-foreground">
                By continuing you agree to AgilePortal&apos;s Terms &amp; Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
