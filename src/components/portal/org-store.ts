"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Org = {
  id: string
  name: string
  industry: string
  createdAt: number
  contactEmail: string
  seats: number // total seats purchased
}

export type Team = {
  id: string
  orgId: string
  name: string
  managerName: string
  managerEmail: string
  createdAt: number
}

export type Invite = {
  id: string
  orgId: string
  teamId: string
  email: string
  role: "org_admin" | "manager" | "learner"
  status: "pending" | "accepted"
  createdAt: number
}

type OrgState = {
  orgs: Org[]
  teams: Team[]
  invites: Invite[]
  createOrg: (input: { name: string; industry: string; contactEmail: string; seats: number }) => Org
  createTeam: (input: { orgId: string; name: string; managerName: string; managerEmail: string }) => Team
  inviteLearner: (input: { orgId: string; teamId: string; email: string }) => Invite
  removeOrg: (orgId: string) => void
  removeTeam: (teamId: string) => void
  resetToDemo: () => void
}

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`
}

// 3 demo enterprises pre-seeded so the dashboard isn't empty on first load
const DEMO_ORGS: Org[] = [
  {
    id: "org_tcs",
    name: "Tata Consultancy Services",
    industry: "IT Services",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 28,
    contactEmail: "ld@tcs.com",
    seats: 250,
  },
  {
    id: "org_icici",
    name: "ICICI Bank",
    industry: "Banking & Financial Services",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    contactEmail: "learning@icicibank.in",
    seats: 120,
  },
  {
    id: "org_reliance",
    name: "Reliance Retail",
    industry: "Retail & E-commerce",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    contactEmail: "training@relianceretail.com",
    seats: 80,
  },
]

const DEMO_TEAMS: Team[] = [
  {
    id: "team_tcs_1",
    orgId: "org_tcs",
    name: "Digital Re-skilling Cohort",
    managerName: "Lakshmi Iyer",
    managerEmail: "lakshmi.iyer@tcs.com",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
  {
    id: "team_tcs_2",
    orgId: "org_tcs",
    name: "New Hire Onboarding Batch",
    managerName: "Vikram Rao",
    managerEmail: "vikram.rao@tcs.com",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: "team_icici_1",
    orgId: "org_icici",
    name: "Branch Manager Enablement",
    managerName: "Anita Desai",
    managerEmail: "anita.desai@icicibank.in",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },
  {
    id: "team_reliance_1",
    orgId: "org_reliance",
    name: "Store Manager Leadership",
    managerName: "Rohit Khanna",
    managerEmail: "rohit.khanna@relianceretail.com",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
]

const DEMO_INVITES: Invite[] = [
  {
    id: "inv_1",
    orgId: "org_tcs",
    teamId: "team_tcs_1",
    email: "lakshmi.iyer@tcs.com",
    role: "manager",
    status: "accepted",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 19,
  },
  {
    id: "inv_2",
    orgId: "org_tcs",
    teamId: "team_tcs_2",
    email: "vikram.rao@tcs.com",
    role: "manager",
    status: "accepted",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },
  {
    id: "inv_3",
    orgId: "org_icici",
    teamId: "team_icici_1",
    email: "anita.desai@icicibank.in",
    role: "manager",
    status: "accepted",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: "inv_4",
    orgId: "org_reliance",
    teamId: "team_reliance_1",
    email: "rohit.khanna@relianceretail.com",
    role: "manager",
    status: "accepted",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: "inv_5",
    orgId: "org_tcs",
    teamId: "team_tcs_1",
    email: "kumar.s@tcs.com",
    role: "learner",
    status: "pending",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "inv_6",
    orgId: "org_icici",
    teamId: "team_icici_1",
    email: "priya.n@icicibank.in",
    role: "learner",
    status: "pending",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
]

function initialState() {
  return {
    orgs: DEMO_ORGS,
    teams: DEMO_TEAMS,
    invites: DEMO_INVITES,
  }
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set, _get) => ({
      ...initialState(),

      createOrg: ({ name, industry, contactEmail, seats }) => {
        const org: Org = {
          id: uid("org"),
          name: name.trim(),
          industry: industry.trim(),
          contactEmail: contactEmail.trim(),
          seats,
          createdAt: Date.now(),
        }
        set((s) => ({ orgs: [...s.orgs, org] }))
        return org
      },

      createTeam: ({ orgId, name, managerName, managerEmail }) => {
        const team: Team = {
          id: uid("team"),
          orgId,
          name: name.trim(),
          managerName: managerName.trim(),
          managerEmail: managerEmail.trim(),
          createdAt: Date.now(),
        }
        // Auto-create an accepted manager invite
        const invite: Invite = {
          id: uid("inv"),
          orgId,
          teamId: team.id,
          email: managerEmail.trim(),
          role: "manager",
          status: "accepted",
          createdAt: Date.now(),
        }
        set((s) => ({
          teams: [...s.teams, team],
          invites: [...s.invites, invite],
        }))
        return team
      },

      inviteLearner: ({ orgId, teamId, email }) => {
        const invite: Invite = {
          id: uid("inv"),
          orgId,
          teamId,
          email: email.trim(),
          role: "learner",
          status: "pending",
          createdAt: Date.now(),
        }
        set((s) => ({ invites: [...s.invites, invite] }))
        return invite
      },

      removeOrg: (orgId) => {
        set((s) => ({
          orgs: s.orgs.filter((o) => o.id !== orgId),
          teams: s.teams.filter((t) => t.orgId !== orgId),
          invites: s.invites.filter((i) => i.orgId !== orgId),
        }))
      },

      removeTeam: (teamId) => {
        set((s) => ({
          teams: s.teams.filter((t) => t.id !== teamId),
          invites: s.invites.filter((i) => i.teamId !== teamId),
        }))
      },

      resetToDemo: () => set(initialState()),
    }),
    {
      name: "agileportal-org-store",
      skipHydration: true,
    },
  ),
)
