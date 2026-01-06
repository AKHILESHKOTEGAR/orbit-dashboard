import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  SignInButton, 
  SignedIn, 
  SignedOut, 
  UserButton 
} from '@clerk/nextjs'
import { LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    // CHANGED: Fixed position, Dark background with blur, Dark border
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="flex h-16 items-center px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* LEFT: Logo */}
        <div className="flex items-center gap-8 flex-1">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white transition-opacity hover:opacity-80">
            {/* Logo Icon */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <LayoutDashboard size={18} strokeWidth={3} />
            </div>
            <span>Orbit</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#about" className="hover:text-white transition-colors">About</Link>
          </div>
        </div>

        {/* RIGHT: Auth Buttons */}
        <div className="flex items-center gap-4">
            <SignedOut>
                <div className="hidden md:block">
                     <SignInButton mode="modal">
                        <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/10">Log in</Button>
                    </SignInButton>
                </div>
                <SignInButton mode="modal">
                    <Button className="bg-white text-black hover:bg-zinc-200">Sign Up</Button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <UserButton 
                    appearance={{
                        elements: {
                            avatarBox: "h-9 w-9 border-2 border-zinc-800"
                        }
                    }}
                />
            </SignedIn>
        </div>

      </div>
    </nav>
  );
}