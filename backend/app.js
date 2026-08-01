const express = require("express");
const cors = require("cors");
const path = require("path");
const addOtpColumns = require("./migrations/addOtpColumns");

const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const surveyRoutes = require("./routes/surveyRoutes");
const chatRoutes = require("./routes/chatRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

// Run startup migrations
addOtpColumns();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/complaints", complaintRoutes);

const { Readable } = require("stream");

function stripMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\[BOOKING_READY:.*?\]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[`#*_~>[\]()|]/g, " ")
    .replace(/^[-•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

app.get("/api/tts", (req, res) => {
  try {
    const { text, lang } = req.query;
    if (!text) return res.status(400).send("Missing text");
    const cleanText = stripMarkdown(String(text)).slice(0, 200);
    if (!cleanText) return res.status(400).send("Empty text");

    const targetLang = (String(lang || "te")).split("-")[0];
    const encoded = encodeURIComponent(cleanText);
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${targetLang}&total=1&idx=0&textlen=${cleanText.length}&client=tw-ob&prev=input`;

    return res.redirect(googleUrl);
  } catch (err) {
    console.error("TTS Redirect Error:", err.message);
    res.status(500).send("TTS Failed");
  }
});

app.get("/", (req, res) => {
    res.send("🚜 Welcome to KisanSeeva API");
});

module.exports = app;