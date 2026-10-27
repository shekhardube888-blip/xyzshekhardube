"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./auth-store"
import { StudentDashboard } from "./student-dashboard"

/**
 * Renders the Student Dashboard only after client-side hydration and only
 * when the user is signed in as a student OR google user. Admins see the
 * Admin Dashboard instead (handled by <AdminGate />). Guests do not see
 * a dashboard.
 */
export function StudentGate() {
  const role = useAuth((s) => s.role)
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount guard for SSR-safe localStorage read
  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  if (role !== "student" && role !== "google") return null
  return <StudentDashboard />
}
