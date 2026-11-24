import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

/**
 * POST /api/student/register
 * Saves a new student to the database (email + phone as primary key).
 * If the email or phone already exists, returns the existing student.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, email, phone, stream, qualification, year,
      college, city, guardianEmail, guardianRole,
      category, subcategory, track,
    } = body

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 },
      )
    }

    // Check if student already exists (by email OR phone)
    const existing = await db.student.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          { phone: phone.trim() },
        ],
      },
    })

    if (existing) {
      // Return existing student — no duplicate
      return NextResponse.json({
        ok: true,
        student: existing,
        message: "Student already registered",
      })
    }

    // Create new student in DB
    const student = await db.student.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        stream: stream || null,
        qualification: qualification || null,
        year: year || null,
        college: college || null,
        city: city || null,
        guardianEmail: guardianEmail || null,
        guardianRole: guardianRole || null,
        category: category || null,
        subcategory: subcategory || null,
        track: track || null,
        status: "active",
      },
    })

    return NextResponse.json({
      ok: true,
      student,
      message: "Student registered successfully",
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
