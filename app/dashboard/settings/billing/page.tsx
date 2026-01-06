import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; 
import { Check, CreditCard, ChevronLeft, Zap, Infinity } from "lucide-react";
import { ProUpgradeFlow } from "@/components/ProUpgradeFlow";
import { downgradeToFree } from "@/app/actions";

export default async function BillingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // 1. FETCH PROFILE & CLIENT COUNTS
  const profile = await db.userProfile.findUnique({ where: { userId: userId } });
  const clientCount = await db.client.count({ where: { userId: userId } });

  if (!profile) redirect("/onboarding");

  // 2. CHECK STATUS
  const isPro = profile.plan === "PRO";
  const MAX_CLIENTS = 5;
  
  // Calculate usage
  const usagePercentage = isPro ? 100 : (clientCount / MAX_CLIENTS) * 100;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <Link 
            href="/dashboard/settings" 
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center transition-colors"
        >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Settings
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Billing & Plans</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Manage your subscription and payment methods.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        
        {/* LEFT COLUMN */}
        <div className="md:col-span-7 space-y-6">
            
            {/* PLAN CARD - DYNAMIC */}
            <Card className={`border ${isPro ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : "border-zinc-200 dark:border-zinc-800"}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                             {isPro ? "Orbit Pro" : "Free Plan"}
                        </CardTitle>
                        <CardDescription>
                            {isPro ? "You are on the unlimited tier." : "You are currently on the free tier."}
                        </CardDescription>
                    </div>
                    <Badge className={isPro ? "bg-blue-600" : "bg-zinc-600"}>
                        {isPro ? "PRO" : "ACTIVE"}
                    </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        {isPro ? "$29" : "$0"} <span className="text-base font-normal text-zinc-500 dark:text-zinc-400">/ month</span>
                    </div>
                    <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                        {isPro ? (
                            // PRO FEATURES LIST
                            <>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600"/> <strong>Unlimited</strong> Clients</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600"/> Priority Support</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600"/> Advanced Analytics</li>
                             </>
                        ) : (
                             // FREE FEATURES LIST
                             <>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-zinc-500"/> Up to {MAX_CLIENTS} Clients</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-zinc-500"/> Unlimited Invoices</li>
                             </>
                        )}
                    </ul>
                    
                    {/* ONLY SHOW UPGRADE BUTTON IF FREE */}
                    {!isPro ? (
                        <div className="mt-6">
                            <ProUpgradeFlow />
                        </div>
                    ) : (
                        <Button variant="outline" className="w-full mt-6 cursor-default border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                            Current Plan Active
                        </Button>
                    )}

                </CardContent>
            </Card>

            {/* USAGE LIMITS CARD */}
            <Card className="dark:bg-zinc-900 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle>Usage Limits</CardTitle>
                    <CardDescription>Your current usage for this billing cycle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">Clients Added</span>
                            <span className="text-zinc-500">
                                {isPro ? <span className="flex items-center gap-1"><Infinity className="w-4 h-4"/> Unlimited</span> : `${clientCount} / ${MAX_CLIENTS}`}
                            </span>
                        </div>
                        
                        {/* If PRO, show full blue bar. If FREE, show actual progress */}
                        <Progress value={usagePercentage} className="h-2" />
                        
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {isPro 
                                ? <span className="text-blue-600 font-medium">You have unlimited access.</span>
                                : (clientCount >= MAX_CLIENTS 
                                    ? <span className="text-red-500 font-medium">Limit reached. Upgrade to add more.</span>
                                    : "Upgrade to Pro for unlimited clients."
                                  )
                            }
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-5 space-y-6">
             
             {/* PAYMENT METHOD CARD */}
             <Card className="dark:bg-zinc-900 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* SHOW CARD IF PRO (Simulated) */}
                    {isPro ? (
                        <div className="flex items-center gap-3 p-3 border border-zinc-200 rounded-lg dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                            <div className="p-2 bg-white rounded-md border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700">
                                {/* Safe Check for Card Brand */}
                                {profile?.cardBrand === "Venmo/UPI" ? (
                                    <Zap className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                                ) : (
                                    <CreditCard className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                                    {/* Safe Check for Card Details */}
                                    {profile?.cardBrand || "Card"} ending in {profile?.cardLast4 || "****"}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    {profile?.cardExpiry && profile?.cardExpiry !== "N/A" ? `Expires ${profile.cardExpiry}` : "Connected via App"}
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20">
                                Edit
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-8 border border-dashed border-zinc-200 rounded-lg dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50">
                            <p className="text-sm text-zinc-500">No payment method connected.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* BILLING HISTORY */}
            <Card className="dark:bg-zinc-900 dark:border-zinc-800 opacity-60">
                <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                    {isPro ? (
                        <div className="flex justify-between items-center text-sm">
                            <span>Pro Plan - Monthly</span>
                            <span>$29.00</span>
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-500">No invoices generated yet.</p>
                    )}
                </CardContent>
            </Card>

        </div>
      </div>

      {/* DEV TOOL: RESET BUTTON */}
      <div className="pt-12 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-xs text-zinc-400 mb-4 uppercase font-bold tracking-wider">Developer Zone</p>
        <form action={downgradeToFree}>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                Reset Plan to Free (For Testing)
            </Button>
        </form>
      </div>
    </div>
  );
}