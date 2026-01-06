import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ No API Key found in .env");
  process.exit(1);
}

console.log("🔑 Checking models for key starting with:", apiKey.substring(0, 10) + "...");

async function checkAvailableModels() {
  // We use the direct API URL to see what Google actually returns for your key
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        console.error("❌ API Returned Error:", data.error.message);
        return;
    }

    if (!data.models) {
        console.error("❌ No models found. The API is enabled, but the list is empty.");
        console.log("Full response:", data);
        return;
    }

    console.log("\n✅ SUCCESS! Found these models:");
    // Filter for just the 'generateContent' models we care about
    const usefulModels = data.models
        .filter(m => m.supportedGenerationMethods.includes("generateContent"))
        .map(m => m.name.replace("models/", "")); // Clean up the name

    console.log(usefulModels.join("\n"));

  } catch (err) {
    console.error("❌ Network Error:", err);
  }
}

checkAvailableModels();