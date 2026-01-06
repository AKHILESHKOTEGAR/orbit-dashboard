"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"; 
import { redirect } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { clerkClient } from "@clerk/nextjs/server";



// --- CLIENTS ---

export async function createClient(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const profile = await db.userProfile.findUnique({ where: { userId: userId } });
  const currentCount = await db.client.count({ where: { userId: userId } });
  const isPro = profile?.plan === "PRO";
  
  if (!isPro && currentCount >= 5) {
      return; 
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const description = formData.get("description") as string; 
  const dateStr = formData.get("deadline") as string;        
  const deadline = dateStr ? new Date(dateStr) : undefined;

  await db.client.create({
    data: {
      name,
      email,
      userId,
      status: "LEAD",
      description: description, 
      deadline: deadline        
    }
  });

  revalidatePath("/dashboard");
}

export async function deleteClient(formData: FormData) {
  const { userId } = await auth();
  const clientId = formData.get("id") as string;

  if (!userId) return;

  await db.client.deleteMany({ where: { id: clientId, userId: userId } });
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
}

// --- NEW PRO FEATURES (NOTES & REMINDERS) ---

export async function saveClientNote(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return;

  const clientId = formData.get("clientId") as string;
  const notes = formData.get("notes") as string;

  const client = await db.client.findFirst({ where: { id: clientId, userId } });
  if (!client) return;

  await db.client.update({
    where: { id: clientId },
    data: { notes: notes }
  });

  revalidatePath(`/clients/${clientId}`);
}

export async function addReminder(formData: FormData) {
  const clientId = formData.get("clientId") as string;
  const text = formData.get("text") as string;

  if (!text) return; // Don't add empty reminders

  await db.reminder.create({
    data: { clientId, text }
  });
  revalidatePath(`/clients/${clientId}`);
}

export async function toggleReminder(formData: FormData) {
    const id = formData.get("id") as string;
    const clientId = formData.get("clientId") as string;
    const currentStatus = formData.get("isDone") === "true";

    await db.reminder.update({
        where: { id },
        data: { isDone: !currentStatus }
    });
    revalidatePath(`/clients/${clientId}`);
}

export async function deleteReminder(formData: FormData) {
    const id = formData.get("id") as string;
    const clientId = formData.get("clientId") as string;

    await db.reminder.delete({ where: { id } });
    revalidatePath(`/clients/${clientId}`);
}

// --- INVOICES ---

export async function createInvoice(formData: FormData) {
  const amount = formData.get("amount") as string;
  const clientId = formData.get("clientId") as string;

  await db.invoice.create({
    data: {
      amount: Number(amount),
      status: "PENDING",
      clientId: clientId,
    }
  });

  revalidatePath("/dashboard/invoices"); 
  revalidatePath(`/clients/${clientId}`);
}

export async function markAsPaid(formData: FormData) {
    const invoiceId = formData.get("invoiceId") as string;
    const clientId = formData.get("clientId") as string;

    await db.invoice.update({
        where: { id: invoiceId },
        data: { status: "PAID" }
    });

    revalidatePath(`/clients/${clientId}`);
}

export async function deleteInvoice(formData: FormData) {
  const { userId } = await auth();
  const invoiceId = formData.get("id") as string;
  
  if (!userId) return;

  const invoice = await db.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true }
  });

  if (invoice && invoice.client.userId === userId) {
      await db.invoice.delete({ where: { id: invoiceId } });
  }

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/clients/${invoice?.clientId}`);
}

// --- USER & SETTINGS ---

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return;

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string; 
  const birthDate = new Date(formData.get("birthDate") as string);

  await db.userProfile.create({
    data: {
      userId: userId,
      name: name,
      email: email,
      phone: phone,
      birthDate: birthDate,
      currency: "USD",
      plan: "FREE"
    }
  });

  redirect("/dashboard");
}

export async function deleteAccount() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.invoice.deleteMany({ where: { client: { userId: userId } } });
  await db.client.deleteMany({ where: { userId: userId } });
  await db.userProfile.delete({ where: { userId: userId } });

  const client = await clerkClient()
  await client.users.deleteUser(userId);

  redirect("/");
}

export async function updateCurrency(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return;

  const currency = formData.get("currency") as string;

  await db.userProfile.update({
    where: { userId },
    data: { currency: currency },
  });

  // NUCLEAR OPTION: Revalidate everything to ensure Client pages update too
  revalidatePath("/", "layout"); 
}

export async function toggleUserPlan(userId: string, currentPlan: string) {
    const newPlan = currentPlan === "FREE" ? "PRO" : "FREE";
    await db.userProfile.update({ where: { userId: userId }, data: { plan: newPlan } });
    revalidatePath("/dashboard/admin");
}

export async function upgradeToPro(paymentDetails?: { last4: string; brand: string; expiry: string }) {
  const { userId } = await auth();
  if (!userId) return;

  await db.userProfile.update({
    where: { userId },
    data: { 
      plan: "PRO",
      // If payment details are provided, save them. Otherwise, keep existing or null.
      ...(paymentDetails && {
        cardLast4: paymentDetails.last4,
        cardBrand: paymentDetails.brand,
        cardExpiry: paymentDetails.expiry
      })
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings/billing");
  return { success: true };
}


export async function generateAiTasks(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return;

  const clientId = formData.get("clientId") as string;
  const projectTitle = formData.get("projectTitle") as string;

  // 1. Check Pro Status
  const profile = await db.userProfile.findUnique({ where: { userId } });
  if (profile?.plan !== "PRO") return;

  // 2. Call Google Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `I am a freelancer working on a project called "${projectTitle}". 
  Generate exactly 5 short, actionable to-do list tasks for this project. 
  Return ONLY the tasks separated by commas, no numbers, no bullet points.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 3. Process the AI response (Split by comma)
    const tasks = text.split(",").map(task => task.trim()).filter(t => t.length > 0);

    // 4. Save to Database
    for (const task of tasks) {
        await db.reminder.create({
            data: {
                clientId: clientId,
                text: task,
                isDone: false
            }
        });
    }

    revalidatePath(`/clients/${clientId}`);

  } catch (error) {
    console.error("AI Error:", error);
  }
}

export async function generateAiEmail(formData: FormData) {
  console.log("🤖 1. AI Action Triggered");
  
  const { userId } = await auth();
  if (!userId) return { error: "User not found" };

  const clientName = formData.get("clientName") as string;
  const context = formData.get("context") as string;
  const tone = formData.get("tone") as string;

  const profile = await db.userProfile.findUnique({ where: { userId } });
  if (profile?.plan !== "PRO") return { error: "Upgrade to Pro to use this!" };

  const apiKey = process.env.GEMINI_API_KEY;
  
  // DEBUGGING: Print the first 5 chars of the key to prove it loaded
  console.log("🔑 Loaded Key:", apiKey ? apiKey.substring(0, 5) + "..." : "MISSING");

  if (!apiKey) return { error: "Server Error: API Key missing" };

  // --- FIX: USE THE OLDER, STABLE MODEL ---
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  // ----------------------------------------

  const prompt = `Write a short, professional email to a client named "${clientName}".
  Context: ${context}.
  Tone: ${tone}.
  My Name: ${profile.name}.
  Return ONLY the email body text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ AI Success");
    return { success: text };
  } catch (error: any) {
    console.error("❌ AI Error Full Details:", error);
    // Print the available models if possible to debug
    return { error: `AI Failed: ${error.message}` };
  }
}

export async function downgradeToFree() {
  const { userId } = await auth();
  if (!userId) return;

  // Reset plan to FREE
  await db.userProfile.update({
    where: { userId },
    data: { plan: "FREE" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings/billing");
}