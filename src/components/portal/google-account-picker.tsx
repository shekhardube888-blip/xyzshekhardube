"use client"

import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronRight, UserPlus } from "lucide-react"
import { useAuth } from "./auth-store"
import { useToast } from "@/hooks/use-toast"

export type DemoGoogleAccount = {
  id: string
  name: string
  email: string
  initials: string
  color: string
  stream: string
}

export const DEMO_GOOGLE_ACCOUNTS: DemoGoogleAccount[] = [
  {
    id: "aditya",
    name: "Aditya Sharma",
    email: "aditya.sharma@gmail.com",
    initials: "AS",
    color: "bg-emerald-500",
    stream: "MBA · Marketing",
  },
  {
    id: "priya",
    name: "Priya Menon",
    email: "priya.menon@gmail.com",
    initials: "PM",
    color: "bg-amber-500",
    stream: "BBA · Digital Marketing",
  },
  {
    id: "kartik",
    name: "Kartik Verma",
    email: "kartik.verma@gmail.com",
    initials: "KV",
    color: "bg-teal-500",
    stream: "BSc · Statistics",
  },
]

/**
 * Polished "Choose an account" dialog that visually mirrors Google's real
 * account picker. Used as the fallback when REAL Google OAuth credentials
 * aren't configured — gives users a working sign-in experience in the
 * sandbox preview.
 */
export function GoogleAccountPicker({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPick: (acc: DemoGoogleAccount) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-0 sm:rounded-2xl">
        <div className="flex flex-col items-center pt-8">
          {/* Google logo (inline SVG to avoid extra network request) */}
          <svg
            viewBox="0 0 75 24"
            className="h-6 w-auto"
            aria-label="Google"
            role="img"
          >
            <path
              fill="#4285F4"
              d="M9.24 8.05v2.95h4.31c-.17 1.1-.71 1.93-1.5 2.51v2.09h2.43c1.42-1.31 2.25-3.24 2.25-5.55 0-.42-.04-.83-.1-1.22H9.24z"
            />
            <path
              fill="#34A853"
              d="M9.24 16.5c2.04 0 3.75-.67 5-1.83l-2.43-1.88c-.67.45-1.54.72-2.57.72-1.97 0-3.64-1.34-4.24-3.13H2.5v1.94c1.25 2.48 3.84 4.18 6.74 4.18z"
            />
            <path
              fill="#FBBC05"
              d="M5 10.49c-.15-.45-.24-.93-.24-1.49s.09-1.04.24-1.49V5.57H2.5C1.96 6.66 1.65 7.92 1.65 9s.31 2.34.85 3.43L5 10.49z"
            />
            <path
              fill="#EA4335"
              d="M9.24 5.55c1.11 0 2.11.38 2.9 1.13l2.17-2.17C13.41 3.04 11.71 2.5 9.24 2.5 6.34 2.5 3.75 4.2 2.5 6.68l2.5 1.94c.6-1.79 2.27-3.07 4.24-3.07z"
            />
          </svg>
        </div>
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-[22px] font-normal text-gray-800">
            Choose an account
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            to continue to AgilePortal
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 px-2 pb-4">
          <ul className="divide-y divide-gray-100">
            {DEMO_GOOGLE_ACCOUNTS.map((acc) => (
              <li key={acc.id}>
                <button
                  type="button"
                  onClick={() => onPick(acc)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                  <Avatar className={`h-9 w-9 ${acc.color}`}>
                    <AvatarFallback className="bg-transparent text-xs font-semibold text-white">
                      {acc.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-800">
                      {acc.name}
                    </div>
                    <div className="truncate text-xs text-gray-500">
                      {acc.email}
                    </div>
                    <div className="truncate text-[11px] text-gray-400">
                      {acc.stream} · Demo account
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-gray-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white">
              <UserPlus className="h-4 w-4 text-gray-500" />
            </span>
            <span className="text-sm font-medium text-gray-700">
              Use another account
            </span>
          </button>

          <p className="mt-4 text-[11px] leading-relaxed text-gray-400">
            To enable <strong>real</strong> Google Sign-In, set
            <code className="mx-1 rounded bg-gray-100 px-1 text-[10px]">
              GOOGLE_CLIENT_ID
            </code>
            and
            <code className="mx-1 rounded bg-gray-100 px-1 text-[10px]">
              GOOGLE_CLIENT_SECRET
            </code>
            in your <code className="text-[10px]">.env</code> file — see the
            comment block in <code className="text-[10px]">.env</code> for
            full setup steps.
          </p>

          <div className="mt-3 flex items-center justify-end gap-2 border-t pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Hook used by the Google sign-in button. Returns a click handler that:
 *   - Calls signIn("google") if real Google OAuth is configured server-side
 *   - Otherwise opens the demo account picker dialog
 */
export function useGoogleSignIn() {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const { loginAsGoogle } = useAuth()
  const { toast } = useToast()

  // Check server-side status once on mount
  useEffect(() => {
    fetch("/api/google-status", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { enabled?: boolean }) => setEnabled(!!d.enabled))
      .catch(() => setEnabled(false))
  }, [])

  const trigger = () => {
    if (enabled === null) {
      toast({
        title: "Checking Google OAuth status…",
        description: "One moment — verifying configuration.",
      })
      return
    }
    if (enabled) {
      // Real Google OAuth — redirect to Google consent
      signIn("google", { callbackUrl: "/" })
      return
    }
    // Demo fallback — open the picker
    setPickerOpen(true)
  }

  const handlePick = (acc: DemoGoogleAccount) => {
    loginAsGoogle(acc.name, acc.email, null)
    setPickerOpen(false)
    toast({
      title: `Signed in as ${acc.name}`,
      description: `${acc.email} · Demo Google account (${acc.stream})`,
    })
  }

  return {
    pickerOpen,
    setPickerOpen,
    trigger,
    handlePick,
    enabled,
  }
}

/**
 * The smart "Sign in with Google" button. Auto-decides between real OAuth
 * and the demo picker based on server-side configuration.
 */
export function GoogleSignInButton({
  className,
  variant = "outline",
  label = "Sign in with Google",
}: {
  className?: string
  variant?: "outline" | "default" | "secondary"
  label?: string
}) {
  const { pickerOpen, setPickerOpen, trigger, handlePick, enabled } =
    useGoogleSignIn()

  return (
    <>
      <button
        type="button"
        onClick={trigger}
        className={
          "flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60 " +
            (className ?? "")
        }
        disabled={enabled === null}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.24 1.05-3.71 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75z"
          />
        </svg>
        {enabled === null ? "Loading…" : label}
      </button>
      <GoogleAccountPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={handlePick}
      />
    </>
  )
}
