"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteBtn({ action, id }: { action: any, id: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors h-8 w-8"
        type="submit"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </form>
  );
}