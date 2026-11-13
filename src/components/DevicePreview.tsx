"use client";

import { useState } from "react";
import { Smartphone, Monitor, ExternalLink, RefreshCw } from "lucide-react";
import Link from "next/link";

interface DevicePreviewProps {
  slug: string;
}

export function DevicePreview({ slug }: DevicePreviewProps) {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [key, setKey] = useState(0);

  const reload = () => setKey((prev) => prev + 1);

  return (
    <div className="bg-white rounded-[32px] border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[780px]">
      {/* Top Bar Controls */}
      <div className="p-4 sm:p-4.5 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-heading font-black text-sm tracking-tight text-white">
              Live Catalogue Simulator
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-blue-400 bg-blue-950/60 border border-blue-900/50 px-2.5 py-0.5 rounded-lg">
            {slug}.mydigicatalogue.com
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Device Switcher */}
          <div className="bg-slate-900 p-1 rounded-2xl flex items-center gap-1 border border-slate-800">
            <button
              onClick={() => setDevice("mobile")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                device === "mobile"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile View</span>
            </button>
            <button
              onClick={() => setDevice("desktop")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                device === "desktop"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop View</span>
            </button>
          </div>

          <button
            onClick={reload}
            title="Refresh preview"
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-800 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <Link
            href={`/c/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200 border border-blue-500/30 rounded-xl text-xs font-heading font-bold transition-colors"
          >
            <span>Open Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 p-4 flex items-center justify-center overflow-hidden">
        {!slug ? (
          <div className="text-center p-8 max-w-sm bg-white rounded-3xl border border-slate-200 shadow-lg space-y-3">
            <p className="font-extrabold text-sm text-slate-800">Store Profile Not Set Up Yet</p>
            <p className="text-xs text-slate-500">
              Complete your store profile and brand settings to enable interactive live device previews.
            </p>
            <Link
              href="/dashboard/profile"
              className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Configure Store Profile
            </Link>
          </div>
        ) : device === "mobile" ? (
          <div className="w-[390px] h-[670px] bg-slate-950 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 relative flex flex-col transition-all">
            {/* Phone Notch / Speaker */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 ring-1 ring-slate-700 mr-2"></div>
              <div className="w-2 h-2 rounded-full bg-blue-950/80"></div>
            </div>

            {/* Inner Screen */}
            <div className="flex-1 bg-white rounded-[38px] overflow-hidden relative shadow-inner">
              <iframe
                key={key}
                src={`/c/${slug}`}
                className="w-full h-full border-0"
                title="Mobile Live Preview"
              />
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-2 mb-1"></div>
          </div>
        ) : (
          <div className="w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 flex flex-col">
            {/* Browser Address bar mockup */}
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              </div>
              <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 font-mono text-[11px] text-slate-700">
                https://mydigicatalogue.com/c/{slug}
              </div>
            </div>
            <iframe
              key={key}
              src={`/c/${slug}`}
              className="w-full flex-1 border-0"
              title="Desktop Live Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}
