import { NextResponse } from "next/server"
import { googleEnabled } from "@/lib/auth"

/**
 * Exposes whether REAL Google OAuth credentials are configured.
 * The client uses this to decide whether the "Sign in with Google" button
 * should call signIn("google") (real) or open the demo account picker
 * (fallback).
 */
export async function GET() {
  return NextResponse.json({ enabled: googleEnabled })
}
