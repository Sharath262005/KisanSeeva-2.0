import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle, X, Send, Bot, User, Loader2, RefreshCw,
  Mic, MicOff, Volume2, VolumeX, Check, Tractor, Phone, PhoneOff
} from "lucide-react";
import API, { getBaseURL } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";

// ─── Seed Bot Mascot SVG — Rounded Robot Head with Sprout ────────────
function SeedBotMascot({ size = 40, className = "" }: { size?: number; className?: string }) {
  // Unique IDs per size to avoid SVG gradient collisions
  const uid = `sb${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Body / bubble fill */}
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
        {/* Body stroke gradient */}
        <linearGradient id={`${uid}-stroke`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        {/* Face screen gradient */}
        <linearGradient id={`${uid}-face`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#164e63" />
        </linearGradient>
        {/* Leaf gradient */}
        <linearGradient id={`${uid}-leaf`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
      </defs>

      {/* ══ Sprout Stem ══ */}
      <line
        x1="40" y1="19" x2="40" y2="11"
        stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"
      />

      {/* ══ Right Leaf ══ */}
      <path
        d="M41 15 C41 8, 50 4, 54 7 C52 14, 44 17, 41 15 Z"
        fill={`url(#${uid}-leaf)`}
        stroke="#15803d" strokeWidth="1.5" strokeLinejoin="round"
      />

      {/* ══ Left Leaf ══ */}
      <path
        d="M39 14 C37 7, 28 5, 25 8 C27 15, 36 17, 39 14 Z"
        fill="#4ade80"
        stroke="#15803d" strokeWidth="1.5" strokeLinejoin="round"
      />

      {/* ══ Antenna Rod + Glowing Tip ══ */}
      <line
        x1="56" y1="24" x2="63" y2="16"
        stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"
      />
      <circle cx="63" cy="15" r="4" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
      <circle cx="63" cy="15" r="2" fill="#fff7ed" />

      {/* ══ Rounded Robot Head Body (main bubble) ══ */}
      <rect
        x="12" y="22" width="56" height="42" rx="20" ry="20"
        fill={`url(#${uid}-body)`}
        stroke={`url(#${uid}-stroke)`}
        strokeWidth="3"
      />

      {/* Chat bubble tail (bottom-left notch) */}
      <path
        d="M20 64 L10 74 L28 64 Z"
        fill={`url(#${uid}-body)`}
        stroke={`url(#${uid}-stroke)`}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* ══ Ear Pads (Headphone Cushions) ══ */}
      <rect x="8" y="35" width="7" height="14" rx="3.5" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
      <rect x="65" y="35" width="7" height="14" rx="3.5" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />

      {/* ══ Face Screen — Rounded Rectangle ══ */}
      <rect
        x="20" y="30" width="40" height="26" rx="11" ry="11"
        fill={`url(#${uid}-face)`}
        stroke="#34d399" strokeWidth="2"
      />

      {/* Screen shine / glare */}
      <rect x="24" y="33" width="12" height="4" rx="2" fill="white" opacity="0.08" />

      {/* ══ Eyes — Arc / Crescent happy style ══ */}
      {/* Left eye white + iris */}
      <circle cx="31" cy="42" r="4.5" fill="#e2e8f0" />
      <circle cx="31" cy="42" r="2.8" fill="#34d399" />
      <circle cx="32" cy="41" r="1" fill="white" opacity="0.9" />

      {/* Right eye white + iris */}
      <circle cx="49" cy="42" r="4.5" fill="#e2e8f0" />
      <circle cx="49" cy="42" r="2.8" fill="#34d399" />
      <circle cx="50" cy="41" r="1" fill="white" opacity="0.9" />

      {/* ══ Rosy Cheeks ══ */}
      <ellipse cx="25" cy="50" rx="4" ry="2.5" fill="#fb7185" opacity="0.55" />
      <ellipse cx="55" cy="50" rx="4" ry="2.5" fill="#fb7185" opacity="0.55" />

      {/* ══ Happy Smile ══ */}
      <path
        d="M33 49 Q40 55 47 49"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Alias for backwards compatibility
const SeedLogo = SeedBotMascot;

// ─── Farmer Logo SVG (Indian Farmer + Fields + Tractor) ──────────────
function FarmerLogo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Outer circle */}
      <circle cx="40" cy="40" r="37" fill="#f0fdf4" stroke="#15803d" strokeWidth="3" />
      {/* Green fields stripes */}
      <ellipse cx="40" cy="56" rx="30" ry="14" fill="#16a34a" />
      <path d="M12 56 Q20 48 30 52 Q40 56 50 52 Q60 48 68 56" stroke="#4ade80" strokeWidth="1.5" fill="none" />
      <path d="M14 60 Q22 53 32 57 Q42 61 52 57 Q62 53 66 60" stroke="#4ade80" strokeWidth="1" fill="none" />
      {/* Sun rays */}
      <circle cx="58" cy="30" r="7" fill="#fbbf24" />
      <line x1="58" y1="20" x2="58" y2="16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <line x1="58" y1="40" x2="58" y2="44" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <line x1="48" y1="30" x2="44" y2="30" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <line x1="68" y1="30" x2="72" y2="30" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <line x1="51" y1="23" x2="48" y2="20" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="65" y1="37" x2="68" y2="40" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tractor small */}
      <rect x="52" y="48" width="12" height="7" rx="2" fill="#15803d" />
      <circle cx="54" cy="56" r="2.5" fill="#0f172a" stroke="#4ade80" strokeWidth="1" />
      <circle cx="62" cy="56" r="2.5" fill="#0f172a" stroke="#4ade80" strokeWidth="1" />
      <rect x="56" y="45" width="6" height="5" rx="1" fill="#166534" />
      {/* Farmer head / turban */}
      <ellipse cx="32" cy="26" rx="10" ry="8" fill="#15803d" />
      {/* Turban folds */}
      <path d="M22 26 Q26 20 32 22 Q38 20 42 26" stroke="#4ade80" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M22 28 Q26 22 32 24 Q38 22 42 28" stroke="#166534" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Face */}
      <ellipse cx="32" cy="36" rx="8" ry="9" fill="#d4a574" />
      {/* Beard */}
      <path d="M24 40 Q28 46 32 47 Q36 46 40 40" fill="#15803d" />
      {/* Eyes */}
      <circle cx="29" cy="35" r="1.5" fill="#1e293b" />
      <circle cx="35" cy="35" r="1.5" fill="#1e293b" />
      {/* Smile */}
      <path d="M28 40 Q32 43 36 40" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─── Provider Logo SVG (Wrench + Gear + Truck) ────────────────────────
function ProviderLogo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Rounded square frame */}
      <rect x="4" y="4" width="72" height="72" rx="14" fill="#f0fdf4" stroke="#15803d" strokeWidth="3" />
      {/* Gear behind */}
      <circle cx="50" cy="28" r="14" fill="none" stroke="#16a34a" strokeWidth="4" strokeDasharray="6 4" />
      <circle cx="50" cy="28" r="7" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
      {/* Wrench body */}
      <path d="M24 56 L44 30 C44 30 48 24 52 26 C56 28 54 34 50 36 L30 62 Z" fill="#166534" stroke="#15803d" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="23" cy="57" r="5" fill="#166534" stroke="#4ade80" strokeWidth="2" />
      {/* Fist holding wrench knuckles */}
      <rect x="36" y="36" width="10" height="14" rx="4" fill="#d4a574" stroke="#92400e" strokeWidth="1.5" />
      <line x1="38" y1="38" x2="38" y2="48" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
      <line x1="42" y1="38" x2="42" y2="48" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
      {/* Truck */}
      <rect x="44" y="57" width="22" height="12" rx="3" fill="#15803d" />
      <rect x="57" y="52" width="9" height="9" rx="2" fill="#166534" stroke="#4ade80" strokeWidth="1" />
      <circle cx="48" cy="70" r="3" fill="#0f172a" stroke="#4ade80" strokeWidth="1.5" />
      <circle cx="62" cy="70" r="3" fill="#0f172a" stroke="#4ade80" strokeWidth="1.5" />
      <rect x="44" y="57" width="8" height="7" rx="1" fill="#4ade80" opacity="0.4" />
    </svg>
  );
}

// ─── KisanSeeva Logo SVG (Handshake + Leaves — General / Bot) ─────────
function KisanSeevaLogo({ size = 28, className = "" }: { size?: number; className?: string }) {
  const uid = `ks${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-leaf`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>
      {/* Big curved left leaf */}
      <path d="M10 55 C5 38 18 18 40 22 C18 26 14 42 20 55 Z" fill={`url(#${uid}-leaf)`} />
      {/* Big curved right leaf */}
      <path d="M70 55 C75 38 62 18 40 22 C62 26 66 42 60 55 Z" fill={`url(#${uid}-leaf)`} />
      {/* Center sprout stem */}
      <line x1="40" y1="40" x2="40" y2="14" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
      {/* Top leaf center */}
      <path d="M40 14 C40 6 50 2 55 6 C52 14 44 16 40 14 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1.5" />
      {/* Top leaf left */}
      <path d="M40 20 C35 12 25 12 22 16 C26 22 35 22 40 20 Z" fill="#4ade80" stroke="#15803d" strokeWidth="1.5" />
      {/* Gold sparkle star */}
      <path d="M60 14 L62 10 L64 14 L68 16 L64 18 L62 22 L60 18 L56 16 Z" fill="#fbbf24" />
      <circle cx="56" cy="10" r="2" fill="#fbbf24" />
      <circle cx="68" cy="20" r="1.5" fill="#fbbf24" />
      {/* Handshake */}
      {/* Left hand */}
      <path d="M14 56 C14 56 20 52 26 54 L34 58 C34 58 38 60 36 64 C34 68 28 66 28 66 L18 62 Z" fill="#d4a574" stroke="#92400e" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Right hand */}
      <path d="M66 56 C66 56 60 52 54 54 L46 58 C46 58 42 60 44 64 C46 68 52 66 52 66 L62 62 Z" fill="#d4a574" stroke="#92400e" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Fingers overlap / grip */}
      <path d="M30 58 L50 58 C50 58 52 62 50 65 L30 65 C30 65 28 62 30 58 Z" fill="#c8965a" stroke="#92400e" strokeWidth="1.5" />
      <line x1="35" y1="58" x2="35" y2="65" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
      <line x1="40" y1="58" x2="40" y2="65" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
      <line x1="45" y1="58" x2="45" y2="65" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────
interface Message { role: "user" | "assistant"; content: string; }
interface BookingDetails { serviceId: number; date: string; location: string; hours: number; }

// ─── Speech Recognition ──────────────────────────────────────────────
const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// ─── Localized Prompts ───────────────────────────────────────────────
const L10N: Record<string, { greeting: string; placeholder: string; suggestions: string[] }> = {
  en: {
    greeting: "🌱 Namaste! I'm **Seed**, your agricultural AI assistant. Ask me anything about farming or booking machinery!",
    placeholder: "Ask Seed...",
    suggestions: ["Book a tractor", "What is KisanSeeva?", "How to register?", "Best crops for summer?"]
  },
  te: {
    greeting: "🌱 నమస్కారం! నేను **సీడ్ (Seed)**, మీ వ్యవసాయ సహాయకుడిని. యంత్రాల బుకింగ్ లేదా వ్యవసాయం గురించి ఏదైనా అడగండి!",
    placeholder: "సీడ్‌ని అడగండి...",
    suggestions: ["ట్రాక్టర్ బుక్ చేయి", "కిసాన్ సేవా అంటే ఏమిటి?", "నమోదు ఎలా చేయాలి?", "వేసవి పంటలు?"]
  },
  hi: {
    greeting: "🌱 नमस्ते! मैं **सीड (Seed)** हूँ, आपका कृषि सहायक। खेती या मशीनरी बुकिंग के बारे में कुछ भी पूछें!",
    placeholder: "सीड से पूछें...",
    suggestions: ["ट्रैक्टर बुक करें", "किसान सेवा क्या है?", "रजिस्टर कैसे करें?", "गर्मी में फसलें?"]
  },
  ta: {
    greeting: "🌱 வணக்கம்! நான் **சீட் (Seed)**, உங்கள் விவசாய உதவியாளர். எதையும் கேளுங்கள்!",
    placeholder: "சீட்டிடம் கேளுங்கள்...",
    suggestions: ["டிராக்டர் முன்பதிவு", "கிசான் சேவா என்ன?", "எப்படி பதிவு செய்வது?"]
  },
  kn: {
    greeting: "🌱 ನಮಸ್ಕಾರ! ನಾನು **ಸೀಡ್ (Seed)**, ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ಕೇಳಿ!",
    placeholder: "ಸೀಡ್ ಅವರನ್ನು ಕೇಳಿ...",
    suggestions: ["ಟ್ರ್ಯಾಕ್ಟರ್ ಬುಕ್ ಮಾಡಿ", "ಕಿಸಾನ್ ಸೇವಾ ಏನು?"]
  },
  mr: {
    greeting: "🌱 नमस्कार! मी **सीड (Seed)** आहे, तुमचा शेती सहाय्यक. विचारा!",
    placeholder: "सीडला विचारा...",
    suggestions: ["ट्रॅक्टर बुक करा", "किसान सेवा म्हणजे काय?"]
  },
  bn: {
    greeting: "🌱 নমস্কার! আমি **সিড (Seed)**, আপনার কৃষি সহকারী। জিজ্ঞাসা করুন!",
    placeholder: "সিডকে জিজ্ঞাসা করুন...",
    suggestions: ["ট্র্যাক্টর বুক করুন", "কিষান সেবা কী?"]
  }
};

function stripMarkdown(text: string): string {
  return text
    .replace(/\[BOOKING_READY:.*?\]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[`#*_~>[\]()|]/g, " ")
    .replace(/^[-•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Native Web Speech API (speechSynthesis) ──────────────────────────────────
function speakWithWebSpeech(
  text: string,
  langCode: string,
  onEnd?: () => void,
  onError?: () => void
) {
  if (!window.speechSynthesis) { onEnd?.(); return; }

  const cleanText = stripMarkdown(text).slice(0, 300);
  if (!cleanText) { onEnd?.(); return; }

  try {
    window.speechSynthesis.cancel();
  } catch { }

  const utt = new SpeechSynthesisUtterance(cleanText);
  const langKeywords: Record<string, string[]> = {
    te: ["telugu", "te-in", "te_in", "te"],
    hi: ["hindi", "hi-in", "hi_in", "hi"],
    ta: ["tamil", "ta-in", "ta_in", "ta"],
    kn: ["kannada", "kn-in", "kn_in", "kn"],
    mr: ["marathi", "mr-in", "mr_in", "mr"],
    bn: ["bengali", "bn-in", "bn_in", "bn"],
    en: ["english", "en-in", "en-us", "en"],
  };

  const doSpeak = () => {
    const voices = window.speechSynthesis.getVoices() || [];
    let matched: SpeechSynthesisVoice | undefined;

    const keywords = langKeywords[langCode] || [langCode];

    for (const kw of keywords) {
      matched = voices.find((v) =>
        v.lang.toLowerCase() === kw ||
        v.lang.toLowerCase().replace('_', '-') === kw ||
        v.name.toLowerCase().includes(kw)
      );
      if (matched) break;
    }

    if (!matched) {
      matched = voices.find((v) => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
    }

    if (matched) {
      utt.voice = matched;
      utt.lang = matched.lang;
    } else {
      utt.lang = `${langCode}-IN`;
    }

    utt.rate = 0.95;
    utt.pitch = 1.0;
    utt.volume = 1.0;

    utt.onend = () => onEnd?.();
    utt.onerror = (e) => {
      console.warn("WebSpeech utterance notice:", e);
      onEnd?.();
    };

    try {
      window.speechSynthesis.speak(utt);
    } catch (e) {
      console.warn("speechSynthesis.speak failed:", e);
      onEnd?.();
    }
  };

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    let fired = false;
    window.speechSynthesis.onvoiceschanged = () => {
      if (fired) return;
      fired = true;
      window.speechSynthesis.onvoiceschanged = null;
      doSpeak();
    };
    setTimeout(() => {
      if (!fired) {
        fired = true;
        doSpeak();
      }
    }, 400);
  } else {
    doSpeak();
  }
}

// ─── Format message to HTML ──────────────────────────────────────────
function fmt(text: string) {
  return text
    .replace(/\[BOOKING_READY:.*?\]/g, "").trim()
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

// ─── Main Component ──────────────────────────────────────────────────
export default function Chatbot() {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();

  // Detect user role for logo switching
  const userRole = user?.role ?? "farmer";

  const [isOpen, setIsOpen] = useState(false);
  const [showBubblePill, setShowBubblePill] = useState(true);
  const [isLiveVoice, setIsLiveVoice] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [botReply, setBotReply] = useState("");
  const [pendingBooking, setPendingBooking] = useState<BookingDetails | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"none" | "submitting" | "success" | "error">("none");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLiveRef = useRef(false);
  isLiveRef.current = isLiveVoice;

  const l10n = L10N[currentLanguage.code] || L10N.en;

  // Initial greeting when opened or language changes
  useEffect(() => {
    if (isOpen) {
      setMessages([{ role: "assistant", content: l10n.greeting }]);
    }
  }, [isOpen, currentLanguage]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Speech Recognition setup
  useEffect(() => {
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = currentLanguage.sttCode;

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => {
      setIsListening(false);
      if (isLiveRef.current && !isBotSpeaking) restartListening(800);
    };
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      if (transcript) {
        setVoiceTranscript(transcript);
        sendMessage(transcript);
      }
    };
    recRef.current = rec;
  }, [currentLanguage]);

  const restartListening = (delay = 600) => {
    setTimeout(() => {
      if (isLiveRef.current && recRef.current) {
        try { recRef.current.start(); } catch { }
      }
    }, delay);
  };

  const speak = useCallback((text: string, onDone?: () => void) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    const targetLang = currentLanguage.sttCode.split("-")[0]; // e.g. "te", "hi", "en"
    setIsBotSpeaking(true);

    speakWithWebSpeech(
      text,
      targetLang,
      () => {
        setIsBotSpeaking(false);
        onDone?.();
      },
      () => {
        setIsBotSpeaking(false);
        onDone?.();
      }
    );
  }, [currentLanguage]);

  const toggleMic = () => {
    if (!SR) { alert("Speech recognition requires Chrome or Edge."); return; }
    if (isListening) {
      recRef.current?.stop();
    } else {
      if (audioRef.current) { audioRef.current.pause(); setIsBotSpeaking(false); }
      window.speechSynthesis.cancel();
      try { recRef.current?.start(); } catch { }
    }
  };

  const startLiveVoice = () => {
    if (!SR) { alert("Speech recognition requires Chrome or Edge."); return; }
    setIsLiveVoice(true);
    setVoiceTranscript("");
    setBotReply("");
    setTimeout(() => {
      try { recRef.current?.start(); } catch { }
    }, 400);
  };

  const endLiveVoice = () => {
    setIsLiveVoice(false);
    recRef.current?.stop();
    if (audioRef.current) audioRef.current.pause();
    window.speechSynthesis.cancel();
    setIsBotSpeaking(false);
    setIsListening(false);
  };

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    if (pendingBooking && bookingStatus === "none") {
      const lower = content.toLowerCase();
      if (/confirm|yes|ok|సరే|हाँ|ஆம்|ಹೌದು|हो/.test(lower)) { confirmBooking(); setInput(""); return; }
      if (/cancel|no|stop|వద్దు|नहीं|இல்லை|ಬೇಡ/.test(lower)) { cancelBooking(); setInput(""); return; }
    }

    const userMsg: Message = { role: "user", content };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);
    if (pendingBooking) { setPendingBooking(null); setBookingStatus("none"); }

    try {
      const res = await API.post("/chat", {
        messages: history.map(m => ({ role: m.role, content: m.content })),
        language: currentLanguage.code
      });

      const reply: string = res.data.reply;

      const match = reply.match(/\[BOOKING_READY:\s*(.*?)\]/);
      if (match) {
        try { setPendingBooking(JSON.parse(match[1])); setBookingStatus("none"); } catch { }
      }

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setBotReply(reply.replace(/\[BOOKING_READY:.*?\]/g, "").trim());

      speak(reply, () => {
        if (isLiveRef.current) restartListening(400);
      });

    } catch {
      const err = "Sorry, something went wrong. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: err }]);
      if (isLiveRef.current) restartListening(800);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const confirmBooking = async () => {
    if (!pendingBooking) return;
    setBookingStatus("submitting");
    try {
      if (!localStorage.getItem("token")) throw new Error("Not logged in.");
      await API.post("/bookings", {
        serviceId: pendingBooking.serviceId,
        bookingDate: pendingBooking.date,
        hoursRequired: pendingBooking.hours,
        location: pendingBooking.location,
      });
      setBookingStatus("success");
      const msg = "🎉 Booking submitted successfully! Redirecting to your bookings...";
      setMessages(prev => [...prev, { role: "assistant", content: msg }]);
      speak(msg);
      setPendingBooking(null);
      setTimeout(() => navigate("/farmer/bookings"), 2500);
    } catch (e: any) {
      setBookingStatus("error");
      const msg = `❌ Booking failed: ${e.response?.data?.message || e.message}`;
      setMessages(prev => [...prev, { role: "assistant", content: msg }]);
    }
  };

  const cancelBooking = () => {
    setPendingBooking(null); setBookingStatus("none");
    const msg = "Booking cancelled. How can I help you?";
    setMessages(prev => [...prev, { role: "assistant", content: msg }]);
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: l10n.greeting }]);
    setPendingBooking(null); setBookingStatus("none");
    if (audioRef.current) audioRef.current.pause();
    window.speechSynthesis.cancel();
  };

  // ══════════════════════════════════════════════════════════════════
  //  LIVE VOICE CALL UI  (fullscreen overlay)
  // ══════════════════════════════════════════════════════════════════
  if (isOpen && isLiveVoice) {
    return (
      <div className="fixed inset-0 z-[999] bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 flex flex-col items-center justify-center select-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5 text-white/90 text-sm font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Seed 🌱 · Live Call ({currentLanguage.nativeName})
          </div>
          <button
            onClick={endLiveVoice}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer text-white"
            title="Close call"
            aria-label="Close live call"
          >
            <X size={20} />
          </button>
        </div>

        {/* Avatar + pulse rings */}
        <div className="relative flex items-center justify-center mb-8">
          {(isListening || isBotSpeaking) && <>
            <span className="absolute w-52 h-52 rounded-full border-2 border-emerald-400/20 animate-ping" style={{ animationDuration: "1.4s" }} />
            <span className="absolute w-40 h-40 rounded-full border-2 border-emerald-400/30 animate-ping" style={{ animationDuration: "1.1s" }} />
          </>}
          <div className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isBotSpeaking ? "bg-emerald-500 scale-110 shadow-emerald-500/50" :
              isListening ? "bg-red-500 scale-105 shadow-red-500/50" :
                "bg-emerald-700"
            }`}>
            {isBotSpeaking
              ? <Volume2 size={44} className="text-white animate-bounce" />
              : isListening
                ? <Mic size={44} className="text-white animate-pulse" />
                : <SeedLogo size={44} />
            }
          </div>
        </div>

        {/* Status label */}
        <p className="text-white text-2xl font-extrabold mb-2">
          {isBotSpeaking ? "Seed is speaking..." : isListening ? "Listening to you..." : loading ? "Thinking..." : "Seed 🌱"}
        </p>
        <p className="text-emerald-300/70 text-sm font-medium mb-8">
          {isBotSpeaking ? "Seed is talking — speak when done" : isListening ? "Speak now..." : loading ? "Processing request..." : "Press mic to speak"}
        </p>

        {/* Transcript cards */}
        <div className="w-full max-w-sm px-6 space-y-3 mb-10">
          {voiceTranscript && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 text-right">
              <p className="text-[10px] text-white/40 font-bold uppercase mb-1">You said</p>
              <p className="text-white text-sm font-semibold">{voiceTranscript}</p>
            </div>
          )}
          {botReply && (
            <div className="bg-emerald-500/20 backdrop-blur-sm rounded-2xl px-4 py-3">
              <p className="text-[10px] text-emerald-300/60 font-bold uppercase mb-1">Seed replied</p>
              <p className="text-white/90 text-sm">{botReply.slice(0, 160)}{botReply.length > 160 ? "…" : ""}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleMic}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${isListening ? "bg-red-600 animate-pulse" : "bg-white/10 hover:bg-white/20"
              }`}
          >
            {isListening ? <MicOff size={26} className="text-white" /> : <Mic size={26} className="text-white" />}
          </button>

          <button
            onClick={endLiveVoice}
            className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-2xl transition-all cursor-pointer"
            title="End Call"
          >
            <PhoneOff size={32} className="text-white" />
          </button>

          <button
            onClick={() => { if (audioRef.current) audioRef.current.pause(); window.speechSynthesis.cancel(); setIsBotSpeaking(false); }}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shadow-lg transition-all cursor-pointer"
            title="Mute Audio"
          >
            <VolumeX size={26} className="text-white" />
          </button>
        </div>

        <p className="absolute bottom-6 text-white/30 text-xs">Tap red button to end call</p>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  //  REGULAR CHAT UI
  // ══════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ── Floating Bot Trigger & Callout Pill ── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group font-['Plus_Jakarta_Sans',sans-serif]">
          {/* Floating Callout Bubble Pill */}
          {showBubblePill && (
            <div
              onClick={() => setIsOpen(true)}
              className="relative animate-bounce bg-white text-slate-800 px-4 py-2 rounded-2xl shadow-xl border border-emerald-100/80 flex items-center gap-2.5 text-xs font-semibold select-none cursor-pointer hover:shadow-2xl hover:border-emerald-200 transition-all duration-300"
            >
              <span className="text-base animate-pulse">👋</span>
              <span className="font-extrabold text-slate-900 tracking-tight">Hi! I'm Seed</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBubblePill(false);
                }}
                className="ml-1 text-slate-400 hover:text-slate-700 p-0.5 rounded-full hover:bg-slate-100 transition"
                title="Dismiss greeting"
                aria-label="Dismiss greeting"
              >
                <X size={13} />
              </button>
              {/* Pointer triangle */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-emerald-100/80 rotate-45" />
            </div>
          )}

          {/* Avatar Circular Trigger Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-[72px] h-[72px] rounded-full bg-gradient-to-br from-white via-emerald-50 to-amber-50 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border-[3px] border-emerald-400 cursor-pointer glow-emerald"
            aria-label="Open Seed AI assistant"
          >
            {/* Subtle ring glow behind button */}
            <span className="absolute -inset-1 rounded-full border-2 border-emerald-300/40 animate-ping" style={{ animationDuration: '2.5s' }} />
            <SeedLogo size={58} className="drop-shadow-lg z-10 transition-transform duration-300 group-hover:scale-110" />

            {/* Online Status Dot */}
            <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow z-20">
              <span className="absolute inset-0 rounded-full bg-emerald-300 animate-ping opacity-75" />
            </span>
          </button>
        </div>
      )}

      {/* ── Main Chat Window Modal ── */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 z-50 w-full max-w-sm flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-emerald-500/20 bg-white font-['Plus_Jakarta_Sans',sans-serif] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          style={{ height: "84vh", maxHeight: "650px" }}
        >

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              {/* KisanSeeva Logo badge */}
              <div className="relative w-10 h-10 rounded-2xl bg-white p-1 border border-emerald-400/30 flex items-center justify-center overflow-hidden shadow-sm">
                <img src="/logo.png" alt="KisanSeeva Logo" className="w-full h-full object-contain" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-900" />
              </div>
              <div>
                <p className="font-extrabold text-sm tracking-tight flex items-center gap-1.5 text-white">
                  Seed AI <span className="text-xs bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-400/20">🌱</span>
                </p>
                <p className="text-[11px] text-emerald-200/80 font-medium mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  KisanSeeva ·
                  {userRole === "provider"
                    ? <span className="flex items-center gap-1"><img src="/provider-logo.png" alt="Provider" className="w-3.5 h-3.5 object-contain rounded" /> Provider</span>
                    : <span className="flex items-center gap-1"><img src="/farmer-logo.png" alt="Farmer" className="w-3.5 h-3.5 object-contain rounded" /> Farmer</span>
                  }
                  · {currentLanguage.nativeName}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={startLiveVoice}
                className="flex items-center gap-1 bg-emerald-600/40 hover:bg-emerald-600/60 border border-emerald-400/30 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Start hands-free voice call"
              >
                <Phone size={13} className="text-emerald-300 animate-pulse" /> Call
              </button>
              <button
                onClick={clearChat}
                className="p-1.5 hover:bg-white/10 rounded-xl transition cursor-pointer text-emerald-200 hover:text-white"
                title="Clear conversation"
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl transition cursor-pointer text-emerald-200 hover:text-white"
                title="Close Chat"
                aria-label="Close Chat"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3.5 bg-gradient-to-b from-slate-50 to-white">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"} items-end`}>
                <div className={`w-8 h-8 rounded-2xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm ${m.role === "user"
                    ? "bg-white border border-slate-200 p-0.5"
                    : "bg-gradient-to-br from-emerald-600 to-emerald-800"
                  }`}>
                  {m.role === "user"
                    ? <img src={userRole === "provider" ? "/provider-logo.png" : "/farmer-logo.png"} alt="User Logo" className="w-full h-full object-contain" />
                    : <SeedLogo size={22} />
                  }
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed shadow-sm ${m.role === "user"
                    ? "bg-slate-900 text-white rounded-br-xs font-medium"
                    : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs font-normal"
                  }`}>
                  <div dangerouslySetInnerHTML={{ __html: fmt(m.content) }} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2.5">
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center overflow-hidden">
                  <SeedLogo size={22} />
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5 items-center h-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Pending booking card */}
            {pendingBooking && (
              <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 space-y-3 shadow-sm backdrop-blur-xs">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                  <Tractor size={16} className="text-emerald-700" /> Confirm Booking?
                </div>
                <div className="text-xs text-slate-700 space-y-1 bg-white/70 p-2.5 rounded-xl border border-emerald-100">
                  <p><strong>Service:</strong> #{pendingBooking.serviceId}</p>
                  <p><strong>Date:</strong> {pendingBooking.date}</p>
                  <p><strong>Hours:</strong> {pendingBooking.hours}</p>
                  <p><strong>Location:</strong> {pendingBooking.location}</p>
                </div>
                {bookingStatus === "none" && (
                  <div className="flex gap-2">
                    <button onClick={cancelBooking} className="flex-1 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer shadow-2xs">
                      Cancel
                    </button>
                    <button onClick={confirmBooking} className="flex-1 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow-xs">
                      <Check size={14} /> Confirm
                    </button>
                  </div>
                )}
                {bookingStatus === "submitting" && (
                  <div className="flex justify-center py-1 text-xs text-emerald-800 font-bold items-center gap-1.5">
                    <Loader2 className="animate-spin" size={14} /> Submitting...
                  </div>
                )}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {messages.length <= 1 && (
            <div className="px-3.5 py-2.5 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {l10n.suggestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="whitespace-nowrap text-[11.5px] bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-900 font-semibold px-3 py-1.5 rounded-xl border border-emerald-200/60 hover:border-emerald-300 transition-all shrink-0 cursor-pointer shadow-2xs hover:scale-102"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Controls */}
          <div className="px-3.5 py-3 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 bg-slate-100/80 rounded-2xl px-3.5 py-2 focus-within:ring-2 focus-within:ring-emerald-500/40 focus-within:bg-white focus-within:border-emerald-300 transition-all border border-transparent">
              <button
                onClick={toggleMic}
                className={`p-1.5 rounded-xl transition cursor-pointer ${isListening ? "bg-red-500 text-white animate-pulse" : "text-slate-400 hover:text-emerald-700"}`}
                title={isListening ? "Stop listening" : `Speak (${currentLanguage.nativeName})`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={l10n.placeholder}
                disabled={loading}
                className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none min-w-0 font-medium"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="p-2 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <Send size={15} />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
