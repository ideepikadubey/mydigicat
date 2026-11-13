"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Menu, X, LogIn } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <>
      {/* ── White Glass Sticky Navbar ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/90"
            : "bg-white/90 backdrop-blur-sm shadow-xs border-b border-slate-200/70"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo */}
            <Link href="/" onClick={closeMenu} className="group flex items-center shrink-0">
              <img
                src="/MyDigiCatalogue Digital Bookmark Logo.png"
                alt="MyDigiCatalogue Logo"
                className="h-11 sm:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-heading font-bold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-100/70 transition-all duration-150"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-heading font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-600" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/onboarding"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-heading font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden relative z-50 flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all duration-200 active:scale-95"
            >
              <span className={`absolute transition-all duration-200 ${isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}>
                <X className="w-5 h-5" />
              </span>
              <span className={`absolute transition-all duration-200 ${isMobileMenuOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}>
                <Menu className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer (Full-Height Responsive Slide-over) ── */}
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[min(85vw,340px)] bg-white shadow-2xl border-l border-slate-200 flex flex-col md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <img
            src="/MyDigiCatalogue Digital Bookmark Logo.png"
            alt="MyDigiCatalogue"
            className="h-10 w-auto object-contain"
          />
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-heading font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 transition-all"
            >
              <span>{item.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          ))}

          <div className="my-3 h-px bg-slate-100" />

          {/* Quick legal / policy links */}
          <div className="space-y-0.5 pt-1">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Refund Policy", href: "/refund-policy" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="block px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-2.5">
          <Link
            href="/login"
            onClick={closeMenu}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-heading font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-all active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4 text-slate-600" />
            <span>Sign In to Dashboard</span>
          </Link>

          <Link
            href="/onboarding"
            onClick={closeMenu}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-heading font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Catalogue — ₹399</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}
