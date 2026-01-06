import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { deleteInvoice } from "@/app/actions";

export default async function InvoicesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await db.userProfile.findUnique({ where: { userId } });
  const currency = profile?.currency || "USD";

  const invoices = await db.invoice.findMany({
    where: { 
      client: { userId: userId } 
    },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Invoices</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Track payments and outstanding balances.</p>
        </div>
        <Link href="/dashboard/clients">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2"/> New Invoice
            </Button>
        </Link>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-medium border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-4">CLIENT / INVOICE ID</th>
              <th className="px-6 py-4">AMOUNT</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4">DATE ISSUED</th>
              <th className="px-6 py-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {invoices.map((inv) => (
              <tr key={inv.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                        <FileText className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-semibold text-zinc-900 dark:text-zinc-200">{inv.client.name}</div>
                        <div className="text-xs text-zinc-500 font-mono uppercase">ID: {inv.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-zinc-900 dark:text-zinc-200">
                  {formatCurrency(Number(inv.amount), currency)}
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    variant="outline" 
                    className={`
                      ${inv.status === 'PAID' 
                        ? 'border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400' 
                        : 'border-orange-200 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:border-orange-900 dark:text-orange-400'}
                    `}
                  >
                    {inv.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                    {inv.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                    <form action={deleteInvoice}>
                        <input type="hidden" name="id" value={inv.id} />
                        {/* FIXED: Added aria-label below */}
                        <button 
                            className="text-zinc-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-md dark:hover:bg-red-900/20"
                            aria-label="Delete invoice"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </form>
                </td>
              </tr>
            ))}
            
            {invoices.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                        No invoices found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}