"use client"

import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useAuth } from "./auth-store"

/**
 * Wraps the app with NextAuth's SessionProvider so `useSession()` works.
 */
export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

/**
 * AuthSync (renderless) — keeps the Zustand auth-store in sync with the
 * NextAuth session. When a user signs in via real Google OAuth, their name,
 * email and profile picture are pushed into the Zustand store so the rest of
 * the UI (navbar, login section, admin gate) can read them without calling
 * useSession everywhere.
 */
export function AuthSync() {
  const { data: session, status } = useSession()
  const loginAsGoogle = useAuth((s) => s.loginAsGoogle)
  const currentRole = useAuth((s) => s.role)
  const [mounted, setMounted] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount guard for SSR-safe session read
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    if (status === "authenticated" && session?.user) {
      // Real NextAuth session is active — promote to google role unless
      // the user is currently an admin (higher privilege, keep it).
      if (currentRole !== "admin" && currentRole !== "google") {
        loginAsGoogle(
          session.user.name ?? "Google User",
          session.user.email ?? "user@gmail.com",
          // @ts-expect-error - image isn't on the default User type
          session.user.image ?? null,
        )
      }
    }
    // Intentionally do NOT logout on status === "unauthenticated" — demo
    // google logins (no real NextAuth session) would otherwise get clobbered.
    // NextAuth session expiry is handled by the explicit logout() call which
    // also fires signOut() — see login.tsx / navbar.tsx.
  }, [status, session, mounted, currentRole, loginAsGoogle])

  return null
}
