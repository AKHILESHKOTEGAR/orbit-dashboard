import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // FIX: Added 'bg-zinc-50 dark:bg-zinc-950' to the wrapper
    // This ensures the WHOLE page background turns black in dark mode
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      
      {/* Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}