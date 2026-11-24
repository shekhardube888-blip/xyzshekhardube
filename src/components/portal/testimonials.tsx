"use client"

import { TESTIMONIALS } from "./portal-data"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

export function Testimonials() {
  return (
    <section id="stories" className="border-b bg-muted/30 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
            Student Stories
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            What our interns say
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Real students, real projects, real career outcomes. 10,000+ students trained across
            500+ colleges in management and science streams.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex h-full flex-col p-6">
                <Quote className="h-6 w-6 text-emerald-300" />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                  {t.quote}
                </p>
                <div className="mt-5 flex items-center gap-3 border-t pt-4">
                  <Avatar className="h-10 w-10 border bg-emerald-50">
                    <AvatarFallback className="bg-emerald-50 text-xs font-semibold text-emerald-700">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.program}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
