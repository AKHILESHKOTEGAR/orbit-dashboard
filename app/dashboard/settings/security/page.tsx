import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Lock, ShieldAlert } from "lucide-react";
import { SecuritySettings } from "@/components/SecuritySettings";
import { DeleteAccountBtn } from "@/components/DeleteAccountBtn"; 

export default async function SecurityPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <Link 
            href="/dashboard/settings" 
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center transition-colors"
        >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Settings
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Security</h1>
      </div>
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-500"/> Authentication
            </CardTitle>
        </CardHeader>
        <CardContent>
            <SecuritySettings /> 
        </CardContent>
      </Card>
      <Card className="border-red-100 dark:border-red-900/30 dark:bg-red-900/5">
         <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
                <ShieldAlert className="w-5 h-5"/> Danger Zone
            </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
                <p className="font-medium text-zinc-900 dark:text-zinc-200">Delete Account</p>
                <p className="text-sm text-zinc-500">Permanently delete your account and all data.</p>
            </div>
            <DeleteAccountBtn />
        </CardContent>
      </Card>

    </div>
  );
}