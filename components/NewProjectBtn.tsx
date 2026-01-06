"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/app/actions";

export function NewProjectBtn() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" /> New Project
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 relative">
            
          <button 
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors"
                aria-label="Close"
                title="Close"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Create New Project</h2>
                <p className="text-sm text-zinc-400">Add a new client to start tracking.</p>
            </div>

            <form 
                action={async (formData) => {
                    await createClient(formData);
                    setIsOpen(false);
                }} 
                className="flex flex-col gap-4"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase">Client Name</label>
                        <Input name="name" placeholder="Acme Corp" className="bg-zinc-800 border-zinc-700 text-white" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase">Email</label>
                        <Input name="email" placeholder="contact@acme.com" className="bg-zinc-800 border-zinc-700 text-white" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase">Description</label>
                    <Input name="description" placeholder="e.g. Website Redesign" className="bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase">Deadline</label>
                    <Input name="deadline" type="date" className="bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold mt-2">
                    Create Project
                </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}