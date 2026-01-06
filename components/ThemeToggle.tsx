"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // 1. Wait until mounted on client to avoid mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 2. Prevent hydration mismatch by rendering a skeleton until mounted
  if (!mounted) {
    return (
      <div className="flex items-center p-1 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-100 dark:bg-zinc-900">
        <div className="h-7 w-7" />
        <div className="h-7 w-7" />
        <div className="h-7 w-7" />
      </div>
    )
  }

  return (
    <div className="flex items-center p-1 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-100 dark:bg-zinc-900">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("light")}
        className={cn(
          "h-7 w-7 p-0 rounded-md transition-all",
          theme === "light" 
            ? "bg-white text-black shadow-sm" 
            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        )}
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Light</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("dark")}
        className={cn(
          "h-7 w-7 p-0 rounded-md transition-all",
          theme === "dark" 
            ? "bg-zinc-800 text-white shadow-sm" 
            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        )}
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Dark</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("system")}
        className={cn(
          "h-7 w-7 p-0 rounded-md transition-all",
          theme === "system" 
            ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white" 
            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        )}
      >
        <Laptop className="h-4 w-4" />
        <span className="sr-only">System</span>
      </Button>
    </div>
  )
}