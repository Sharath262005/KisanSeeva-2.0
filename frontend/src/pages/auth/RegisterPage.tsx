import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { KSButton } from "../../components/ui";
import {
  Sprout, Tractor, AlertCircle, CheckCircle2, Eye, EyeOff,
  Camera, RefreshCw, MapPin, Loader2, ArrowLeft
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

type Role = "farmer" | "provider";

const ROLE_META = {
  farmer: {
    label: "Farmer",
    emoji: "🌾",
    icon: Sprout,
    headerBg: "bg-gradient-to-br from-emerald-600 to-green-700",
    accent: "text-emerald-700",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-100",
    stepActive: "bg-green-500 border-green-500",
    stepCurrent: "border-green-500 text-green-600",
    stepBar: "bg-green-400",
    ringClass: "focus:ring-2 focus:ring-green-400/30 focus:border-green-400",
  },
  provider: {
    label: "Provider",
    emoji: "🚜",
    icon: Tractor,
    headerBg: "bg-gradient-to-br from-amber-500 to-orange-600",
    accent: "text-amber-700",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-100",
    stepActive: "bg-amber-500 border-amber-500",
    stepCurrent: "border-amber-500 text-amber-600",
    stepBar: "bg-amber-400",
    ringClass: "focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400",
  },
} as const;

/* ────────── Selfie Camera Component ────────── */
interface SelfieCameraProps {
  onCapture: (blob: Blob, dataUrl: string) => void;
}
const SelfieCamera: React.FC<SelfieCameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");

  // ── Detect native Capacitor (Android/iOS) ──────────────────────────────────
  // getUserMedia() requires HTTPS or localhost. Capacitor runs on file:// which
  // is neither — so the camera is always blocked on Android APKs via getUserMedia.
  // Solution: on native, use <input type="file" capture="user"> which opens the
  // Android native camera app directly and always works.
  const isNativePlatform = typeof window !== "undefined" &&
    Boolean((window as any).Capacitor?.isNativePlatform?.());

  // ── Web camera (works on HTTPS in a browser) ───────────────────────────────
  const startCamera = useCallback(async () => {
    if (isNativePlatform) return; // skip — native uses file input instead
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 480, height: 480 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch {
      setCameraError("Camera access denied. Please allow camera access in your browser settings.");
    }
  }, [isNativePlatform]);

  useEffect(() => {
    if (!isNativePlatform) startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startCamera, isNativePlatform]);

  // ── Native Android: handle image selected from native camera ───────────────
  const handleNativeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Convert dataUrl to Blob for upload FormData
      fetch(dataUrl)
        .then((r) => r.blob())
        .then((blob) => onCapture(blob, dataUrl));
    };
    reader.readAsDataURL(file);
  };

  // ── Web: capture frame from live video stream ──────────────────────────────
  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = canvasRef.current!.toDataURL("image/jpeg");
      onCapture(blob, url);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    }, "image/jpeg", 0.92);
  };

  // ── NATIVE ANDROID UI — opens native camera app via file input ─────────────
  if (isNativePlatform) {
    return (
      <div className="space-y-3">
        {/* Hidden native file input with capture="user" (front/selfie camera) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleNativeFileSelect}
        />
        {/* Tap area to open camera */}
        <div
          className="rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 aspect-square max-h-56 mx-auto flex flex-col items-center justify-center gap-3 cursor-pointer active:scale-95 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera size={44} className="text-slate-400" />
          <p className="text-sm text-slate-500 font-bold">Tap to Open Front Camera</p>
          <p className="text-xs text-slate-400 text-center px-4">Your front (selfie) camera will open</p>
        </div>
        <KSButton
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 justify-center flex items-center gap-2"
        >
          <Camera size={18} /> Open Camera & Take Selfie
        </KSButton>
      </div>
    );
  }

  // ── WEB BROWSER UI — getUserMedia live preview ─────────────────────────────
  if (cameraError) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 flex items-start gap-2">
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
        {cameraError}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-h-56 mx-auto flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <Loader2 className="animate-spin text-green-400" size={32} />
          </div>
        )}
        {/* Face guide overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-40 rounded-full border-2 border-white/40 border-dashed" />
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <KSButton type="button" onClick={capture} disabled={!cameraReady} className="w-full py-3 justify-center flex items-center gap-2">
        <Camera size={18} /> Take Selfie
      </KSButton>
    </div>
  );
};

/* ────────── Main RegisterPage ────────── */
const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();

  // Read role from URL param, default to farmer
  const roleParam = searchParams.get("role") as Role | null;
  const initialRole: Role = roleParam === "provider" ? "provider" : "farmer";

  // Role is fixed from URL — no tab switching
  const role: Role = initialRole;
  const meta = ROLE_META[role];
  const RoleIcon = meta.icon;

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);

  // Step 1 — Basic Info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Farmer fields
  const [farmerVillage, setFarmerVillage] = useState("");
  const [farmerDistrict, setFarmerDistrict] = useState("");
  const [farmerState, setFarmerState] = useState("");
  const [farmerLandSize, setFarmerLandSize] = useState("");
  const [farmerCrops, setFarmerCrops] = useState("");

  // Provider fields
  const [providerServiceType, setProviderServiceType] = useState("");
  const [providerMachineCount, setProviderMachineCount] = useState("");
  const [providerMachineDetails, setProviderMachineDetails] = useState("");
  const [providerArea, setProviderArea] = useState("");
  const [providerDistrict, setProviderDistrict] = useState("");
  const [providerState, setProviderState] = useState("");

  // Location coords
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  // Step 3 — Documents
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [drivingLicenseFile, setDrivingLicenseFile] = useState<File | null>(null);
  const [cameraKey, setCameraKey] = useState(0);

  const inputClass =
    `w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none ${meta.ringClass} transition text-slate-800 placeholder:text-slate-400 text-sm`;

  /* ── Step 1 validation ── */
  const handleNext = () => {
    if (!name.trim()) { setError("Please enter your full name"); return; }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) { setError("Please enter a valid 10-digit Indian phone number"); return; }
    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address"); return; }
    if (!password || password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError("");
    setStep(2);
  };

  /* ── Auto-detect location ── */
  const detectLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError("Could not detect location. Please enter your district manually.");
      }
    );
  };

  /* ── Build extraInfo string ── */
  const buildExtraInfo = () => {
    if (role === "farmer") {
      return `Village: ${farmerVillage}, District: ${farmerDistrict}, State: ${farmerState}, Land: ${farmerLandSize} acres, Crops: ${farmerCrops}`;
    } else {
      return `Service: ${providerServiceType}, Machines: ${providerMachineCount}, Details: ${providerMachineDetails}, Area of operation: ${providerArea}, District: ${providerDistrict}, State: ${providerState}`;
    }
  };

  /* ── Step 2 validation & submit ── */
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "farmer") {
      if (!farmerVillage.trim()) { setError("Village/Town name is required"); return; }
      if (!farmerDistrict.trim()) { setError("District is required"); return; }
      if (!farmerState.trim()) { setError("State is required"); return; }
      if (!farmerLandSize.trim()) { setError("Land size is required"); return; }
      if (!farmerCrops.trim()) { setError("Crops grown is required"); return; }
    } else {
      if (!providerServiceType.trim()) { setError("Service type is required"); return; }
      if (!providerMachineCount.trim()) { setError("Number of machines is required"); return; }
      if (!providerMachineDetails.trim()) { setError("Machine details are required"); return; }
      if (!providerArea.trim()) { setError("Area of operation is required"); return; }
      if (!providerDistrict.trim()) { setError("District is required"); return; }
      if (!providerState.trim()) { setError("State is required"); return; }
    }

    if (userId) { setStep(3); return; }

    const addressCity = role === "farmer" ? farmerDistrict : providerDistrict;
    const addressState = role === "farmer" ? farmerState : providerState;

    setLoading(true);
    try {
      const { user } = await authRegister({
        name: name.trim(),
        email: email.trim() ? email.trim().toLowerCase() : undefined,
        phone: phone.trim(),
        role,
        password,
        extraInfo: buildExtraInfo(),
        lat: lat ?? undefined,
        lng: lng ?? undefined,
        addressCity,
        addressState,
      });
      setUserId(user.id);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3 document upload ── */
  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadharFile) { setError("Please upload your Aadhaar card"); return; }
    if (!selfieBlob) { setError("Please take a selfie using the camera above"); return; }
    if (role === "provider" && !drivingLicenseFile) { setError("Driving license is required for service providers"); return; }
    if (!userId) { setError("Session expired. Please start over."); return; }

    const formData = new FormData();
    formData.append("userId", userId.toString());
    formData.append("aadhar", aadharFile);
    formData.append("selfie", selfieBlob, "selfie.jpg");
    if (drivingLicenseFile) formData.append("driving_license", drivingLicenseFile);

    setLoading(true);
    setError("");
    try {
      // FIX E: Use correct token key — 'ks_auth_token' not 'token'
      // The wrong key caused every upload request to go out without Authorization
      // header, resulting in a silent 401 on the upload-documents endpoint.
      const token = localStorage.getItem("ks_auth_token") || "";
      const baseUrl = (API.defaults.baseURL || "").replace("/api", "");
      const res = await fetch(`${baseUrl}/api/auth/upload-documents`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Upload failed");
      }
      navigate("/pending-approval");
    } catch (err: any) {
      setError(err.message || "Failed to upload documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SERVICE_TYPES = [
    "Tractor (Ploughing)",
    "Tractor (Rotavator)",
    "Harvester (Paddy)",
    "Harvester (Wheat)",
    "Sprayer / Pest Control",
    "Seed Sowing Machine",
    "Water Pump / Motor Repair",
    "General Machinery Repair",
    "Thresher",
    "Other",
  ];

  const stepLabels = ["Basic Info", "Details", "Verify"];

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the KisanSeeva network — India's agricultural services platform"
    >
      {/* Back to Home */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition mb-4"
      >
        <ArrowLeft size={14} /> Back to Home
      </button>

      {/* Role Identity Header */}
      <div className={`flex items-center gap-3 rounded-2xl p-4 ${meta.headerBg} text-white shadow-lg mb-6`}>
        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <RoleIcon size={22} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Registering as</p>
          <p className="text-lg font-black">{meta.emoji} {meta.label} Account</p>
        </div>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-xs font-semibold text-white/70 hover:text-white underline transition"
          >
            Change role
          </button>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${s <= step ? meta.accent : "text-slate-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  s < step
                    ? `${meta.stepActive} text-white`
                    : s === step
                    ? meta.stepCurrent
                    : "border-slate-300 text-slate-400"
                }`}
              >
                {s < step ? <CheckCircle2 size={16} /> : s}
              </div>
              <span className="text-xs font-semibold hidden sm:block">
                {stepLabels[s - 1]}
              </span>
            </div>
            {s < 3 && <div className={`flex-1 h-0.5 rounded-full transition-all ${step > s ? meta.stepBar : "bg-slate-200"}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 mb-5">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* ────────── STEP 1: Basic Info ────────── */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Phone Number * <span className="text-slate-400 font-normal">(10 digits — used to login)</span>
            </label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" maxLength={10} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-slate-400 font-normal text-xs">(Optional)</span>
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com (optional)" className={inputClass} />
            <p className="text-xs text-slate-400 mt-1">Used for password reset and notifications. You can skip this.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className={inputClass + " pr-12"}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <KSButton type="button" onClick={handleNext} className="w-full py-4 text-center justify-center">
            Continue →
          </KSButton>
        </div>
      )}

      {/* ────────── STEP 2: Role-specific Details ────────── */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-5">
          <div className={`p-4 ${meta.accentBg} border ${meta.accentBorder} rounded-2xl text-sm`}>
            <p className={`font-semibold mb-0.5 ${meta.accent}`}>Welcome, {name.split(" ")[0]}! {meta.emoji}</p>
            <p className={meta.accent}>
              {role === "farmer"
                ? "Tell us about your farm so we can connect you with the right services."
                : "Tell us about your equipment and services so farmers can find you."}
            </p>
          </div>

          {/* Location auto-detect */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-2xl">
            <MapPin size={18} className="text-blue-600 shrink-0" />
            <div className="flex-1 text-sm">
              {lat && lng
                ? <span className="text-green-700 font-semibold">✅ Location detected ({lat.toFixed(4)}, {lng.toFixed(4)})</span>
                : <span className="text-slate-600">Auto-detect your location for nearby matching</span>
              }
            </div>
            <button type="button" onClick={detectLocation} disabled={locating} className="text-xs font-bold text-blue-600 hover:text-blue-800 shrink-0 flex items-center gap-1">
              {locating ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
              {locating ? "Detecting..." : lat ? "Re-detect" : "Detect"}
            </button>
          </div>

          {role === "farmer" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Village / Town *</label>
                  <input value={farmerVillage} onChange={(e) => setFarmerVillage(e.target.value)} placeholder="e.g. Reddygudem" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">District *</label>
                  <input value={farmerDistrict} onChange={(e) => setFarmerDistrict(e.target.value)} placeholder="e.g. Warangal" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">State *</label>
                <input value={farmerState} onChange={(e) => setFarmerState(e.target.value)} placeholder="e.g. Telangana" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Total Land Size (acres) *</label>
                <input type="number" min="0.1" step="0.1" value={farmerLandSize} onChange={(e) => setFarmerLandSize(e.target.value)} placeholder="e.g. 5.5" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Crops You Grow *</label>
                <input value={farmerCrops} onChange={(e) => setFarmerCrops(e.target.value)} placeholder="e.g. Paddy, Cotton, Maize" className={inputClass} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Type *</label>
                <select value={providerServiceType} onChange={(e) => setProviderServiceType(e.target.value)} className={inputClass}>
                  <option value="">Select service type</option>
                  {SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Number of Machines *</label>
                <input type="number" min="1" value={providerMachineCount} onChange={(e) => setProviderMachineCount(e.target.value)} placeholder="e.g. 2" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Machine Details (Make & Model) *</label>
                <textarea
                  rows={3}
                  value={providerMachineDetails}
                  onChange={(e) => setProviderMachineDetails(e.target.value)}
                  placeholder="e.g. Mahindra 475 DI Tractor (2021), John Deere 5050 E"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Area of Operation (km radius) *</label>
                <input value={providerArea} onChange={(e) => setProviderArea(e.target.value)} placeholder="e.g. 20 km around Warangal" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">District *</label>
                  <input value={providerDistrict} onChange={(e) => setProviderDistrict(e.target.value)} placeholder="e.g. Karimnagar" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">State *</label>
                  <input value={providerState} onChange={(e) => setProviderState(e.target.value)} placeholder="e.g. Telangana" className={inputClass} />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3">
            <KSButton type="button" variant="outline" disabled={loading} onClick={() => { setStep(1); setError(""); }} className="w-1/3 py-4 text-center justify-center">
              ← Back
            </KSButton>
            <KSButton type="submit" disabled={loading} className="flex-1 py-4 text-center justify-center">
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="animate-spin w-4 h-4" /> Saving...
                </span>
              ) : "Next: Verify →"}
            </KSButton>
          </div>
        </form>
      )}

      {/* ────────── STEP 3: Documents & Selfie ────────── */}
      {step === 3 && (
        <form onSubmit={handleDocumentUpload} className="space-y-6">
          <div className={`p-4 ${meta.accentBg} border ${meta.accentBorder} rounded-2xl text-sm`}>
            <p className={`font-semibold mb-0.5 ${meta.accent}`}>Final Step: Identity Verification 📄</p>
            <p className={meta.accent}>Upload Aadhaar, take a live selfie, and submit for admin approval.</p>
          </div>

          {/* Aadhaar Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Aadhaar Card * <span className="text-xs font-normal text-slate-400">(JPG/PNG/PDF)</span></label>
            <div className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${aadharFile ? "border-green-400 bg-green-50" : "border-slate-200 hover:border-slate-300"}`}>
              <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => setAadharFile(e.target.files?.[0] || null)} className="hidden" id="aadhar-upload" />
              <label htmlFor="aadhar-upload" className="cursor-pointer">
                {aadharFile
                  ? <span className="text-sm font-semibold text-green-700">✅ {aadharFile.name}</span>
                  : <span className="text-sm text-slate-400">Click to upload Aadhaar</span>
                }
              </label>
            </div>
          </div>

          {/* Selfie via Camera */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Live Selfie * <span className="text-xs font-normal text-orange-500">⚠️ Camera capture only — no file uploads</span>
            </label>
            {selfiePreview ? (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-square max-h-56 mx-auto">
                  <img src={selfiePreview} alt="selfie" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">✅ Captured</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelfieBlob(null);
                    setSelfiePreview(null);
                    setCameraKey((k) => k + 1);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-2xl py-2.5 hover:bg-slate-50 transition"
                >
                  <RefreshCw size={16} /> Retake Selfie
                </button>
              </div>
            ) : (
              <SelfieCamera
                key={cameraKey}
                onCapture={(blob, dataUrl) => {
                  setSelfieBlob(blob);
                  setSelfiePreview(dataUrl);
                }}
              />
            )}
          </div>

          {/* Driving License (Provider only) */}
          {role === "provider" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Driving License * <span className="text-xs font-normal text-slate-400">(JPG/PNG/PDF)</span></label>
              <div className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${drivingLicenseFile ? "border-green-400 bg-green-50" : "border-slate-200 hover:border-slate-300"}`}>
                <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => setDrivingLicenseFile(e.target.files?.[0] || null)} className="hidden" id="dl-upload" />
                <label htmlFor="dl-upload" className="cursor-pointer">
                  {drivingLicenseFile
                    ? <span className="text-sm font-semibold text-green-700">✅ {drivingLicenseFile.name}</span>
                    : <span className="text-sm text-slate-400">Click to upload Driving License</span>
                  }
                </label>
              </div>
            </div>
          )}

          <KSButton type="submit" disabled={loading} className="w-full py-4 text-center justify-center">
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="animate-spin w-4 h-4" /> Uploading...
              </span>
            ) : "Submit for Verification 🚀"}
          </KSButton>
        </form>
      )}

      <div className="text-center text-sm text-slate-500 mt-4">
        Already have an account?{" "}
        <span onClick={() => navigate(`/login?role=${role}`)} className="font-semibold text-green-600 hover:text-green-700 hover:underline cursor-pointer">
          Sign in here
        </span>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
