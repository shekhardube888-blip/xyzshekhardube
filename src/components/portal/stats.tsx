"use client"

import { Button } from "@/components/ui/button"
import { GLANCE_STATS } from "./portal-data"

export function Stats() {
  return (
    <section className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
              Program at a glance
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Verified metrics · Updated 2025
            </h2>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <a href="#programs">Enroll now</a>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {GLANCE_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="text-3xl font-bold tracking-tight text-foreground">{s.value}</div>
              <div className="mt-1 text-sm font-medium text-foreground">{s.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
