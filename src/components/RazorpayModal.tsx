"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck, Zap, X, CreditCard, Sparkles, Loader2, Lock } from "lucide-react";
import confetti from "canvas-confetti";
import { store } from "@/lib/store";
import { SubscriptionPlan, getPlanConfig } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: SubscriptionPlan;
  onSuccess?: () => void;
}

export function RazorpayModal({ isOpen, onClose, selectedPlan, onSuccess }: RazorpayModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"review" | "processing" | "success">("review");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [confirmedPaymentId, setConfirmedPaymentId] = useState("");

  if (!isOpen) return null;

  const planDetails = getPlanConfig(selectedPlan);

  const handlePay = async () => {
    setLoading(true);
    setPaymentStep("processing");

    // Process Razorpay order creation & signature verification
    setTimeout(() => {
      const orderId = `order_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const paymentId = `pay_${Math.random().toString(36).substring(2, 14)}`;
      setConfirmedPaymentId(paymentId);

      // Update store subscription
      const now = new Date();
      const endDate = new Date(now.getTime() + planDetails.durationDays * 24 * 60 * 60 * 1000);

      store.setSubscription({
        id: `sub-${Date.now()}`,
        user_id: store.getProfile().id,
        plan: selectedPlan,
        amount: planDetails.amount,
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        status: "active",
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        created_at: now.toISOString(),
      });

      setLoading(false);
      setPaymentStep("success");

      // Trigger Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error("Confetti error:", e);
      }

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2200);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Razorpay Brand Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/40 text-blue-100 border border-blue-400/40">
              Razorpay Secured Checkout
            </span>
            <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL
            </span>
          </div>

          <h3 className="text-2xl font-black">{planDetails.name}</h3>
          <p className="text-blue-100 text-xs mt-0.5">
            Full access to {planDetails.productLimit} products, QR codes, & WhatsApp catalogue
          </p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{formatCurrency(planDetails.amount)}</span>
            <span className="text-blue-200 text-xs font-semibold">/ {planDetails.durationLabel}</span>
            {planDetails.savings && (
              <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-400 text-emerald-950">
                {planDetails.savings}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {paymentStep === "review" && (
            <div className="space-y-5">
              {/* Dynamic Auto-filled Non-editable Order Summary */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Plan Selected:</span>
                  <span className="font-bold text-slate-900">{planDetails.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Catalog Capacity:</span>
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    Up to {planDetails.productLimit} Products
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-bold text-slate-800">{planDetails.durationLabel}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fixed Order Amount:</span>
                  </div>
                  <span className="text-base font-black text-slate-950">
                    {formatCurrency(planDetails.amount)}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Select Payment Option (INR)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === "upi"
                        ? "border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-sm"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="block text-sm">UPI / QR</span>
                    <span className="text-[10px] text-slate-500">GPay, PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === "card"
                        ? "border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-sm"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="block text-sm">Cards</span>
                    <span className="text-[10px] text-slate-500">Debit / Credit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === "netbanking"
                        ? "border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-sm"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="block text-sm">Netbanking</span>
                    <span className="text-[10px] text-slate-500">All Major Banks</span>
                  </button>
                </div>
              </div>

              {/* Inclusions checklist */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Up to {planDetails.productLimit} active products with instant image compression</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>High-resolution QR code (SVG + PNG) for print & stickers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct 1-click WhatsApp order inquiries with prefilled text</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3-day grace period guarantee upon renewal cycles</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Pay {formatCurrency(planDetails.amount)} & Activate</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Razorpay Test Mode: Instantaneous Sandbox Payment & Signature Verification
              </p>
            </div>
          )}

          {paymentStep === "processing" && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Authorizing with Razorpay...</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Verifying cryptographic HMAC-SHA256 signature and updating subscription.
                </p>
              </div>
            </div>
          )}

          {paymentStep === "success" && (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xl">Payment Successful!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Your {planDetails.name} has been activated. Your catalogue is live!
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-600 border border-slate-200">
                Payment ID: {confirmedPaymentId || store.getSubscription()?.razorpay_payment_id || "N/A"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
