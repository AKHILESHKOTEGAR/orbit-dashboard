import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  createInvoice,
  markAsPaid,
  saveClientNote,
  addReminder,
  toggleReminder,
  deleteReminder,
  generateAiTasks,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  StickyNote,
  ListTodo,
  Trash2,
  Plus,
  Lock,
  Sparkles,
} from "lucide-react";
import { EmailGenerator } from "@/components/EmailGenerator";
import { formatCurrency } from "@/lib/utils";
import { AiEmailModal } from "@/components/AiEmailModal";

export default async function ClientPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const { userId } = await auth();
  if (!userId) redirect("/");

  // FETCH PROFILE
  const profile = await db.userProfile.findUnique({
    where: { userId: userId },
  });
  const isPro = profile?.plan === "PRO";
  const currency = profile?.currency || "USD";

  // FETCH CLIENT
  const client = await db.client.findFirst({
    where: {
      id: id,
      userId: userId,
    },
    include: {
      invoices: { orderBy: { createdAt: "desc" } },
      reminders: { orderBy: { id: "asc" } },
    },
  });

  if (!client) redirect("/dashboard/clients");

  const totalDue = client.invoices
    .filter((inv) => inv.status === "PENDING")
    .reduce((acc, inv) => acc + Number(inv.amount), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="space-y-4">
        <Link
          href="/dashboard/clients"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Projects
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
              {client.name}
              <Badge
                variant={client.status === "LEAD" ? "secondary" : "default"}
                className="text-sm px-3 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {client.status}
              </Badge>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-mono text-sm">
              {client.email}
            </p>
          </div>

          <div className="flex gap-2">
            {/* NEW: AI Email Button (Logic handles inside this component) */}
            <AiEmailModal clientName={client.name} isPro={isPro} />

            {/* OLD Generator (You can remove this later if you want) */}
            <div className="hidden">
              <EmailGenerator clientName={client.name} totalDue={totalDue} />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID LAYOUT */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT COLUMN: INVOICES */}
        <div className="md:col-span-2 space-y-8">
          <Card className="bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <FileText className="w-5 h-5 text-blue-500" /> Create New
                Invoice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createInvoice} className="flex gap-4 items-end">
                <input type="hidden" name="clientId" value={client.id} />
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400 ml-1">
                    Amount
                  </label>
                  <Input
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-white border-zinc-200 text-lg font-mono dark:bg-zinc-950 dark:border-zinc-800 dark:text-white"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" /> Send Invoice
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-200 text-lg">
              Invoice History
            </h3>
            <div className="space-y-3">
              {client.invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:border-blue-400 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-blue-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-zinc-800 dark:group-hover:bg-blue-900/20 dark:group-hover:text-blue-400 transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-zinc-400 uppercase">
                        #{inv.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {inv.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <Badge
                      variant={inv.status === "PAID" ? "default" : "secondary"}
                      className={
                        inv.status === "PAID"
                          ? "bg-green-100 text-green-700 hover:bg-green-100 border-0 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 dark:bg-amber-900/30 dark:text-amber-400"
                      }
                    >
                      {inv.status === "PAID" ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {inv.status}
                    </Badge>
                    <div className="text-lg font-bold font-mono w-24 text-right text-zinc-900 dark:text-white">
                      {formatCurrency(Number(inv.amount), currency)}
                    </div>
                    {inv.status === "PENDING" && (
                      <form action={markAsPaid}>
                        <input type="hidden" name="invoiceId" value={inv.id} />
                        <input
                          type="hidden"
                          name="clientId"
                          value={client.id}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="sr-only">Mark Paid</span>
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
              {client.invoices.length === 0 && (
                <div className="p-12 text-center border-2 border-dashed border-zinc-200 rounded-xl dark:border-zinc-800">
                  <p className="text-zinc-500 dark:text-zinc-400">
                    No invoices sent to this client yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRO FEATURES */}
        <div className="space-y-6">
          {/* NOTES */}
          <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10 dark:border-yellow-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-yellow-800 dark:text-yellow-500 flex items-center gap-2">
                <StickyNote className="w-4 h-4" /> Project Notes
                {!isPro && (
                  <Badge
                    variant="outline"
                    className="ml-auto text-[10px] bg-white text-zinc-500 border-zinc-200"
                  >
                    PRO
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={saveClientNote}>
                <input type="hidden" name="clientId" value={client.id} />
                <div className="relative">
                  {!isPro && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-md">
                      <Lock className="w-6 h-6 text-zinc-400" />
                    </div>
                  )}
                  <Textarea
                    name="notes"
                    defaultValue={client.notes || ""}
                    placeholder="Jot down quick requirements, passwords, or ideas..."
                    className="bg-yellow-100/50 border-yellow-200 text-yellow-900 min-h-[150px] resize-none focus-visible:ring-yellow-500 dark:bg-yellow-950/30 dark:border-yellow-900 dark:text-yellow-200 dark:placeholder:text-yellow-800"
                  />
                </div>
                <Button
                  disabled={!isPro}
                  size="sm"
                  variant="secondary"
                  className="w-full mt-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800"
                >
                  Save Notes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* TASKS & AI REMINDERS */}
          <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <ListTodo className="w-4 h-4" /> Tasks & Reminders
                {!isPro && (
                  <Badge
                    variant="outline"
                    className="ml-auto text-[10px] bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
                  >
                    PRO
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* --- AI GENERATOR BUTTON --- */}
              {isPro && client.reminders.length === 0 && (
                <form action={generateAiTasks} className="mb-2">
                  <input type="hidden" name="clientId" value={client.id} />
                  <input
                    type="hidden"
                    name="projectTitle"
                    value={client.name}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-2" /> Auto-Generate Tasks
                    with AI
                  </Button>
                </form>
              )}
              {/* --------------------------- */}

              <form action={addReminder} className="flex gap-2">
                <input type="hidden" name="clientId" value={client.id} />
                <Input
                  name="text"
                  placeholder={
                    isPro ? "Add a new task..." : "Unlock to add tasks"
                  }
                  disabled={!isPro}
                  className="h-8 text-xs bg-white dark:bg-zinc-950 dark:border-zinc-800"
                />
                <Button
                  disabled={!isPro}
                  size="sm"
                  className="h-8 w-8 p-0 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </form>

              <div className="space-y-2">
                {client.reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="flex items-center justify-between group text-sm p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <form action={toggleReminder}>
                        <input type="hidden" name="id" value={rem.id} />
                        <input
                          type="hidden"
                          name="clientId"
                          value={client.id}
                        />
                        <input
                          type="hidden"
                          name="isDone"
                          value={String(rem.isDone)}
                        />
                        <button
                          disabled={!isPro}
                          aria-label={
                            rem.isDone ? "Mark as undone" : "Mark as done"
                          }
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            rem.isDone
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                          }`}
                        >
                          {rem.isDone && <CheckCircle2 className="w-3 h-3" />}
                        </button>
                      </form>
                      <span
                        className={`transition-all ${
                          rem.isDone
                            ? "text-zinc-400 line-through"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {rem.text}
                      </span>
                    </div>
                    <form action={deleteReminder}>
                      <input type="hidden" name="id" value={rem.id} />
                      <input type="hidden" name="clientId" value={client.id} />
                      <button
                        disabled={!isPro}
                        aria-label="Delete reminder"
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </form>
                  </div>
                ))}
                {client.reminders.length === 0 && (
                  <p className="text-xs text-zinc-400 text-center py-4 italic">
                    No active reminders.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}