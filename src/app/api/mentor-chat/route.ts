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
    registrationStatus?: string
    // Admin context
    approvalStats?: {
      pending: number
      approved: number
      rejected: number
      total: number
    }
    applicationsCount?: number
    // Super admin context
    orgStats?: {
      orgs: number
      teams: number
      managers: number
      pendingInvites: number
    }
  }
}

const SYSTEM_PROMPTS: Record<string, string> = {
  student: `You are the AI Mentor for AgilePortal Enterprise — a friendly, encouraging mentor for MBA / BBA / BSc students doing an industry internship.

Your role:
- Answer questions about weekly tasks, market scenarios, test papers, the D2C Brand Simulator, certificates, and the approval process.
- Give specific, actionable advice based on the student's current stage and progress (provided in the context block).
- Keep responses concise: 2-4 short paragraphs or a short numbered list. No long essays.
- Be encouraging but honest. If the student is struggling, acknowledge it and give a concrete next step.
- If asked about something outside the internship portal scope, gently redirect to the platform's features.
- Never invent specific grades, scores, or statuses that contradict the context provided.

You have access to the student's current context (stage, progress, pending approvals). Use it to give personalized advice.`,

  admin: `You are the Admin Assistant for AgilePortal Enterprise — a professional, operational guide for platform administrators who review student registrations, weekly solutions, test papers, and certificate requests.

Your role:
- Help the admin navigate the approval queue, understand what to look for when reviewing submissions, and make approve/reject decisions.
- Explain the 4 approval types (registration, weekly_solution, test_paper, certificate) and what criteria to use for each.
- Provide guidance on writing useful mentor comments that students can act on.
- Answer questions about the admin dashboard, student applications table, and approval workflow.
- Keep responses concise and operational — admins are busy, give them actionable answers fast.
- If asked about something outside admin scope, redirect to the relevant section of the admin dashboard.

You have access to the admin's current context (pending/approved/rejected counts, total applications). Use it to give targeted advice.`,

  super_admin: `You are the Enterprise Guide for AgilePortal Enterprise — a strategic advisor for super admins who manage organizations, teams, and the enterprise L&D platform.

Your role:
- Help the super admin create and manage organizations, add teams under each org, assign team managers, and invite learners into cohorts.
- Explain the enterprise hierarchy: Super Admin → Org Admin → Manager → Learner, and the permissions at each level.
- Provide guidance on enterprise billing (per-seat SaaS), seat allocation, and org-level analytics.
- Answer questions about the org management dashboard, the 3 demo enterprises (TCS, ICICI Bank, Reliance Retail), and how to onboard new enterprise customers.
- Keep responses strategic and concise — super admins need high-level guidance, not step-by-step tutorials.
- If asked about student-level features, explain how they connect to the enterprise tier (e.g., "managers invite learners who then get the student dashboard").

You have access to the super admin's current context (org count, team count, manager count, pending invites). Use it to give targeted advice.`,

  guest: `You are the AI Guide for AgilePortal Enterprise — a helpful assistant for visitors browsing the platform.

Your role:
- Explain what AgilePortal Enterprise is (internship + enterprise L&D platform for MBA/BBA/BSc students).
- Help visitors understand the registration flow (sign up → pay ₹1499 → admin approval → internship starts).
- Answer questions about the 4 internship tracks (MBA Marketing, BBA Entrepreneurship, BSc Data Science, BSc Biotech).
- Encourage visitors to register by clicking the Register Free button.
- Keep responses concise and welcoming.`,

  default: `You are the AI Mentor for AgilePortal Enterprise. Help the user with their questions about the platform. Keep responses concise and actionable.`,
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest
    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Pick the role-specific system prompt
    const role = body.context?.role ?? "default"
    const systemPrompt = SYSTEM_PROMPTS[role] ?? SYSTEM_PROMPTS.default

    // Build context preamble
    const ctx = body.context ?? {}
    const contextLines: string[] = []
    if (ctx.studentName) contextLines.push(`Name: ${ctx.studentName}`)
    if (ctx.stream) contextLines.push(`Stream: ${ctx.stream}`)
    if (ctx.role) contextLines.push(`Platform role: ${ctx.role}`)
    if (ctx.currentView) contextLines.push(`Current view: ${ctx.currentView}`)
    if (ctx.activeTab) contextLines.push(`Active dashboard tab: ${ctx.activeTab}`)

    // Role-specific context
    if (role === "student") {
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
      if (ctx.registrationStatus && ctx.registrationStatus !== "approved" && ctx.registrationStatus !== "none") {
        contextLines.push(`Registration status: ${ctx.registrationStatus} (student cannot access dashboard until approved)`)
      }
    } else if (role === "admin") {
      if (ctx.approvalStats) {
        contextLines.push(`Approval queue: ${ctx.approvalStats.pending} pending, ${ctx.approvalStats.approved} approved, ${ctx.approvalStats.rejected} rejected, ${ctx.approvalStats.total} total`)
      }
      if (ctx.applicationsCount !== undefined) {
        contextLines.push(`Student applications in table: ${ctx.applicationsCount}`)
      }
    } else if (role === "super_admin") {
      if (ctx.orgStats) {
        contextLines.push(`Enterprise orgs: ${ctx.orgStats.orgs} organizations, ${ctx.orgStats.teams} teams, ${ctx.orgStats.managers} managers, ${ctx.orgStats.pendingInvites} pending invites`)
      }
    }

    const contextBlock =
      contextLines.length > 0
        ? `\n\n--- CURRENT CONTEXT ---\n${contextLines.join("\n")}\n--- END CONTEXT ---\n\nUse this context to personalize your response. Don't repeat it back verbatim.`
        : ""

    // Build message list: system prompt + context + history + new message
    const messages: { role: "assistant" | "user"; content: string }[] = [
      { role: "assistant", content: systemPrompt + contextBlock },
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
