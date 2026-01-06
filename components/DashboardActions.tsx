"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarDays, Download } from "lucide-react"
import { format } from "date-fns"

interface DashboardActionsProps {
  data: any[]; 
}

export function DashboardActions({ data }: DashboardActionsProps) {
  // Extract Dates for Highlighting
  const deadlines = data
    .filter(c => c.deadline)
    .map(c => new Date(c.deadline));
    
  const paidDates = data
    .flatMap(c => c.invoices)
    .filter((i: any) => i.status === "PAID")
    .map((i: any) => new Date(i.createdAt));

  const handleExport = () => {
    const headers = ["Client Name", "Status", "Total Revenue", "Deadline", "Created At"];
    const rows = data.map(client => {
      const total = client.invoices.reduce((acc: number, inv: any) => acc + Number(inv.amount), 0);
      return [
        `"${client.name}"`, 
        client.status, 
        `"${total.toFixed(2)}"`, 
        client.deadline ? new Date(client.deadline).toLocaleDateString() : 'No Deadline',
        new Date(client.createdAt).toLocaleDateString()
      ];
    });

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `orbit_report_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-wrap gap-2">
      
      {/* VISUAL CALENDAR */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800 justify-start text-left font-normal"
          >
            <CalendarDays className="mr-2 h-4 w-4 text-zinc-500" />
            <span>View Schedule</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950" align="end">
          <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex gap-4 text-xs">
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" /> Deadline
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" /> Paid Invoice
            </div>
          </div>
          <Calendar
            mode="default"
            // Default to today, but allow navigation
            defaultMonth={new Date()}
            // Pass modifiers for colors
            modifiers={{
                deadline: deadlines,
                paid: paidDates
            }}
            modifiersClassNames={{
                deadline: "bg-red-500 text-white hover:bg-red-600 rounded-md",
                paid: "bg-green-500 text-white hover:bg-green-600 rounded-md"
            }}
            className="bg-white dark:bg-zinc-950 dark:text-zinc-100 rounded-md border-0"
          />
        </PopoverContent>
      </Popover>

      {/* EXPORT BUTTON */}
      <Button 
        onClick={handleExport}
        className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        <Download className="w-4 h-4 mr-2"/> Export Report
      </Button>
    </div>
  )
}