import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CalendarDays } from "lucide-react";
import { NewProjectBtn } from "@/components/NewProjectBtn";
import { DeleteBtn } from "@/components/DeleteBtn";
import { deleteClient } from "@/app/actions";
import { formatCurrency } from "@/lib/utils"; 

export default async function ProjectsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // 1. FETCH PROFILE TO GET CURRENCY
  const profile = await db.userProfile.findUnique({ where: { userId } });
  const currency = profile?.currency || "USD";

  const clients = await db.client.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
    include: { invoices: true }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Projects</h1>
           <p className="text-zinc-500 dark:text-zinc-400">Manage your active clients and leads.</p>
        </div>
        <NewProjectBtn />
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
        <Input 
            placeholder="Search projects..." 
            className="pl-10 bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-500" 
        />
      </div>

      {/* PROJECTS GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-all border-zinc-200 hover:border-blue-500 group h-full relative overflow-hidden bg-white dark:bg-zinc-900 dark:border-zinc-800">
                
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DeleteBtn action={deleteClient} id={client.id} />
                </div>

                <Link href={`/clients/${client.id}`} className="block h-full">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-lg font-bold text-zinc-800 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                                {client.name}
                            </CardTitle>
                            <Badge variant={client.status === 'LEAD' ? "secondary" : "default"} className="w-fit dark:bg-zinc-800 dark:text-zinc-300">
                                {client.status}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-zinc-500 mb-4 h-10 line-clamp-2 dark:text-zinc-400">
                            {client.description || "No description provided."}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center text-xs text-zinc-400">
                                <CalendarDays className="w-3 h-3 mr-1"/>
                                {client.deadline ? client.deadline.toLocaleDateString() : "No Deadline"}
                            </div>
                            <div className="font-mono text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                {/* FIXED: Uses formatCurrency now */}
                                {formatCurrency(
                                    client.invoices.reduce((acc, inv) => acc + Number(inv.amount), 0), 
                                    currency
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Link>
            </Card>
        ))}

        {clients.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800">
                <p className="text-zinc-500 dark:text-zinc-400">No projects found. Create one to get started.</p>
            </div>
        )}
      </div>
    </div>
  );
}