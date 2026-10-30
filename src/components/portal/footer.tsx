"use client"

import { CONTACT, FOOTER_LINKS } from "./portal-data"

export function Footer() {
  const MailIcon = CONTACT.icons.mail
  const PhoneIcon = CONTACT.icons.phone
  const WhatsAppIcon = CONTACT.icons.whatsapp
  const LinkedinIcon = CONTACT.icons.linkedin

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <span aria-hidden className="text-sm font-bold">
                  A
                </span>
              </span>
              <span className="text-base font-bold">
                Agile<span className="text-emerald-400">Portal</span>{" "}
                <span className="ml-0.5 rounded bg-amber-500/20 px-1.5 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                  Enterprise
                </span>
              </span>
            </div>
            <p className="mt-3 text-sm text-background/70">{CONTACT.tagline}</p>
            <div className="mt-4 space-y-1.5 text-sm">
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-2 text-background/70 hover:text-background"
              >
                <MailIcon className="h-4 w-4" />
                {CONTACT.email}
              </a>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-background/70 hover:text-background"
              >
                <PhoneIcon className="h-4 w-4" />
                {CONTACT.phone}
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, "")}`}
                className="flex items-center gap-2 text-background/70 hover:text-background"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp {CONTACT.whatsapp}
              </a>
            </div>
          </div>

          <FooterCol title="Internships" links={FOOTER_LINKS.internships} />
          <FooterCol title="Resources" links={FOOTER_LINKS.resources} />
          <FooterCol title="Company" links={FOOTER_LINKS.company} />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-background/20 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-background/60">
            © 2026 AgilePortal.in · All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-background/60">
            <a href="#" className="hover:text-background">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-background">
              Terms
            </a>
            <a href="#" className="hover:text-background">
              Refund Policy
            </a>
            <a
              href="#"
              className="flex items-center gap-1 hover:text-background"
            >
              <LinkedinIcon className="h-3.5 w-3.5" />
              {CONTACT.linkedin}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-background/80">
        {title}
      </h3>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-sm text-background/70 transition-colors hover:text-background hover:underline"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
