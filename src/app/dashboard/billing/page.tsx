"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  AlertTriangle,
  Clock,
  Zap,
  RotateCcw,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { store } from "@/lib/store";
import { Subscription, Profile, SubscriptionPlan, getPlanConfig, SUBSCRIPTION_PLANS } from "@/lib/types";
import { formatCurrency, getSubscriptionDetails } from "@/lib/utils";
import { RazorpayModal } from "@/components/RazorpayModal";
import { InvoiceModal } from "@/components/InvoiceModal";

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription>(store.getSubscription());
  const [profile, setProfile] = useState<Profile>(store.getProfile());

  // Modal states
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("monthly");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setSubscription(store.getSubscription());
      setProfile(store.getProfile());
    };
    window.addEventListener("mydigicat_store_update", handleUpdate);
    return () => window.removeEventListener("mydigicat_store_update", handleUpdate);
  }, []);

  const subDetails = getSubscriptionDetails(subscription?.end_date);

  const handleOpenRenew = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsPayModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Subscription & Billing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your prepaid subscription plan, view invoice history, and simulate expiry states.
          </p>
        </div>

        <button
          onClick={() => setIsInvoiceModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <FileText className="w-4 h-4" />
          <span>View Tax Invoice</span>
        </button>
      </div>

      {/* Current Active Plan Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/40 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                Current Plan
              </span>
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                  subDetails.status === "active"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : subDetails.status === "grace"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-red-500/20 text-red-300 border-red-500/30"
                }`}
              >
                Status: {subDetails.status}
              </span>
            </div>

            <h2 className="text-3xl font-black capitalize">{subscription.plan} Subscription</h2>
            <p className="text-sm text-blue-200">
              Capacity: Up to 100 products • Unlimited page views • WhatsApp lead generation
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>
                  Started:{" "}
                  {subscription.start_date
                    ? new Date(subscription.start_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Not Activated"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>
                  Expires:{" "}
                  {subscription.end_date
                    ? new Date(subscription.end_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-left md:text-right space-y-3">
            <div>
              <span className="text-3xl font-black">{formatCurrency(subscription.amount)}</span>
              <p className="text-xs text-blue-300 mt-0.5">Prepaid Cycle</p>
            </div>
            <button
              onClick={() => handleOpenRenew("monthly")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/30 transition-transform hover:scale-105"
            >
              Extend / Renew Subscription
            </button>
          </div>
        </div>
      </div>

      {/* PLAN — Single Monthly Plan */}
      {(() => {
        const plan = SUBSCRIPTION_PLANS["monthly"];
        return (
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4">
              Your Plan
            </h3>

            <div className="relative p-6 sm:p-8 rounded-3xl border-2 border-blue-500 bg-white shadow-lg max-w-md">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow">
                Best Value
              </div>

              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-extrabold text-lg text-slate-900">{plan.name}</h4>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200 mt-1 inline-block">
                    Up to {plan.productLimit} Products
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {plan.durationLabel}
                </span>
              </div>

              <p className="text-3xl font-black text-slate-900 mb-1">{formatCurrency(plan.amount)}</p>
              <p className="text-xs text-slate-500 mb-5">{plan.tagline}</p>

              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Up to 100 active products with instant photo compressor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Permanent QR Code + 1-Click WhatsApp Direct Inquiries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3-day grace period protection upon renewal cycle</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => handleOpenRenew("monthly")}
                className="w-full py-3.5 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Activate / Renew — {formatCurrency(plan.amount)}</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* INTERACTIVE EXPIRY LIFECYCLE SIMULATOR */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-amber-600 fill-amber-500" />
          <h3 className="font-black text-base text-amber-950">
            Subscription Lifecycle Testing Panel (SaaS Verification)
          </h3>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          Switch between subscription phases in 1-click to verify reminder banners (7-day, 1-day), 3-day grace period behavior, and expired store handling:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
          <button
            onClick={() => store.simulatePlanStatus("active")}
            className="p-3 rounded-xl bg-white border border-amber-300 hover:bg-emerald-50 hover:border-emerald-400 text-xs font-bold text-slate-800 text-center transition-all shadow-sm"
          >
            <span className="block text-emerald-600">● Active</span>
            <span className="text-[10px] text-slate-500">45 Days Left</span>
          </button>

          <button
            onClick={() => store.simulatePlanStatus("warning-7d")}
            className="p-3 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-xs font-bold text-slate-800 text-center transition-all shadow-sm"
          >
            <span className="block text-amber-600">▲ 7-Day Warning</span>
            <span className="text-[10px] text-slate-500">Banner Alert</span>
          </button>

          <button
            onClick={() => store.simulatePlanStatus("warning-1d")}
            className="p-3 rounded-xl bg-white border border-amber-300 hover:bg-orange-100 text-xs font-bold text-slate-800 text-center transition-all shadow-sm"
          >
            <span className="block text-orange-600">▲ 1-Day Warning</span>
            <span className="text-[10px] text-slate-500">Critical Alert</span>
          </button>

          <button
            onClick={() => store.simulatePlanStatus("grace")}
            className="p-3 rounded-xl bg-white border border-amber-300 hover:bg-amber-200 text-xs font-bold text-slate-800 text-center transition-all shadow-sm"
          >
            <span className="block text-amber-700">⏳ 3-Day Grace</span>
            <span className="text-[10px] text-slate-500">Catalogue Live</span>
          </button>

          <button
            onClick={() => store.simulatePlanStatus("expired")}
            className="p-3 rounded-xl bg-white border border-amber-300 hover:bg-red-50 hover:border-red-400 text-xs font-bold text-slate-800 text-center transition-all shadow-sm"
          >
            <span className="block text-red-600">✖ Expired</span>
            <span className="text-[10px] text-slate-500">Unavailable Screen</span>
          </button>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900">Payment & Transaction History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Plan</th>
                <th className="py-3 px-3">Order / Payment ID</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscription.razorpay_payment_id || subscription.amount > 0 ? (
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {new Date(subscription.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-3 font-bold capitalize text-slate-900">
                    {subscription.plan}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    {subscription.razorpay_payment_id || subscription.razorpay_order_id || "N/A"}
                  </td>
                  <td className="py-3 px-3 font-black text-slate-900">
                    {formatCurrency(subscription.amount)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      Paid
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setIsInvoiceModalOpen(true)}
                      className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No transaction history recorded yet. Choose a plan above to activate via Razorpay.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Razorpay Modal */}
      <RazorpayModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        selectedPlan={selectedPlan}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        subscription={subscription}
        profile={profile}
      />
    </div>
  );
}
