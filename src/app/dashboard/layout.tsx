"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Palette,
  QrCode,
  CreditCard,
  Store,
  ExternalLink,
  BookOpen,
  Menu,
  X,
  Sparkles,
  RotateCcw,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { store } from "@/lib/store";
import { ExpiryBanner } from "@/components/ExpiryBanner";
import { getSubscriptionDetails } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState(store.getProfile());
  const [subscription, setSubscription] = useState(store.getSubscription());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(store.getProfile());
      setSubscription(store.getSubscription());
    };
    window.addEventListener("mydigicat_store_update", handleUpdate);
    return () => window.removeEventListener("mydigicat_store_update", handleUpdate);
  }, []);

  const subDetails = getSubscriptionDetails(subscription?.end_date);

  const navItems = [
    { label: "Overview & Preview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/dashboard/products", icon: ShoppingBag },
    { label: "Categories", href: "/dashboard/categories", icon: Layers },
    { label: "Profile & Branding", href: "/dashboard/profile", icon: Palette },
    { label: "QR Code & Share", href: "/dashboard/qr-code", icon: QrCode },
    { label: "Billing & Invoices", href: "/dashboard/billing", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs">
            MD
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            {profile.firm_name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/c/${profile.slug}`}
            target="_blank"
            className="p-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold flex items-center gap-1 border border-blue-200"
          >
            <Store className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 text-slate-800 flex flex-col justify-between p-6 transition-transform duration-300 md:static md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Link href="/" className="flex items-center group py-1">
              <img
                src="/MyDigiCatalogue Digital Bookmark Logo.png"
                alt="MyDigiCatalogue"
                className="h-12 w-auto object-contain group-hover:scale-105 transition-all duration-300 drop-shadow-sm"
              />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Business Profile Quick Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200/80 flex items-center gap-3 shadow-sm hover:border-blue-200 transition-all">
            <div className="w-11 h-11 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-200/80 flex items-center justify-center p-0.5 shadow-sm">
              {profile.logo_url ? (
                <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Store className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="font-heading font-extrabold text-sm text-slate-900 truncate tracking-tight">
                  {profile.firm_name}
                </h4>
              </div>
              <p className="text-[11px] text-blue-600 font-mono font-semibold truncate tracking-tight">
                {profile.slug}.mydigicatalogue.com
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-heading font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.01]"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 hover:translate-x-0.5"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span className="tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-5 border-t border-slate-100">
          {/* Public Store Direct Link */}
          <Link
            href={`/c/${profile.slug}`}
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/80 text-xs font-heading font-bold text-blue-700 transition-all group shadow-sm hover:shadow"
          >
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-blue-600" />
              <span>Open Public Store</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {/* Subscription Status Pill */}
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex items-center justify-between text-[11px]">
            <div>
              <span className="text-slate-400 block font-medium">Plan Status:</span>
              <span
                className={`font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  subDetails.status === "active"
                    ? "text-emerald-600"
                    : subDetails.status === "grace"
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${subDetails.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                {subDetails.status}
              </span>
            </div>
            <Link
              href="/dashboard/billing"
              className="text-xs font-heading font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              Manage
            </Link>
          </div>

          {/* Logout */}
          <div>
            <Link
              href="/login"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("mydigicat_auth_user");
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-heading font-bold border border-slate-200/80 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <ExpiryBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
