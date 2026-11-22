"use client"

import { PROGRAMS, type Program } from "./portal-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Radio, ArrowRight } from "lucide-react"
import { useView } from "./use-view"

export function Programs() {
  return (
    <section id="programs" className="border-b bg-muted/30 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
            Internship Programs
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Choose your industry track
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Four tracks covering the full management &amp; science landscape — from marketing &amp;
            entrepreneurship (MBA / BBA) to data science &amp; biotech (BSc). All live, all
            project-based, all mentor-led.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PROGRAMS.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProgramCard({ program }: { program: Program }) {
  const isSoon = program.status === "soon"
  return (
    <Card
      className={`relative flex h-full flex-col overflow-hidden transition-all hover:shadow-lg ${
        program.badge === "Most Popular" ? "border-2 border-emerald-300" : ""
      }`}
    >
      {program.badge && (
        <div className="absolute right-0 top-0 m-3">
          <Badge
            className={
              program.badge === "Most Popular"
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-200 text-slate-700"
            }
          >
            {program.badge}
          </Badge>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden>
            {program.emoji}
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {program.track}
            </p>
            <CardTitle className="text-xl">{program.title}</CardTitle>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="outline">{program.level}</Badge>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {program.duration}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {program.cost}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Radio className="h-3.5 w-3.5" />
            {program.schedule}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">{program.description}</p>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Key skills
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {program.skills.map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex flex-wrap items-center gap-2 border-t bg-muted/30 p-4">
        <Button
          asChild
          variant={program.ctaVariant === "outline" ? "outline" : "default"}
          className={
            program.ctaVariant === "default"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : ""
          }
          disabled={isSoon}
        >
          {isSoon ? (
            <span>{program.cta}</span>
          ) : (
            <button onClick={() => useView.getState().goToLogin()} className="flex items-center">
              {program.cta}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </button>
          )}
        </Button>
        {!isSoon && (
          <Button variant="ghost" size="sm" asChild>
            <a href="#categories">View Details</a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
