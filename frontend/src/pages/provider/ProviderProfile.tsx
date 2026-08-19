import React, { useState, useEffect } from "react";
import { User, ShieldCheck, Tractor, Briefcase, Camera, LogOut, Settings, Globe, Star, Sun, Moon, Monitor } from "lucide-react";
import { KSCard, KSButton, KSBadge } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { useLanguage, SUPPORTED_LANGUAGES } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import API from "../../services/api";

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

  useEffect(() => {
    if (user) {
      setBusinessName(user.name);
      setPhone(user.phone);
      setExtraInfo(user.extraInfo || "");
      // Always sync selfie from the latest user object
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelfie(reader.result as string);
      setImageChanged(true);
    };
    reader.readAsDataURL(file);
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
      // Explicitly sync selfie from server response to guarantee UI update
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

  const themeOptions: { value: "light" | "dark" | "system"; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{t("myProfile")}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t("editProfile")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {saved && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 p-4 rounded-2xl flex items-center gap-2">
            <ShieldCheck size={20} />
            <span className="font-semibold">Business profile details updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 p-4 rounded-2xl">
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* ── PROFILE PHOTO AVATAR CARD ── */}
        <KSCard className="flex flex-col items-center sm:flex-row sm:items-center gap-6 bg-gradient-to-r from-amber-50/70 to-orange-50/70 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-100 dark:border-amber-800">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-md bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-900 dark:text-amber-300 font-extrabold text-2xl">
              {selfie ? (
                <img src={selfie} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{businessName ? getInitials(businessName) : "P"}</span>
              )}
            </div>
            <label
              htmlFor="provider-avatar-upload"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center shadow-lg cursor-pointer transition active:scale-95"
              title="Upload profile picture"
            >
              <Camera size={16} />
            </label>
            <input
              id="provider-avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{businessName || "Provider"}</h3>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">🚜 Service Partner Account</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tap the camera icon to select & update your profile picture.</p>
          </div>
        </KSCard>

        <div className="grid gap-6">
          {/* Business Info */}
          <KSCard className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <Briefcase className="text-yellow-600 dark:text-yellow-400" size={20} />
              Agency Information
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t("name")}</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t("phone")}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition text-sm"
                required
              />
            </div>
          </KSCard>

          {/* Logistics / Operations */}
          <KSCard className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <Tractor className="text-yellow-600 dark:text-yellow-400" size={20} />
              Machinery Capabilities & Details
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Fleet details, models, and service range</label>
              <textarea
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
                placeholder="Enter tractor/harvester models, plate numbers, and typical daily availability."
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition text-sm"
              />
            </div>

            <div className="pt-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Verification Status</p>
              <KSBadge variant="success">
                <ShieldCheck size={14} /> Verified Provider
              </KSBadge>
            </div>
          </KSCard>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogOut size={18} />
            <span>Sign Out of Account</span>
          </button>

          <KSButton type="submit" disabled={submitting} className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold border-0 px-8 py-3">
            {submitting ? "Saving..." : t("save")}
          </KSButton>
        </div>
      </form>

      {/* ── RATINGS GIVEN SECTION ── */}
      {ratedBookings.length > 0 && (
        <KSCard className="space-y-4 mt-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Star className="text-amber-500 fill-amber-400" size={20} />
            Ratings I've Given to Farmers
          </h3>
          <div className="space-y-3">
            {ratedBookings.map((b: any) => (
              <div key={b.id} className="flex items-start justify-between p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-100 dark:border-amber-800">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">{b.farmer_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{b.service_name} · KS-{b.id}</p>
                  {b.provider_feedback && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic mt-1">"{b.provider_feedback}"</p>
                  )}
                </div>
                <div className="flex gap-0.5 shrink-0">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14}
                      className={s <= b.provider_rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </KSCard>
      )}

      {/* ── APP SETTINGS CARD ── */}
      <KSCard className="space-y-5 mt-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Settings className="text-amber-600 dark:text-amber-400" size={20} />
          App Settings
        </h3>

        {/* ── DARK / LIGHT MODE TOGGLE ── */}
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
            {theme === "dark" ? <Moon size={15} className="text-indigo-500" /> : theme === "light" ? <Sun size={15} className="text-amber-500" /> : <Monitor size={15} className="text-slate-500" />}
            Display Theme
          </p>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                  theme === value
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300"
                    : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
                {theme === value && <Check size={12} className="text-amber-600" />}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
            <Globe size={15} className="text-amber-600" />
            Display Language
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                  currentLanguage.code === lang.code
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300"
                    : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
                {currentLanguage.code === lang.code && (
                  <Check size={14} className="text-amber-600 ml-auto shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </KSCard>
    </div>
  );
};

export default ProviderProfile;
