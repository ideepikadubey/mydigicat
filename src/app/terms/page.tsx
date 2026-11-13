import Link from "next/link";
import { ArrowLeft, FileText, Phone, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — MyDigiCatalogue",
  description: "Read the Terms of Service governing use of the MyDigiCatalogue platform by The Dynamite Technologies.",
};

const sections = [
  {
    num: "1",
    title: "Acceptance of Terms",
    content: `By creating a MyDigiCatalogue account and paying for a subscription, you ("Merchant", "you") agree to be bound by these Terms of Service. These Terms constitute a legally binding agreement between you and The Dynamite Technologies ("we", "us", "Company"), registered in Kishangarh, Rajasthan. If you do not agree to these Terms, do not access or use the platform.`,
  },
  {
    num: "2",
    title: "Description of Service",
    content: `MyDigiCatalogue is a prepaid Software-as-a-Service (SaaS) platform that enables Indian businesses to:`,
    list: [
      "Create a shareable mobile-first digital product catalogue accessible via a unique URL",
      "Generate a permanent QR code (SVG and PNG) for print and digital use",
      "Receive direct WhatsApp-based product enquiries from catalogue visitors",
      "Manage up to 100 products per active subscription period",
      "Track catalogue page view analytics",
    ],
  },
  {
    num: "3",
    title: "Subscription & Payment",
    list: [
      "Plans are prepaid and non-auto-renewing — you renew manually when you choose",
      "Payment is processed exclusively via Razorpay in Indian Rupees (INR)",
      "Current plan: ₹399 for 30 days of access",
      "A 3-day grace period applies after expiry — your catalogue remains live during this window",
      "After the grace period ends, your public catalogue page is hidden until you renew",
      "We reserve the right to revise plan pricing with 14 days' prior notice",
    ],
  },
  {
    num: "4",
    title: "Acceptable Use",
    content: `You agree to use MyDigiCatalogue only for lawful business purposes. You must NOT:`,
    list: [
      "List illegal, counterfeit, stolen, prohibited, or age-restricted goods",
      "Use the platform for spam, phishing, impersonation, or fraud",
      "Attempt to access, scrape, or interfere with other merchants' data or accounts",
      "Reverse-engineer, decompile, or copy any part of our platform",
      "Upload images or content that you do not own or have permission to use",
      "Misuse the platform in any way that violates Indian law, including IT Act 2000",
    ],
    footer: "We reserve the right to suspend or permanently terminate accounts violating these terms, without refund, at our sole discretion.",
  },
  {
    num: "5",
    title: "Content Ownership & License",
    list: [
      "You retain full ownership of all product data, images, descriptions, and business information you upload",
      "You grant The Dynamite Technologies a limited, non-exclusive, royalty-free license to display your content to your catalogue visitors for the purpose of providing the service",
      "We will never use your product images, branding, or business data for our own marketing without your explicit written consent",
      "Upon account deletion, your content license is revoked and your data is purged within 30 days",
    ],
  },
  {
    num: "6",
    title: "Platform Availability & Uptime",
    content: `We strive to maintain high availability but do not guarantee 100% uptime. Scheduled maintenance will be communicated in advance. We are not liable for:`,
    list: [
      "Brief service interruptions due to maintenance or infrastructure updates",
      "Third-party service failures (Razorpay, Supabase, Vercel CDN)",
      "Internet outages or connectivity issues beyond our control",
      "Force majeure events including natural disasters, power outages, or government actions",
    ],
  },
  {
    num: "7",
    title: "Limitation of Liability",
    content: `To the fullest extent permitted by Indian law, The Dynamite Technologies shall not be liable for:`,
    list: [
      "Loss of business, revenue, or profits due to catalogue downtime or data loss",
      "Errors, inaccuracies, or omissions in product information entered by you",
      "WhatsApp delivery failures, message delays, or platform changes by Meta",
      "Any indirect, incidental, special, or consequential damages",
    ],
    footer: "Our maximum aggregate liability for any claim is strictly limited to the amount paid by you in the last billing cycle (₹399).",
  },
  {
    num: "8",
    title: "Termination",
    list: [
      "You may stop using the service at any time — your data will be retained until you request deletion",
      "We may suspend or terminate accounts for Terms violations, with or without notice",
      "Upon termination for cause, no refund is issued for the remaining subscription period",
      "Upon expiry of subscription (non-renewal), your account data is retained for 90 days before automatic deletion",
    ],
  },
  {
    num: "9",
    title: "Changes to Terms",
    content: `We may update these Terms of Service periodically. We will provide at least 14 days' notice via WhatsApp message or registered email before material changes take effect. Continued use of the platform after the notice period constitutes acceptance of the revised Terms.`,
  },
  {
    num: "10",
    title: "Governing Law & Dispute Resolution",
    content: `These Terms of Service are governed exclusively by the laws of India. Any dispute, claim, or controversy arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts located in Kishangarh, Rajasthan, India. We encourage resolving disputes amicably through our WhatsApp support before initiating legal proceedings.`,
  },
];

export default function TermsPage() {
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
          <span className="text-sm font-bold text-slate-900">Terms of Service</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <FileText className="w-3.5 h-3.5" />
            Terms of Service Agreement
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-slate-500 text-sm">
            Effective Date: November 2026 &nbsp;·&nbsp; Operated by <strong className="text-slate-700">The Dynamite Technologies</strong>, Kishangarh, Rajasthan
          </p>
        </div>

        {/* Quick links */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Navigation</p>
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s.num}
                href={`#section-${s.num}`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-full transition-colors"
              >
                {s.num}. {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-slate-700 leading-relaxed">
          {sections.map((section) => (
            <div
              key={section.num}
              id={`section-${section.num}`}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 scroll-mt-20"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  {section.num}
                </div>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">{section.title}</h2>
              </div>

              {section.content && (
                <p className="text-sm text-slate-600 mb-4">{section.content}</p>
              )}

              {section.list && (
                <ul className="space-y-2.5 mb-4">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {section.footer && (
                <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold">
                  {section.footer}
                </div>
              )}
            </div>
          ))}

          {/* Contact */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-blue-900">Contact Us</h2>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              For any questions regarding these Terms, reach our support team:
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
              <Phone className="w-4 h-4" />
              WhatsApp: +91 82091 92373 &nbsp;|&nbsp; Mon–Sat, 9:00 AM – 7:00 PM IST
            </div>
            <p className="text-xs text-blue-700 mt-2">
              The Dynamite Technologies, Kishangarh, Rajasthan – 305801, India
            </p>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-100 pt-6">
            © {new Date().getFullYear()} The Dynamite Technologies. All rights reserved. MyDigiCatalogue is a product of The Dynamite Technologies.
            These Terms supersede all prior agreements related to the use of MyDigiCatalogue.
          </div>
        </div>
      </div>
    </div>
  );
}

