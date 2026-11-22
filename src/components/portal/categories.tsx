"use client"

import { useState } from "react"
import { CATEGORIES, type Category } from "./portal-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, ArrowLeft, Layers, BookOpen } from "lucide-react"
import { useView } from "./use-view"

const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Intermediate: "bg-amber-100 text-amber-700 border-amber-200",
  Advanced: "bg-rose-100 text-rose-700 border-rose-200",
}

export function Categories() {
  const [active, setActive] = useState<Category | null>(null)

  return (
    <section id="categories" className="border-b bg-background scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
            Internship Categories
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Choose Your Domain
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            Select your field to see the full project hierarchy: Category → Subcategory → Projects
            with details + progress. Click any category card to drill down.
          </p>
        </div>

        {!active ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => {
              const Icon = c.icon
              const isDisabled = !!c.badge
              return (
                <button
                  key={c.id}
                  onClick={() => !isDisabled && setActive(c)}
                  disabled={isDisabled}
                  className={`group relative overflow-hidden rounded-2xl border bg-card p-6 text-left shadow-sm transition-all hover:shadow-md ${
                    isDisabled ? "cursor-not-allowed opacity-70" : "hover:-translate-y-0.5"
                  }`}
                >
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.accent}`}
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent} ring-1 ring-inset ring-black/5`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      {c.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {c.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{c.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{c.blurb}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {c.tags.map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="border-border bg-background/70 text-xs font-normal"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                    {!isDisabled && (
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-700">
                        Select
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <SelectedCategory category={active} onBack={() => setActive(null)} />
        )}
      </div>
    </section>
  )
}

function SelectedCategory({
  category,
  onBack,
}: {
  category: Category
  onBack: () => void
}) {
  const Icon = category.icon
  const totalProjects = category.subcategories.reduce(
    (sum, s) => sum + s.projects.length,
    0,
  )

  return (
    <Card className="mt-10 overflow-hidden border-2 border-emerald-200">
      <CardHeader className={`bg-gradient-to-br ${category.accent}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 ring-1 ring-inset ring-black/5">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <CardTitle className="text-2xl">{category.title}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{category.blurb}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Layers className="h-4 w-4" />
            {category.subcategories.length} Subcategories
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {totalProjects} Projects
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
          {category.subcategories.map((sc) => (
            <div key={sc.name} className="p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                {sc.name}
              </h4>
              <ul className="mt-4 space-y-3">
                {sc.projects.map((p) => (
                  <li
                    key={p.title}
                    className="flex items-start justify-between gap-3 rounded-lg border bg-background/60 p-3"
                  >
                    <div className="flex items-start gap-2">
                      <ChevronRight className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.title}</p>
                        <p className="text-xs text-muted-foreground">Project brief</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] ${levelColor[p.level]}`}
                    >
                      {p.level}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t bg-muted/40 p-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Like what you see? Register to enroll in the {category.title} track.
          </p>
          <Button onClick={() => useView.getState().goToLogin()} className="bg-emerald-600 hover:bg-emerald-700">
            Register for this track
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
