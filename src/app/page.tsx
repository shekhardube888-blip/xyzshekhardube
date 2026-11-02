"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/portal/navbar"
import { Hero } from "@/components/portal/hero"
import { Stats } from "@/components/portal/stats"
import { Categories } from "@/components/portal/categories"
import { Login } from "@/components/portal/login"
import { HowItWorks } from "@/components/portal/how-it-works"
import { Programs } from "@/components/portal/programs"
import { WhyUs } from "@/components/portal/why-us"
import { Testimonials } from "@/components/portal/testimonials"
import { About } from "@/components/portal/about"
import { FAQ } from "@/components/portal/faq"
import { Footer } from "@/components/portal/footer"
import { StudentDashboard } from "@/components/portal/student-dashboard"
import { AdminDashboard } from "@/components/portal/admin-dashboard"
import { OrgManagementPanel } from "@/components/portal/org-management-panel"
import { PendingApproval } from "@/components/portal/pending-approval"
import { useAuth } from "@/components/portal/auth-store"
import { useView } from "@/components/portal/use-view"
import { useMounted } from "@/components/portal/use-test-progress"

export default function Home() {
  const view = useView((s) => s.view)
  const role = useAuth((s) => s.role)
  const registrationStatus = useAuth((s) => s.registrationStatus)
  const goToDashboard = useView((s) => s.goToDashboard)
  const goToMarketing = useView((s) => s.goToMarketing)
  const mounted = useMounted()

  // Auto-correct the view based on auth state once mounted:
  //  - If a non-guest role exists AND view === "login" → jump to dashboard
  //    (covers reload while on the login view but actually already logged in)
  //  EXCEPT for students mid-registration (registered/paid/rejected) — they
  //  need to stay in the login view so the RegistrationWizard can complete
  //  the payment step, and the PendingApproval screen takes over only after
  //  they click "Go to my dashboard".
  //  - If no role AND view === "dashboard" → jump back to marketing
  useEffect(() => {
    if (!mounted) return
    if (view === "login" && role && role !== "guest") {
      // Students who haven't finished registration stay in the login view
      if (
        role === "student" &&
        registrationStatus !== "approved" &&
        registrationStatus !== "none"
      ) {
        return
      }
      goToDashboard()
    } else if (view === "dashboard" && !role) {
      goToMarketing()
    }
  }, [mounted, view, role, registrationStatus, goToDashboard, goToMarketing])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {view === "marketing" && <MarketingView />}
        {view === "login" && <LoginView />}
        {view === "dashboard" && <DashboardView />}
      </main>
      <Footer />
    </div>
  )
}

function MarketingView() {
  // Note: the login section is intentionally NOT in this view — it lives in
  // its own "login" view now. The marketing page is purely the landing page.
  return (
    <>
      <Hero />
      <Stats />
      <Categories />
      <Programs />
      <HowItWorks />
      <WhyUs />
      <Testimonials />
      <About />
      <FAQ />
    </>
  )
}

function LoginView() {
  return <Login />
}

function DashboardView() {
  const role = useAuth((s) => s.role)
  const registrationStatus = useAuth((s) => s.registrationStatus)
  const mounted = useMounted()

  // Wait for client-side mount before rendering — auth role comes from
  // localStorage (Zustand persist) and isn't available during SSR.
  if (!mounted) return null

  if (role === "admin") return <AdminDashboard />
  if (role === "super_admin") return <OrgManagementPanel />

  // Student / google roles: gate on registration status
  if (role === "student" || role === "google") {
    // If registration is paid but not yet approved, show the pending screen
    if (registrationStatus === "paid" || registrationStatus === "registered" || registrationStatus === "rejected") {
      return <PendingApproval />
    }
    // If approved (or legacy direct-login which sets approved), show dashboard
    if (registrationStatus === "approved" || registrationStatus === "none") {
      return <StudentDashboard />
    }
  }

  // Guests / logged-out users shouldn't reach the dashboard view — the
  // auto-correction effect in Home() bounces them back to marketing.
  return null
}
