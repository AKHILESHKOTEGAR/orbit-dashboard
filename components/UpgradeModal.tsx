"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, CreditCard, QrCode, ShieldCheck, Zap, Loader2, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { upgradeToPro } from "@/app/actions";

export function UpgradeModal() {
  const [step, setStep] = useState<"PLANS" | "PAYMENT">("PLANS")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"IDLE" | "PROCESSING" | "SUCCESS">("IDLE")

  // Form State for Validation
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")

  // Check if form is valid
  const isFormValid = cardName.length > 0 && cardNumber.length > 10 && cardExpiry.length > 0 && cardCvc.length >= 3;

  // AUTO-PAYMENT SIMULATION (For QR Code)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (step === "PAYMENT" && paymentMethod === "qr") {
        setPaymentStatus("PROCESSING");
        // Simulate waiting for bank confirmation (3 seconds)
        timeout = setTimeout(() => {
            setPaymentStatus("SUCCESS");
            setTimeout(() => {
                setOpen(false);
                alert("Payment Received! Plan Upgraded.");
                setStep("PLANS"); // Reset
                setPaymentStatus("IDLE");
            }, 1000);
        }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [step, paymentMethod]);

  const handleCardPayment = async () => {
    if (!isFormValid) return; // Stop if invalid

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    setOpen(false)
    alert("Payment Successful! Welcome to Orbit Pro.")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-0">
            <Zap className="w-4 h-4 mr-2 fill-current" /> Upgrade to Pro
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogTitle className="sr-only">Upgrade to Pro Plan</DialogTitle>
        
        {/* STEP 1: PLANS */}
        {step === "PLANS" && (
            <div className="flex flex-col h-full">
                <div className="p-6 text-center bg-zinc-900/50 border-b border-zinc-800">
                    <DialogHeader>
                        <h2 className="text-2xl font-bold text-center text-white">Choose your Power</h2>
                        <p className="text-zinc-400 mt-2">Unlock the full potential of your freelance business.</p>
                    </DialogHeader>
                </div>
                
                <div className="p-6 grid gap-6 md:grid-cols-2">
                    {/* Free Plan */}
                    <div className="space-y-4 opacity-50 grayscale">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Starter</h3>
                            <span className="font-mono text-xl">$0</span>
                        </div>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li className="flex gap-2"><Check className="w-4 h-4"/> 5 Clients Limit</li>
                            <li className="flex gap-2"><Check className="w-4 h-4"/> Basic Invoicing</li>
                        </ul>
                        <Button variant="outline" disabled className="w-full border-zinc-700 text-zinc-500">Current Plan</Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="space-y-4 relative bg-zinc-900/80 p-4 rounded-xl border border-blue-500/30 ring-1 ring-blue-500/20">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Badge className="bg-blue-600 text-white hover:bg-blue-600">Recommended</Badge>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <h3 className="font-semibold text-lg text-blue-100">Orbit Pro</h3>
                            <div className="text-right">
                                <span className="font-mono text-2xl font-bold text-white">$29</span>
                                <span className="text-xs text-zinc-400">/mo</span>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-zinc-300">
                            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400"/> Unlimited Clients</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400"/> Priority Support</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400"/> Advanced Analytics</li>
                        </ul>
                        <Button onClick={() => setStep("PAYMENT")} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                            Select Pro Plan
                        </Button>
                    </div>
                </div>
            </div>
        )}

        {/* STEP 2: PAYMENT */}
        {step === "PAYMENT" && (
            <div className="flex flex-col h-full">
                 {/* HEADER with FIXED PADDING for Close Button */}
                 <div className="p-4 pr-12 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
                    <button onClick={() => setStep("PLANS")} className="text-xs text-zinc-500 hover:text-white transition-colors">
                        ← Back to Plans
                    </button>
                    <div className="text-right">
                        <div className="text-xs text-zinc-500">Total Due</div>
                        <div className="font-bold font-mono text-lg text-white">$29.00</div>
                    </div>
                </div>

                <div className="p-6">
                    <Tabs defaultValue="card" className="w-full" onValueChange={(val) => setPaymentMethod(val)}>
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-900">
                            <TabsTrigger value="card" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                                <CreditCard className="w-4 h-4 mr-2"/> Card
                            </TabsTrigger>
                            <TabsTrigger value="qr" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                                <QrCode className="w-4 h-4 mr-2"/> QR Pay
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="card" className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-zinc-500">Cardholder Name</Label>
                                <Input 
                                    placeholder="John Doe" 
                                    className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-600"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-zinc-500">Card Number</Label>
                                <div className="relative">
                                    <Input 
                                        placeholder="0000 0000 0000 0000" 
                                        className="bg-zinc-900 border-zinc-800 pl-10 focus-visible:ring-blue-600 font-mono"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                    />
                                    <CreditCard className="w-4 h-4 absolute left-3 top-3 text-zinc-500"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-zinc-500">Expiry</Label>
                                    <Input 
                                        placeholder="MM/YY" 
                                        className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-600 font-mono text-center"
                                        value={cardExpiry}
                                        onChange={(e) => setCardExpiry(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-zinc-500">CVC</Label>
                                    <Input 
                                        placeholder="123" 
                                        type="password" 
                                        maxLength={3} 
                                        className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-600 font-mono text-center"
                                        value={cardCvc}
                                        onChange={(e) => setCardCvc(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <Button 
                                onClick={handleCardPayment} 
                                disabled={loading || !isFormValid} // DISABLE IF INVALID
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <ShieldCheck className="w-4 h-4 mr-2"/>}
                                {loading ? "Processing..." : "Pay Securely $29.00"}
                            </Button>
                            
                            {!isFormValid && (
                                <p className="text-[10px] text-center text-red-400 mt-2">
                                    * Please fill in all card details to proceed.
                                </p>
                            )}
                        </TabsContent>

                        <TabsContent value="qr" className="space-y-6 text-center py-4">
                            {paymentStatus === "SUCCESS" ? (
                                <div className="flex flex-col items-center justify-center h-48 animate-in fade-in zoom-in">
                                    <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                                        <Check className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Payment Received!</h3>
                                    <p className="text-zinc-400">Upgrading your account...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="relative bg-white p-4 rounded-xl w-48 h-48 mx-auto flex items-center justify-center shadow-xl">
                                        {/* Overlay for Scanning Animation */}
                                        <div className="absolute inset-0 border-4 border-blue-500/50 rounded-xl animate-pulse"></div>
                                        <div className="absolute h-0.5 w-full bg-red-500 top-0 animate-[scan_2s_ease-in-out_infinite]" />
                                        
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=orbit@bank&pn=OrbitPro&am=29.00" alt="QR" className="w-full h-full mix-blend-multiply"/>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-zinc-100 flex items-center justify-center gap-2 text-lg">
                                            <Loader2 className="w-4 h-4 animate-spin text-blue-500"/> 
                                            Listening for payment...
                                        </h3>
                                        <p className="text-sm text-zinc-400 max-w-[240px] mx-auto leading-relaxed">
                                            Scan this code with your banking app. We will detect it automatically.
                                        </p>
                                    </div>
                                </>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  )
}