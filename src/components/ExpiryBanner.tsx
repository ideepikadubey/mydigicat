"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, Sparkles, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { store } from "@/lib/store";
import { getSubscriptionDetails } from "@/lib/utils";

export function ExpiryBanner() {
  const [sub, setSub] = useState(store.getSubscription());

  useEffect(() => {
    const handleUpdate = () => setSub(store.getSubscription());
    window.addEventListener("mydigicat_store_update", handleUpdate);
    return () => window.removeEventListener("mydigicat_store_update", handleUpdate);
  }, []);

  const details = getSubscriptionDetails(sub?.end_date);

  if (details.banner === "none") {
    return null;
  }

  if (details.banner === "warning-7d") {
    return (
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-orange-500/10 border border-amber-300 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 text-sm">
              Subscription Reminder: {details.daysLeft} days remaining
            </h4>
            <p className="text-xs text-amber-800">
              Your plan will renew on {new Date(sub.end_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}. Renew early to prevent any service interruptions.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Renew Subscription</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  if (details.banner === "warning-1d") {
    return (
      <div className="bg-gradient-to-r from-orange-500/15 via-red-500/15 to-rose-500/15 border-2 border-orange-400 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-700 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-orange-950 text-sm">
              Critical Reminder: Subscription Expires Today!
            </h4>
            <p className="text-xs text-orange-900">
              Only less than 24 hours remaining on your catalogue plan. Please renew now to maintain your public store URL.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Renew</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  if (details.banner === "grace") {
    return (
      <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-red-600/20 border-2 border-dashed border-amber-500 rounded-2xl p-4 mb-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-white rounded-xl">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-amber-950 text-sm">
                Grace Period Active (3 Days)
              </h4>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full uppercase">
                Active Temporary Access
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-0.5">
              Your prepaid cycle has ended, but we have kept your catalogue live for 3 grace days. Renew now before it becomes temporarily unavailable!
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pay & Renew Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Expired
  return (
    <div className="bg-gradient-to-r from-red-500/15 via-rose-500/20 to-red-500/15 border-2 border-red-500 rounded-2xl p-4 mb-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-600 text-white rounded-xl">
          <XCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-red-950 text-sm">
              Catalogue Temporarily Offline
            </h4>
            <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full uppercase">
              Expired
            </span>
          </div>
          <p className="text-xs text-red-900 mt-0.5">
            Your grace period has ended. Visitors to your link/QR currently see a "Temporarily Unavailable" page. All your {store.getProducts().length} products and data are safely preserved and will immediately reactivate upon renewal!
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/billing"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
      >
        <Sparkles className="w-4 h-4" />
        <span>Reactivate My Catalogue</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
