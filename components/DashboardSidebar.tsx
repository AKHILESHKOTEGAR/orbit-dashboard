"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  CreditCard, 
  Settings, 
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

const menuItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  // I have updated these paths so they are unique. 
  // Note: Clicking them will give a 404 until we create these pages.
  { href: "/dashboard/clients", label: "Projects", icon: Briefcase }, 
  { href: "/dashboard/invoices", label: "Invoices", icon: CreditCard },        
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950 text-white h-screen fixed left-0 top-0 border-r border-zinc-800 hidden md:flex flex-col z-50">
      
      {/*Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
            </div>
            Orbit
        </div>
      </div>

      {/*Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1">
        <p className="px-3 text-xs font-semibold text-zinc-500 uppercase mb-2">Menu</p>
        {menuItems.map((item) => {
          
          // Logic for active state
          const isActive = item.href === "/dashboard" 
            ? pathname === "/dashboard" 
            : pathname.startsWith(item.href);

          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                 
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* 3. User Profile (Bottom) */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/"/>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-white">My Account</span>
                <span className="text-xs text-zinc-500">Pro Plan</span>
            </div>
        </div>
      </div>
    </aside>
  );
}