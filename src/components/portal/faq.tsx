"use client"

import { FAQS } from "./portal-data"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { MessageCircle, HelpCircle } from "lucide-react"

export function FAQ() {
  return (
    <section id="faq" className="border-b bg-background scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
            Frequently Asked
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you want to know
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Still have a question? Ask the AI Mentor below, or WhatsApp{" "}
            <a
              href="https://wa.me/918095557334"
              className="font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              +91 80955 57334
            </a>{" "}
            — our team replies within 24 hours.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-b">
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                    <span className="flex items-start gap-2">
                      <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {f.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <aside className="rounded-2xl border bg-gradient-to-br from-emerald-50 to-background p-6">
            <h3 className="text-base font-semibold">Ask the AI Mentor</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our 24/7 AI assistant can answer most questions about eligibility, batch schedule,
              certificate and project details — instant replies, no waiting.
            </p>
            <Button
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
              asChild
            >
              <a href="#login">
                <MessageCircle className="mr-1.5 h-4 w-4" />
                Open AI Mentor
              </a>
            </Button>
            <div className="mt-4 border-t pt-4 text-xs text-muted-foreground">
              <p>Prefer to talk to a human?</p>
              <p className="mt-1">
                WhatsApp:{" "}
                <a
                  href="https://wa.me/918095557334"
                  className="font-medium text-emerald-700 underline-offset-2 hover:underline"
                >
                  +91 80955 57334
                </a>
              </p>
              <p className="mt-1">
                Email:{" "}
                <a
                  href="mailto:training@agileportal.in"
                  className="font-medium text-emerald-700 underline-offset-2 hover:underline"
                >
                  training@agileportal.in
                </a>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
