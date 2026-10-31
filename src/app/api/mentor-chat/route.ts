import { NextRequest, NextResponse } from "next/server"
import ZAI from "z-ai-web-dev-sdk"

export const dynamic = "force-dynamic"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

type ChatRequest = {
  message: string
  history?: ChatMessage[]
  context?: {
    studentName?: string
    studentEmail?: string
    stream?: string
    role?: string
    currentView?: string
    activeTab?: string
    weeklyCompleted?: number
    weeklyTotal?: number
    testsPassed?: number
    testsTotal?: number
    simStatus?: string
    simQuarter?: number
    simTotalQuarters?: number
    simGrade?: string
    pendingApprovals?: number
  }
}

const SYSTEM_PROMPT = `You are the AI Mentor for AgilePortal Enterprise — a friendly, encouraging mentor for MBA / BBA / BSc students doing an industry internship.

Your role:
- Answer questions about weekly tasks, market scenarios, test papers, the D2C Brand Simulator, certificates, and the approval process.
- Give specific, actionable advice based on the student's current stage and progress (provided in the context block).
- Keep responses concise: 2-4 short paragraphs or a short numbered list. No long essays.
- Be encouraging but honest. If the student is struggling, acknowledge it and give a concrete next step.
- If asked about something outside the internship portal scope, gently redirect to the platform's features.
- Never invent specific grades, scores, or statuses that contradict the context provided.

You have access to the student's current context (stage, progress, pending approvals). Use it to give personalized advice.`

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest
    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build context preamble
    const ctx = body.context ?? {}
    const contextLines: string[] = []
    if (ctx.studentName) contextLines.push(`Student name: ${ctx.studentName}`)
    if (ctx.stream) contextLines.push(`Stream: ${ctx.stream}`)
    if (ctx.role) contextLines.push(`Platform role: ${ctx.role}`)
    if (ctx.currentView) contextLines.push(`Current view: ${ctx.currentView}`)
    if (ctx.activeTab) contextLines.push(`Active dashboard tab: ${ctx.activeTab}`)
    if (ctx.weeklyCompleted !== undefined && ctx.weeklyTotal) {
      contextLines.push(`Weekly tasks: ${ctx.weeklyCompleted}/${ctx.weeklyTotal} weeks completed`)
    }
    if (ctx.testsPassed !== undefined && ctx.testsTotal) {
      contextLines.push(`Test papers: ${ctx.testsPassed}/${ctx.testsTotal} passed`)
    }
    if (ctx.simStatus) {
      contextLines.push(
        `Simulation: ${ctx.simStatus}` +
          (ctx.simStatus === "running" && ctx.simQuarter && ctx.simTotalQuarters
            ? ` (Q${ctx.simQuarter} of ${ctx.simTotalQuarters})`
            : ctx.simStatus === "finished" && ctx.simGrade
            ? ` (final grade: ${ctx.simGrade})`
            : ""),
      )
    }
    if (ctx.pendingApprovals !== undefined && ctx.pendingApprovals > 0) {
      contextLines.push(`Pending approvals: ${ctx.pendingApprovals} (awaiting mentor review)`)
    }

    const contextBlock =
      contextLines.length > 0
        ? `\n\n--- STUDENT CONTEXT ---\n${contextLines.join("\n")}\n--- END CONTEXT ---\n\nUse this context to personalize your response. Don't repeat it back verbatim.`
        : ""

    // Build message list: system prompt + context + history + new message
    const messages: { role: "assistant" | "user"; content: string }[] = [
      { role: "assistant", content: SYSTEM_PROMPT + contextBlock },
    ]

    // Include up to the last 8 messages of history for continuity
    const hist = (body.history ?? []).slice(-8)
    for (const m of hist) {
      messages.push({ role: m.role, content: m.content })
    }

    messages.push({ role: "user", content: body.message })

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: "disabled" },
    })

    const reply = completion.choices[0]?.message?.content ?? ""
    if (!reply.trim()) {
      return NextResponse.json({
        reply: "I'm here — could you rephrase your question? I want to make sure I help you with the right thing.",
      })
    }

    return NextResponse.json({ reply })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { error: msg, reply: "I hit a snag just now — please try again in a moment." },
      { status: 500 },
    )
  }
}
