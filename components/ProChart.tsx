"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProChart({ isPro }: { isPro: boolean }) {
  if (!isPro) {
    return (
      <Card className="border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
            <div className="bg-blue-100 p-3 rounded-full mb-3 dark:bg-blue-900/30">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-white">Unlock Revenue Forecasting</h3>
            <p className="text-sm text-zinc-500 mb-4 max-w-xs">See your projected earnings for next month with Orbit Pro.</p>
            <Link href="/dashboard/settings/billing">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Upgrade to Unlock</Button>
            </Link>
        </div>=
        <CardHeader>
            <CardTitle className="text-zinc-400">Projected Revenue</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-[200px] bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" /> Projected Revenue
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm text-zinc-500">Next Month (Estimated)</p>
                        <p className="text-3xl font-bold text-zinc-900 dark:text-white">$12,450.00</p>
                    </div>
                    <span className="text-green-600 font-medium text-sm">+14% vs last month</span>
                </div>
                {/* Simple Bar Visual */}
                <div className="h-4 w-full bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800">
                    <div className="h-full bg-green-500 w-[75%]" />
                </div>
                <p className="text-xs text-zinc-400">Based on your active "Lead" projects.</p>
            </div>
        </CardContent>
    </Card>
  );
}