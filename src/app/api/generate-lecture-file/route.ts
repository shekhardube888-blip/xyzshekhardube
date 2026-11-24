import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { readFile } from "fs/promises"
import path from "path"

export const dynamic = "force-dynamic"

/**
 * POST /api/generate-lecture-file
 * Body: { lecture: {...}, weekId: number, format: "pdf" | "ppt" }
 * Calls the Python script to generate the file and returns it as a download.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { lecture, weekId, format } = body

    if (!lecture || !weekId || !format) {
      return NextResponse.json({ error: "lecture, weekId, and format are required" }, { status: 400 })
    }

    if (format !== "pdf" && format !== "ppt") {
      return NextResponse.json({ error: "format must be 'pdf' or 'ppt'" }, { status: 400 })
    }

    // Call the Python script (use the venv Python that has reportlab + pptx)
    const scriptPath = path.join(process.cwd(), "scripts", "generate-lecture.py")
    const pythonPath = "/home/z/.venv/bin/python3"
    const input = JSON.stringify({ lecture, weekId, format })

    const result = await new Promise<{ path: string; filename: string }>((resolve, reject) => {
      const proc = spawn(pythonPath, [scriptPath], {
        stdio: ["pipe", "pipe", "pipe"],
      })

      let stdout = ""
      let stderr = ""

      proc.stdin.write(input)
      proc.stdin.end()

      proc.stdout.on("data", (data) => { stdout += data.toString() })
      proc.stderr.on("data", (data) => { stderr += data.toString() })

      proc.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${stderr || stdout}`))
        } else {
          try {
            const parsed = JSON.parse(stdout.trim())
            resolve(parsed)
          } catch {
            reject(new Error(`Failed to parse script output: ${stdout}`))
          }
        }
      })

      proc.on("error", (err) => reject(err))
    })

    // Read the generated file and return as download
    const fileBuffer = await readFile(result.path)
    const contentType = format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.presentationml.presentation"

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
