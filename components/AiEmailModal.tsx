"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // <--- Imported Input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateAiEmail } from "@/app/actions";
import { Mail, Sparkles, Loader2, Copy, ExternalLink } from "lucide-react";

export function AiEmailModal({ clientName, isPro }: { clientName: string, isPro: boolean }) {
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Changed default to empty so the user can type
  const [context, setContext] = useState(""); 
  const [tone, setTone] = useState("Professional");

  const handleGenerate = async () => {
    if (!isPro) return alert("Upgrade to Pro to use this!");
    if (!context.trim()) return alert("Please type what the email is about!");

    setLoading(true);
    setGeneratedEmail(""); 

    const formData = new FormData();
    formData.append("clientName", clientName);
    formData.append("context", context);
    formData.append("tone", tone);

    try {
        const result = await generateAiEmail(formData);
        
        if (result.error) {
            alert(result.error);
        } else if (result.success) {
            setGeneratedEmail(result.success);
        }
    } catch (e) {
        alert("Something went wrong. Check your console.");
    } finally {
        setLoading(false);
    }
  };

  // --- MAIL OPENING LOGIC ---
  const openGmail = () => {
    const subject = encodeURIComponent(`${context} - ${clientName}`);
    const body = encodeURIComponent(generatedEmail);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank");
  };

  const openYahoo = () => {
    const subject = encodeURIComponent(`${context} - ${clientName}`);
    const body = encodeURIComponent(generatedEmail);
    window.open(`https://compose.mail.yahoo.com/?Subject=${subject}&Body=${body}`, "_blank");
  };

  const openDefaultMail = () => {
    const subject = encodeURIComponent(`${context} - ${clientName}`);
    const body = encodeURIComponent(generatedEmail);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  // --------------------------

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400">
           <Mail className="w-4 h-4" /> AI Email
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 sm:max-w-[500px]">
        <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" /> AI Email Composer
            </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
            {/* INPUTS AREA */}
            <div className="space-y-3">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">What is this email about?</label>
                    <Input 
                        placeholder="e.g. Ask for the vector logo files..." 
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className="bg-zinc-50 dark:bg-zinc-900"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Tone</label>
                    <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Professional">👔 Professional</SelectItem>
                            <SelectItem value="Friendly">😊 Friendly</SelectItem>
                            <SelectItem value="Firm">😡 Firm (Overdue)</SelectItem>
                            <SelectItem value="Excited">🤩 Excited</SelectItem>
                            <SelectItem value="Apologetic">🙏 Apologetic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* GENERATE BUTTON */}
            <Button onClick={handleGenerate} disabled={loading || !isPro} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Draft"}
            </Button>

            {/* RESULT AREA */}
            {generatedEmail && (
                <div className="space-y-3 pt-2">
                    <div className="relative">
                        <Textarea 
                            value={generatedEmail} 
                            onChange={(e) => setGeneratedEmail(e.target.value)}
                            className="h-40 bg-zinc-50 dark:bg-zinc-900 font-mono text-sm p-4 resize-none focus-visible:ring-blue-500"
                        />
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            onClick={() => {
                                navigator.clipboard.writeText(generatedEmail);
                                alert("Copied to clipboard!");
                            }}
                        >
                            <Copy className="w-3 h-3 text-zinc-500" />
                        </Button>
                    </div>

                    {/* SEND BUTTONS */}
                    <div className="grid grid-cols-3 gap-2">
                        <Button onClick={openGmail} variant="outline" className="text-xs border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
                            <Mail className="w-3 h-3 mr-2" /> Gmail
                        </Button>
                        <Button onClick={openYahoo} variant="outline" className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:bg-purple-900/10 dark:text-purple-400">
                            <Mail className="w-3 h-3 mr-2" /> Yahoo
                        </Button>
                        <Button onClick={openDefaultMail} variant="outline" className="text-xs">
                            <ExternalLink className="w-3 h-3 mr-2" /> App
                        </Button>
                    </div>
                </div>
            )}
            
            {!isPro && <p className="text-xs text-center text-red-500">Available on Pro Plan only.</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}