import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle"; 
import { Bell, CreditCard, Globe, Mail, Shield, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { CurrencySelector } from "@/components/CurrencySelector"; 

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await db.userProfile.findUnique({
    where: { userId: userId }
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Manage your account preferences and workspace.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        
        {/* --- LEFT COLUMN: Navigation --- */}
        <div className="md:col-span-3 space-y-2">
            {/* General (Active) */}
            <div className="flex items-center justify-between px-3 py-2 bg-blue-50 text-blue-700 rounded-md font-medium text-sm dark:bg-blue-500/20 dark:text-blue-300">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> General
                </div>
            </div>
            
            {/* Billing Link */}
            <Link href="/dashboard/settings/billing" className="block">
                <div className="flex items-center justify-between px-3 py-2 text-zinc-600 hover:bg-zinc-100 rounded-md font-medium text-sm transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Billing
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-50"/>
                </div>
            </Link>

            {/* Security Link */}
            <Link href="/dashboard/settings/security" className="block">
                <div className="flex items-center justify-between px-3 py-2 text-zinc-600 hover:bg-zinc-100 rounded-md font-medium text-sm transition-colors cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Security
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-50"/>
                </div>
            </Link>
        </div>

        {/* --- RIGHT COLUMN: Forms --- */}
        <div className="md:col-span-9 space-y-6">

            {/* 1. PROFILE SECTION */}
            <Card className="dark:border-zinc-800 dark:bg-zinc-950">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>This is how others will see you on the site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                             <div className="p-1 border-2 border-dashed border-zinc-200 rounded-full dark:border-zinc-700">
                                <UserButton />
                             </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Profile Picture</h3>
                            <p className="text-xs text-zinc-500 max-w-[200px]">
                                Managed by Clerk authentication. Click the image to change.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            {/* FIX: Added || "" to handle null values */}
                            <Input defaultValue={profile?.name || ""} readOnly className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            {/* FIX: Added || "" to handle null values */}
                            <Input defaultValue={profile?.email || ""} readOnly className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. APPEARANCE & PREFERENCES */}
            <Card className="dark:border-zinc-800 dark:bg-zinc-950">
                <CardHeader>
                    <CardTitle>Appearance & Preferences</CardTitle>
                    <CardDescription>Customize your interface experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Interface Theme</Label>
                            <p className="text-sm text-zinc-500">Select your preferred display mode.</p>
                        </div>
                        <ThemeToggle />
                    </div>

                    <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800" />

                    {/* Currency Selector */}
                    <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                            <Label className="text-base flex items-center gap-2">
                                <Globe className="w-4 h-4 text-zinc-500"/> Currency
                            </Label>
                            <p className="text-sm text-zinc-500">Default currency for all dashboards.</p>
                        </div>
                        
                        <CurrencySelector defaultValue={profile?.currency || "USD"} />
                        
                    </div>
                </CardContent>
            </Card>

            {/* 3. NOTIFICATIONS */}
            <Card className="dark:border-zinc-800 dark:bg-zinc-950">
                 <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Choose what we email you about.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-3 border border-zinc-100 rounded-lg dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-md dark:bg-blue-900/20">
                                <Mail className="w-4 h-4"/>
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-sm font-medium">Invoice Paid</h4>
                                <p className="text-xs text-zinc-500">Get an email when you get money.</p>
                            </div>
                        </div>
                        <div className="h-5 w-9 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 h-3 w-3 bg-white rounded-full shadow-sm"/>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-zinc-100 rounded-lg dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-md dark:bg-orange-900/20">
                                <Bell className="w-4 h-4"/>
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-sm font-medium">Monthly Report</h4>
                                <p className="text-xs text-zinc-500">Receive a summary of your stats.</p>
                            </div>
                        </div>
                        <div className="h-5 w-9 bg-zinc-200 dark:bg-zinc-700 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 h-3 w-3 bg-white rounded-full shadow-sm"/>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}