const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "groq/compound-mini",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant"
];

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
    ? `\nCRITICAL LANGUAGE MANDATE: You MUST reply entirely in ${langName} using native script. Keep it very short and natural.`
    : "";

  return `You are Seed 🌱, the friendly agricultural AI for KisanSeeva.

STYLE & LENGTH RULES (CRITICAL):
- Keep EVERY answer extremely short, simple, and direct (1 to 2 sentences max, under 35 words).
- Talk naturally like a helpful friend. NO long essays, NO unnecessary introductions, NO filler matter.
- Give only the direct, essential answer.

DOMAIN RULES:
- Only answer about KisanSeeva (renting tractors/harvesters/machinery, repairs, registration, bookings) and agricultural farming advice (crops, soil, weather, fertilizers).
- If asked about non-farming topics (movies, politics, gaming, general coding), reply in 1 brief sentence: "I only assist with KisanSeeva and agriculture. How can I help with your farming needs today?"

ABOUT KISANSEEVA (Brief):
- Connects farmers with machinery providers (tractors, harvesters, seeders, sprayers) for hourly rental and repair services.
- Farmers book equipment and track providers live; providers list machines and earn.

USER SESSION:
${userContext}

AVAILABLE MACHINERY SERVICES:
${servicesContext}
${langInstruction}

BOOKING ASSISTANCE:
- If a farmer wants to book, ask for missing details ONE BY ONE in 1 short sentence (Machine name, Date, Hours, Location).
- When all 4 are ready, output 1 short confirmation sentence and append:
  [BOOKING_READY: {"serviceId": SERVICE_ID, "date": "YYYY-MM-DD", "location": "LOCATION", "hours": HOURS}]

Remember: Keep it short, simple, and straight to the point in ${langName}.`;
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

    let reply = null;
    let lastError = null;

    for (const model of GROQ_MODELS) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model,
            messages: fullMessages,
            stream: false,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          let rawReply = data?.choices?.[0]?.message?.content || "";
          // Strip any internal reasoning <think>...</think> tags if present
          rawReply = rawReply.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
          if (rawReply) {
            reply = rawReply;
            break;
          }
        } else {
          lastError = await groqRes.text();
          console.warn(`[ChatController] Model ${model} failed:`, lastError);
        }
      } catch (err) {
        lastError = err.message;
        console.warn(`[ChatController] Error invoking ${model}:`, err.message);
      }
    }

    if (!reply) {
      return res.status(502).json({
        message: "AI service error. Please check your API key.",
        error: lastError,
      });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Chat Controller Error:", error.message);
    res.status(500).json({ message: "Server error processing chat request." });
  }
};

module.exports = { handleChat };
