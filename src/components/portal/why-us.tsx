"use client"

import { FEATURES } from "./portal-data"
import { Card, CardContent } from "@/components/ui/card"

export function WhyUs() {
  return (
    <section id="why" className="border-b bg-background scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
            Why AgilePortal
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Built for career outcomes
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Free does not mean low-quality. Every cohort is mentor-led, project-driven, and
            structured to make you placement-ready on completion.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <Card key={f.title} className="group h-full transition-all hover:shadow-md">
                <CardContent className="flex h-full flex-col p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100 transition-colors group-hover:bg-emerald-100">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
