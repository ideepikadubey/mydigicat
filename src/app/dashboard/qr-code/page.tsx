"use client";

import { useState, useEffect, useRef } from "react";
import {
  QrCode,
  Download,
  Copy,
  Check,
  Share2,
  Printer,
  ExternalLink,
  Sparkles,
  LayoutTemplate,
  Palette,
  Eye,
  Store,
  Layers,
} from "lucide-react";
import { store } from "@/lib/store";
import { generateQrPng, generateQrSvg, getContrastTextColor, getCatalogueUrl } from "@/lib/utils";

export default function QrCodePage() {
  const [profile, setProfile] = useState(store.getProfile());
  const [qrPngUrl, setQrPngUrl] = useState<string>("");
  const [qrSvgString, setQrSvgString] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [qrColor, setQrColor] = useState("#000000");

  // Standee Designer State
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "brand" | "tabletop">("brand");
  const [standeeSize, setStandeeSize] = useState<"A5" | "A6" | "Square">("A5");
  const [customTagline, setCustomTagline] = useState("Scan to View Complete Digital Catalogue & Prices");

  const standeeRef = useRef<HTMLDivElement>(null);

  const publicUrl = getCatalogueUrl(profile.slug);

  useEffect(() => {
    const handleUpdate = () => setProfile(store.getProfile());
    window.addEventListener("mydigicat_store_update", handleUpdate);
    return () => window.removeEventListener("mydigicat_store_update", handleUpdate);
  }, []);

  useEffect(() => {
    async function loadQr() {
      const png = await generateQrPng(publicUrl, qrColor);
      const svg = await generateQrSvg(publicUrl, qrColor);
      setQrPngUrl(png);
      setQrSvgString(svg);
    }
    loadQr();
  }, [publicUrl, qrColor]);

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPng = () => {
    if (!qrPngUrl) return;
    const a = document.createElement("a");
    a.href = qrPngUrl;
    a.download = `${profile.slug}-catalogue-qr.png`;
    a.click();
  };

  const downloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.slug}-catalogue-qr.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Explore our digital product catalogue for ${profile.firm_name}!\n\nScan QR or click below to browse items:\n${publicUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const printStandee = () => {
    window.print();
  };

  const themeColor = profile.theme_color || "#854d0e";
  const contrastText = getContrastTextColor(themeColor);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
            QR Hub & Tabletop Standee Designer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate printable acrylic tabletop tent cards, scan stands, and permanent store sharing assets.
          </p>
        </div>

        <button
          onClick={printStandee}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold font-heading transition-all shadow-md active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Print Standee / Tent Card</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">
        {/* Left: Interactive QR Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner w-64 h-64 flex items-center justify-center relative mb-4">
            {qrPngUrl ? (
              <img src={qrPngUrl} alt="Store QR Code" className="w-full h-full object-contain" />
            ) : (
              <QrCode className="w-16 h-16 text-slate-300 animate-pulse" />
            )}
          </div>

          <h3 className="font-extrabold text-lg text-slate-900 font-heading">{profile.firm_name}</h3>
          <p className="text-xs font-mono text-blue-600 font-semibold mt-0.5 break-all">
            {publicUrl}
          </p>

          {/* Color Chooser */}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <span>QR Code Color:</span>
            <button
              onClick={() => setQrColor("#000000")}
              className={`w-5 h-5 rounded-full bg-black border ${
                qrColor === "#000000" ? "ring-2 ring-slate-900" : ""
              }`}
            />
            <button
              onClick={() => setQrColor(profile.theme_color || "#2563eb")}
              className={`w-5 h-5 rounded-full border ${
                qrColor === (profile.theme_color || "#2563eb") ? "ring-2 ring-slate-900" : ""
              }`}
              style={{ backgroundColor: profile.theme_color || "#2563eb" }}
            />
          </div>

          {/* Downloads */}
          <div className="mt-6 w-full grid grid-cols-2 gap-2.5">
            <button
              onClick={downloadPng}
              className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/15 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={downloadSvg}
              className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
          </div>
        </div>

        {/* Right: Sharing & Standee Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Permanent Link Info Box */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm font-heading">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Dynamic QR Code (Never Needs Re-printing)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When you add new products or update prices, this exact same QR code updates instantly. Print your tabletop standee once, and use it forever!
            </p>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-none"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold font-heading transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Tabletop Standee Customizer */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-slate-700" />
                <span>Standee & Tent Card Templates</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">Print-ready layouts</span>
            </div>

            {/* Template Chooser */}
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setSelectedTemplate("brand")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedTemplate === "brand"
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="font-bold block font-heading text-xs">Brand Header</span>
                <span className="text-[10px] opacity-80 block mt-0.5">Colored accent header with logo</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTemplate("modern")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedTemplate === "modern"
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="font-bold block font-heading text-xs">Minimalist</span>
                <span className="text-[10px] opacity-80 block mt-0.5">Ultra-clean white acrylic frame</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTemplate("tabletop")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedTemplate === "tabletop"
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="font-bold block font-heading text-xs">Tabletop Tent</span>
                <span className="text-[10px] opacity-80 block mt-0.5">Folded tent card with instructions</span>
              </button>
            </div>

            {/* Custom Tagline Editor */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-slate-600 block">Custom Call-to-Action Tagline</label>
              <input
                type="text"
                value={customTagline}
                onChange={(e) => setCustomTagline(e.target.value)}
                placeholder="e.g. Scan to Browse Our Latest Collection & Special Offers"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Standee Preview & Print Asset */}
      <div className="space-y-3">
        <div className="flex items-center justify-between print:hidden">
          <h3 className="font-heading font-black text-sm text-slate-900">Live Print Preview</h3>
          <span className="text-xs text-slate-400">Fits Standard A5 / A6 Acrylic Standee</span>
        </div>

        {/* 1. BRAND HEADER TEMPLATE */}
        {selectedTemplate === "brand" && (
          <div
            ref={standeeRef}
            className="bg-white rounded-3xl border-2 border-slate-300 max-w-lg mx-auto overflow-hidden shadow-xl print:shadow-none print:border-0 print:m-0 print:max-w-none text-center"
          >
            {/* Top Brand Banner */}
            <div
              className="p-8 text-white flex flex-col items-center justify-center space-y-2"
              style={{ backgroundColor: themeColor, color: contrastText }}
            >
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center overflow-hidden shadow-lg p-1">
                {profile.logo_url ? (
                  <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Store className="w-10 h-10" />
                )}
              </div>
              <h2 className="text-2xl font-black font-heading tracking-tight">{profile.firm_name}</h2>
              {profile.address && <p className="text-xs opacity-90 max-w-sm">{profile.address}</p>}
            </div>

            {/* QR Body */}
            <div className="p-8 space-y-6 bg-slate-50/50">
              <div className="p-5 bg-white rounded-3xl border border-slate-200 inline-block shadow-sm">
                {qrPngUrl && <img src={qrPngUrl} alt="Store QR" className="w-56 h-56 mx-auto" />}
              </div>

              <div className="space-y-1.5">
                <p className="font-black text-base text-slate-900 font-heading">
                  {customTagline}
                </p>
                <p className="text-xs text-slate-500">
                  Open camera on any smartphone to scan & order instantly on WhatsApp
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-medium px-4">
                <span>Direct WhatsApp Ordering</span>
                <span>Powered by MyDigiCatalogue</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. MINIMALIST ACRYLIC TEMPLATE */}
        {selectedTemplate === "modern" && (
          <div
            ref={standeeRef}
            className="bg-white rounded-3xl p-10 border-2 border-slate-300 max-w-lg mx-auto text-center space-y-6 shadow-xl print:shadow-none print:border-0 print:p-4 print:max-w-none"
          >
            <div className="space-y-2">
              <div
                className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-xl shadow-md"
                style={{ backgroundColor: themeColor }}
              >
                {profile.logo_url ? (
                  <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  "MD"
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">{profile.firm_name}</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">{profile.address || "Official Store Catalogue"}</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 inline-block">
              {qrPngUrl && <img src={qrPngUrl} alt="Store QR" className="w-52 h-52 mx-auto" />}
            </div>

            <div className="space-y-1">
              <p className="font-extrabold text-base text-slate-900 font-heading">
                {customTagline}
              </p>
              <p className="text-xs text-slate-500">
                Point your phone camera to browse items and prices
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>Powered by MyDigiCatalogue</span>
            </div>
          </div>
        )}

        {/* 3. TABLETOP TENT CARD TEMPLATE */}
        {selectedTemplate === "tabletop" && (
          <div
            ref={standeeRef}
            className="bg-white rounded-3xl p-8 border-2 border-slate-300 max-w-lg mx-auto text-center space-y-5 shadow-xl print:shadow-none print:border-0 print:p-4 print:max-w-none"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white font-heading font-black text-xs uppercase tracking-wider">
              {profile.firm_name}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              {qrPngUrl && <img src={qrPngUrl} alt="Store QR" className="w-48 h-48 mx-auto" />}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 font-heading">
                {customTagline}
              </h3>
              <p className="text-xs text-slate-500">
                1. Scan with camera &bull; 2. Add to bag &bull; 3. Order on WhatsApp
              </p>
            </div>

            <div className="p-3 bg-slate-100 rounded-xl text-[11px] font-mono text-slate-600 truncate">
              {publicUrl}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

