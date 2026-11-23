"use client"

import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Rocket,
  UserRound,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  LayoutDashboard,
  Crown,
} from "lucide-react"
import { NAV_LINKS } from "./portal-data"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useAuth } from "./auth-store"
import { useView } from "./use-view"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const ROLE_LABEL: Record<string, string> = {
  student: "Student",
  google: "Student",
  admin: "Admin",
  super_admin: "Super Admin",
  guest: "Guest",
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { role, name, logout } = useAuth()
  const view = useView((s) => s.view)
  const goToLogin = useView((s) => s.goToLogin)
  const goToMarketing = useView((s) => s.goToMarketing)
  const goToDashboard = useView((s) => s.goToDashboard)
  const { toast } = useToast()

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount guard for SSR-safe localStorage read
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleLogout = () => {
    const wasGoogle = role === "google"
    logout()
    if (wasGoogle) {
      signOut({ redirect: false }).catch(() => {
        /* ignore */
      })
    }
    toast({
      title: "Logged out",
      description: "Session cleared. Returning to the landing page.",
    })
    goToLogin()
  }

  // What dashboard link to show in the navbar based on role
  const dashboardHref =
    role === "admin"
      ? "#admin"
      : role === "super_admin"
      ? "#org"
      : "#student"
  const dashboardLabel =
    role === "admin"
      ? "Admin Dashboard"
      : role === "super_admin"
      ? "Org Management"
      : "My Dashboard"

  const showMarketingNav = view === "marketing"
  const showLoginHeader = view === "login"
  const showDashboardHeader = view === "dashboard"

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors ${
        scrolled || view !== "marketing"
          ? "bg-background/90 backdrop-blur border-border supports-[backdrop-filter]:bg-background/70"
          : "bg-background/60 backdrop-blur border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          onClick={goToMarketing}
          className="flex items-center gap-2"
          aria-label="Back to home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Rocket className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Agile<span className="text-emerald-600">Portal</span>{" "}
            <span className="ml-0.5 rounded bg-amber-100 px-1.5 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              Enterprise
            </span>
          </span>
        </button>

        {/* Desktop nav (marketing view only) */}
        {showMarketingNav && (
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.filter((l) => l.href !== "#login").map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              >
                {l.label}
              </a>
            ))}
            {mounted && role && role !== "guest" && (
              <button
                onClick={goToDashboard}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                {dashboardLabel}
              </button>
            )}
          </nav>
        )}

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {showMarketingNav && (
            <>
              {mounted && role ? (
                <>
                  <Badge
                    variant="outline"
                    className={`gap-1 ${
                      role === "admin"
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : role === "super_admin"
                        ? "border-violet-300 bg-violet-50 text-violet-700"
                        : role === "guest"
                        ? "border-slate-300 bg-slate-50 text-slate-700"
                        : "border-emerald-300 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {role === "admin" ? (
                      <ShieldCheck className="h-3 w-3" />
                    ) : role === "super_admin" ? (
                      <Crown className="h-3 w-3" />
                    ) : (
                      <UserRound className="h-3 w-3" />
                    )}
                    {name}
                  </Badge>
                  {role !== "guest" && (
                    <button
                      onClick={goToDashboard}
                      className="rounded-md px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                    >
                      <LayoutDashboard className="mr-1.5 inline h-4 w-4" />
                      {dashboardLabel}
                    </button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="mr-1.5 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={goToLogin}>
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={goToLogin}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Register Free
                  </Button>
                </>
              )}
            </>
          )}

          {showLoginHeader && (
            <Button variant="ghost" size="sm" onClick={goToMarketing}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to home
            </Button>
          )}

          {showDashboardHeader && (
            <>
              <Badge
                variant="outline"
                className={`gap-1 ${
                  role === "admin"
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : role === "super_admin"
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-emerald-300 bg-emerald-50 text-emerald-700"
                }`}
              >
                {role === "admin" ? (
                  <ShieldCheck className="h-3 w-3" />
                ) : role === "super_admin" ? (
                  <Crown className="h-3 w-3" />
                ) : (
                  <UserRound className="h-3 w-3" />
                )}
                {name}
                <span className="ml-1 text-[10px] opacity-70">
                  · {ROLE_LABEL[role ?? "guest"]}
                </span>
              </Badge>
              <Button variant="ghost" size="sm" onClick={goToMarketing}>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu (only on marketing + dashboard views) */}
        {!showLoginHeader && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <Rocket className="h-4 w-4" />
                  </span>
                  AgilePortal Enterprise
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-1 px-2">
                {showMarketingNav &&
                  NAV_LINKS.filter((l) => l.href !== "#login").map((l) => (
                    <SheetClose asChild key={l.href}>
                      <a
                        href={l.href}
                        className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {l.label}
                      </a>
                    </SheetClose>
                  ))}
                {showDashboardHeader && (
                  <SheetClose asChild>
                    <a
                      href={dashboardHref}
                      className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {dashboardLabel}
                    </a>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <button
                    onClick={goToMarketing}
                    className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ArrowLeft className="mr-1.5 inline h-4 w-4" />
                    Back to home
                  </button>
                </SheetClose>
              </div>
              <div className="mt-auto flex flex-col gap-2 px-4 pb-6">
                {mounted && role ? (
                  <>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">Signed in as</p>
                      <p className="text-sm font-semibold text-foreground">{name}</p>
                      <p className="mt-0.5 text-[10px] font-mono uppercase text-emerald-700">
                        {ROLE_LABEL[role ?? "guest"]}
                      </p>
                    </div>
                    {showMarketingNav && role !== "guest" && (
                      <SheetClose asChild>
                        <Button variant="outline" onClick={goToDashboard}>
                          <LayoutDashboard className="mr-1.5 h-4 w-4" />
                          Go to dashboard
                        </Button>
                      </SheetClose>
                    )}
                    <SheetClose asChild>
                      <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="mr-1.5 h-4 w-4" />
                        Logout
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button variant="outline" onClick={goToLogin}>
                        Login
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        onClick={goToLogin}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Register Free
                      </Button>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  )
}
