"use client";

import { useTransition } from "react";
import { updateCurrency } from "@/app/actions";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CurrencySelector({ defaultValue }: { defaultValue: string }) {
  const [isPending, startTransition] = useTransition();

  const handleValueChange = (value: string) => {
    const formData = new FormData();
    formData.append("currency", value);

    startTransition(async () => {
      await updateCurrency(formData);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select 
        defaultValue={defaultValue || "USD"} 
        onValueChange={handleValueChange} 
        disabled={isPending}
      >
        <SelectTrigger className="w-[140px] bg-white dark:bg-zinc-900">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">USD ($)</SelectItem>
          <SelectItem value="EUR">EUR (€)</SelectItem>
          <SelectItem value="GBP">GBP (£)</SelectItem>
          <SelectItem value="INR">INR (₹)</SelectItem>
        </SelectContent>
      </Select>
      {isPending && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
    </div>
  );
}
