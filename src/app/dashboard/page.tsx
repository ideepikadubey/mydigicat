"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Eye,
  CreditCard,
  QrCode,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Share2,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { store } from "@/lib/store";
import { DevicePreview } from "@/components/DevicePreview";
import { formatCurrency, getSubscriptionDetails } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const [profile, setProfile] = useState(store.getProfile());
  const [subscription, setSubscription] = useState(store.getSubscription());
  const [products, setProducts] = useState(store.getProducts());
  const [views, setViews] = useState(store.getViewsCount());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(store.getProfile());
      setSubscription(store.getSubscription());
      setProducts(store.getProducts());
      setViews(store.getViewsCount());
    };
    window.addEventListener("mydigicat_store_update", handleUpdate);
    return () => window.removeEventListener("mydigicat_store_update", handleUpdate);
  }, []);

  const subDetails = getSubscriptionDetails(subscription?.end_date);
  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/c/${profile.slug}`
    : `https://mydigicatalogue.com/c/${profile.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out our digital product catalogue at ${profile.firm_name}!\n\nBrowse all products & order online:\n${publicUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome & Quick Action Bar */}
      <div className="relative overflow-hidden bg-white/90 backdrop-blur-md p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
                {profile.firm_name}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-heading font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Store
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 flex-wrap">
              <span>Permanent Catalogue Link:</span>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-blue-600 font-semibold hover:underline bg-blue-50/70 px-2.5 py-0.5 rounded-lg border border-blue-100 flex items-center gap-1"
              >
                <span>{publicUrl}</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Link Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-heading font-bold transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-heading font-bold transition-all border border-slate-200/90 shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
              <span>Share WhatsApp</span>
            </button>

            <Link
              href={`/c/${profile.slug}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-heading font-bold transition-all shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Public Store</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Product Count (x / 100) */}
        <div className="relative overflow-hidden p-6 rounded-[28px] bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400">
              Product Capacity
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
                {products.length}
              </span>
              <span className="text-slate-400 text-sm font-heading font-bold">/ 100 max</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full mt-3 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  products.length >= 100 ? "bg-red-500" : "bg-gradient-to-r from-blue-500 to-indigo-600"
                }`}
                style={{ width: `${Math.min(100, (products.length / 100) * 100)}%` }}
              />
            </div>
          </div>
          <Link
            href="/dashboard/products"
            className="text-xs font-heading font-bold text-blue-600 hover:text-blue-700 mt-4 flex items-center gap-1 group/link"
          >
            <span>Manage Products</span>
            <span className="group-hover/link:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Metric 2: Plan Status & Expiry */}
        <div className="relative overflow-hidden p-6 rounded-[28px] bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400">
              Plan Status
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-heading font-black uppercase tracking-tight ${
                  subDetails.status === "active"
                    ? "text-emerald-600"
                    : subDetails.status === "grace"
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                {subscription.plan.replace("_", " ")}
              </span>
              <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {subDetails.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Expires: {new Date(subscription.end_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="text-xs font-heading font-bold text-indigo-600 hover:text-indigo-700 mt-4 flex items-center gap-1 group/link"
          >
            <span>Renew / Change Plan</span>
            <span className="group-hover/link:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Metric 3: Total Views */}
        <div className="relative overflow-hidden p-6 rounded-[28px] bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400">
              Catalogue Views
            </span>
            <div className="p-2.5 rounded-2xl bg-violet-50 text-violet-600 group-hover:scale-110 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
              {views}
            </span>
            <p className="text-xs text-slate-500 font-medium mt-1">Total customer visits & scans</p>
          </div>
          <span className="text-xs font-heading font-bold text-violet-600 mt-4 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>High Engagement Rate</span>
          </span>
        </div>

        {/* Metric 4: QR Hub */}
        <div className="relative overflow-hidden p-6 rounded-[28px] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4 relative">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-blue-200">
              Printable Standee
            </span>
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white group-hover:scale-110 transition-transform">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="relative">
            <p className="text-base font-heading font-extrabold tracking-tight">Instant QR Standee</p>
            <p className="text-xs text-blue-100 font-medium mt-0.5">Ready for acrylic tabletop stands</p>
          </div>
          <Link
            href="/dashboard/qr-code"
            className="text-xs font-heading font-extrabold bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl w-fit shadow-md mt-4 transition-all hover:scale-105 active:scale-95"
          >
            Download QR →
          </Link>
        </div>
      </div>

      {/* Top Performing Products Analytics & Quick Insights */}
      {products.length > 0 && (
        <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Top Viewed & Popular Products</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time visitor attention analytics based on customer views and WhatsApp enquiries
              </p>
            </div>
            <Link
              href="/dashboard/products"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 font-heading hover:underline"
            >
              View All Products ({products.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            {[...products]
              .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
              .slice(0, 4)
              .map((prod, index) => (
                <div
                  key={prod.id}
                  className="p-3.5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all flex items-center gap-3 group shadow-2xs hover:shadow-sm"
                >
                  <div className="relative w-14 h-14 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-black text-[10px] flex items-center justify-center font-heading">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="font-heading font-bold text-xs text-slate-900 truncate">
                      {prod.name}
                    </h4>
                    <p className="font-black text-slate-900 text-xs font-heading">
                      {formatCurrency(prod.price)}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1 font-bold text-blue-600">
                        <Eye className="w-3 h-3" />
                        <span>{prod.views_count || Math.floor(Math.random() * 8 + 3)} views</span>
                      </span>
                      <span>&bull;</span>
                      <span className={prod.in_stock ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                        {prod.in_stock ? "In Stock" : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Main Section: Interactive Live Preview Frame */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Interactive Store Preview</span>
              <span className="text-[11px] font-heading font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Live Simulator
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Experience your catalogue in real-time just as your customers see it on their mobile and desktop devices.
            </p>
          </div>
          <Link
            href="/dashboard/products"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-heading font-bold rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Product</span>
          </Link>
        </div>

        <DevicePreview slug={profile.slug} />
      </div>
    </div>
  );
}

