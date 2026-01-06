import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { completeOnboarding } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default async function OnboardingPage() {
  const user = await currentUser(); // Get details from Clerk
  
  if (!user) redirect("/"); // Should not happen

  // Double check: If they already have a profile, send them to dashboard
  const existingProfile = await db.userProfile.findUnique({
    where: { userId: user.id }
  });
  if (existingProfile) redirect("/dashboard");

  // Get their email from Clerk to pre-fill
  const email = user.emailAddresses[0].emailAddress;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        </div>

        <Card className="w-full max-w-md relative z-10 border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="text-2xl text-white">Welcome to Orbit</CardTitle>
                <CardDescription className="text-zinc-400">Let's set up your profile to get started.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={completeOnboarding} className="space-y-6">
                    
                    {/* Read-Only Email */}
                    <div className="space-y-2">
                        <Label className="text-zinc-300">Email Address</Label>
                        <Input 
                            name="email" 
                            value={email} 
                            readOnly 
                            className="bg-zinc-950/50 border-zinc-800 text-zinc-500 cursor-not-allowed focus-visible:ring-0" 
                        />
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label className="text-zinc-300">Full Name</Label>
                        <Input 
                            name="name" 
                            placeholder="e.g. Alex Carter" 
                            defaultValue={`${user.firstName || ''} ${user.lastName || ''}`}
                            required 
                            className="bg-zinc-800 border-zinc-700 text-white" 
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label className="text-zinc-300">Phone Number</Label>
                        <Input 
                            name="phone" 
                            type="tel"
                            placeholder="+1 (555) 000-0000" 
                            className="bg-zinc-800 border-zinc-700 text-white" 
                        />
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-2">
                        <Label className="text-zinc-300">Date of Birth</Label>
                        <Input 
                            name="birthDate" 
                            type="date"
                            required 
                            className="bg-zinc-800 border-zinc-700 text-white block w-full" 
                        />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11">
                        Complete Setup
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
