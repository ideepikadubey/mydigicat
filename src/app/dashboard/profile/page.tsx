"use client";

import { useState, useEffect } from "react";
import {
  Palette,
  Upload,
  Store,
  Check,
  Save,
  Globe,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
  Image,
  X,
} from "lucide-react";
import { store } from "@/lib/store";
import { Profile } from "@/lib/types";
import { slugify, compressImageToDataUrl, getContrastTextColor } from "@/lib/utils";
import { THEME_PRESETS, ThemePreset } from "@/lib/theme";

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile>(store.getProfile());
  const [firmName, setFirmName] = useState(profile.firm_name);
  const [slug, setSlug] = useState(profile.slug);
  const [address, setAddress] = useState(profile.address);
  const [phone, setPhone] = useState(profile.phone);
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp);
  const [email, setEmail] = useState(profile.email);
  const [logoUrl, setLogoUrl] = useState(profile.logo_url);
  const [bannerUrl, setBannerUrl] = useState(profile.banner_url || "");
  const [themeColor, setThemeColor] = useState(profile.theme_color || "#854d0e");

  const [activeTab, setActiveTab] = useState<"all" | "Luxury" | "Artisanal" | "Classic" | "Modern">("all");
  const [isCompressing, setIsCompressing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [slugError, setSlugError] = useState("");

  useEffect(() => {
    const current = store.getProfile();
    setProfile(current);
    setFirmName(current.firm_name);
    setSlug(current.slug);
    setAddress(current.address);
    setPhone(current.phone);
    setWhatsapp(current.whatsapp);
    setEmail(current.email);
    setLogoUrl(current.logo_url);
    setBannerUrl(current.banner_url || "");
    setThemeColor(current.theme_color || "#854d0e");
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImageToDataUrl(file, 250 * 1024);
        setLogoUrl(compressed);
        // Instant sync to store
        const currentProfile = store.getProfile();
        store.setProfile({ ...currentProfile, logo_url: compressed });
      } catch (err) {
        console.error("Logo compression error:", err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl("");
    const currentProfile = store.getProfile();
    store.setProfile({ ...currentProfile, logo_url: "" });
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImageToDataUrl(file, 600 * 1024);
        setBannerUrl(compressed);
        const currentProfile = store.getProfile();
        store.setProfile({ ...currentProfile, banner_url: compressed });
      } catch (err) {
        console.error("Banner compression error:", err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleRemoveBanner = () => {
    setBannerUrl("");
    const currentProfile = store.getProfile();
    store.setProfile({ ...currentProfile, banner_url: "" });
  };

  const handleSlugChange = (val: string) => {
    const cleanSlug = slugify(val);
    setSlug(cleanSlug);
    if (!cleanSlug) {
      setSlugError("Slug cannot be empty");
    } else {
      setSlugError("");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) {
      setSlugError("Slug is required");
      return;
    }

    const updatedProfile: Profile = {
      ...profile,
      firm_name: firmName.trim() || "My Business",
      slug: slug.trim(),
      address: address.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      logo_url: logoUrl,
      banner_url: bannerUrl,
      theme_color: themeColor,
      updated_at: new Date().toISOString(),
    };

    store.setProfile(updatedProfile);
    setProfile(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const contrastColor = getContrastTextColor(themeColor);
  const filteredPresets = activeTab === "all"
    ? THEME_PRESETS
    : THEME_PRESETS.filter((p) => p.category === activeTab);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Brand Identity & Color Themes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Choose your signature brand palette, upload store logo, and customize contact links.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold animate-fade-in shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved & Store Updated!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Curated Theme Color Palette */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                <span>Curated Business Color Palettes</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Specially tailored for Indian retail, artisanal craftsmanship, and luxury boutiques.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              {(["all", "Luxury", "Artisanal", "Classic", "Modern"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg transition-all capitalize ${
                    activeTab === tab
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Presets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredPresets.map((preset) => {
              const isSelected = themeColor.toLowerCase() === preset.hex.toLowerCase();
              const presetContrast = getContrastTextColor(preset.hex);

              return (
                <div
                  key={preset.id}
                  onClick={() => setThemeColor(preset.hex)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden group ${
                    isSelected
                      ? "border-slate-900 bg-slate-50 shadow-md ring-2 ring-slate-900/10 scale-[1.02]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="w-8 h-8 rounded-xl shadow flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: preset.hex }}
                    >
                      {isSelected && (
                        <Check
                          className="w-4 h-4 stroke-[3]"
                          style={{ color: presetContrast }}
                        />
                      )}
                    </span>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {preset.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 leading-tight">
                      {preset.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase">
                      {preset.hex}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Hex Input & Live Dynamic Contrast Header Preview */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="block text-xs font-bold text-slate-700">Custom Hex:</label>
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-28 px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs uppercase font-bold"
                />
              </div>

              <span className="text-[11px] font-semibold text-slate-500">
                Luminance Contrast: <strong className="text-slate-800">{contrastColor === "#ffffff" ? "Light on Dark (White)" : "Dark on Light (Black)"}</strong>
              </span>
            </div>

            {/* Live Minimalist Glassmorphic Card Live Preview */}
            <div className="relative p-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
              {/* Top Accent Shimmer Line */}
              <div
                className="absolute top-0 inset-x-0 h-[3px] opacity-85"
                style={{
                  background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)`,
                }}
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative group shrink-0">
                    <div
                      className="absolute -inset-0.5 rounded-xl opacity-30 blur-xs"
                      style={{ backgroundColor: themeColor }}
                    />
                    <div className="relative w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-xs shadow-xs">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white font-black text-sm"
                          style={{ backgroundColor: themeColor }}
                        >
                          {firmName.slice(0, 2).toUpperCase() || "MD"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-sm text-slate-900 font-heading">
                        {firmName || "Store Header Live Preview"}
                      </h4>
                      <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-black">
                        ✓
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Minimalist Glassmorphic Card • Theme accents prices & category filters
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-wider text-white shadow-xs"
                    style={{ backgroundColor: themeColor }}
                  >
                    Theme Accent
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-inner relative group">
              {logoUrl ? (
                <img src={logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
              ) : (
                <Store className="w-9 h-9 text-slate-400" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div>
                <p className="text-sm font-black text-slate-900">Store Logo & Brand Icon</p>
                <p className="text-xs text-slate-500">
                  Upload your shop / brand logo. It appears at the top of your catalogue and QR standees.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-95">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isCompressing ? "Compressing..." : logoUrl ? "Change Logo" : "Upload Store Logo"}</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>

                {logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="px-3 py-2 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl text-xs font-bold transition-colors"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Banner Image Upload */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Image className="w-4 h-4 text-indigo-600" />
                Header Banner Image
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full uppercase">Premium Look</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload a wide banner photo (store front, products, lifestyle shot) — displayed as the full header background of your catalogue. Recommended: 1200×400px or wider.
              </p>
            </div>

            {/* Banner Preview */}
            <div className="relative w-full h-32 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-100 flex items-center justify-center">
              {bannerUrl ? (
                <>
                  <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-3 text-white text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    Banner Preview
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveBanner}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors"
                    title="Remove banner"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <Image className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                  <p className="text-xs text-slate-400 font-medium">No banner uploaded yet</p>
                  <p className="text-[10px] text-slate-300">Plain theme colour will be used as background</p>
                </div>
              )}
            </div>

            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-95">
              <Upload className="w-3.5 h-3.5" />
              <span>{isCompressing ? "Compressing..." : bannerUrl ? "Change Banner" : "Upload Banner Image"}</span>
              <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Card 2: Contact & Store Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-600" />
            <span>Store & Contact Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Firm Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Business / Firm Name *
              </label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Subdomain Slug */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Custom Store Subdomain *
              </label>
              <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 bg-white shadow-xs">
                <span className="bg-slate-100 px-3.5 py-2.5 text-xs text-slate-500 font-mono flex items-center border-r border-slate-200">
                  https://
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="your-shop-name"
                  className="w-full px-3 py-2.5 text-xs font-mono focus:outline-none font-bold text-slate-900"
                />
                <span className="bg-slate-100 px-3.5 py-2.5 text-xs text-indigo-700 font-bold font-mono flex items-center border-l border-slate-200 shrink-0">
                  .mydigicatalogue.com
                </span>
              </div>
              {slugError ? (
                <p className="text-xs text-red-600 mt-1.5 font-bold">{slugError}</p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Your store will be instantly accessible at: <span className="font-mono font-bold text-indigo-600">https://{slug || "your-shop"}.mydigicatalogue.com</span>
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                WhatsApp Number (with country code) *
              </label>
              <div className="relative">
                <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="919876543210"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Calling Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Business Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@artisanleather.in"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Store Location / Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop address for Google Maps directions button..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 text-white font-black text-xs rounded-2xl shadow-xl transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: themeColor, color: contrastColor }}
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Apply Theme</span>
          </button>
        </div>
      </form>
    </div>
  );
}
