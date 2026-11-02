"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Lock,
  Receipt,
  IndianRupee,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export const REGISTRATION_FEE = 1499

export type PaymentResult = {
  paymentId: string
  amount: number
  method: "card" | "upi" | "netbanking"
  paidAt: number
}

export function PaymentGateway({ onPaid }: { onPaid: (result: PaymentResult) => void }) {
  const { toast } = useToast()
  const [method, setMethod] = useState<"card" | "upi" | "netbanking">("card")
  const [processing, setProcessing] = useState(false)

  // Card fields
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")

  // UPI field
  const [upiId, setUpiId] = useState("")

  // Net banking field
  const [bank, setBank] = useState("")

  const handlePay = () => {
    // Basic validation per method
    if (method === "card") {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        toast({ title: "Please fill all card details", variant: "destructive" })
        return
      }
    } else if (method === "upi") {
      if (!upiId || !upiId.includes("@")) {
        toast({ title: "Enter a valid UPI ID", description: "e.g. yourname@okhdfcbank", variant: "destructive" })
        return
      }
    } else if (method === "netbanking") {
      if (!bank) {
        toast({ title: "Select your bank", variant: "destructive" })
        return
      }
    }

    setProcessing(true)
    // Simulate payment processing (2 seconds)
    setTimeout(() => {
      setProcessing(false)
      const paymentId = `PAY_${Date.now().toString(36).toUpperCase()}`
      const result: PaymentResult = {
        paymentId,
        amount: REGISTRATION_FEE,
        method,
        paidAt: Date.now(),
      }
      toast({
        title: "Payment successful!",
        description: `₹${REGISTRATION_FEE} paid · Receipt ID: ${paymentId}`,
      })
      onPaid(result)
    }, 2000)
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
              Registration Fee Payment
            </CardTitle>
            <CardDescription className="mt-1">
              Pay ₹{REGISTRATION_FEE} to submit your registration for admin approval.
            </CardDescription>
          </div>
          <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
            <Lock className="mr-1 h-3 w-3" />
            Secure
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Fee breakdown */}
        <div className="rounded-lg border bg-muted/40 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Internship Registration Fee</span>
            <span className="font-medium">₹{REGISTRATION_FEE}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">GST</span>
            <span className="font-medium text-emerald-700">₹0 (inclusive)</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t pt-2 text-base font-bold">
            <span>Total payable</span>
            <span className="text-emerald-700">₹{REGISTRATION_FEE}</span>
          </div>
        </div>

        {/* Payment method tabs */}
        <Tabs value={method} onValueChange={(v) => setMethod(v as typeof method)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="card" className="text-xs">
              <CreditCard className="mr-1 h-3.5 w-3.5" />
              Card
            </TabsTrigger>
            <TabsTrigger value="upi" className="text-xs">
              <Smartphone className="mr-1 h-3.5 w-3.5" />
              UPI
            </TabsTrigger>
            <TabsTrigger value="netbanking" className="text-xs">
              <Building2 className="mr-1 h-3.5 w-3.5" />
              Net Banking
            </TabsTrigger>
          </TabsList>

          {/* Card form */}
          <TabsContent value="card" className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="card-number" className="text-xs">Card number</Label>
              <Input
                id="card-number"
                placeholder="4111 1111 1111 1111"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="card-name" className="text-xs">Name on card</Label>
              <Input
                id="card-name"
                placeholder="As printed on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="expiry" className="text-xs">Expiry (MM/YY)</Label>
                <Input
                  id="expiry"
                  placeholder="12/27"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  maxLength={5}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cvv" className="text-xs">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={3}
                />
              </div>
            </div>
            <div className="rounded-md border border-blue-200 bg-blue-50 p-2 text-[11px] text-blue-800">
              <ShieldCheck className="mr-1 inline h-3 w-3" />
              Test mode — use any card number. No real charge.
            </div>
          </TabsContent>

          {/* UPI form */}
          <TabsContent value="upi" className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="upi-id" className="text-xs">UPI ID</Label>
              <Input
                id="upi-id"
                placeholder="yourname@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-800">
              <Smartphone className="mr-1 inline h-3 w-3" />
              You&apos;ll receive a payment request on your UPI app. Approve it to complete.
            </div>
          </TabsContent>

          {/* Net banking form */}
          <TabsContent value="netbanking" className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="bank" className="text-xs">Select bank</Label>
              <select
                id="bank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="">— Choose your bank —</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="SBI">State Bank of India</option>
                <option value="Axis">Axis Bank</option>
                <option value="Kotak">Kotak Mahindra Bank</option>
                <option value="Yes">Yes Bank</option>
              </select>
            </div>
            <div className="rounded-md border border-violet-200 bg-violet-50 p-2 text-[11px] text-violet-800">
              <Building2 className="mr-1 inline h-3 w-3" />
              You&apos;ll be redirected to your bank&apos;s login page (simulated in this demo).
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t bg-muted/30 p-4">
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          onClick={handlePay}
          disabled={processing}
        >
          {processing ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              Processing payment…
            </>
          ) : (
            <>
              <Lock className="mr-1.5 h-4 w-4" />
              Pay ₹{REGISTRATION_FEE}
            </>
          )}
        </Button>
        <p className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
          <ShieldCheck className="h-3 w-3" />
          256-bit encrypted · This is a demo — no real payment is processed.
        </p>
      </CardFooter>
    </Card>
  )
}
