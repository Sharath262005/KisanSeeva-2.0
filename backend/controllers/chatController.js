const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "llama-3.1-8b-instant";

const LANGUAGE_NAMES = {
  te: "Telugu (తెలుగు)",
  hi: "Hindi (हिंदी)",
  ta: "Tamil (தமிழ்)",
  kn: "Kannada (ಕನ್ನಡ)",
  mr: "Marathi (మరాఠీ)",
  bn: "Bengali (বাংলা)",
  en: "English",
};

const getSystemPrompt = (userContext, servicesContext, language) => {
  const langName = LANGUAGE_NAMES[language] || "English";
  const langInstruction = language && language !== "en"
    ? `\n---
CRITICAL LOCAL LANGUAGE MANDATE:
The user has selected the language: ${langName}.
You MUST write your entire response in ${langName} using native script (for example: Telugu script for Telugu, Devanagari for Hindi, Tamil script for Tamil).
Do NOT write your response in English. Format all greetings, explanations, questions, and agricultural advice in ${langName}.
Ensure the special [BOOKING_READY: ...] tag at the end remains valid JSON.`
    : "";

  return `You are Seed 🌱, a friendly, knowledgeable, and caring AI assistant for the KisanSeeva platform — representing the root and foundation for Indian farmers.

STRICT DOMAIN & PLATFORM BOUNDARY RULE (CRITICAL):
You are an AI assistant exclusively for KisanSeeva, Agriculture, and Equipment Repairs/Services.
1. ALLOWED TOPICS:
   - KisanSeeva Platform: Registration, login, farmer & provider portals, booking machinery (tractors, harvesters, sprayers, rotavators, threshers, etc.), booking status, community pricing surveys, verification documents (Aadhaar, selfie, license), admin approvals, tracking.
   - Agriculture & Farming: Crop guidance (paddy, wheat, cotton, sugarcane, etc.), soil health, fertilizers, irrigation, farming seasons, pest control, harvesting tips.
   - Equipment Repairs & Service Process: How machinery repair and servicing work on KisanSeeva, tractor maintenance tips, equipment troubleshooting, how services happen.
2. STRICTLY FORBIDDEN TOPICS (NON-AGRICULTURE / NON-PLATFORM):
   - Movies, sports, politics, general coding/programming, non-farming finance, general history, general math/science homework, personal entertainment, etc.
3. REFUSAL PROTOCOL FOR UNRELATED TOPICS:
   - If the user asks about ANYTHING outside KisanSeeva, agriculture, farming, or machinery repairs:
   - YOU MUST POLITELY REFUSE. Do NOT answer the question.
   - Respond in ${langName} with a warm, polite gesture like this:
     "I am Seed 🌱, an AI assistant dedicated exclusively to the KisanSeeva platform, agricultural machinery, equipment repairs, and farming support. For questions unrelated to agriculture or KisanSeeva, please consult general AI assistants like ChatGPT, Gemini, or Claude. How can I help you with KisanSeeva or your farming needs today?"

About KisanSeeva:
- KisanSeeva connects local Farmers with Service Providers who offer agricultural machinery on rent (tractors, harvesters, seeders, sprayers, threshers, rotavators, ploughs, etc.) and machinery repair services.
- Farmers can browse available services, book machinery by the hour, request repair assistance, and track providers in real-time.
- Service Providers can list their equipment, offer maintenance/repairs, manage bookings, and track earnings.
- The platform runs Community Pricing Surveys where farmers and providers suggest fair prices per hour for each service type, and admin finalizes the recommended rate.
- New users (farmers/providers) must register, upload verification documents (Aadhaar, selfie, driving license) and await admin approval before using the platform.

USER SESSION CONTEXT:
${userContext}

AVAILABLE MACHINERY SERVICES CURRENTLY LISTED:
${servicesContext}
${langInstruction}

BOOKING SERVICE ASSISTANCE RULES (CRITICAL):
- If the user says they want to book/rent machinery:
  1. Check if the user is a logged-in Farmer (refer to USER SESSION CONTEXT). If not logged in or role is not 'farmer', politely explain that they must be logged in as a Farmer to book a service, and guide them to register or login.
  2. If they are a logged-in Farmer, check if you have the 4 required booking details:
     - Service ID / Service Name (must match one of the AVAILABLE MACHINERY SERVICES list)
     - Booking Date (ask the user for the date if not specified. Accept natural language like "tomorrow", "next Monday" or dates like "July 15th")
     - Hours Required (duration of the booking, must be a number)
     - Farm Location/Address (full text address of their farm)
  3. If any of these 4 details are missing, ask for them politely one by one in ${langName}. Do not ask for all at once to keep it simple.
  4. Once you have gathered all 4 details:
     - Output a response summarizing the booking details in ${langName}.
     - At the very end of your response, append the following exact JSON block tag (ensure it is valid JSON):
       [BOOKING_READY: {"serviceId": SERVICE_ID_NUMBER, "date": "YYYY-MM-DD", "location": "FARM_LOCATION", "hours": HOURS_NUMBER}]
     - Ask the user to confirm by saying "confirm" or clicking the confirm button.

Keep responses concise, clear, under 180 words. Respond in a warm, helpful tone in ${langName}.`;
};

const handleChat = async (req, res) => {
  const { messages, language } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: "Messages array is required." });
  }

  try {
    // 1. Build User Context
    let userContext = `Today's date is: ${new Date().toISOString().split("T")[0]}.\nThe user is a Guest (not logged in). They cannot place bookings.`;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
        const userRes = await db.query("SELECT name, role FROM users WHERE id = $1", [decoded.id]);
        if (userRes.rows.length > 0) {
          const dbUser = userRes.rows[0];
          userContext = `Today's date is: ${new Date().toISOString().split("T")[0]}.
The user is logged in:
- Name: ${dbUser.name}
- Role: ${dbUser.role} (Only 'farmer' role can book services)
- User ID: ${decoded.id}`;
        }
      } catch (err) {
        // Ignore invalid token, treat as guest
      }
    }

    // 2. Build Services Context (with DB fallback)
    let servicesContext = "Standard KisanSeeva services available: Tractor Ploughing (₹800/hr), Paddy Harvester (₹1500/hr), Crop Sprayer (₹500/hr).";
    try {
      const servicesRes = await db.query(`
        SELECT s.id, s.name, s.type, s.price_per_hour, u.name as provider_name 
        FROM services s 
        JOIN users u ON s.provider_id = u.id 
        WHERE s.status = 'available'
      `);
      if (servicesRes.rows.length > 0) {
        servicesContext = servicesRes.rows.map(s => 
          `- ID ${s.id}: ${s.name} (${s.type}) by ${s.provider_name} - ₹${parseFloat(s.price_per_hour).toFixed(2)}/hour`
        ).join("\n");
      }
    } catch (dbErr) {
      console.warn("[ChatController] DB warning, using default services context:", dbErr.message);
    }

    // 3. Build Full Messages with Dynamic Language Prompt
    const dynamicPrompt = getSystemPrompt(userContext, servicesContext, language);
    const fullMessages = [
      { role: "system", content: dynamicPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: fullMessages,
        stream: false,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq Error Response:", errText);
      return res.status(502).json({
        message: "AI service error. Please check your API key.",
        error: errText,
      });
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";

    res.json({ reply });
  } catch (error) {
    console.error("Chat Controller Error:", error.message);
    res.status(500).json({ message: "Server error processing chat request." });
  }
};

module.exports = { handleChat };
