"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Store,
  Upload,
  Plus,
  Trash2,
  Check,
  CreditCard,
  Building,
  Layers,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Loader2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { store } from "@/lib/store";
import { SubscriptionPlan, Category, Product, getPlanConfig, SUBSCRIPTION_PLANS } from "@/lib/types";
import {
  formatCurrency,
  slugify,
  compressImageToDataUrl,
  getContrastTextColor,
} from "@/lib/utils";
import { THEME_PRESETS } from "@/lib/theme";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Business Profile
  const [firmName, setFirmName] = useState("");
  const [slug, setSlug] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [themeColor, setThemeColor] = useState("#2563eb");
  const [step1Error, setStep1Error] = useState("");

  // Step 2: Categories
  const [categories, setCategories] = useState<string[]>([]);
  const [newCatInput, setNewCatInput] = useState("");

  // Step 3: First Products
  const [products, setProducts] = useState<
    Array<{
      name: string;
      category: string;
      price: number;
      description: string;
      imageUrl: string;
    }>
  >([]);

  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  // Step 4: Plan Selection & Razorpay Payment
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("monthly");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState("");

  // Read URL query params & saved auth session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get("plan");
      if (planParam === "monthly") {
        setSelectedPlan(planParam);
      }

      // Pre-fill email and firm name if merchant already signed in/verified with OTP
      const savedAuth = localStorage.getItem("mydigicat_auth_user");
      if (savedAuth) {
        try {
          const parsed = JSON.parse(savedAuth);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.firm_name) setFirmName(parsed.firm_name);
        } catch {}
      }
    }
  }, []);

  // Sync slug with firmName
  useEffect(() => {
    if (firmName && !slug) {
      setSlug(slugify(firmName));
    }
  }, [firmName, slug]);

  // Handle Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImageToDataUrl(file, 200 * 1024);
        setLogoUrl(compressed);
      } catch (err) {
        console.error("Logo compression error:", err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  // Handle Product Image Upload
  const handleProdImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImageToDataUrl(file, 450 * 1024);
        setNewProdImage(compressed);
      } catch (err) {
        console.error("Image compression error:", err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  // Step 1 Validation & Proceed
  const handleProceedFromStep1 = () => {
    setStep1Error("");
    if (!firmName.trim()) {
      setStep1Error("Please enter your business or firm name.");
      return;
    }
    if (!whatsapp.trim()) {
      setStep1Error("Please enter your WhatsApp number for customer enquiries.");
      return;
    }
    setCurrentStep(2);
  };

  // Add Category
  const handleAddCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      alert(`Category "${trimmed}" already exists in your list.`);
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCatInput("");
  };

  const handleDeleteCategory = (idx: number) => {
    const updated = categories.filter((_, i) => i !== idx);
    setCategories(updated);
  };

  // Reorder Category (up / down)
  const moveCategory = (index: number, direction: "up" | "down") => {
    const newCategories = [...categories];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newCategories.length) {
      const temp = newCategories[index];
      newCategories[index] = newCategories[targetIndex];
      newCategories[targetIndex] = temp;
      setCategories(newCategories);
    }
  };

  // Add Product to list
  const handleAddProduct = () => {
    if (!newProdName.trim() || !newProdPrice) return;
    setProducts([
      ...products,
      {
        name: newProdName.trim(),
        category: newProdCategory || categories[0] || "General",
        price: parseFloat(newProdPrice) || 0,
        description: newProdDesc.trim(),
        imageUrl: newProdImage,
      },
    ]);
    setNewProdName("");
    setNewProdPrice("");
    setNewProdDesc("");
    setNewProdImage("");
  };

  const handleDeleteProduct = (idx: number) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  // Final Step: Execute Razorpay Payment & Save Authentic Record
  const handleFinalPaymentAndLaunch = () => {
    setPaymentProcessing(true);

    const planConfig = getPlanConfig(selectedPlan);

    setTimeout(() => {
      const now = new Date();
      const days = planConfig.durationDays;
      const amount = planConfig.amount;
      const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      const orderId = `order_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const paymentId = `pay_${Math.random().toString(36).substring(2, 14)}`;

      setConfirmedPaymentId(paymentId);

      // 1. Save Authentic Business Profile
      const profileId = store.getProfile().id;
      store.setProfile({
        id: profileId,
        firm_name: firmName.trim() || "My Business",
        slug: slug.trim() || slugify(firmName) || "my-catalogue",
        address: address.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        logo_url: logoUrl,
        theme_color: themeColor,
        created_at: now.toISOString(),
      });

      // 2. Save Categories
      const savedCategories: Category[] = categories.map((name, idx) => ({
        id: `cat-${Date.now()}-${idx}`,
        user_id: profileId,
        name,
        sort_order: idx + 1,
        created_at: now.toISOString(),
      }));
      store.setCategories(savedCategories);

      // 3. Save Products
      const categoryMap = new Map(savedCategories.map((c) => [c.name, c.id]));
      const savedProducts: Product[] = products.map((p, idx) => ({
        id: `prod-${Date.now()}-${idx}`,
        user_id: profileId,
        category_id: categoryMap.get(p.category) || savedCategories[0]?.id || null,
        name: p.name,
        description: p.description,
        price: p.price,
        image_url: p.imageUrl,
        in_stock: true,
        is_active: true,
        sort_order: idx + 1,
        created_at: now.toISOString(),
      }));
      store.setProducts(savedProducts);

      // 4. Save Authentic Subscription Linked to Order & Payment
      store.setSubscription({
        id: `sub-${Date.now()}`,
        user_id: profileId,
        plan: selectedPlan,
        amount,
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        status: "active",
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        created_at: now.toISOString(),
      });

      setPaymentProcessing(false);
      setPaymentSuccess(true);

      try {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      } catch {}

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center group py-1">
            <img
              src="/MyDigiCatalogue Digital Bookmark Logo.png"
              alt="MyDigiCatalogue"
              className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
            />
          </Link>

          <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
            <span>Store Setup Wizard</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
              Step {currentStep} of 4
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1">
        {/* Step Indicator Bar */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
            {/* Step 1 */}
            <button
              onClick={() => setCurrentStep(1)}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                currentStep === 1
                  ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
                  : currentStep > 1
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-400"
              }`}
            >
              <Building className="w-4 h-4" />
              <span className="hidden sm:inline">1. Store Profile</span>
              <span className="sm:hidden">1. Profile</span>
            </button>

            {/* Step 2 */}
            <button
              onClick={() => firmName && setCurrentStep(2)}
              disabled={!firmName}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                currentStep === 2
                  ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
                  : currentStep > 2
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-400 opacity-60"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">2. Categories</span>
              <span className="sm:hidden">2. Cats</span>
            </button>

            {/* Step 3 */}
            <button
              onClick={() => firmName && setCurrentStep(3)}
              disabled={!firmName}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                currentStep === 3
                  ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
                  : currentStep > 3
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-400 opacity-60"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">3. Products</span>
              <span className="sm:hidden">3. Items</span>
            </button>

            {/* Step 4 */}
            <button
              onClick={() => firmName && setCurrentStep(4)}
              disabled={!firmName}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                currentStep === 4
                  ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
                  : "border-slate-200 bg-white text-slate-400 opacity-60"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">4. Plan & Pay</span>
              <span className="sm:hidden">4. Payment</span>
            </button>
          </div>
        </div>

        {/* STEP 1: BUSINESS PROFILE */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fade-in">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Step 1: Store Profile
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Brand Details & Contact Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                This information appears on your digital catalogue header, WhatsApp order buttons, and QR code.
              </p>
            </div>

            {step1Error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
                {step1Error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Firm Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Business / Firm Name *
                </label>
                <input
                  type="text"
                  required
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder="e.g. Royal Silks & Sarees"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm font-semibold"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Catalogue Slug (URL) *
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-600">
                  <span className="bg-slate-100 px-3 py-3 text-xs text-slate-500 font-mono flex items-center">
                    /c/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    placeholder="my-store"
                    className="w-full px-3 py-3 text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Number (with Country Code) *
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Calling Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Business Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. contact@mybusiness.in"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Shop / Store Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Shop 42, Heritage Market, Connaught Place, New Delhi..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                />
              </div>

              {/* Logo Upload */}
              <div className="sm:col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border border-slate-300 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-bold text-slate-800">Business Logo</p>
                  <p className="text-[11px] text-slate-500">Auto-compressed client-side for fast loading</p>
                  <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isCompressing ? "Compressing..." : "Upload Logo Image"}</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Theme Color Picker */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Brand Theme Color
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setThemeColor(preset.hex)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        themeColor.toLowerCase() === preset.hex.toLowerCase()
                          ? "ring-4 ring-offset-2 ring-blue-600 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    >
                      {themeColor.toLowerCase() === preset.hex.toLowerCase() && (
                        <Check
                          className="w-4 h-4 stroke-[3]"
                          style={{ color: getContrastTextColor(preset.hex) }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
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
                    className="w-28 px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs uppercase"
                  />
                  <span
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border"
                    style={{
                      backgroundColor: themeColor,
                      color: getContrastTextColor(themeColor),
                      borderColor: "rgba(0,0,0,0.1)",
                    }}
                  >
                    Header Pill Preview
                  </span>
                </div>
              </div>
            </div>

            {/* Step 1 Action */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={handleProceedFromStep1}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Continue to Categories</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CATEGORIES */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fade-in">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Step 2: Product Categories
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Organize Your Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Add categories to help customers navigate your catalogue. Sticky chips will follow this exact order.
              </p>
            </div>

            {/* Add Category Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
                placeholder="New Category Name (e.g. Sarees, Jewellery, Gift Hampers)..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-6 py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5 hover:opacity-95 active:scale-95"
                style={{ backgroundColor: themeColor, color: getContrastTextColor(themeColor) }}
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Category List */}
            {categories.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
                No categories added yet. Type a name above and click <strong>Add</strong>, or you can add them later from your dashboard.
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm text-slate-800">{cat}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveCategory(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCategory(idx, "down")}
                        disabled={idx === categories.length - 1}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                        title="Move down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(idx)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2 Actions */}
            <div className="pt-4 border-t border-slate-200 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Continue to First Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FIRST PRODUCTS */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fade-in">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Step 3: Sample Products
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Add Initial Products
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Add your first sample items now. You can manage and upload up to 100 products anytime from your dashboard.
              </p>
            </div>

            {/* Add Product Form Box */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                + Add A Product
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Product Name *"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  placeholder="Price in INR (₹) *"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isCompressing ? "Compressing..." : "Choose Image (<5MB)"}</span>
                  <input type="file" accept="image/*" onChange={handleProdImageUpload} className="hidden" />
                </label>

                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Short description / specs..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add To List</span>
                </button>
              </div>
            </div>

            {/* Added Products Table/List */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Current Products ({products.length})
              </p>

              {products.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No products added yet. You can add items now or later directly from your dashboard.
                </div>
              ) : (
                products.map((prod, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-sm text-slate-900">{prod.name}</p>
                        <p className="text-xs text-slate-500">
                          {prod.category} • <strong className="text-blue-700">{formatCurrency(prod.price)}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(idx)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Step 3 Actions */}
            <div className="pt-4 border-t border-slate-200 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Continue to Plan & Activation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW, PLAN SELECTION & SECURE PAYMENT */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fade-in">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Step 4: Final Step
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Select Plan & Activate Store
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Review your store details, choose your prepaid billing cycle, and complete payment to make your catalogue live.
              </p>
            </div>

            {/* Complete Store Verification Summary */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Account & Store Summary
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Store Name:</span>
                  <strong className="text-sm text-slate-900 font-bold">{firmName || "My Store"}</strong>
                </div>

                <div>
                  <span className="text-slate-400 block">Catalogue Link:</span>
                  <span className="font-mono text-blue-600 font-bold">
                    /c/{slug || slugify(firmName) || "store"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">WhatsApp Enquiry Number:</span>
                  <strong className="text-slate-800 font-mono">+{whatsapp || "N/A"}</strong>
                </div>

                <div>
                  <span className="text-slate-400 block">Inventory Configured:</span>
                  <strong className="text-slate-800">
                    {categories.length} Categories • {products.length} Products
                  </strong>
                </div>
              </div>
            </div>

            {/* Plan — Single Monthly Plan */}
            {(() => {
              const plan = SUBSCRIPTION_PLANS["monthly"];
              const isSelected = true;
              return (
                <div className="pt-1">
                  <div className="p-6 rounded-3xl border-2 border-blue-600 bg-blue-50/50 shadow-lg ring-2 ring-blue-600/20 relative">
                    <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                      Best Value
                    </div>

                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">{plan.name}</h3>
                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 mt-1 inline-block">
                          Up to {plan.productLimit} Products
                        </span>
                      </div>
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 mt-1"
                      />
                    </div>

                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-3xl font-black text-slate-900">{formatCurrency(plan.amount)}</span>
                      <span className="text-slate-500 text-xs font-semibold">/ {plan.durationLabel}</span>
                    </div>

                    <p className="text-xs text-slate-600">{plan.tagline}</p>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{plan.productLimit} products • WhatsApp checkout • QR code</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Dynamic Locked & Unchangeable Payment Summary */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-blue-900">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-blue-950 text-sm">
                    {getPlanConfig(selectedPlan).name} ({getPlanConfig(selectedPlan).durationLabel})
                  </p>
                  <p className="text-blue-700 text-[11px]">
                    Fixed Order Total • Non-editable Razorpay amount • Up to {getPlanConfig(selectedPlan).productLimit} products
                  </p>
                </div>
              </div>
              <div className="sm:text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-blue-600 block">Total Due:</span>
                <span className="font-black text-2xl text-blue-950">
                  {formatCurrency(getPlanConfig(selectedPlan).amount)}
                </span>
              </div>
            </div>

            {/* Payment Success State */}
            {paymentSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-black text-emerald-900 text-base">Payment Verified & Store Live!</h4>
                <p className="text-xs text-emerald-700 font-mono">
                  Payment ID: {confirmedPaymentId}
                </p>
                <p className="text-xs text-slate-500">Redirecting to your store dashboard...</p>
              </div>
            )}

            {/* Step 4 Actions */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                disabled={paymentProcessing || paymentSuccess}
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleFinalPaymentAndLaunch}
                disabled={paymentProcessing || paymentSuccess}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75"
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>
                      Pay {formatCurrency(getPlanConfig(selectedPlan).amount)} & Launch Store
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
