import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

/**
 * GET /api/student/list
 * Returns all students from the database (for admin progress panel).
 */
export async function GET() {
  try {
    const students = await db.student.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      ok: true,
      students,
      count: students.length,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
