"use client"

import { Navbar } from "@/components/portal/navbar"
import { Hero } from "@/components/portal/hero"
import { Stats } from "@/components/portal/stats"
import { AdminGate } from "@/components/portal/admin-gate"
import { StudentGate } from "@/components/portal/student-gate"
import { OrgGate } from "@/components/portal/org-gate"
import { Categories } from "@/components/portal/categories"
import { Login } from "@/components/portal/login"
import { HowItWorks } from "@/components/portal/how-it-works"
import { Programs } from "@/components/portal/programs"
import { WhyUs } from "@/components/portal/why-us"
import { Testimonials } from "@/components/portal/testimonials"
import { About } from "@/components/portal/about"
import { FAQ } from "@/components/portal/faq"
import { Footer } from "@/components/portal/footer"

export default function Home() {
  // Section order matches the reference site:
  // Hero → Stats → Categories → Login → How It Works → Programs → Why Us → Testimonials → About → FAQ
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <OrgGate />
        <StudentGate />
        <AdminGate />
        <Categories />
        <Login />
        <HowItWorks />
        <Programs />
        <WhyUs />
        <Testimonials />
        <About />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
