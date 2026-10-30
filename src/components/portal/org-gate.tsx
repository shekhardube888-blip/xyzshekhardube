"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./auth-store"
import { OrgManagementPanel } from "./org-management-panel"

/**
 * Renders the Organization Management panel only after client-side hydration
 * and only when the user is signed in as super_admin. Admins (student
 * applications dashboard) and learners see their respective panels instead.
 */
export function OrgGate() {
  const role = useAuth((s) => s.role)
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount guard for SSR-safe localStorage read
  useEffect(() => setMounted(true), [])

  if (!mounted || role !== "super_admin") return null
  return <OrgManagementPanel />
}
