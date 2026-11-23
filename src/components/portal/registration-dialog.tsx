"use client"

/* eslint-disable react-hooks/set-state-in-effect -- dialog open state synced from view store */

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useView } from "./use-view"
import { RegistrationWizard } from "./registration-wizard"

/**
 * Registration popup dialog that overlays the marketing landing page.
 * Opens when:
 * - User clicks "Register Free" in the navbar (sets view to "register")
 * - Or when the forceOpen prop is true
 *
 * The marketing page stays visible behind the dialog.
 * After registration completes → dialog closes + dashboard opens.
 */
export function RegistrationDialog({ forceOpen }: { forceOpen?: boolean }) {
  const view = useView((s) => s.view)
  const goToMarketing = useView((s) => s.goToMarketing)
  const [open, setOpen] = useState(false)

  // Open when view is "register" or forceOpen is true
  useEffect(() => {
    if (view === "register" || forceOpen) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [view, forceOpen])

  const handleClose = (openState: boolean) => {
    setOpen(openState)
    if (!openState) {
      // When dialog closes, go back to marketing view
      goToMarketing()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 sm:rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Register for your internship</DialogTitle>
          <DialogDescription>
            Fill in your details and start tracking your internship immediately.
          </DialogDescription>
        </DialogHeader>

        {/* Back button */}
        <div className="sticky top-0 z-10 border-b bg-background/95 px-4 py-2 backdrop-blur">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleClose(false)}
            className="w-fit"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Registration Wizard */}
        <div className="p-4">
          <RegistrationWizard />
        </div>
      </DialogContent>
    </Dialog>
  )
}
