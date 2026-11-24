"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Trophy,
  Plus,
  ArrowRight,
  Layers,
  TrendingUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-store"
import { useEnrollmentStore, type Enrollment } from "./enrollment-store"
import { CATEGORIES } from "./portal-data"
import { SIM_TOTAL_QUARTERS } from "./simulation-engine"

export function MyInternshipsPanel() {
  const { toast } = useToast()
  const { email, name } = useAuth()
  const { enrollments, createEnrollment, setActiveEnrollment, markCompleted } = useEnrollmentStore()

  const myEnrollments = email ? useEnrollmentStore.getState().getEnrollmentsForStudent(email) : []
  const [showEnrollForm, setShowEnrollForm] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [newSubcategory, setNewSubcategory] = useState("")

  const handleEnroll = () => {
    if (!newCategory || !newSubcategory || !email) {
      toast({ title: "Select category + subcategory", variant: "destructive" })
      return
    }
    const cat = CATEGORIES.find((c) => c.title === newCategory)
    if (!cat) return
    const subcat = cat.subcategories.find((s) => s.name === newSubcategory)
    if (!subcat) return

    const enr = createEnrollment({
      studentEmail: email,
      category: newCategory,
      subcategory: newSubcategory,
      track: cat.title.includes("MBA") ? "MBA" : cat.title.includes("BBA") ? "BBA" : "BSc",
    })
    toast({
      title: "Enrolled!",
      description: `${newCategory} → ${newSubcategory} is now your active internship.`,
    })
    setShowEnrollForm(false)
    setNewCategory("")
    setNewSubcategory("")
  }

  const handleActivate = (enr: Enrollment) => {
    setActiveEnrollment(enr.id)
    toast({
      title: "Switched active internship",
      description: `${enr.category} → ${enr.subcategory} is now active.`,
    })
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-5 w-5 text-emerald-600" />
              My Internships
            </CardTitle>
            <CardDescription>
              {myEnrollments.length === 0
                ? "No internships enrolled yet. Complete your registration to start."
                : `${myEnrollments.length} internship${myEnrollments.length > 1 ? "s" : ""} · ${myEnrollments.filter((e) => e.status === "completed").length} completed`}
            </CardDescription>
          </div>
          {myEnrollments.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => setShowEnrollForm((s) => !s)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Enroll in new category
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Enroll form */}
        {showEnrollForm && (
          <div className="rounded-lg border border-violet-200 bg-violet-50/30 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
              Select a new category + subcategory
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select value={newCategory} onValueChange={(v) => { setNewCategory(v); setNewSubcategory("") }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c) => !c.badge).map((c) => (
                      <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Subcategory</Label>
                <Select value={newSubcategory} onValueChange={setNewSubcategory} disabled={!newCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={newCategory ? "Select subcategory" : "Pick category first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {newCategory && CATEGORIES.find((c) => c.title === newCategory)?.subcategories.map((s) => (
                      <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowEnrollForm(false)}>Cancel</Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleEnroll}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                Enroll
              </Button>
            </div>
          </div>
        )}

        {/* Enrollment cards */}
        {myEnrollments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Your enrolled internships will appear here. Complete your registration to get started.
            </p>
          </div>
        ) : (
          myEnrollments.map((enr) => {
            const weeksCompleted = Object.values(enr.weeklyProgress).filter(
              (w) => w.testPassed && w.solutionSubmitted,
            ).length
            const testsPassed = Object.values(enr.testScores).filter((s) => s >= 70).length
            const weekProgress = Math.round((weeksCompleted / SIM_TOTAL_QUARTERS) * 100)
            const isActive = enr.id === useEnrollmentStore.getState().activeEnrollmentId

            return (
              <div
                key={enr.id}
                className={`rounded-xl border p-4 ${
                  isActive ? "border-emerald-300 bg-emerald-50/30 ring-1 ring-emerald-200" : "border-border bg-background"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{enr.category}</p>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">{enr.subcategory}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Enrolled {new Date(enr.enrolledAt).toLocaleDateString()}
                      {enr.completedAt && ` · Completed ${new Date(enr.completedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {enr.status === "completed" ? (
                      <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    ) : isActive ? (
                      <Badge className="bg-violet-600 text-white hover:bg-violet-700">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                </div>

                {/* Progress bars */}
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Weekly tasks</span>
                      <span className="font-medium text-foreground">{weeksCompleted}/{SIM_TOTAL_QUARTERS}</span>
                    </div>
                    <Progress value={weekProgress} className="mt-1 h-1.5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Tests passed</span>
                      <span className="font-medium text-foreground">{testsPassed}/6</span>
                    </div>
                    <Progress value={(testsPassed / 6) * 100} className="mt-1 h-1.5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Simulation</span>
                      <span className="font-medium text-foreground">{enr.simulationGrade ?? "—"}</span>
                    </div>
                    <Progress value={enr.simulationGrade ? 100 : 0} className="mt-1 h-1.5" />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{enr.track}</span>
                    {enr.simulationGrade && (
                      <span className="flex items-center gap-1"><Trophy className="h-3 w-3" />Grade {enr.simulationGrade}</span>
                    )}
                  </div>
                  {!isActive && enr.status === "active" && (
                    <Button size="sm" variant="outline" onClick={() => handleActivate(enr)}>
                      Set as active
                    </Button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </CardContent>

      {myEnrollments.length > 0 && (
        <CardFooter className="border-t bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">
            Complete all 8 weekly tasks + pass tests + finish the simulation to mark an internship as
            completed. Then enroll in a new category.
          </p>
        </CardFooter>
      )}
    </Card>
  )
}

import { Label } from "@/components/ui/label"
