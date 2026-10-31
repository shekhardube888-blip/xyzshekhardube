"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Users,
  Wallet,
  RotateCcw,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import {
  GRADE_BADGE_CLASS,
  type SortKey,
} from "./simulation-leaderboard"
import { useLeaderboard } from "./use-leaderboard"
import { formatINR } from "./simulation-engine"
import { useMounted } from "./use-test-progress"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "grade", label: "Grade" },
  { value: "cash", label: "Final cash" },
  { value: "share", label: "Avg market share" },
  { value: "profit", label: "Total profit" },
]

const MEDAL_ICON: Record<number, typeof Trophy> = {
  1: Crown,
  2: Medal,
  3: Trophy,
}

const MEDAL_COLOR: Record<number, string> = {
  1: "bg-amber-100 text-amber-700",
  2: "bg-slate-200 text-slate-700",
  3: "bg-orange-100 text-orange-700",
}

export function LeaderboardPanel() {
  const mounted = useMounted()
  const { entries, lastUserEntryId, sortKey, setSortKey, resetToDemo } = useLeaderboard()
  const [showAll, setShowAll] = useState(false)

  const sorted = useMemo(
    () => (mounted ? sortEntriesLocal(entries, sortKey) : []),
    [mounted, entries, sortKey],
  )

  // Top 5 by default, expandable to full list
  const visible = showAll ? sorted : sorted.slice(0, 5)

  // Aggregate stats
  const stats = useMemo(() => {
    if (!mounted || entries.length === 0) {
      return { totalPlayers: 0, topGrade: "—", avgCash: 0, yourRank: null as number | null }
    }
    const gradeWeight: Record<string, number> = { A: 4, B: 3, C: 2, D: 1 }
    const bestEntry = sorted[0]
    const avgCash = Math.round(
      entries.reduce((sum, e) => sum + e.finalCash, 0) / entries.length,
    )
    const yourRank = lastUserEntryId
      ? sorted.findIndex((e) => e.id === lastUserEntryId) + 1
      : null
    return {
      totalPlayers: entries.length,
      topGrade: bestEntry?.grade ?? "—",
      avgCash,
      yourRank,
    }
  }, [mounted, entries, sorted, lastUserEntryId])

  if (!mounted) return null

  return (
    <Card className="border-violet-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-5 w-5 text-amber-500" />
              Cohort leaderboard
            </CardTitle>
            <CardDescription>
              Anonymous results across all completed simulations. Your most recent
              game is highlighted.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    Sort: {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Aggregate stats */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCell label="Players" value={String(stats.totalPlayers)} icon={Users} />
          <StatCell label="Top grade" value={stats.topGrade} icon={Crown} />
          <StatCell label="Avg cash" value={formatINR(stats.avgCash)} icon={Wallet} />
          <StatCell
            label="Your rank"
            value={stats.yourRank ? `#${stats.yourRank}` : "—"}
            icon={Trophy}
            highlight={!!stats.yourRank}
          />
        </div>

        {/* Leaderboard table */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Rank</th>
                <th className="px-3 py-2 text-left font-medium">Player</th>
                <th className="px-3 py-2 text-center font-medium">Grade</th>
                <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">Cash</th>
                <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">BE</th>
                <th className="px-3 py-2 text-right font-medium">Share</th>
                <th className="hidden px-3 py-2 text-right font-medium md:table-cell">Profit</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((entry, i) => {
                const rank = i + 1
                const isYou = entry.id === lastUserEntryId
                const Medal = MEDAL_ICON[rank]
                return (
                  <tr
                    key={entry.id}
                    className={`border-t ${
                      isYou
                        ? "bg-emerald-50/60 font-medium"
                        : rank <= 3
                        ? "bg-amber-50/20"
                        : ""
                    }`}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {Medal ? (
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${MEDAL_COLOR[rank]}`}
                          >
                            <Medal className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                            {rank}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">#{rank}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {entry.anonymousName}
                            {isYou && (
                              <Badge className="ml-2 bg-emerald-600 text-[10px] text-white hover:bg-emerald-700">
                                You
                              </Badge>
                            )}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{entry.stream}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${GRADE_BADGE_CLASS[entry.grade]}`}
                      >
                        {entry.grade}
                      </Badge>
                    </td>
                    <td className="hidden px-3 py-2.5 text-right sm:table-cell">
                      <span
                        className={
                          entry.finalCash < 0
                            ? "text-rose-700"
                            : "text-foreground"
                        }
                      >
                        {formatINR(entry.finalCash)}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2.5 text-right sm:table-cell">
                      {entry.brandEquity.toFixed(0)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {entry.avgMarketShare.toFixed(1)}%
                    </td>
                    <td className="hidden px-3 py-2.5 text-right md:table-cell">
                      <span
                        className={`flex items-center justify-end gap-0.5 ${
                          entry.totalProfit >= 0 ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {entry.totalProfit >= 0 ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {formatINR(entry.totalProfit)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {sorted.length > 5 && (
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" onClick={() => setShowAll((s) => !s)}>
              {showAll ? "Show top 5" : `Show all ${sorted.length}`}
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-between border-t bg-muted/30 p-3">
        <p className="text-xs text-muted-foreground">
          Pre-seeded with anonymized cohort results. Your completed games are added automatically.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => resetToDemo()}
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset to demo
        </Button>
      </CardFooter>
    </Card>
  )
}

function StatCell({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string
  value: string
  icon: typeof Trophy
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-lg border p-2.5 text-center ${
        highlight ? "border-emerald-300 bg-emerald-50/40" : "bg-background"
      }`}
    >
      <Icon className={`mx-auto h-4 w-4 ${highlight ? "text-emerald-600" : "text-violet-600"}`} />
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}

// Local sort wrapper so useMemo works cleanly
function sortEntriesLocal(
  entries: ReturnType<typeof useLeaderboard.getState>["entries"],
  key: SortKey,
) {
  const gradeWeight: Record<string, number> = { A: 4, B: 3, C: 2, D: 1 }
  const sorted = [...entries]
  if (key === "grade") {
    sorted.sort(
      (a, b) =>
        gradeWeight[b.grade] - gradeWeight[a.grade] || b.finalCash - a.finalCash,
    )
  } else if (key === "cash") {
    sorted.sort((a, b) => b.finalCash - a.finalCash)
  } else if (key === "share") {
    sorted.sort((a, b) => b.avgMarketShare - a.avgMarketShare)
  } else if (key === "profit") {
    sorted.sort((a, b) => b.totalProfit - a.totalProfit)
  }
  return sorted
}
