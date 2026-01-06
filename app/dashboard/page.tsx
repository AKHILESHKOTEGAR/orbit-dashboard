import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createClient } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { RevenueChart } from "@/components/RevenueChart";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wallet, Users, CheckCircle2, Plus, Zap } from "lucide-react"; 
import { DashboardActions } from "@/components/DashboardActions";
import { formatCurrency } from "@/lib/utils";
import { ProChart } from "@/components/ProChart"; // Imported

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await db.userProfile.findUnique({ where: { userId: userId } });
  if (!profile) redirect("/onboarding");
  
  // DEBUGGING: Check terminal to confirm plan status
  console.log("CURRENT USER PLAN:", profile.plan); 

  const currency = profile.currency || "USD"; 
  const isPro = profile.plan === "PRO"; 

  // 1. Fetch Data
  const clientsRaw = await db.client.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
    include: { invoices: true } 
  });

  const paidInvoicesRaw = await db.invoice.findMany({
    where: { client: { userId: userId }, status: "PAID" },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { client: true }
  });

  // 2. Data Formatting
  const clients = clientsRaw.map(client => ({
    ...client,
    invoices: client.invoices.map(inv => ({ ...inv, amount: Number(inv.amount) }))
  }));

  const paidInvoices = paidInvoicesRaw.map(inv => ({
    ...inv,
    amount: Number(inv.amount)
  }));

  // 3. Calculate Stats
  const chartData = clients.map(client => ({
      name: client.name,
      total: client.invoices.reduce((acc, inv) => acc + Number(inv.amount), 0)
  }));
  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.total, 0);
  const activeProjects = clients.length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Overview</h1>
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mt-1">
                Welcome back, {profile.name}
                
                {/* --- PRO BADGE --- */}
                {isPro ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                        <Zap className="w-3 h-3 fill-current" /> PRO
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        FREE
                    </span>
                )}
            </div>
          </div>
          
          <DashboardActions data={clients} />
        </div>

        {/* METRICS ROW */}
        <div className="grid gap-4 md:grid-cols-3">
             <Card className="p-6 shadow-sm border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 mb-2 font-medium text-sm uppercase tracking-wider dark:text-zinc-400">
                    <Wallet className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> Total Revenue
                </div>
                <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        {formatCurrency(totalRevenue, currency)}
                    </div>
                </div>
             </Card>
             <Card className="p-6 shadow-sm border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 mb-2 font-medium text-sm uppercase tracking-wider dark:text-zinc-400">
                    <Users className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> Active Projects
                </div>
                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{activeProjects}</div>
             </Card>
             <Card className="p-6 shadow-sm border-zinc-200 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 mb-2 font-medium text-sm uppercase tracking-wider dark:text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Last Payment
                </div>
                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {paidInvoices[0] ? formatCurrency(Number(paidInvoices[0].amount), currency) : formatCurrency(0, currency)}
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                    {paidInvoices[0] ? `From ${paidInvoices[0].client.name}` : "No recent transactions"}
                </div> 
             </Card>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid gap-8 md:grid-cols-12 items-stretch">
            
            {/* LEFT COLUMN */}
            <div className="md:col-span-8 flex flex-col gap-8 h-full">
                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex-1 dark:bg-zinc-900 dark:border-zinc-800">
                    <h3 className="font-semibold text-lg text-zinc-800 dark:text-zinc-100 mb-6">Revenue Trends</h3>
                    <div className="h-[300px] w-full">
                        <RevenueChart data={chartData} />
                    </div>
                </div>
                <Card className="border-zinc-200 shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-800">
                    <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 dark:bg-zinc-800/50 dark:border-zinc-800">
                        <CardTitle className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Recent Payments</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {paidInvoices.map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between p-4 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors dark:border-zinc-800 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-9 w-9 bg-green-100 border-green-200 border dark:bg-green-900/20 dark:border-green-800">
                                        <AvatarFallback className="text-green-700 font-bold dark:text-green-400">
                                            {inv.amount > 0 ? "+" : "-"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-200">{inv.client.name}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{inv.createdAt.toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="font-bold text-green-700 font-mono dark:text-green-400">
                                    +{formatCurrency(Number(inv.amount), currency)}
                                </div>
                            </div>
                        ))}
                        {paidInvoices.length === 0 && <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">No payments received yet.</div>}
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="md:col-span-4 flex flex-col gap-6 h-full">
                 
                 {/* 1. NEW PROJECT CARD */}
                 <Card className="shadow-xl overflow-hidden shrink-0 border-zinc-200 bg-white dark:bg-black dark:border-zinc-800">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                            <Plus className="h-5 w-5 bg-zinc-100 rounded-full p-1 text-zinc-900 dark:bg-zinc-800 dark:text-white"/> New Project
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <form action={createClient} className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Input name="name" placeholder="Client Name" className="bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white" required />
                                <Input name="email" placeholder="Email" className="bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white" required />
                            </div>
                            <Input name="description" placeholder="Description" className="bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white" />
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">Deadline</label>
                                <Input name="deadline" type="date" className="bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white" />
                            </div>
                            
                            {/* LIMIT WARNING */}
                            {!isPro && clients.length >= 5 && (
                                <p className="text-xs text-red-500 text-center font-medium mt-2">Free plan limit reached (5/5)</p>
                            )}

                            <Button 
                                type="submit" 
                                disabled={!isPro && clients.length >= 5} 
                                className="w-full mt-2 font-bold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
                            >
                                {(!isPro && clients.length >= 5) ? "Upgrade to Add More" : "Create Project"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* 2. PRO ANALYTICS CHART (Only visible to Pro, blurred for Free) */}
                <ProChart isPro={isPro} />

                {/* 3. PROJECTS LIST */}
                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col flex-1 dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0 dark:bg-zinc-800/50 dark:border-zinc-800">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-200">Your Projects</span>
                        <Link href="/dashboard/clients" className="text-xs text-blue-600 hover:underline dark:text-blue-400">View All</Link>
                    </div>
                    <div className="divide-y divide-zinc-100 overflow-auto flex-1 dark:divide-zinc-800">
                        {clients.slice(0, 5).map(client => (
                            <Link key={client.id} href={`/clients/${client.id}`} className="block p-4 hover:bg-blue-50/50 transition group dark:hover:bg-zinc-800/50">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="font-medium text-zinc-900 group-hover:text-blue-700 transition-colors dark:text-zinc-300 dark:group-hover:text-blue-400">{client.name}</div>
                                    <Badge variant={client.status === "LEAD" ? "secondary" : "outline"} className="text-[10px] dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700">
                                        {client.status}
                                    </Badge>
                                </div>
                                <div className="text-xs text-zinc-500 line-clamp-1 dark:text-zinc-500">
                                    {client.description || "No description provided"}
                                </div>
                            </Link>
                        ))}
                         {clients.length === 0 && <div className="p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">No projects yet.</div>}
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
}