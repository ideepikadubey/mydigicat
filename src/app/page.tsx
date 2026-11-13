"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Sparkles,
  QrCode,
  Smartphone,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Layers,
  Palette,
  Store,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RazorpayModal } from "@/components/RazorpayModal";
import { store } from "@/lib/store";
import { SubscriptionPlan } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function LandingPage() {
  const [profile, setProfile] = useState(store.getProfile());
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleUpdate = () => setProfile(store.getProfile());
    window.addEventListener("mydigicat_store_update", handleUpdate);
    return () => window.removeEventListener("mydigicat_store_update", handleUpdate);
  }, []);

  const faqs = [
    {
      q: "How does MyDigiCatalogue help my business get more orders?",
      a: "Instead of sending messy PDF catalogues or hundreds of individual photos, you get a clean, high-speed digital store link and QR code. Customers can browse your categories, search products instantly, and click 'Enquire on WhatsApp' with pre-filled product details and prices, allowing you to close sales directly on WhatsApp.",
    },
    {
      q: "What happens when I update my prices or add new products?",
      a: "All updates reflect instantaneously! Your customers and existing QR codes never need to change. When you edit a price or add a product from your dashboard, visitors see the changes immediately.",
    },
    {
      q: "What is the 3-day grace period?",
      a: "We understand that business owners get busy. When your prepaid cycle ends, we keep your public catalogue active for an additional 3 days (grace period) and send timely reminders so your customers never experience interruptions.",
    },
    {
      q: "How many products can I upload?",
      a: "Both our Monthly and Quarterly plans allow up to 100 active products per account with client-side automated image compression (<500KB) to ensure blazing fast loading speeds for your customers.",
    },
    {
      q: "Can I download my QR code for printed standees and packaging?",
      a: "Yes! You can download your catalogue's QR code in high-resolution PNG and scalable vector SVG formats, ready for printing on counter standees, business cards, carry bags, and invoices.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-20 lg:pt-14 lg:pb-32 overflow-hidden">
        {/* Ambient background mesh glow effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-violet-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              {/* Premium Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-blue-200/80 text-blue-700 text-xs font-heading font-bold shadow-xs hover:border-blue-300 transition-all">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span>Next-Gen Digital Catalogue Platform for Indian Businesses</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-heading font-black tracking-tight text-slate-900 leading-[1.1] sm:leading-[1.08]">
                Transform Your Products Into An{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent drop-shadow-xs">
                  Interactive Digital Catalogue
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                Ditch heavy PDFs and disorganized photo albums. Create a branded online catalogue with a permanent QR code, instant WhatsApp enquiry buttons, and live inventory sync.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                <Link
                  href="/onboarding"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-heading font-bold text-base shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2.5 group"
                >
                  <Sparkles className="w-5 h-5 text-blue-200 group-hover:rotate-12 transition-transform" />
                  <span>Create Your Catalogue</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-base border border-slate-200/90 shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 hover:border-slate-300"
                >
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Micro-Features Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-heading font-bold text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No Coding Required
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ready in 3 Minutes
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Razorpay Verified
                </span>
              </div>

              {/* Trust Metrics Bar */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-xs text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">100</p>
                  <p className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mt-0.5">Product Capacity</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-xs text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-heading font-black text-blue-600 tracking-tight">&lt; 3 Min</p>
                  <p className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mt-0.5">Setup Time</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-xs text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-heading font-black text-emerald-600 tracking-tight">100%</p>
                  <p className="text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider mt-0.5">Live Sync</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup with Floating Feature Cards */}
            <div className="lg:col-span-5 relative flex justify-center py-4">
              {/* Floating Card 1: WhatsApp Enquiry Notification */}
              <div className="absolute -top-2 -left-6 sm:-left-10 z-30 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 hidden sm:flex items-center gap-3 animate-fade-in hover:scale-105 transition-transform max-w-[240px]">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-heading font-bold text-slate-900 truncate">WhatsApp Order</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate font-medium">"I want to order Classic Satchel"</p>
                </div>
              </div>

              {/* Floating Card 2: QR Standee Badge */}
              <div className="absolute -bottom-4 -right-4 sm:-right-8 z-30 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 hidden sm:flex items-center gap-3 animate-fade-in hover:scale-105 transition-transform max-w-[220px]">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-heading font-bold text-slate-900">Printable QR Standee</p>
                  <p className="text-[10px] text-blue-600 font-medium font-mono">Scan & Browse Store</p>
                </div>
              </div>

              {/* Phone Device Frame */}
              <div className="relative w-full max-w-[360px] bg-slate-950 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Dynamic Island / Speaker */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-slate-900 ring-1 ring-slate-700 mr-2"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-950/80"></div>
                </div>

                {/* Inner Screen Preview */}
                <div className="w-full h-[580px] bg-white rounded-[38px] overflow-hidden relative shadow-inner flex flex-col">
                  {/* Top Store Header */}
                  <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 pt-9 text-center relative shadow-sm">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl mb-1.5 border border-white/30 shadow-sm">
                      YS
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <h3 className="font-heading font-black text-sm tracking-tight">Your Store Name</h3>
                      <span className="w-4 h-4 rounded-full bg-blue-400 text-white flex items-center justify-center text-[10px] font-black shadow-xs">✓</span>
                    </div>
                    <p className="text-[10px] text-blue-100 font-medium">Boutique & Retail Showroom</p>

                    {/* Icon Action Buttons */}
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 text-white flex items-center justify-center shadow-sm">
                        <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                      </span>
                      <span className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 text-white flex items-center justify-center shadow-sm text-xs font-bold">
                        📞
                      </span>
                      <span className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 text-white flex items-center justify-center shadow-sm text-xs font-bold">
                        📍
                      </span>
                      <span className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 text-white flex items-center justify-center shadow-sm text-xs font-bold">
                        🔗
                      </span>
                    </div>
                  </div>

                  {/* Category Chips */}
                  <div className="p-2.5 bg-white flex gap-1.5 overflow-x-auto border-b border-slate-100 shadow-xs">
                    <span className="text-[10px] font-heading font-bold px-3 py-1 rounded-full bg-blue-600 text-white shrink-0 shadow-xs">
                      All Items (24)
                    </span>
                    <span className="text-[10px] font-heading font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 shrink-0">
                      Bags
                    </span>
                    <span className="text-[10px] font-heading font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 shrink-0">
                      Wallets
                    </span>
                    <span className="text-[10px] font-heading font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 shrink-0">
                      Footwear
                    </span>
                  </div>

                  {/* Products Grid */}
                  <div className="p-3 grid grid-cols-2 gap-2.5 flex-1 overflow-y-auto bg-slate-50">
                    <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                      <div className="w-full h-24 bg-slate-100 rounded-xl overflow-hidden relative mb-1.5">
                        <img
                          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop&q=80"
                          alt="Leather Satchel"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] font-heading font-bold text-slate-900 line-clamp-1">Classic Satchel</p>
                        <p className="text-xs font-heading font-black text-blue-600">₹4,999</p>
                      </div>
                      <div className="mt-1.5 py-1 rounded-lg bg-slate-900 text-white font-heading font-bold text-[9px] flex items-center justify-center gap-1 shadow-xs">
                        <img src="/whatsapp.png" alt="WhatsApp" className="w-2.5 h-2.5 object-contain" />
                        <span>Enquire</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                      <div className="w-full h-24 bg-slate-100 rounded-xl overflow-hidden relative mb-1.5">
                        <img
                          src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=80"
                          alt="Leather Wallet"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] font-heading font-bold text-slate-900 line-clamp-1">RFID Bi-Fold</p>
                        <p className="text-xs font-heading font-black text-blue-600">₹1,299</p>
                      </div>
                      <div className="mt-1.5 py-1 rounded-lg bg-slate-900 text-white font-heading font-bold text-[9px] flex items-center justify-center gap-1 shadow-xs">
                        <img src="/whatsapp.png" alt="WhatsApp" className="w-2.5 h-2.5 object-contain" />
                        <span>Enquire</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                      <div className="w-full h-24 bg-slate-100 rounded-xl overflow-hidden relative mb-1.5">
                        <img
                          src="https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&auto=format&fit=crop&q=80"
                          alt="Chelsea Boots"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] font-heading font-bold text-slate-900 line-clamp-1">Chelsea Boots</p>
                        <p className="text-xs font-heading font-black text-blue-600">₹6,499</p>
                      </div>
                      <div className="mt-1.5 py-1 rounded-lg bg-slate-900 text-white font-heading font-bold text-[9px] flex items-center justify-center gap-1 shadow-xs">
                        <img src="/whatsapp.png" alt="WhatsApp" className="w-2.5 h-2.5 object-contain" />
                        <span>Enquire</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                      <div className="w-full h-24 bg-slate-100 rounded-xl overflow-hidden relative mb-1.5">
                        <img
                          src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80"
                          alt="Leather Belt"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] font-heading font-bold text-slate-900 line-clamp-1">Bridle Belt</p>
                        <p className="text-xs font-heading font-black text-blue-600">₹1,499</p>
                      </div>
                      <div className="mt-1.5 py-1 rounded-lg bg-slate-900 text-white font-heading font-bold text-[9px] flex items-center justify-center gap-1 shadow-xs">
                        <img src="/whatsapp.png" alt="WhatsApp" className="w-2.5 h-2.5 object-contain" />
                        <span>Enquire</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="p-2 bg-white border-t border-slate-100 text-center">
                    <p className="text-[9px] text-slate-400 font-heading font-semibold">
                      Powered by MyDigiCatalogue
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">
              Everything Your Store Needs
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Engineered For Effortless Catalogue Sharing
            </p>
            <p className="text-slate-600 mt-4 text-base">
              Say goodbye to outdated printed booklets. MyDigiCatalogue gives your customers an instant, interactive mobile showroom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/70 hover:shadow-xl hover:border-blue-300 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <QrCode className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instant QR Code & URL</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get a unique, permanent link <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded">/c/[slug]</code> and downloadable high-res QR codes (PNG & SVG) for tables, counters, and packaging.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/70 hover:shadow-xl hover:border-emerald-300 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <img src="/whatsapp.png" alt="WhatsApp" className="w-7 h-7 object-contain" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">1-Click WhatsApp Inquiries</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Customers tap "Enquire on WhatsApp" on any product and get a prefilled message with the exact item name, price, and details straight to your chat.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/70 hover:shadow-xl hover:border-violet-300 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Palette className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Custom Brand Theming</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Personalize with your business logo, banner, and exact brand color. Smart contrast algorithms automatically ensure crisp readability for your customers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/70 hover:shadow-xl hover:border-amber-300 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Auto Client Compression</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload images up to 5MB from your phone or desktop. Our client-side compressor automatically reduces them to under 500KB for rapid mobile loading.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/70 hover:shadow-xl hover:border-indigo-300 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Drag & Drop Category Order</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Organize your catalogue intuitively with custom categories, drag-and-drop reordering, and sticky category chips for fast visitor navigation.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/70 hover:shadow-xl hover:border-rose-300 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Visitor Analytics & Live Preview</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track how many customers view your catalogue, and test edits immediately in the built-in mobile & desktop live simulator inside your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">
              Simple 4-Step Process
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              From Setup To Live Store In Under 3 Minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-1">Pick Plan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select your preferred prepaid cycle (Monthly or Quarterly) via secure Razorpay checkout.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-1">Business Details</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your firm name, WhatsApp number, shop address, brand logo, and custom theme color.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white font-extrabold flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-1">Add Products</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Organize categories and upload up to 100 products with automatic high-speed image compression.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-1">Publish & Share</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download your QR code, share your direct WhatsApp link, and start receiving customer enquiries!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section id="pricing" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">
              Transparent Prepaid Pricing
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              One Simple Plan For Every Business
            </p>
            <p className="text-slate-600 mt-3 text-sm">
              Transparent pricing with no hidden commissions. Everything you need to run your digital catalogue.
            </p>
          </div>

          {/* Single Plan Card — centered */}
          <div className="flex justify-center max-w-7xl mx-auto">
            <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-blue-900 to-indigo-950 text-white border-2 border-blue-500 shadow-2xl w-full max-w-sm flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-[10px] px-4 py-0.5 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">
                ✦ Best Value — Only Plan
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-2xl text-white">1 Month Plan</h3>
                  <span className="text-[11px] font-bold text-blue-200 bg-blue-800/60 px-2.5 py-0.5 rounded-full border border-blue-700">
                    30 Days
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-black text-white">₹399</span>
                  <span className="text-blue-200 text-sm font-semibold">/ month</span>
                </div>
                <span className="inline-block text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-md mb-6">
                  Up to 100 Products
                </span>

                <ul className="space-y-3 text-sm text-blue-100 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Up to 100 products with photos & prices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Permanent QR Code (PNG + SVG) for print & stickers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Direct 1-click WhatsApp enquiry buttons</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited visits & pageviews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>3-day grace period on renewal</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/onboarding?plan=monthly"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 text-center"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Started — ₹399 / month</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ ACCORDION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              Have Questions? We Have Answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(prev => (prev === idx ? null : idx))}
                  className="w-full p-6 text-left font-bold text-slate-900 flex items-center justify-between gap-4"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      openFaq === idx ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Ready To Launch Your Digital Storefront Today?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto font-normal">
            Join hundreds of retail stores, artisans, and manufacturers taking orders seamlessly on WhatsApp.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="px-9 py-4 rounded-2xl bg-white text-slate-900 font-extrabold text-base shadow-2xl hover:bg-slate-100 transition-all hover:scale-105"
            >
              Start 3-Minute Setup
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-2xl bg-blue-950/40 hover:bg-blue-950/60 text-white font-bold text-base border border-white/20 backdrop-blur-md transition-all"
            >
              Open Owner Dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
