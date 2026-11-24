"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, BadgeCheck } from "lucide-react"
import { HERO_STATS } from "./portal-data"

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b bg-gradient-to-b from-emerald-50/70 via-background to-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-1/4 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            UGC-Aligned · Industry Mentor-Led · Enterprise-Ready · Verifiable Certificates
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Launch Your Career with Industry-Grade{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
              Internships
            </span>{" "}
            & Projects
          </h1>
          <p className="mt-6 text-base text-muted-foreground sm:text-lg text-pretty">
            Industry-grade Internship Programs in Marketing, Entrepreneurship, Data Science &
            Biotechnology. <strong className="font-semibold text-foreground">AgilePortal Enterprise</strong>{" "}
            delivers mentor-led, project-based training for{" "}
            <strong className="font-semibold text-foreground">MBA · BBA · BSc</strong> students —
            with verifiable certificates designed for academic credit. Enterprise orgs manage
            team training cohorts via the Super Admin dashboard.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              Trusted by <strong className="text-foreground">800+</strong> students across{" "}
              <strong className="text-foreground">80+</strong> colleges
            </span>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">
              <a href="#programs">
                Start Free Internship
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <a href="#categories">Explore 60+ Projects</a>
            </Button>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-5">
            {HERO_STATS.map((s) => (
              <li
                key={s.label}
                className="rounded-lg border bg-background/80 p-3 text-center shadow-sm"
              >
                <div className="text-base font-semibold text-foreground">
                  {s.value}{" "}
                  <span className="text-xs font-normal text-muted-foreground">{s.suffix}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
