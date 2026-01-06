"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createInvoice } from "@/app/actions";

type ClientProp = {
  id: string;
  name: string;
}

export function NewInvoiceBtn({ clients }: { clients: ClientProp[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="w-4 h-4 mr-2" /> New Invoice
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 relative">
            
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors"
                aria-label="Close"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Create Invoice</h2>
                <p className="text-sm text-zinc-400">Bill one of your existing projects.</p>
            </div>

            <form 
                action={async (formData) => {
                    await createInvoice(formData);
                    setIsOpen(false);
                }} 
                className="flex flex-col gap-4"
            >
                <div className="space-y-2">
                    <label htmlFor="client-select" className="text-xs font-semibold text-zinc-400 uppercase">
                        Select Project
                    </label>
                    <select 
                        id="client-select"
                        name="clientId" 
                        required
                        defaultValue=""
                        className="w-full h-10 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                    >
                        <option value="" disabled>-- Select a Client --</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="amount-input" className="text-xs font-semibold text-zinc-400 uppercase">
                        Amount ($)
                    </label>
                    <Input 
                        id="amount-input"
                        name="amount" 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-blue-500" 
                        required 
                    />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold mt-2">
                    Create Invoice
                </Button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}