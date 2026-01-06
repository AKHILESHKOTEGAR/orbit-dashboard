"use client"

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function SecuritySettings() {
  const { openUserProfile } = useClerk();

  return (
    <div className="space-y-6">
      {/*PASSWORD */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="space-y-1">
              <p className="font-medium text-zinc-900 dark:text-zinc-200">Password</p>
              <p className="text-sm text-zinc-500">Manage your password via Clerk.</p>
          </div>
          <Button 
            variant="outline" 
            className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
            onClick={() => openUserProfile()} // <--- FIXED: Removed invalid argument
          >
            Manage Password
          </Button>
      </div>

      {/*TWO FACTOR */}
      <div className="flex items-center justify-between">
          <div className="space-y-1">
              <p className="font-medium text-zinc-900 dark:text-zinc-200">2-Step Verification</p>
              <p className="text-sm text-zinc-500">Add an extra layer of security.</p>
          </div>
          <Button 
            variant="outline" 
            className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
            onClick={() => openUserProfile()} 
           >
            Manage 2FA
          </Button>
      </div>
    </div>
  );
}