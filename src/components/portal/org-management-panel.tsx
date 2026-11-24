"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CertificatePanel } from "./certificate-panel"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Building2,
  Users,
  UserPlus,
  Mail,
  Trash2,
  Crown,
  Building,
  Layers,
  Send,
  RotateCcw,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useOrgStore, type Org, type Team } from "./org-store"

const KPIS = [
  { key: "orgs", label: "Organizations", icon: Building2, accent: "text-emerald-600" },
  { key: "teams", label: "Teams", icon: Layers, accent: "text-teal-600" },
  { key: "managers", label: "Managers", icon: Crown, accent: "text-amber-600" },
  { key: "pending", label: "Pending Invites", icon: Clock, accent: "text-violet-600" },
] as const

export function OrgManagementPanel() {
  const { toast } = useToast()
  const { orgs, teams, invites, createOrg, createTeam, inviteLearner, removeOrg, removeTeam, resetToDemo } =
    useOrgStore()

  // Create-org form state
  const [orgName, setOrgName] = useState("")
  const [orgIndustry, setOrgIndustry] = useState("")
  const [orgContact, setOrgContact] = useState("")
  const [orgSeats, setOrgSeats] = useState("")

  // Create-team form state (per org — keyed by orgId)
  const [teamOrgId, setTeamOrgId] = useState("")
  const [teamName, setTeamName] = useState("")
  const [teamManagerName, setTeamManagerName] = useState("")
  const [teamManagerEmail, setTeamManagerEmail] = useState("")

  // Invite-learner form state (per team — keyed by teamId)
  const [inviteTeamOrgId, setInviteTeamOrgId] = useState("")
  const [inviteTeamId, setInviteTeamId] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")

  const kpis = useMemo(() => {
    const managers = invites.filter((i) => i.role === "manager" && i.status === "accepted").length
    const pending = invites.filter((i) => i.status === "pending").length
    return {
      orgs: orgs.length,
      teams: teams.length,
      managers,
      pending,
    }
  }, [orgs, teams, invites])

  const handleCreateOrg = () => {
    if (!orgName || !orgIndustry || !orgContact || !orgSeats) {
      toast({
        title: "All fields required",
        description: "Name, industry, contact email, and seats are all required.",
      })
      return
    }
    const seats = parseInt(orgSeats, 10)
    if (isNaN(seats) || seats < 1) {
      toast({ title: "Invalid seats", description: "Seats must be a positive number." })
      return
    }
    const org = createOrg({ name: orgName, industry: orgIndustry, contactEmail: orgContact, seats })
    toast({
      title: "Organization created",
      description: `${org.name} added with ${org.seats} seats. Invite an org admin to start onboarding teams.`,
    })
    setOrgName("")
    setOrgIndustry("")
    setOrgContact("")
    setOrgSeats("")
  }

  const handleCreateTeam = () => {
    if (!teamOrgId || !teamName || !teamManagerName || !teamManagerEmail) {
      toast({
        title: "All fields required",
        description: "Pick an org, then fill team name, manager name, and manager email.",
      })
      return
    }
    const team = createTeam({
      orgId: teamOrgId,
      name: teamName,
      managerName: teamManagerName,
      managerEmail: teamManagerEmail,
    })
    toast({
      title: "Team created",
      description: `"${team.name}" added. ${team.managerName} was auto-invited as manager.`,
    })
    setTeamName("")
    setTeamManagerName("")
    setTeamManagerEmail("")
  }

  const handleInviteLearner = () => {
    if (!inviteTeamId || !inviteEmail) {
      toast({
        title: "Pick team + email",
        description: "Select an org, a team, and enter the learner's email.",
      })
      return
    }
    const team = teams.find((t) => t.id === inviteTeamId)
    if (!team) return
    inviteLearner({ orgId: team.orgId, teamId: team.id, email: inviteEmail })
    toast({
      title: "Learner invited",
      description: `Invite sent to ${inviteEmail} for team "${team.name}".`,
    })
    setInviteEmail("")
  }

  const handleRemoveOrg = (org: Org) => {
    removeOrg(org.id)
    toast({
      title: "Organization removed",
      description: `${org.name} and all its teams + invites were deleted.`,
      variant: "destructive",
    })
  }

  const handleRemoveTeam = (team: Team) => {
    removeTeam(team.id)
    toast({
      title: "Team removed",
      description: `"${team.name}" was deleted.`,
      variant: "destructive",
    })
  }

  return (
    <section
      id="org"
      className="border-b border-violet-200 bg-violet-50/30 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
              Super Admin · Organization & Team Management
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Enterprise orgs &amp; team cohorts
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create organizations, add teams under each org, assign team managers, and
              invite learners into cohorts. All enterprise customers billed per seat.
            </p>
          </div>
          <Badge className="border-violet-300 bg-violet-100 text-violet-800">
            <Crown className="mr-1 h-3 w-3" />
            Super Admin Mode · Enterprise Tier
          </Badge>
        </div>

        {/* KPIs */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {KPIS.map((k) => {
            const Icon = k.icon
            return (
              <Card key={k.key} className="border-violet-200 shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 ${k.accent}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xl font-bold leading-none">{kpis[k.key]}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{k.label}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* LEFT — Create org form */}
          <Card className="border-violet-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building className="h-5 w-5 text-violet-600" />
                Create organization
              </CardTitle>
              <CardDescription>
                Onboard a new enterprise customer. They get billed per seat.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="org-name" className="text-xs">Organization name</Label>
                <Input
                  id="org-name"
                  placeholder="e.g. Tata Consultancy Services"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="org-industry" className="text-xs">Industry</Label>
                <Input
                  id="org-industry"
                  placeholder="e.g. IT Services"
                  value={orgIndustry}
                  onChange={(e) => setOrgIndustry(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="org-contact" className="text-xs">L&D contact email</Label>
                <Input
                  id="org-contact"
                  type="email"
                  placeholder="ld@company.com"
                  value={orgContact}
                  onChange={(e) => setOrgContact(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="org-seats" className="text-xs">Seats purchased</Label>
                <Input
                  id="org-seats"
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  value={orgSeats}
                  onChange={(e) => setOrgSeats(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-violet-600 hover:bg-violet-700"
                onClick={handleCreateOrg}
              >
                <Building2 className="mr-1.5 h-4 w-4" />
                Create org
              </Button>
            </CardContent>
          </Card>

          {/* MIDDLE — Create team form */}
          <Card className="border-violet-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-5 w-5 text-teal-600" />
                Create team
              </CardTitle>
              <CardDescription>
                Add a training cohort under an org + assign a manager.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="team-org" className="text-xs">Organization</Label>
                <Select value={teamOrgId} onValueChange={setTeamOrgId}>
                  <SelectTrigger id="team-org">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgs.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name} · {o.industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="team-name" className="text-xs">Team / cohort name</Label>
                <Input
                  id="team-name"
                  placeholder="e.g. New Hire Onboarding Batch"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="team-mgr-name" className="text-xs">Manager name</Label>
                <Input
                  id="team-mgr-name"
                  placeholder="e.g. Lakshmi Iyer"
                  value={teamManagerName}
                  onChange={(e) => setTeamManagerName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="team-mgr-email" className="text-xs">Manager email</Label>
                <Input
                  id="team-mgr-email"
                  type="email"
                  placeholder="lakshmi@company.com"
                  value={teamManagerEmail}
                  onChange={(e) => setTeamManagerEmail(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700"
                onClick={handleCreateTeam}
              >
                <UserPlus className="mr-1.5 h-4 w-4" />
                Create team + invite manager
              </Button>
            </CardContent>
          </Card>

          {/* RIGHT — Invite learner form */}
          <Card className="border-violet-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-5 w-5 text-amber-600" />
                Invite learner
              </CardTitle>
              <CardDescription>
                Send a seat-invite to a learner to join a specific team cohort.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="inv-org" className="text-xs">Organization</Label>
                <Select
                  value={inviteTeamOrgId}
                  onValueChange={(v) => {
                    setInviteTeamOrgId(v)
                    setInviteTeamId("")
                  }}
                >
                  <SelectTrigger id="inv-org">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgs.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inv-team" className="text-xs">Team / cohort</Label>
                <Select
                  value={inviteTeamId}
                  onValueChange={setInviteTeamId}
                  disabled={!inviteTeamOrgId}
                >
                  <SelectTrigger id="inv-team">
                    <SelectValue placeholder={inviteTeamOrgId ? "Select team" : "Pick org first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {teams
                      .filter((t) => t.orgId === inviteTeamOrgId)
                      .map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inv-email" className="text-xs">Learner email</Label>
                <Input
                  id="inv-email"
                  type="email"
                  placeholder="learner@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={handleInviteLearner}
                disabled={!inviteTeamId}
              >
                <Send className="mr-1.5 h-4 w-4" />
                Send invite
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Org tree */}
        <Card className="mt-6 border-violet-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">All organizations &amp; teams</CardTitle>
                <CardDescription>
                  {orgs.length} orgs · {teams.length} teams · {invites.filter((i) => i.status === "pending").length} pending invites
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetToDemo()
                  toast({
                    title: "Reset to demo data",
                    description: "Orgs, teams, and invites restored to the pre-seeded demo set.",
                  })
                }}
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset to demo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {orgs.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                No organizations yet. Use the &quot;Create organization&quot; form above to onboard your first enterprise.
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {orgs.map((org) => {
                  const orgTeams = teams.filter((t) => t.orgId === org.id)
                  const orgInvites = invites.filter((i) => i.orgId === org.id)
                  return (
                    <AccordionItem key={org.id} value={org.id} className="border-b">
                      <AccordionTrigger className="px-6 hover:no-underline">
                        <div className="flex flex-1 items-center gap-3 pr-3 text-left">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                            <Building2 className="h-5 w-5" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {org.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {org.industry} · {org.seats} seats · {org.contactEmail}
                            </p>
                          </div>
                          <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
                            <span className="flex items-center gap-1">
                              <Layers className="h-3 w-3" />
                              {orgTeams.length} teams
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {orgInvites.filter((i) => i.status === "accepted").length} active
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {orgInvites.filter((i) => i.status === "pending").length} pending
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="space-y-3">
                          {orgTeams.length === 0 ? (
                            <p className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                              No teams yet under this org. Create one using the &quot;Create team&quot; form.
                            </p>
                          ) : (
                            orgTeams.map((team) => {
                              const teamInvites = invites.filter((i) => i.teamId === team.id)
                              const accepted = teamInvites.filter((i) => i.status === "accepted")
                              const pending = teamInvites.filter((i) => i.status === "pending")
                              return (
                                <div
                                  key={team.id}
                                  className="rounded-lg border bg-background/60 p-3"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-semibold text-foreground">
                                        {team.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Manager: {team.managerName} · {team.managerEmail}
                                      </p>
                                    </div>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 text-rose-600 hover:bg-rose-50"
                                      aria-label={`Remove team ${team.name}`}
                                      onClick={() => handleRemoveTeam(team)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>

                                  {teamInvites.length > 0 && (
                                    <ul className="mt-3 space-y-1.5">
                                      {teamInvites.map((inv) => (
                                        <li
                                          key={inv.id}
                                          className="flex items-center justify-between gap-2 rounded-md bg-muted/30 px-2 py-1.5 text-xs"
                                        >
                                          <span className="flex items-center gap-1.5 truncate">
                                            {inv.status === "accepted" ? (
                                              <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" />
                                            ) : (
                                              <Clock className="h-3 w-3 shrink-0 text-amber-600" />
                                            )}
                                            <span className="truncate text-foreground">{inv.email}</span>
                                          </span>
                                          <div className="flex items-center gap-1.5">
                                            <Badge variant="outline" className="text-[10px] capitalize">
                                              {inv.role}
                                            </Badge>
                                            <Badge
                                              variant="outline"
                                              className={`text-[10px] ${
                                                inv.status === "accepted"
                                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                  : "border-amber-200 bg-amber-50 text-amber-700"
                                              }`}
                                            >
                                              {inv.status}
                                            </Badge>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  )}

                                  <div className="mt-2 flex gap-3 text-[11px] text-muted-foreground">
                                    <span>{accepted.length} accepted</span>
                                    <span>·</span>
                                    <span>{pending.length} pending</span>
                                  </div>
                                </div>
                              )
                            })
                          )}
                        </div>

                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            onClick={() => handleRemoveOrg(org)}
                          >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            Remove org
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">
              All org, team, and invite data is stored locally in your browser (localStorage) for this demo.
              In production, this would persist to a multi-tenant Postgres + audit log.
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Certificate panel — super admin can override + print participation letters */}
      <CertificatePanel />
    </section>
  )
}
