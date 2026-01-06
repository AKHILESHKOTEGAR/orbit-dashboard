"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import { RevenueChart } from "@/components/RevenueChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- FAKE DATA FOR CHART ---
const demoChartData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 4500 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 5800 },
];

// --- FAQ DATA ---
const faqList = [
  {
    question: "Is Orbit really free to use?",
    answer: "Yes! Our Starter plan is 100% free forever. It includes up to 3 clients and unlimited invoicing. We believe in helping freelancers get off the ground without overhead costs. You only pay when you need advanced AI features or unlimited clients.",
  },
  {
    question: "How does the AI Email Generator work?",
    answer: "Orbit uses advanced LLMs to analyze your invoice details (amount, due date, client history). It then drafts a context-aware email—polite for friendly reminders, or firm for overdue payments. You can review and edit every email before sending.",
  },
  {
    question: "Is my financial data secure?",
    answer: "Security is our top priority. We use bank-grade encryption for all data storage and transmission. We never sell your financial data to third parties, and we rely on Clerk for secure, industry-standard authentication.",
  },
  {
    question: "Can I accept payments directly?",
    answer: "Currently, Orbit helps you generate and send professional PDF invoices. You can include your own payment links (Stripe, PayPal, Bank Details) directly in the invoice notes.",
  },
  {
    question: "Can I export my data for tax season?",
    answer: "Absolutely. You can export your revenue data and transaction history to verify your income, making tax season much less stressful.",
  },
  {
    question: "Does it work on mobile?",
    answer: "Soon to be launched based on customer experience and feedback."  },
];

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // EFFECT: If user is logged in, force them to Dashboard immediately
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white">
      
      <Navbar /> 

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <div className="h-16" />

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-20 pb-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          <span>Orbit 2.0 is now live</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent max-w-4xl"
        >
          The Operating System for <br />
          <span className="text-blue-500">High-Growth Freelancers</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-xl text-zinc-400 max-w-2xl"
        >
          Stop using spreadsheets. Orbit automates your invoices, tracks your
          revenue, and recovers overdue payments with AI.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard">
            <Button
              size="lg"
              className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
            >
              Start for Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </SignInButton>
          
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <CheckCircle2 className="h-4 w-4 text-green-500" /> No credit card
            required
          </div>
        </motion.div>

        {/* Hero Shot */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative mt-20 w-full max-w-5xl"
        >
          <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-blue-600 to-purple-600 opacity-30 blur-2xl" />
          <div className="relative rounded-[20px] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/20" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                <div className="h-3 w-3 rounded-full bg-green-500/20" />
              </div>
              <div className="ml-4 h-6 w-64 rounded-full bg-zinc-900" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 p-4 rounded-xl border border-zinc-800 bg-black/50">
                <h3 className="text-zinc-400 mb-4 font-medium">
                  Revenue Growth
                </h3>
                <div className="h-[250px] w-full">
                  <RevenueChart data={demoChartData} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                      <Zap size={16} />
                    </div>
                    <div className="text-sm font-medium text-zinc-300">
                      Total Revenue
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">$12,450</div>
                </div>
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                      <Star size={16} />
                    </div>
                    <div className="text-sm font-medium text-zinc-300">
                      Active Clients
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">14</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-y border-zinc-900 bg-black/50 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-zinc-500 mb-6 uppercase tracking-widest">
            Trusted by builders from
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
            <div className="text-xl font-bold text-white flex items-center gap-2">
              ACME <span className="text-blue-500">CORP</span>
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              Stark <span className="text-purple-500">Industries</span>
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              Wayne <span className="text-yellow-500">Tech</span>
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              Cyber<span className="text-green-500">dyne</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 py-24 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
              <Zap className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Revenue Intelligence
            </h3>
            <p className="text-zinc-400">
              Visualize your income streams instantly. Know exactly which
              clients are driving your growth.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Smart Invoicing</h3>
            <p className="text-zinc-400">
              Create professional invoices in seconds. Track status from "Sent"
              to "Paid" without the chaos.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
              <Star className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Automated Recovery</h3>
            <p className="text-zinc-400">
              Let our AI draft polite but firm collection emails to recover
              overdue payments effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Simple, transparent pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 flex flex-col hover:border-zinc-700 transition-colors">
              <h3 className="text-xl font-semibold text-zinc-300">Starter</h3>
              <div className="text-4xl font-bold mt-4 mb-2">$0</div>
              <p className="text-zinc-500 mb-6">
                Forever free for freelancers.
              </p>
              <ul className="space-y-3 text-left mb-8 flex-1">
                <li className="flex gap-2 text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" /> up to 3
                  Clients
                </li>
                <li className="flex gap-2 text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" /> Unlimited
                  Invoices
                </li>
              </ul>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="w-full border-zinc-700 hover:bg-zinc-800 text-black dark:text-white"
                >
                  Start for Free
                </Button>
              </SignInButton>
            </div>
            {/* Pro Plan */}
            <div className="relative p-8 rounded-2xl border border-blue-600 bg-blue-600/5 flex flex-col hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <h3 className="text-xl font-semibold text-blue-400">
                Pro Bundle
              </h3>
              <div className="text-4xl font-bold mt-4 mb-2">$29</div>
              <p className="text-zinc-400 mb-6">per month</p>
              <ul className="space-y-3 text-left mb-8 flex-1">
                <li className="flex gap-2 text-white">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" /> Unlimited
                  Clients
                </li>
                <li className="flex gap-2 text-white">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" /> AI Email
                  Generator
                </li>
                <li className="flex gap-2 text-white">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" /> Priority
                  Support
                </li>
              </ul>
              <SignInButton mode="modal">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION (UPDATED) */}
      <section id="faq" className="py-24 bg-zinc-900/30">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-400">
              Everything you need to know about managing your business with Orbit.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqList.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="border border-zinc-800 rounded-lg px-4 bg-black/40 data-[state=open]:bg-zinc-900/50 transition-all"
              >
                <AccordionTrigger className="text-zinc-200 hover:text-white hover:no-underline py-5 text-left text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-400 leading-relaxed pb-6 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-black pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl text-white">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <LayoutDashboard size={18} />
              </div>
              Orbit
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              The financial operating system designed for the next generation of
              independent consultants.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-sm">
          © 2025 Orbit Systems Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}