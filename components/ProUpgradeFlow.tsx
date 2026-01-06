"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Zap, CreditCard, QrCode, Lock, User } from "lucide-react";
import { upgradeToPro } from "@/app/actions";

const MOCK_QR_URL = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://venmo.com/u/orbit-demo";

export function ProUpgradeFlow() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // FORM STATE
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!name || !cardNumber || !expiry || !cvc) {
        setError("Please fill in all fields to proceed.");
        return;
    }
    setError("");

    // EXTRACT CARD INFO
    // Get last 4 digits (remove spaces first)
    const cleanNumber = cardNumber.replace(/\s/g, "");
    const last4 = cleanNumber.slice(-4) || "0000";
    
    // Determine Brand (Simple Logic)
    const brand = cleanNumber.startsWith("4") ? "Visa" : cleanNumber.startsWith("5") ? "Mastercard" : "Card";

    startTransition(async () => {
      // Simulate Processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // PASS DATA TO SERVER ACTION
      await upgradeToPro({
          last4: last4,
          brand: brand,
          expiry: expiry
      });

      setOpen(false); 
      router.refresh(); 
    });
  };

  const handleQrPayment = () => {
    startTransition(async () => {
        // For QR, we just save a placeholder
        await upgradeToPro({
            last4: "QR",
            brand: "Venmo/UPI",
            expiry: "N/A"
        });
        setOpen(false);
        router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-0 transition-all hover:scale-[1.02]">
          <Zap className="w-4 h-4 mr-2 fill-current text-yellow-300" /> 
          Upgrade to Pro
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="card" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Card
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" /> QR Code
            </TabsTrigger>
          </TabsList>

          {/* CARD FORM */}
          <TabsContent value="card" className="space-y-4">
            <div className="space-y-2">
                <Label>Cardholder Name</Label>
                <div className="relative">
                    <Input placeholder="John Doe" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} />
                    <User className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Card Number</Label>
                <div className="relative">
                    <Input placeholder="0000 0000 0000 0000" className="pl-10 font-mono" maxLength={19} value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                    <CreditCard className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input placeholder="MM/YY" className="font-mono" maxLength={5} value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>CVC</Label>
                    <div className="relative">
                        <Input placeholder="123" className="pl-10 font-mono" maxLength={4} value={cvc} onChange={(e) => setCvc(e.target.value)} />
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                    </div>
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded border border-red-100 text-center">
                    {error}
                </div>
            )}

            <Button onClick={handlePayment} disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : "Pay $29.00 Securely"}
            </Button>
            <p className="text-xs text-center text-zinc-400 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Encrypted by Stripe (Simulated)
            </p>
          </TabsContent>

          {/* QR CODE */}
          <TabsContent value="qr">
             <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-sm relative">
                 <img src={MOCK_QR_URL} alt="Scan to Pay" className="w-40 h-40 mix-blend-multiply" />
              </div>
              <p className="text-xs text-center text-zinc-500">Scan with Venmo, CashApp, or your Banking App.</p>
              <Button onClick={handleQrPayment} disabled={isPending} className="w-full bg-green-600 hover:bg-green-700 text-white">
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</> : "I have sent the payment"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}