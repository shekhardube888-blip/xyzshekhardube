"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./auth-store"
import { AdminDashboard } from "./admin-dashboard"

/**
 * Renders the Admin Dashboard only after client-side hydration and only when
 * the user is signed in as admin. Avoids SSR/hydration mismatches by gating
 * on `mounted` (localStorage isn't available during SSR).
 */
export function AdminGate() {
  const role = useAuth((s) => s.role)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted || role !== "admin") return null
  return <AdminDashboard />
}

