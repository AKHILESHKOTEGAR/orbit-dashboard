"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export function EmailGenerator({ clientName, totalDue }: { clientName: string, totalDue: number }) {
  const [isOpen, setIsOpen] = useState(false)

  // This is the "Business Logic" - changing tone based on amount
  const generateEmail = () => {
    const today = new Date().toLocaleDateString()
    
    if (totalDue > 10000) {
        return `URGENT: Outstanding Balance for ${clientName}\n\nDear Finance Team,\n\nWe are reviewing our accounts and noticed a significant outstanding balance of $${totalDue.toLocaleString()} as of ${today}.\n\nPlease arrange for immediate payment to avoid service interruption.\n\nRegards,\nOrbit Systems`
    } else {
        return `Invoice Reminder - ${clientName}\n\nHi there,\n\nJust a friendly reminder that we have invoices totaling $${totalDue.toLocaleString()} ready for payment.\n\nLet us know if you need copies of the invoices.\n\nThanks,\nOrbit Systems`
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
           ✉️ Draft Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>AI Draft: Payment Collection</DialogTitle>
          <DialogDescription>
            Generated based on total debt of ${totalDue.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea 
            className="h-[200px] font-mono text-sm" 
            value={generateEmail()} 
            readOnly 
          />
          <Button onClick={() => {
            navigator.clipboard.writeText(generateEmail())
            setIsOpen(false)
            alert("Copied to clipboard!")
          }}>
            Copy to Clipboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
