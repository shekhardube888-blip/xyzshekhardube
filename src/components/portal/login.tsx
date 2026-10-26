"use client"

import { useState } from "react"
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
import { BadgeCheck, ShieldCheck, Clock, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const TRUST_BADGES = [
  { label: "AICTE-Aligned", icon: BadgeCheck },
  { label: "Mentor-Led", icon: ShieldCheck },
  { label: "Certificate", icon: BadgeCheck },
  { label: "100% Online", icon: Globe },
]

export function Login() {
  const { toast } = useToast()
  const [studentEmail, setStudentEmail] = useState("")
  const [studentPassword, setStudentPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupStream, setSignupStream] = useState("")
  const [adminUser, setAdminUser] = useState("")
  const [adminPass, setAdminPass] = useState("")

  const fakeSubmit = (msg: string) => {
    toast({
      title: "Submitted",
      description: msg,
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
              Students: sign in with Google or email + password. Admin: use your credentials.
              New here? Use the Sign Up tab to register as a student — onboarding takes under 60
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
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>AgilePortal Access</CardTitle>
              <CardDescription>
                Pick a tab to sign in or register. All student tracks are 100% free.
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
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full" type="button">
                      Sign in with Google
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">or</span>
                      </div>
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
                    onClick={() =>
                      fakeSubmit("Sign-in request received — check your inbox to confirm.")
                    }
                  >
                    Sign In
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Don&apos;t have an account? Sign up as a student below.
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
                    onClick={() =>
                      fakeSubmit(
                        "Sign-up received — our team will verify your enrollment within 48 hours.",
                      )
                    }
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
                      onChange={(e) => setAdminUser(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ad-pass">Admin Password</Label>
                    <Input
                      id="ad-pass"
                      type="password"
                      placeholder="••••••••"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => fakeSubmit("Admin sign-in attempt logged.")}
                  >
                    Sign In
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Admin login only. Students use Google Sign-In or the Sign Up tab.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-xs text-muted-foreground">
                By continuing you agree to AgilePortal&apos;s Terms & Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
