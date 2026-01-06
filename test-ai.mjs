import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

console.log("UNICORN TEST STARTING..."); // <--- If you don't see this, the file didn't save!
console.log("Key:", apiKey ? apiKey.substring(0, 5) + "..." : "MISSING");

async function checkModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.error) {
        console.log(" RAW API ERROR:", JSON.stringify(data.error, null, 2));
    } else {
        console.log("SUucess..Available models:");
        console.log(data.models.map(m => m.name).join("\n"));
    }
  } catch (e) {
    console.log(" NETWORK ERROR:", e.message);
  }
}

checkModels();
