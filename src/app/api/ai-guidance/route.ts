import { NextRequest, NextResponse } from "next/server"
import ZAI from "z-ai-web-dev-sdk"

// Force this route to be dynamic (no caching of LLM responses at the route level)
export const dynamic = "force-dynamic"

type WeekInput = {
  weekId?: number
  weekTitle?: string
  weekObjective?: string
  brand?: string
  brief?: string
  asks?: string[]
}

type GuidanceResponse = {
  summary: string
  steps: { title: string; detail: string; aiToolExamples: string[] }[]
  industryExamples: { company: string; useCase: string; impact: string }[]
  erpIntegrations: { erp: string; integration: string; benefit: string }[]
  tryItPrompt: string
  caution: string
}

const SYSTEM_PROMPT = `You are an AI mentor for MBA / BBA / BSc students doing an 8-week industry internship. For the given week's topic and market scenario, produce a STRUCTURED AI guidance response in VALID JSON only — no markdown fences, no commentary outside the JSON.

The goal: help the student understand step-by-step HOW AI and LLMs are used in this domain in real industry, and how AI connects to ERPs (Salesforce, HubSpot, Zoho, SAP, NetSuite, Microsoft Dynamics, etc.).

JSON schema:
{
  "summary": "1-2 sentence overview of how AI applies to this week's task",
  "steps": [
    {
      "title": "Step name (verb-led, e.g. 'Scrape and cluster customer reviews')",
      "detail": "2-3 sentence explanation of what to do, why it matters, and how AI helps",
      "aiToolExamples": ["2-3 real AI tools or product features, e.g. 'ChatGPT for theme clustering', 'Meta Advantage+ for auto-bidding', 'Google Vertex AI for churn scoring'"]
    }
  ],
  "industryExamples": [
    {
      "company": "Real company name",
      "useCase": "1 sentence on what they use AI for in this domain",
      "impact": "1 quantified outcome if known, otherwise a directional impact"
    }
  ],
  "erpIntegrations": [
    {
      "erp": "Real ERP name (Salesforce / HubSpot / Zoho / SAP / NetSuite / Dynamics / Shopify)",
      "integration": "1 sentence on how AI connects to this ERP for this week's task",
      "benefit": "1 sentence on the operational benefit"
    }
  ],
  "tryItPrompt": "A copy-paste-ready LLM prompt (50-100 words) the student can paste into ChatGPT / Claude / Gemini to start applying AI to this week's task",
  "caution": "1 sentence on a real limitation, bias risk, or compliance concern when using AI in this domain"
}

Return exactly 5 steps, 3 industryExamples, 3 erpIntegrations. JSON only.`

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as WeekInput
    if (!body.weekId || !body.weekTitle) {
      return NextResponse.json(
        { error: "weekId and weekTitle are required" },
        { status: 400 },
      )
    }

    const userPrompt = `Generate AI guidance for:
- Week ${body.weekId}: ${body.weekTitle}
- Objective: ${body.weekObjective ?? "n/a"}
- Market scenario brand: ${body.brand ?? "n/a"}
- Brief: ${body.brief ?? "n/a"}
- Asks: ${(body.asks ?? []).join("; ") || "n/a"}

Produce the JSON response now.`

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      thinking: { type: "disabled" },
    })

    const raw = completion.choices[0]?.message?.content ?? ""

    // The model should return pure JSON, but be defensive: strip code fences
    // if present, and extract the first {...} block if there's stray text.
    const cleaned = extractJson(raw)
    let parsed: GuidanceResponse
    try {
      parsed = JSON.parse(cleaned) as GuidanceResponse
    } catch {
      return NextResponse.json(
        {
          error: "Failed to parse AI response as JSON",
          raw: cleaned.slice(0, 2000),
        },
        { status: 502 },
      )
    }

    // Basic shape validation
    if (!parsed.steps || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
      return NextResponse.json(
        { error: "AI response missing required fields", raw: cleaned.slice(0, 2000) },
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
  // Strip ```json ... ``` fences if present
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "")
  }
  // If there's still non-JSON around, grab the first {...} block
  const start = t.indexOf("{")
  const end = t.lastIndexOf("}")
  if (start >= 0 && end > start) {
    t = t.slice(start, end + 1)
  }
  return t
}
