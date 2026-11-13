import Link from "next/link";
import { ShieldCheck, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block group py-1">
              <img
                src="/MyDigiCatalogue Digital Bookmark Logo.png"
                alt="MyDigiCatalogue Logo"
                className="h-14 w-auto object-contain brightness-105 group-hover:scale-105 transition-transform duration-200 drop-shadow"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering manufacturers, retailers, wholesalers, and boutiques across India to showcase inventory with zero hassle.
            </p>
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl w-fit shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Razorpay Verified &amp; SSL Secured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-bold text-sm mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/#features" className="text-slate-400 hover:text-white transition-colors">
                  Features &amp; Tools
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-slate-400 hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="text-slate-400 hover:text-white transition-colors">
                  Start Onboarding
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                  Owner Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Types */}
          <div>
            <h4 className="text-white font-heading font-bold text-sm mb-4 uppercase tracking-wider">Industries</h4>
            <ul className="space-y-2.5 text-sm font-medium text-slate-400">
              <li>Jewellery &amp; Fashion Boutiques</li>
              <li>Handicrafts &amp; Leather Works</li>
              <li>Home Decor &amp; Furniture</li>
              <li>Electronics &amp; Hardware</li>
              <li>Wholesalers &amp; Distributors</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white font-heading font-bold text-sm mb-4 uppercase tracking-wider">Support</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                <span>WhatsApp: +91 82091 92373</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Mon-Sat, 9:00 AM - 7:00 PM IST</span>
              </div>
              <p className="text-xs text-slate-400 pt-2 leading-relaxed">
                All subscriptions include 100-product capacity, unlimited scans, instant updates, and WhatsApp checkout integration.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MyDigiCatalogue. All rights reserved. Made for Indian businesses.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="text-slate-400 hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
