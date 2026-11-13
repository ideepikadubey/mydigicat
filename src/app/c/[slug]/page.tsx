"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  MapPin,
  Search,
  Store,
  Sparkles,
  ShoppingBag,
  X,
  ExternalLink,
  ShieldAlert,
  Share2,
  Check,
  Tag,
  Clock,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Send,
  SlidersHorizontal,
} from "lucide-react";
import { store } from "@/lib/store";
import { Product, Category, Profile, PublicCatalogueData, CartItem } from "@/lib/types";
import {
  formatCurrency,
  getContrastTextColor,
  buildWhatsAppEnquiryUrl,
  buildWhatsAppCartUrl,
} from "@/lib/utils";

export default function PublicCataloguePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const [data, setData] = useState<PublicCatalogueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [addedAlert, setAddedAlert] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setLoading(false);
      return;
    }

    // Fetch catalogue data
    const catData = store.getPublicCatalogueBySlug(slug);
    if (catData) {
      // Record page view counter for real views
      store.incrementView();
    }
    setData(catData);
    setLoading(false);

    // Dynamic store update listener
    const handleUpdate = () => {
      setData(store.getPublicCatalogueBySlug(slug));
    };
    window.addEventListener("mydigicat_store_update", handleUpdate);
    return () => window.removeEventListener("mydigicat_store_update", handleUpdate);
  }, [slug]);

  // Handle modal open + increment product view
  const handleOpenProduct = (prod: Product) => {
    setActiveProductModal(prod);
    setSelectedVariant(prod.variants && prod.variants.length > 0 ? prod.variants[0] : "");
    store.incrementProductView(prod.id);
  };

  // Cart helper functions
  const addToCart = (product: Product, variant?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === (variant || "")
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, quantity: 1, selectedVariant: variant || "" }];
      }
    });

    setAddedAlert(`Added "${product.name}" to your bag!`);
    setTimeout(() => setAddedAlert(null), 2200);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const cartTotalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartTotalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 animate-spin mx-auto flex items-center justify-center text-white font-black">
            MD
          </div>
          <p className="text-xs font-bold text-slate-500">Loading catalogue...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Catalogue Not Found</h2>
          <p className="text-xs text-slate-500">
            The catalogue link you are looking for does not exist or may have been renamed.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700"
          >
            Create Your Own Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const { profile, categories, products, isAvailable } = data;
  const themeColor = profile.theme_color || "#854d0e";
  const headerTextColor = getContrastTextColor(themeColor);

  // If subscription has expired past 3-day grace period
  if (!isAvailable) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Catalogue Temporarily Unavailable</h2>
            <p className="text-sm font-extrabold text-slate-700">{profile.firm_name}</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              This business catalogue is currently undergoing renewal. Please contact the owner directly via phone or visit their physical store.
            </p>
          </div>

          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-extrabold shadow transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call Store: {profile.phone}</span>
            </a>
          )}

          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/dashboard/billing"
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Are you the store owner? Renew subscription here →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter products by category and search
  const visibleProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category_id === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${profile.firm_name} ${profile.address}`
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col justify-between selection:bg-slate-900 selection:text-white relative pb-20">
      {/* Added to Bag Toast Notification */}
      {addedAlert && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce backdrop-blur-md border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{addedAlert}</span>
        </div>
      )}

      {/* Ambient Luxury Glow matching theme accent */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 pointer-events-none -z-10 blur-3xl opacity-30 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${themeColor} 0%, transparent 70%)`,
        }}
      />

      {/* 1. MINIMALIST GLASSMORPHIC / EDITORIAL BRAND CARD */}
      <header className="max-w-4xl mx-auto w-full px-3.5 sm:px-6 pt-4 sm:pt-6 pb-2">
        <div className="relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">

          {/* ── Banner / Background Layer ── */}
          {profile.banner_url ? (
            /* Full banner image mode */
            <div className="relative">
              <img
                src={profile.banner_url}
                alt={`${profile.firm_name} banner`}
                className="w-full h-40 sm:h-52 object-cover"
              />
              {/* Gradient overlay so text is always readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Top shimmer accent */}
              <div
                className="absolute top-0 inset-x-0 h-[3px] opacity-90"
                style={{ background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)` }}
              />
            </div>
          ) : (
            /* Plain glassmorphic card (original) */
            <div className="relative bg-white/80 backdrop-blur-2xl border border-white/80">
              <div
                className="absolute top-0 inset-x-0 h-[3px] opacity-85"
                style={{ background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)` }}
              />
            </div>
          )}

          {/* ── Business Info overlaid on banner OR in plain card ── */}
          <div
            className={`${
              profile.banner_url
                ? "absolute bottom-0 inset-x-0 p-4 sm:p-6"
                : "relative bg-white/80 backdrop-blur-2xl border border-white/80 p-5 sm:p-7"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-5">
              {/* Logo */}
              <div className="relative group shrink-0">
                <div
                  className="absolute -inset-1 rounded-2xl opacity-30 blur-sm transition-all group-hover:opacity-60"
                  style={{ backgroundColor: themeColor }}
                />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200/90 overflow-hidden shrink-0 flex items-center justify-center shadow-md p-1.5">
                  {profile.logo_url ? (
                    <img src={profile.logo_url} alt={profile.firm_name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div
                      className="w-full h-full rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner"
                      style={{ backgroundColor: themeColor }}
                    >
                      {profile.firm_name.slice(0, 2).toUpperCase() || "MD"}
                    </div>
                  )}
                </div>
              </div>

              {/* Business Info */}
              <div className={`flex-1 text-center sm:text-left space-y-1.5 ${profile.banner_url ? "text-white" : ""}`}>
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${
                      profile.banner_url
                        ? "bg-white/15 text-white border-white/30 backdrop-blur-sm"
                        : "text-slate-400 bg-slate-100/80 border-slate-200/60"
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Verified Storefront</span>
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className={`text-2xl sm:text-3xl font-heading font-black tracking-tight ${profile.banner_url ? "text-white" : "text-slate-900"}`}>
                    {profile.firm_name}
                  </h1>
                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white shadow-xs" title="Verified Catalogue">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {profile.address && (
                  <p className={`text-xs font-medium max-w-xl line-clamp-1 ${profile.banner_url ? "text-white/80" : "text-slate-500"}`}>
                    {profile.address}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="pt-1.5 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  {profile.whatsapp && (
                    <a
                      href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank" rel="noreferrer" title="Chat on WhatsApp"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 border border-emerald-500/20 text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95"
                    >
                      <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`} title="Call Store"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 text-xs font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                      <span>Call</span>
                    </a>
                  )}
                  {profile.address && (
                    <a
                      href={mapsUrl} target="_blank" rel="noreferrer" title="Store Location & Directions"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 text-xs font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
                    >
                      <MapPin className="w-3.5 h-3.5 text-slate-600" />
                      <span>Directions</span>
                    </a>
                  )}
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 text-xs font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
                    title={copied ? "Link Copied!" : "Share Catalogue Link"}
                  >
                    {copied ? (
                      <><Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /><span className="text-emerald-700">Copied!</span></>
                    ) : (
                      <><Share2 className="w-3.5 h-3.5 text-slate-600" /><span>Share</span></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. STICKY CATEGORY CHIPS & SEARCH BAR */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 space-y-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or descriptions..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* Sticky Category Chips Styled with Theme Color */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCategory === "all"
                  ? "shadow-sm scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              style={
                selectedCategory === "all"
                  ? { backgroundColor: themeColor, color: headerTextColor }
                  : {}
              }
            >
              All Items ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.category_id === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? "shadow-sm scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  style={
                    isSelected
                      ? { backgroundColor: themeColor, color: headerTextColor }
                      : {}
                  }
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. PRODUCT GRID */}
      <main className="max-w-4xl mx-auto px-4 py-6 w-full flex-1">
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5">
            {visibleProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => handleOpenProduct(prod)}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {!prod.in_stock && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider shadow">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Variants tag badge if product has options */}
                  {prod.variants && prod.variants.length > 0 && (
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-tight shadow">
                      {prod.variants.length} Options
                    </div>
                  )}
                </div>

                {/* Info + Add to Bag & WhatsApp Actions */}
                <div className="p-3 sm:p-4 space-y-2.5">
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 transition-colors group-hover:text-blue-600">
                    {prod.name}
                  </h3>
                  <div className="flex items-baseline justify-between">
                    <span
                      className="font-heading font-black text-sm sm:text-base tracking-tight"
                      style={{ color: themeColor }}
                    >
                      {formatCurrency(prod.price)}
                    </span>
                  </div>

                  {/* Dual Action: Add to Bag + Direct WhatsApp */}
                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, prod.variants?.[0] || undefined);
                      }}
                      className="col-span-2 flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-heading font-bold text-[11px] border border-slate-200 transition-all active:scale-95"
                      title="Add to Bag"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add</span>
                    </button>

                    <a
                      href={buildWhatsAppEnquiryUrl(
                        profile.whatsapp || "918209192373",
                        prod.name,
                        prod.price,
                        profile.firm_name,
                        typeof window !== "undefined" ? window.location.href : ""
                      )}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="col-span-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-heading font-bold text-[11px] shadow-sm transition-all active:scale-95"
                    >
                      <img src="/whatsapp.png" alt="WhatsApp" className="w-3.5 h-3.5 object-contain" />
                      <span>Enquire</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">No products found</h4>
            <p className="text-xs text-slate-400 mt-0.5">Try searching with a different keyword or category.</p>
          </div>
        )}
      </main>

      {/* 4. PRODUCT DETAIL MODAL */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-fade-in my-auto">
            {/* Modal Image Header */}
            <div className="relative aspect-video sm:aspect-[4/3] bg-slate-950">
              <img
                src={activeProductModal.image_url}
                alt={activeProductModal.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveProductModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!activeProductModal.in_stock && (
                <div className="absolute bottom-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow">
                  Currently Out of Stock
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h2 className="text-xl font-black font-heading text-slate-900">
                    {activeProductModal.name}
                  </h2>
                  <span
                    className="text-2xl font-black font-heading shrink-0"
                    style={{ color: themeColor }}
                  >
                    {formatCurrency(activeProductModal.price)}
                  </span>
                </div>
              </div>

              {/* Product Variants Pill Selectors */}
              {activeProductModal.variants && activeProductModal.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Select Option / Variant</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activeProductModal.variants.map((variant) => {
                      const isSelected = selectedVariant === variant;
                      return (
                        <button
                          key={variant}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold font-heading border transition-all ${
                            isSelected
                              ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {variant}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeProductModal.description && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Product Details & Specifications
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {activeProductModal.description}
                  </p>
                </div>
              )}

              {/* Action CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(activeProductModal, selectedVariant || undefined);
                    setActiveProductModal(null);
                  }}
                  className="w-full py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-heading font-bold text-xs border border-slate-300 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag {selectedVariant ? `(${selectedVariant})` : ""}</span>
                </button>

                <a
                  href={buildWhatsAppEnquiryUrl(
                    profile.whatsapp || "918209192373",
                    activeProductModal.name,
                    activeProductModal.price,
                    profile.firm_name,
                    typeof window !== "undefined" ? window.location.href : "",
                    selectedVariant || undefined
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-black text-white font-heading font-bold text-xs shadow-xl shadow-slate-900/15 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                  <span>Direct WhatsApp Enquiry</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. FLOATING CART BOTTOM ACTION BAR (Shows if cart has items) */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 max-w-xl mx-auto animate-fade-in">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-slate-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl flex items-center justify-between hover:bg-black transition-all hover:scale-[1.01] active:scale-[0.99] border border-slate-700/60"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center relative">
                <ShoppingBag className="w-5 h-5 text-white" />
                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                  {cartTotalItemsCount}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[11px] text-slate-300 font-medium">Your Order Bag</p>
                <p className="text-sm font-black font-heading">{formatCurrency(cartTotalAmount)}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-heading font-bold text-xs bg-white text-slate-900 px-4 py-2 rounded-xl shadow-sm">
              <span>View Bag & Order</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* 6. MULTI-ITEM WHATSAPP CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-fade-in overflow-hidden border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-base">Your Order Bag</h3>
                  <p className="text-[11px] text-slate-500">{cartTotalItemsCount} items selected</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length > 0 ? (
                <div className="space-y-3">
                  {cart.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.selectedVariant}-${idx}`}
                      className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3"
                    >
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-heading font-bold text-xs text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        {item.selectedVariant && (
                          <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md text-[10px] font-bold">
                            {item.selectedVariant}
                          </span>
                        )}
                        <p className="text-xs font-black text-slate-900 font-heading">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shrink-0">
                        <button
                          onClick={() => updateQuantity(idx, -1)}
                          className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-xs w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(idx, 1)}
                          className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Customer Details Form */}
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                      Customer & Delivery Details (Optional)
                    </h5>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <textarea
                      placeholder="Delivery Address or Special Note..."
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      rows={2}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 text-sm">Your bag is empty</p>
                  <p className="text-xs text-slate-400 mt-1">Add items from the catalogue to create an order.</p>
                </div>
              )}
            </div>

            {/* Drawer Checkout Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                  <span>Total Amount</span>
                  <span className="text-lg font-black font-heading text-slate-900">
                    {formatCurrency(cartTotalAmount)}
                  </span>
                </div>

                <a
                  href={buildWhatsAppCartUrl(
                    profile.whatsapp || "918209192373",
                    profile.firm_name,
                    cart.map((c) => ({
                      name: c.product.name,
                      price: c.product.price,
                      quantity: c.quantity,
                      variant: c.selectedVariant,
                    })),
                    cartTotalAmount,
                    customerName,
                    deliveryNote,
                    typeof window !== "undefined" ? window.location.href : ""
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-heading font-bold text-xs shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                  <span>Send Order via WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">{profile.firm_name}</p>
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <span>Powered by</span>
          <Link href="/" className="font-extrabold text-blue-600 hover:underline">
            MyDigiCatalogue
          </Link>
          <span>by</span>
          <span className="font-bold text-slate-600">The Dynamite Techs</span>
        </p>
      </footer>
    </div>
  );
}

