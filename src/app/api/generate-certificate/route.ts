import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { readFile } from "fs/promises"
import path from "path"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data, type } = body

    if (!data || !type) {
      return NextResponse.json({ error: "data and type are required" }, { status: 400 })
    }

    if (type !== "certificate" && type !== "letter") {
      return NextResponse.json({ error: "type must be 'certificate' or 'letter'" }, { status: 400 })
    }

    const scriptPath = path.join(process.cwd(), "scripts", "generate-certificate.py")
    const pythonPath = "/home/z/.venv/bin/python3"
    const input = JSON.stringify({ data, type })

    const result = await new Promise<{ path: string; filename: string }>((resolve, reject) => {
      const proc = spawn(pythonPath, [scriptPath], { stdio: ["pipe", "pipe", "pipe"] })
      let stdout = ""
      let stderr = ""
      proc.stdin.write(input)
      proc.stdin.end()
      proc.stdout.on("data", (d) => { stdout += d.toString() })
      proc.stderr.on("data", (d) => { stderr += d.toString() })
      proc.on("close", (code) => {
        if (code !== 0) reject(new Error(`Script failed: ${stderr || stdout}`))
        else {
          try { resolve(JSON.parse(stdout.trim())) }
          catch { reject(new Error(`Parse error: ${stdout}`)) }
        }
      })
      proc.on("error", (err) => reject(err))
    })

    const fileBuffer = await readFile(result.path)
    const contentType = "application/pdf"

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
