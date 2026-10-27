"use client"

import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, Rocket, UserRound, ShieldCheck, LogOut } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { role, name, logout } = useAuth()
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
        /* ignore — signOut can fail when there's no NextAuth session */
      })
    }
    toast({
      title: "Logged out",
      description: "Session cleared. You can browse as guest or sign back in any time.",
    })
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors ${
        scrolled
          ? "bg-background/90 backdrop-blur border-border supports-[backdrop-filter]:bg-background/70"
          : "bg-background/60 backdrop-blur border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Rocket className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Agile<span className="text-emerald-600">Portal</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            >
              {l.label}
            </a>
          ))}
          {mounted && role === "admin" && (
            <a
              href="#admin"
              className="rounded-md px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-50"
            >
              Admin Dashboard
            </a>
          )}
          {mounted && (role === "student" || role === "google") && (
            <a
              href="#student"
              className="rounded-md px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              My Dashboard
            </a>
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {mounted && role ? (
            <>
              <Badge
                variant="outline"
                className={`gap-1 ${
                  role === "admin"
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-emerald-300 bg-emerald-50 text-emerald-700"
                }`}
              >
                {role === "admin" ? (
                  <ShieldCheck className="h-3 w-3" />
                ) : (
                  <UserRound className="h-3 w-3" />
                )}
                {name}
              </Badge>
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
              <Button variant="ghost" size="sm" asChild>
                <a href="#login">Login</a>
              </Button>
              <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-700">
                <a href="#login">Register Free</a>
              </Button>
            </>
          )}
        </div>

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
                AgilePortal
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-1 px-2">
              {NAV_LINKS.map((l) => (
                <SheetClose asChild key={l.href}>
                  <a
                    href={l.href}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </SheetClose>
              ))}
              {mounted && role === "admin" && (
                <SheetClose asChild>
                  <a
                    href="#admin"
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-50"
                  >
                    Admin Dashboard
                  </a>
                </SheetClose>
              )}
              {mounted && (role === "student" || role === "google") && (
                <SheetClose asChild>
                  <a
                    href="#student"
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                  >
                    My Dashboard
                  </a>
                </SheetClose>
              )}
            </div>
            <div className="mt-auto flex flex-col gap-2 px-4 pb-6">
              {mounted && role ? (
                <>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-semibold text-foreground">{name}</p>
                    <p className="mt-0.5 text-[10px] font-mono uppercase text-emerald-700">
                      {role}
                    </p>
                  </div>
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-1.5 h-4 w-4" />
                      Logout
                    </Button>
                  </SheetClose>
                </>
              ) : (
                <>
                  <SheetClose asChild>
                    <Button variant="outline" asChild>
                      <a href="#login">Login</a>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                      <a href="#login">Register Free</a>
                    </Button>
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
