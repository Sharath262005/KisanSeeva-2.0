import React, { useState, useEffect } from "react";
import { User, ShieldCheck, Tractor, Briefcase, Camera, LogOut, Settings, Globe, Star, Sun, Moon, ChevronDown } from "lucide-react";
import { KSBadge } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { useLanguage, SUPPORTED_LANGUAGES } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const compressImage = (file: File, maxWidth = 500, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const ProviderProfile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { t, currentLanguage, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [selfie, setSelfie] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [ratedBookings, setRatedBookings] = useState<any[]>([]);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setBusinessName(user.name);
      setPhone(user.phone);
      setExtraInfo(user.extraInfo || "");
      setSelfie(user.documents?.selfie || null);
    }
  }, [user?.id, user?.documents?.selfie]);

  useEffect(() => {
    API.get("/bookings/provider")
      .then(res => {
        const rated = (res.data.bookings || []).filter(
          (b: any) => b.status === "completed" && b.provider_rating !== null
        );
        setRatedBookings(rated);
      })
      .catch(() => {});
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB.");
      return;
    }
    setError("");
    setImageUploading(true);
    try {
      const compressedDataUrl = await compressImage(file, 500, 0.85);
      setSelfie(compressedDataUrl);
      setImageChanged(true);
    } catch {
      setError("Failed to process image. Please try another photo.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !phone) {
      setError("Business name and contact phone are required.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const updatedUser = await updateUserProfile({
        name: businessName,
        phone,
        extraInfo,
        ...(imageChanged && selfie ? { documents: { selfie } } : {}),
      });
      if (updatedUser?.documents?.selfie) {
        setSelfie(updatedUser.documents.selfie);
      }
      setSaved(true);
      setImageChanged(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (n: string) => {
    return n.split(" ").map(x => x[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-16">
      {/* ── Page Title ── */}
      <div className="pb-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          {t("myProfile")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{t("editProfile")}</p>
      </div>

      {/* ── Success / Error Banners ── */}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3.5 rounded-2xl flex items-center gap-2 text-sm font-semibold shadow-sm">
          <ShieldCheck size={18} className="text-green-600 shrink-0" />
          <span>Business profile details updated successfully!</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-2xl text-sm font-semibold shadow-sm">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ── PROFILE HEADER CARD ── */}
        <div
          className="flex flex-col items-center sm:flex-row sm:items-center gap-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
        >
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div
              className="rounded-full overflow-hidden border-4 border-orange-400 shadow-md bg-orange-50 dark:bg-orange-950 flex items-center justify-center text-orange-700 dark:text-orange-300 font-black text-2xl"
              style={{ width: "88px", height: "88px" }}
            >
              {selfie ? (
                <img
                  src={selfie}
                  alt={businessName || "Profile"}
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{businessName ? getInitials(businessName) : "P"}</span>
              )}
            </div>
            <label
              htmlFor="provider-avatar-upload"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-md cursor-pointer transition-all duration-150 active:scale-95"
              title="Upload profile picture"
            >
              <Camera size={15} />
            </label>
            <input
              id="provider-avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Name + badge */}
          <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100 truncate">
              {businessName || "Service Provider"}
            </h3>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200 dark:border-orange-800 px-2.5 py-0.5 rounded-full">
                🚜 Service Partner Account
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {imageUploading ? "Processing photo…" : "Tap the camera icon to update your photo"}
            </p>
          </div>
        </div>

        {/* ── FORM FIELDS ── */}
        <div className="space-y-4">
          {/* Agency Info */}
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
              <span className="p-1.5 bg-orange-50 dark:bg-orange-950/60 rounded-lg">
                <Briefcase className="text-orange-500" size={16} />
              </span>
              Agency Information
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                {t("name")}
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 border border-slate-200 dark:border-slate-700 bg-[#F5F7F6] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-500 transition text-sm placeholder:text-slate-400"
                placeholder="Your business or name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                {t("phone")}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 border border-slate-200 dark:border-slate-700 bg-[#F5F7F6] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-500 transition text-sm placeholder:text-slate-400"
                placeholder="10-digit mobile number"
                required
              />
            </div>
          </div>

          {/* Machinery Details */}
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
              <span className="p-1.5 bg-orange-50 dark:bg-orange-950/60 rounded-lg">
                <Tractor className="text-orange-500" size={16} />
              </span>
              Machinery Capabilities &amp; Details
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Fleet details, models, and service range
              </label>
              <textarea
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
                placeholder="Enter tractor/harvester models, plate numbers, and typical daily availability."
                rows={3}
                className="w-full px-4 py-2.5 sm:py-3 border border-slate-200 dark:border-slate-700 bg-[#F5F7F6] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-500 transition text-sm placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Verification Status:</span>
              <KSBadge variant="success" className="text-xs py-0.5 px-2.5">
                <ShieldCheck size={13} /> Verified Provider
              </KSBadge>
            </div>
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-1">
          {/* Sign Out — outline only */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full sm:w-auto h-10 px-6 rounded-xl text-red-500 bg-transparent border-2 border-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>

          {/* Save — solid orange */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto h-10 px-7 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 disabled:opacity-50 cursor-pointer"
            style={{ boxShadow: "0 2px 8px rgba(234,88,12,0.25)" }}
          >
            {submitting ? "Saving…" : t("save")}
          </button>
        </div>
      </form>

      {/* ── RATINGS SECTION ── */}
      {ratedBookings.length > 0 && (
        <div
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <span className="p-1.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg">
              <Star className="text-amber-500 fill-amber-400" size={16} />
            </span>
            Ratings I've Given to Farmers
          </h3>
          <div className="space-y-2.5">
            {ratedBookings.map((b: any) => (
              <div key={b.id} className="flex items-start justify-between p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/40">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{b.farmer_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{b.service_name} · KS-{b.id}</p>
                  {b.provider_feedback && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic mt-1">"{b.provider_feedback}"</p>
                  )}
                </div>
                <div className="flex gap-0.5 shrink-0">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={13}
                      className={s <= b.provider_rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── APP SETTINGS CARD ── */}
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      >
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
          <span className="p-1.5 bg-orange-50 dark:bg-orange-950/60 rounded-lg">
            <Settings className="text-orange-500" size={16} />
          </span>
          App Preferences &amp; Settings
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Theme Mode */}
          <div className="p-3.5 rounded-xl bg-[#F5F7F6] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-2">
              {theme === "dark" ? <Moon size={14} className="text-indigo-400" /> : <Sun size={14} className="text-amber-500" />}
              Brightness &amp; Theme
            </label>
            <div className="relative">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full appearance-none px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer transition"
              >
                <option value="light">☀️ Light Mode</option>
                <option value="dark">🌙 Dark Mode</option>
                <option value="system">🖥️ System Default</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">Adjust screen contrast and dark mode.</p>
          </div>

          {/* Language */}
          <div className="p-3.5 rounded-xl bg-[#F5F7F6] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 mb-2">
              <Globe size={14} className="text-orange-500" />
              Display Language
            </label>
            <div className="relative">
              <select
                value={currentLanguage.code}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer transition"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">Choose your preferred regional language.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
