import Link from "next/link";
import { ArrowLeft, ShieldCheck, Eye, Database, Share2, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — MyDigiCatalogue",
  description: "Learn how MyDigiCatalogue collects, uses, and protects your business data.",
};

export default function PrivacyPolicyPage() {
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
          <span className="text-sm font-bold text-slate-900">Privacy Policy</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Privacy &amp; Data Protection
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm">
            Effective Date: November 2026 &nbsp;·&nbsp; Operated by <strong className="text-slate-700">The Dynamite Technologies</strong>, Kishangarh
          </p>
        </div>

        <div className="space-y-10 text-slate-700 leading-relaxed">

          {/* Intro */}
          <p className="text-sm text-slate-600 bg-white border border-slate-200 rounded-2xl p-5">
            The Dynamite Technologies (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates MyDigiCatalogue at{" "}
            <strong>mydigicatalogue.com</strong>. This Privacy Policy explains what data we collect when you use our platform,
            how we use it, and your rights over it. We are committed to keeping your data minimal, secure, and transparent.
          </p>

          {/* What we collect */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Database className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900">What data we collect</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Business Information (provided by you)</h3>
                <ul className="space-y-1.5 text-sm text-slate-600 list-disc list-inside">
                  <li>Firm name, business address, email, phone, WhatsApp number</li>
                  <li>Business logo and brand colour preference</li>
                  <li>Product names, prices, descriptions, and photos</li>
                  <li>Category names for organising your catalogue</li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Technical Data (auto-collected)</h3>
                <ul className="space-y-1.5 text-sm text-slate-600 list-disc list-inside">
                  <li>Catalogue page view counts (anonymous — no visitor personal data stored)</li>
                  <li>Browser and device type for display optimisation</li>
                  <li>Razorpay payment tokens and order IDs (we do <strong>not</strong> store card or UPI credentials)</li>
                  <li>OTP session tokens (temporary, discarded after verification)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What we do NOT collect */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <Eye className="w-4 h-4 text-red-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900">What we do NOT collect</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Personal data of your catalogue visitors",
                "Card numbers, CVV, or UPI PINs",
                "GPS location of you or your customers",
                "Cookies for advertising or cross-site tracking",
                "Your WhatsApp message content",
                "Data from third-party platforms",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm text-red-800 font-medium">
                  <span className="text-red-500 font-black">✕</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* How we use */}
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">How we use your data</h2>
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-5 font-bold text-slate-700 text-xs uppercase tracking-wider">Purpose</th>
                    <th className="text-left py-3 px-5 font-bold text-slate-700 text-xs uppercase tracking-wider">Data Used</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {[
                    ["Render your public digital catalogue", "Firm name, products, logo, theme colour"],
                    ["Send OTP for secure login", "Phone number only"],
                    ["Generate GST tax invoices", "Firm name, email, payment amount"],
                    ["Enforce product plan limits", "Subscription plan type"],
                    ["Aggregate analytics display", "Page view count per catalogue (anonymous)"],
                    ["Customer support", "Name, contact details, payment ID"],
                  ].map(([purpose, data]) => (
                    <tr key={purpose}>
                      <td className="py-3.5 px-5 text-slate-700 font-medium">{purpose}</td>
                      <td className="py-3.5 px-5 text-slate-500">{data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data sharing */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Share2 className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Data sharing</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              We share data <strong>only</strong> with the following trusted partners, and never sell your data to anyone:
            </p>
            <div className="space-y-3">
              {[
                {
                  name: "Razorpay",
                  role: "Payment processing",
                  note: "Governed by Razorpay's own Privacy Policy. We only receive order confirmation tokens.",
                },
                {
                  name: "Supabase",
                  role: "Secure database hosting",
                  note: "Data stored on encrypted servers (India/Singapore region). SOC 2 compliant.",
                },
              ].map((partner) => (
                <div key={partner.name} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
                  <div className="sm:w-32 shrink-0">
                    <span className="font-black text-slate-900 text-sm">{partner.name}</span>
                    <p className="text-xs text-blue-600 font-semibold">{partner.role}</p>
                  </div>
                  <p className="text-sm text-slate-500">{partner.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data retention */}
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">Data retention</h2>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <span className="text-slate-400 font-black shrink-0">•</span>
                <span><strong className="text-slate-800">Active account data</strong> — retained for the duration of your subscription and any renewal cycles.</span>
              </div>
              <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <span className="text-slate-400 font-black shrink-0">•</span>
                <span><strong className="text-slate-800">After account deletion</strong> — all business and product data purged within 30 days of your request.</span>
              </div>
              <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <span className="text-slate-400 font-black shrink-0">•</span>
                <span><strong className="text-slate-800">Payment records</strong> — retained for 7 years as required under Indian GST and accounting law.</span>
              </div>
            </div>
          </div>

          {/* Your rights */}
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">Your rights</h2>
            <p className="text-sm text-slate-600 mb-4">You may request any of the following at any time by contacting us:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: "👁️", title: "Access", desc: "View all data stored about your business" },
                { icon: "✏️", title: "Correction", desc: "Fix any incorrect or outdated information" },
                { icon: "🗑️", title: "Deletion", desc: "Delete your account and all associated data" },
              ].map((right) => (
                <div key={right.title} className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-2">{right.icon}</div>
                  <p className="font-black text-slate-900 text-sm">{right.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{right.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h2 className="text-lg font-black text-blue-900 mb-2">Privacy contact</h2>
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
              <Phone className="w-4 h-4" />
              WhatsApp: +91 82091 92373 &nbsp;|&nbsp; Mon–Sat, 9:00 AM – 7:00 PM IST
            </div>
            <p className="text-xs text-blue-700 mt-2">The Dynamite Technologies, Kishangarh, Rajasthan, India</p>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-100 pt-6">
            This policy applies to mydigicatalogue.com and all associated subdomains. We may update this policy with 14 days&apos; notice.
          </div>
        </div>
      </div>
    </div>
  );
}

