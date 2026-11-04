"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sparkles,
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-store"
import { useView } from "./use-view"
import { useWeeklyProgress } from "./use-weekly-progress"
import { useTestProgressHelpers, useMounted } from "./use-test-progress"
import { useSimulation } from "./simulation-store"
import { useApprovalStore } from "./approval-store"
import { useOrgStore } from "./org-store"
import { SIM_TOTAL_QUARTERS, computeFinalGrade } from "./simulation-engine"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  ts: number
}

const STORAGE_KEY = "agileportal-mentor-chat"

// Role-specific configuration: label, icon color, welcome message, suggested prompts
const ROLE_CONFIG: Record<
  string,
  {
    label: string
    headerColor: string
    buttonColor: string
    welcome: string
    prompts: string[]
  }
> = {
  student: {
    label: "AI Mentor",
    headerColor: "bg-violet-600",
    buttonColor: "bg-violet-600 hover:bg-violet-700",
    welcome: "I'm your AI mentor. Ask me about your weekly tasks, tests, the simulation, or the approval process.",
    prompts: [
      "What should I focus on this week?",
      "How do I improve my market share in the simulation?",
      "Explain the brand audit framework",
      "What's my current progress?",
    ],
  },
  admin: {
    label: "Admin Assistant",
    headerColor: "bg-amber-600",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
    welcome: "I'm your admin assistant. Ask me about the approval queue, reviewing submissions, or student applications.",
    prompts: [
      "How many pending approvals do I have?",
      "What should I look for when reviewing a weekly solution?",
      "How do I reject a registration with feedback?",
      "What are the 4 approval types?",
    ],
  },
  super_admin: {
    label: "Enterprise Guide",
    headerColor: "bg-violet-700",
    buttonColor: "bg-violet-700 hover:bg-violet-800",
    welcome: "I'm your enterprise guide. Ask me about creating orgs, managing teams, or inviting learners.",
    prompts: [
      "How do I create a new organization?",
      "What's the enterprise role hierarchy?",
      "How do I invite learners to a team?",
      "Show me enterprise org stats",
    ],
  },
  guest: {
    label: "AI Guide",
    headerColor: "bg-emerald-600",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    welcome: "I'm the AI guide for AgilePortal Enterprise. Ask me about the platform or how to register.",
    prompts: [
      "What is AgilePortal Enterprise?",
      "How do I register for an internship?",
      "What tracks are available?",
      "How much does registration cost?",
    ],
  },
  default: {
    label: "AI Mentor",
    headerColor: "bg-violet-600",
    buttonColor: "bg-violet-600 hover:bg-violet-700",
    welcome: "I'm here to help. Ask me anything about AgilePortal Enterprise.",
    prompts: ["What can I do here?"],
  },
}

export function MentorChatWidget() {
  const mounted = useMounted()
  const { toast } = useToast()
  const { role, name, email, stream, registrationStatus } = useAuth()
  const view = useView((s) => s.view)
  const { completedWeeks } = useWeeklyProgress(4)
  const { stats: testStats } = useTestProgressHelpers()
  const { status: simStatus, currentQuarter: simQuarter, history: simHistory } = useSimulation()
  const { requests: approvalRequests } = useApprovalStore()
  const { orgs, teams, invites } = useOrgStore()

  const config = ROLE_CONFIG[role ?? "default"] ?? ROLE_CONFIG.default

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[]
        setMessages(parsed)
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Persist chat history
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)))
    } catch {
      /* ignore quota */
    }
  }, [messages, mounted])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  // Compute context for the LLM
  const simGrade =
    simStatus === "finished" && simHistory.length > 0
      ? computeFinalGrade({
          status: simStatus,
          currentQuarter: simQuarter,
          cash: simHistory[simHistory.length - 1].cashAfter,
          brandEquity: simHistory[simHistory.length - 1].brandEquityAfter,
          customerSatisfaction: simHistory[simHistory.length - 1].customerSatisfactionAfter,
          history: simHistory,
        }).grade
      : undefined

  const pendingApprovals = approvalRequests.filter(
    (r) => r.studentEmail.toLowerCase() === (email ?? "").toLowerCase() && r.status === "pending",
  ).length

  const buildContext = () => {
    const base: Record<string, unknown> = {
      studentName: name || undefined,
      studentEmail: email || undefined,
      stream: stream || undefined,
      role: role ?? undefined,
      currentView: view,
      activeTab: view === "dashboard" ? "dashboard" : undefined,
    }

    if (role === "student" || role === "google") {
      base.weeklyCompleted = weeklyCompleted
      base.weeklyTotal = SIM_TOTAL_QUARTERS
      base.testsPassed = testStats.uniquePassed
      base.testsTotal = 6
      base.simStatus = simStatus
      base.simQuarter = simQuarter
      base.simTotalQuarters = SIM_TOTAL_QUARTERS
      base.simGrade = simGrade
      base.pendingApprovals = pendingApprovals
      base.registrationStatus = registrationStatus
    } else if (role === "admin") {
      const pending = approvalRequests.filter((r) => r.status === "pending").length
      const approved = approvalRequests.filter((r) => r.status === "approved").length
      const rejected = approvalRequests.filter((r) => r.status === "rejected").length
      base.approvalStats = {
        pending,
        approved,
        rejected,
        total: approvalRequests.length,
      }
      base.applicationsCount = 6 // demo applications in the admin table
    } else if (role === "super_admin") {
      const managers = invites.filter((i) => i.role === "manager" && i.status === "accepted").length
      const pendingInvites = invites.filter((i) => i.status === "pending").length
      base.orgStats = {
        orgs: orgs.length,
        teams: teams.length,
        managers,
        pendingInvites,
      }
    }

    return base
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: text.trim(),
      ts: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/mentor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
          context: buildContext(),
        }),
      })
      const data = await res.json()
      const reply: ChatMessage = {
        id: `msg_${Date.now()}_a`,
        role: "assistant",
        content: data.reply || data.error || "Sorry, I couldn't process that.",
        ts: Date.now(),
      }
      setMessages((prev) => [...prev, reply])
    } catch {
      const errMsg: ChatMessage = {
        id: `msg_${Date.now()}_e`,
        role: "assistant",
        content: "I hit a network snag — please try again.",
        ts: Date.now(),
      }
      setMessages((prev) => [...prev, errMsg])
      toast({
        title: "Mentor chat error",
        description: "Could not reach the AI mentor. Please retry.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    setMessages([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  if (!mounted) return null

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 ${config.buttonColor}`}
          aria-label={`Open ${config.label} chat`}
        >
          <Sparkles className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
            AI
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[calc(100vw-3rem)] max-w-[400px] flex-col overflow-hidden rounded-xl border border-violet-200 bg-background shadow-2xl">
          {/* Header */}
          <div className={`flex items-center justify-between border-b px-4 py-3 text-white ${config.headerColor}`}>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{config.label}</p>
                <p className="text-[10px] opacity-80">
                  {role ? `Context: ${role.replace("_", " ")}` : "Here to help"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="rounded-md px-2 py-1 text-[11px] opacity-80 transition-colors hover:bg-white/20 hover:opacity-100"
                title="Clear chat"
              >
                Clear
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 opacity-80 transition-colors hover:bg-white/20 hover:opacity-100"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-muted/20 p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${config.headerColor} text-white`}>
                  <Sparkles className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Hi{name ? `, ${name.split(" ")[0]}` : ""}! 👋</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {config.welcome}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-1.5">
                  {config.prompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="rounded-md border border-violet-200 bg-background px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-violet-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                      <Bot className="h-4 w-4" />
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      m.role === "user"
                        ? `${config.headerColor} text-white`
                        : "bg-background border text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  </div>
                  {m.role === "user" && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <User className="h-4 w-4" />
                    </span>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t bg-background p-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ask your mentor…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="text-sm"
              />
              <Button
                size="icon"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="bg-violet-600 hover:bg-violet-700"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground">
              Press Enter to send · AI mentor knows your current stage + progress
            </p>
          </div>
        </div>
      )}
    </>
  )
}
