import { NextRequest, NextResponse } from "next/server"
import ZAI from "z-ai-web-dev-sdk"

export const dynamic = "force-dynamic"

type LectureRequest = {
  weekId?: number
  weekTitle?: string
  weekObjective?: string
  stream?: string
  brand?: string
  brief?: string
}

type LectureSection = {
  heading: string
  content: string // 2-4 sentences
  keyPoints: string[]
}

type Lecture = {
  title: string
  subtitle: string
  durationMinutes: number
  sections: LectureSection[]
  summary: string
  glossary: { term: string; definition: string }[]
}

const SYSTEM_PROMPT = `You are an expert academic lecturer for AgilePortal Enterprise — an internship platform for MBA / BBA / BSc students.

Generate a structured lecture for the given week's topic. The lecture should be educational, practical, and tied to real industry examples.

Return VALID JSON only — no markdown fences, no commentary. Schema:
{
  "title": "Lecture title (concise, topic-focused)",
  "subtitle": "1-line subtitle describing the lecture scope",
  "durationMinutes": 45,
  "sections": [
    {
      "heading": "Section heading (e.g. 'What is Brand Audit?')",
      "content": "2-4 sentences explaining the concept clearly for a student audience",
      "keyPoints": ["3-5 bullet points — actionable takeaways or definitions"]
    }
  ],
  "summary": "1-paragraph summary of what the student learned",
  "glossary": [
    { "term": "Term name", "definition": "1-sentence definition" }
  ]
}

Generate exactly 5 sections. Each section must have 3-5 keyPoints. JSON only.`

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LectureRequest
    if (!body.weekTitle) {
      return NextResponse.json({ error: "weekTitle is required" }, { status: 400 })
    }

    const userPrompt = `Generate a lecture for:
- Week ${body.weekId}: ${body.weekTitle}
- Objective: ${body.weekObjective ?? "n/a"}
- Student stream: ${body.stream ?? "MBA · Marketing"}
- Market scenario brand: ${body.brand ?? "n/a"}
- Brief: ${body.brief ?? "n/a"}

The lecture should cover the week's core concepts, frameworks, and practical applications. Include real-world examples where possible.

Produce the JSON lecture now.`

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
    let parsed: Lecture
    try {
      parsed = JSON.parse(cleaned) as Lecture
    } catch {
      return NextResponse.json(
        { error: "Failed to parse lecture as JSON", raw: cleaned.slice(0, 2000) },
        { status: 502 },
      )
    }

    if (!parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
      return NextResponse.json(
        { error: "Lecture missing required fields" },
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
