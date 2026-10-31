import { NextRequest, NextResponse } from "next/server"
import ZAI from "z-ai-web-dev-sdk"

export const dynamic = "force-dynamic"

type FeedbackInput = {
  weekId?: number
  weekTitle?: string
  brand?: string
  brief?: string
  asks?: string[]
  solutionText?: string
  minWords?: number
  maxWords?: number
}

type FeedbackResponse = {
  verdict: "Strong" | "Solid" | "Needs work"
  oneLineSummary: string
  strengths: string[]
  gaps: string[]
  nextStep: string
}

const SYSTEM_PROMPT = `You are a senior marketing mentor reviewing an MBA student's submission for an internship deliverable. Be specific, kind, and actionable.

Return your review as VALID JSON only — no markdown fences, no commentary. Schema:
{
  "verdict": "Strong" | "Solid" | "Needs work",
  "oneLineSummary": "1 sentence summary of the submission",
  "strengths": ["2-3 specific things the student did well"],
  "gaps": ["2-3 specific things missing or weak, with a hint on how to fix each"],
  "nextStep": "1 concrete next action the student should take to strengthen this submission"
}

JSON only. No extra text.`

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FeedbackInput
    if (!body.solutionText || body.solutionText.trim().length < 30) {
      return NextResponse.json(
        { error: "Solution text is too short to review" },
        { status: 400 },
      )
    }

    const userPrompt = `Review this internship submission.

Week ${body.weekId ?? "?"}: ${body.weekTitle ?? "n/a"}
Brand scenario: ${body.brand ?? "n/a"}
Brief: ${body.brief ?? "n/a"}
Asks: ${(body.asks ?? []).join("; ") || "n/a"}
Word target: ${body.minWords ?? "?"}–${body.maxWords ?? "?"} words

Student submission:
"""
${body.solutionText}
"""

Produce the JSON review now.`

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      thinking: { type: "disabled" },
    })

    const raw = completion.choices[0]?.message?.content ?? ""
    const cleaned = extractJson(raw)
    let parsed: FeedbackResponse
    try {
      parsed = JSON.parse(cleaned) as FeedbackResponse
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI review as JSON", raw: cleaned.slice(0, 2000) },
        { status: 502 },
      )
    }

    return NextResponse.json(parsed)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

function extractJson(s: string): string {
  let t = s.trim()
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "")
  }
  const start = t.indexOf("{")
  const end = t.lastIndexOf("}")
  if (start >= 0 && end > start) {
    t = t.slice(start, end + 1)
  }
  return t
}
