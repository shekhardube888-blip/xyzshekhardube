"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useView, type SectionKey } from "./use-view"
import { Programs } from "./programs"
import { Categories } from "./categories"
import { HowItWorks } from "./how-it-works"
import { WhyUs } from "./why-us"
import { Testimonials } from "./testimonials"
import { About } from "./about"
import { FAQ } from "./faq"

const SECTION_CONFIG: Record<string, { title: string; component: React.ReactNode }> = {
  programs: { title: "Internship Programs", component: <Programs /> },
  categories: { title: "Categories", component: <Categories /> },
  how: { title: "How It Works", component: <HowItWorks /> },
  why: { title: "Why AgilePortal Enterprise", component: <WhyUs /> },
  stories: { title: "Student Stories", component: <Testimonials /> },
  about: { title: "About AgilePortal Enterprise", component: <About /> },
  faq: { title: "Frequently Asked Questions", component: <FAQ /> },
}

export function SectionDialog() {
  const openSection = useView((s) => s.openSection)
  const setOpenSection = useView((s) => s.setOpenSection)

  const config = openSection ? SECTION_CONFIG[openSection] : null

  return (
    <Dialog open={!!openSection} onOpenChange={(o) => { if (!o) setOpenSection(null) }}>
      <DialogContent className="max-w-2xl p-0 sm:rounded-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{config?.title ?? "Section"}</DialogTitle>
          <DialogDescription>View section content</DialogDescription>
        </DialogHeader>

        {/* Emerald header bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-emerald-600 px-4 py-2 text-white">
          <span className="text-sm font-semibold">{config?.title ?? "Section"}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpenSection(null)}
            className="text-white hover:bg-white/20 h-7 px-2 text-xs"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Close
          </Button>
        </div>

        {/* Section content */}
        <div className="p-4">
          {config?.component}
        </div>
      </DialogContent>
    </Dialog>
  )
}
