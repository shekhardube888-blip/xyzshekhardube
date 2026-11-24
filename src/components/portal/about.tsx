"use client"

import { ABOUT_STATS } from "./portal-data"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function About() {
  return (
    <section id="about" className="border-b bg-background scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
              About AgilePortal
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A mission to make quality internships free for every Indian student
            </h2>
            <div className="mt-6 space-y-4 text-base text-muted-foreground">
              <p>
                <strong className="font-semibold text-foreground">AgilePortal</strong> was founded
                in 2018 with a single conviction: every management &amp; science student in India
                deserves access to industry-grade mentorship, real projects, and a verifiable
                certificate — regardless of their financial background or college tier.
              </p>
              <p>
                Over <strong className="font-semibold text-foreground">10,000 students</strong>{" "}
                across <strong className="font-semibold text-foreground">500+ colleges</strong> have
                completed our live, project-based internship programs in Marketing, Entrepreneurship,
                Data Science, and Biotechnology tracks. Our mentors are working professionals from
                companies like Google, ITC, Zomato, Dr. Reddy&apos;s, and Infosys.
              </p>
              <p>
                We are{" "}
                <strong className="font-semibold text-foreground">
                  100% free — always
                </strong>
                . No registration fee, no course fee, no certificate fee. No hidden charges of any
                kind. We are committed to democratising quality education for the next generation of
                Indian managers, marketers, scientists and analysts.
              </p>
              <p>
                <strong className="font-semibold text-foreground">UGC &amp; AICTE mandate
                compliance:</strong> our merit certificates are accepted by 500+ colleges across
                India and are designed to meet UGC &amp; most university internship-mandate
                requirements for academic credit conversion.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <a href="#programs">
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Browse Internships
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#stories">Read student stories</a>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border bg-gradient-to-br from-emerald-50 to-amber-50 p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              By the numbers
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {ABOUT_STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border bg-background/80 p-4 text-center shadow-sm"
                >
                  <div className="text-3xl font-bold tracking-tight text-foreground">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border bg-background/80 p-4">
              <p className="text-xs uppercase tracking-wide text-emerald-700">Our promise</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                Zero fee at every stage · Real industry project on your CV · UGC-aligned verifiable
                certificate · Lifetime alumni access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
