import Link from "next/link";
import { ArrowLeft, RefreshCcw, AlertCircle, CheckCircle2, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — MyDigiCatalogue",
  description: "Understand MyDigiCatalogue's refund and cancellation policy for prepaid digital catalogue subscriptions.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-bold text-slate-900">Refund Policy</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <RefreshCcw className="w-3.5 h-3.5" />
            Refund &amp; Cancellation Policy
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Refund Policy
          </h1>
          <p className="text-slate-500 text-sm">
            Effective Date: November 2026 &nbsp;·&nbsp; Operated by <strong className="text-slate-700">The Dynamite Technologies</strong>, Kishangarh
          </p>
        </div>

        <div className="space-y-8 text-slate-700 leading-relaxed">

          {/* Core Statement */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-black text-amber-900 mb-1">No-Refund Policy — Prepaid Digital Service</h2>
                <p className="text-sm text-amber-800">
                  MyDigiCatalogue offers a prepaid subscription model for access to a digital SaaS platform. Because our
                  service is delivered digitally and catalogue access begins <strong>immediately upon payment confirmation</strong>,
                  all payments are non-refundable once the subscription is activated.
                </p>
              </div>
            </div>
          </div>

          {/* Why */}
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">Why we don&apos;t offer refunds</h2>
            <ul className="space-y-3">
              {[
                "Access to your digital catalogue goes live instantly after payment",
                "Your QR code, shareable link, and product data are immediately accessible to your customers",
                "We provide a free onboarding process so you can fully evaluate the platform before paying",
                "No physical goods are involved — this is a 100% digital, instantly delivered service",
                "We send renewal reminders 7 days and 1 day before expiry so you can make an informed decision",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exceptions */}
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">Exceptions (Goodwill Basis Only)</h2>
            <p className="text-sm text-slate-600 mb-4">
              In the following situations, we will investigate and resolve at the earliest:
            </p>
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-5 font-bold text-slate-700 text-xs uppercase tracking-wider">Situation</th>
                    <th className="text-left py-3 px-5 font-bold text-slate-700 text-xs uppercase tracking-wider">Resolution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {[
                    ["Double payment / duplicate transaction", "Full refund within 5–7 business days"],
                    ["Payment debited but subscription not activated", "Activation within 24 hours or full refund"],
                    ["Technical error on our platform (documented proof required)", "Credit or refund at our discretion"],
                  ].map(([situation, resolution]) => (
                    <tr key={situation}>
                      <td className="py-3.5 px-5 text-slate-700">{situation}</td>
                      <td className="py-3.5 px-5 text-emerald-700 font-semibold">{resolution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to raise */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h2 className="text-lg font-black text-blue-900 mb-2">How to raise a concern</h2>
            <p className="text-sm text-blue-800 mb-3">
              Contact us within <strong>48 hours</strong> of the transaction with your Razorpay Payment ID.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
              <Phone className="w-4 h-4" />
              WhatsApp: +91 82091 92373 &nbsp;|&nbsp; Mon–Sat, 9:00 AM – 7:00 PM IST
            </div>
          </div>

          {/* Grace Period */}
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-3">Subscription Expiry &amp; Grace Period</h2>
            <p className="text-sm text-slate-600">
              Upon subscription expiry, we provide a <strong>3-day grace period</strong> during which your public
              catalogue remains live. After this window, your catalogue is hidden until you renew. Subscriptions are
              not auto-renewed — you renew manually at your convenience.
            </p>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-100 pt-6">
            This policy is governed by the laws of India. Disputes subject to jurisdiction of courts in Kishangarh, Rajasthan.
            Operated by <strong>The Dynamite Technologies</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}

