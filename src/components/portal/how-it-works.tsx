"use client"

import { STEPS } from "./portal-data"
import { Card, CardContent } from "@/components/ui/card"

export function HowItWorks() {
  return (
    <section id="how" className="border-b bg-background scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
            How It Works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Your path from registration to certificate
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Five structured steps — no fee, no friction. Register, get approved, start training,
            ship a real project, and earn a verifiable certificate.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <li key={s.num} className="relative">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        Step {s.num}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  </CardContent>
                </Card>
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-[-12px] top-1/2 hidden h-px w-6 bg-emerald-200 lg:block"
                  />
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
