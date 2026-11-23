import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

/**
 * POST /api/student/login
 * Retrieves a student from the database by email + phone (primary key).
 * If found → returns the full student profile.
 * If not found → returns 404.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone } = body

    if (!email || !phone) {
      return NextResponse.json(
        { error: "Email and phone are required" },
        { status: 400 },
      )
    }

    const student = await db.student.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
      },
    })

    if (!student) {
      return NextResponse.json(
        { ok: false, error: "No student found with this email + phone" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      ok: true,
      student,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
