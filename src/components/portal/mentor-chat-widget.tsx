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
import { SIM_TOTAL_QUARTERS, computeFinalGrade } from "./simulation-engine"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  ts: number
}

const STORAGE_KEY = "agileportal-mentor-chat"
const SUGGESTED_PROMPTS = [
  "What should I focus on this week?",
  "How do I improve my market share in the simulation?",
  "Explain the brand audit framework",
  "What's my current progress?",
]

export function MentorChatWidget() {
  const mounted = useMounted()
  const { toast } = useToast()
  const { role, name, email, stream } = useAuth()
  const view = useView((s) => s.view)
  const { completedWeeks } = useWeeklyProgress(4)
  const { stats: testStats } = useTestProgressHelpers()
  const { status: simStatus, currentQuarter: simQuarter, history: simHistory } = useSimulation()
  const { requests: approvalRequests } = useApprovalStore()

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

  const buildContext = () => ({
    studentName: name || undefined,
    studentEmail: email || undefined,
    stream: stream || undefined,
    role: role ?? undefined,
    currentView: view,
    activeTab: view === "dashboard" ? "student dashboard" : undefined,
    weeklyCompleted,
    weeklyTotal: SIM_TOTAL_QUARTERS,
    testsPassed: testStats.uniquePassed,
    testsTotal: 6,
    simStatus,
    simQuarter,
    simTotalQuarters: SIM_TOTAL_QUARTERS,
    simGrade,
    pendingApprovals,
  })

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
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg transition-all hover:bg-violet-700 hover:shadow-xl hover:scale-105"
          aria-label="Open AI mentor chat"
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
          <div className="flex items-center justify-between border-b bg-violet-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">AI Mentor</p>
                <p className="text-[10px] opacity-80">
                  {role ? `Context: ${role}` : "Here to help"}
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
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Sparkles className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Hi{name ? `, ${name.split(" ")[0]}` : ""}! 👋</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    I&apos;m your AI mentor. Ask me about your weekly tasks, tests, the
                    simulation, or the approval process.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-1.5">
                  {SUGGESTED_PROMPTS.map((p) => (
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
                        ? "bg-violet-600 text-white"
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
