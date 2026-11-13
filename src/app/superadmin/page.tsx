"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  ShieldCheck,
  TrendingUp,
  Users,
  CreditCard,
  ShoppingBag,
  Eye,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Sparkles,
  Smartphone,
  Mail,
  MapPin,
  Layers,
  Lock,
  Unlock,
  FileSpreadsheet,
  LayoutGrid,
  List,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  X,
  Calendar,
  Check,
  Store,
  Receipt,
  ArrowUpRight,
  BadgePercent,
} from "lucide-react";
import confetti from "canvas-confetti";
import { store } from "@/lib/store";
import { RegisteredBusiness, SubscriptionPlan, SubscriptionStatus } from "@/lib/types";
import { formatCurrency, getSubscriptionDetails, slugify } from "@/lib/utils";

export default function SuperAdminPage() {
  const router = useRouter();

  // Authentication / Access state (PIN protected with instant bypass for ease of use)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminPin, setAdminPin] = useState("");
  const [pinError, setPinError] = useState("");

  // Core Data
  const [businesses, setBusinesses] = useState<RegisteredBusiness[]>([]);
  const [stats, setStats] = useState(store.getSuperadminStats());

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SubscriptionStatus>("all");
  const [planFilter, setPlanFilter] = useState<"all" | SubscriptionPlan>("all");
  const [sortBy, setSortBy] = useState<"newest" | "name" | "revenue" | "products" | "views">("newest");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [activeTab, setActiveTab] = useState<"businesses" | "transactions" | "analytics">("businesses");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<RegisteredBusiness | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    firm_name: string;
    slug: string;
    email: string;
    whatsapp: string;
    phone: string;
    address: string;
    theme_color: string;
    subscription_plan: SubscriptionPlan;
    subscription_status: SubscriptionStatus;
    category_count: number;
    product_count: number;
  }>({
    firm_name: "",
    slug: "",
    email: "",
    whatsapp: "",
    phone: "",
    address: "",
    theme_color: "#2563eb",
    subscription_plan: "monthly",
    subscription_status: "active",
    category_count: 3,
    product_count: 12,
  });

  // Load data from store
  const refreshData = () => {
    setBusinesses(store.getRegisteredBusinesses());
    setStats(store.getSuperadminStats());
  };

  useEffect(() => {
    refreshData();
    const handleStoreUpdate = () => refreshData();
    window.addEventListener("mydigicat_store_update", handleStoreUpdate);
    return () => window.removeEventListener("mydigicat_store_update", handleStoreUpdate);
  }, []);

  // Filter and Sort Businesses
  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter((b) => {
        // Status filter
        if (statusFilter !== "all" && b.subscription_status !== statusFilter) return false;
        // Plan filter
        if (planFilter !== "all" && b.subscription_plan !== planFilter) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = b.firm_name.toLowerCase().includes(q);
          const matchSlug = b.slug.toLowerCase().includes(q);
          const matchEmail = b.email.toLowerCase().includes(q);
          const matchWa = b.whatsapp.toLowerCase().includes(q);
          const matchPayId = b.razorpay_payment_id?.toLowerCase().includes(q) ?? false;
          const matchAddress = b.address?.toLowerCase().includes(q) ?? false;
          if (!matchName && !matchSlug && !matchEmail && !matchWa && !matchPayId && !matchAddress) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === "name") {
          return a.firm_name.localeCompare(b.firm_name);
        }
        if (sortBy === "revenue") {
          return (b.subscription_amount || 0) - (a.subscription_amount || 0);
        }
        if (sortBy === "products") {
          return b.product_count - a.product_count;
        }
        if (sortBy === "views") {
          return b.views_count - a.views_count;
        }
        return 0;
      });
  }, [businesses, searchQuery, statusFilter, planFilter, sortBy]);

  // Handle Quick Extend Subscription
  const handleExtend = (id: string, days: number) => {
    store.updateBusinessStatus(id, "active", days);
    refreshData();
  };

  // Handle Status Change
  const handleStatusChange = (id: string, status: SubscriptionStatus) => {
    store.updateBusinessStatus(id, status);
    refreshData();
  };

  // Handle Delete Business
  const handleDelete = (id: string, firmName: string) => {
    if (confirm(`Are you sure you want to delete "${firmName}" and all associated catalogue records from the registry?`)) {
      store.deleteRegisteredBusiness(id);
      refreshData();
    }
  };

  // Handle Switch to Store Owner View
  const handleSwitchToStore = (business: RegisteredBusiness) => {
    store.setProfile({
      id: business.id,
      firm_name: business.firm_name,
      slug: business.slug,
      address: business.address || "",
      phone: business.phone || "",
      whatsapp: business.whatsapp || "",
      email: business.email || "",
      logo_url: business.logo_url || "",
      theme_color: business.theme_color || "#2563eb",
      created_at: business.created_at,
    });
    store.setSubscription({
      id: `sub-${business.id}`,
      user_id: business.id,
      plan: business.subscription_plan,
      amount: business.subscription_amount,
      start_date: business.start_date,
      end_date: business.end_date,
      status: business.subscription_status,
      razorpay_payment_id: business.razorpay_payment_id,
      razorpay_order_id: business.razorpay_order_id,
      created_at: business.created_at,
    });
    router.push("/dashboard");
  };

  // Open Edit Modal
  const openEditModal = (business: RegisteredBusiness) => {
    setSelectedBusiness(business);
    setFormData({
      firm_name: business.firm_name,
      slug: business.slug,
      email: business.email,
      whatsapp: business.whatsapp,
      phone: business.phone || "",
      address: business.address || "",
      theme_color: business.theme_color || "#2563eb",
      subscription_plan: business.subscription_plan,
      subscription_status: business.subscription_status,
      category_count: business.category_count,
      product_count: business.product_count,
    });
    setIsEditModalOpen(true);
  };

  // Submit Add Business
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = store.registerBusiness({
      ...formData,
      slug: formData.slug.trim() || slugify(formData.firm_name),
      is_verified: true,
      views_count: Math.floor(Math.random() * 200 + 20),
    });
    refreshData();
    setIsAddModalOpen(false);
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  // Submit Edit Business
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness) return;
    store.registerBusiness({
      id: selectedBusiness.id,
      ...formData,
      slug: formData.slug.trim() || slugify(formData.firm_name),
      created_at: selectedBusiness.created_at,
      views_count: selectedBusiness.views_count,
      razorpay_payment_id: selectedBusiness.razorpay_payment_id,
      razorpay_order_id: selectedBusiness.razorpay_order_id,
    });
    refreshData();
    setIsEditModalOpen(false);
  };

  // Export Businesses to CSV
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Firm Name",
      "Slug",
      "Email",
      "WhatsApp",
      "Phone",
      "Address",
      "Plan",
      "Status",
      "Amount Paid (INR)",
      "Categories",
      "Products",
      "Views",
      "Payment ID",
      "Registration Date",
    ];

    const rows = businesses.map((b) => [
      b.id,
      `"${b.firm_name.replace(/"/g, '""')}"`,
      b.slug,
      b.email,
      b.whatsapp,
      b.phone || "",
      `"${(b.address || "").replace(/"/g, '""')}"`,
      b.subscription_plan,
      b.subscription_status,
      b.subscription_amount,
      b.category_count,
      b.product_count,
      b.views_count,
      b.razorpay_payment_id || "",
      new Date(b.created_at).toLocaleDateString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mydigicat_registered_businesses_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Businesses to JSON
  const exportToJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(businesses, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mydigicat_registry_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // PIN Verification Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-slate-900">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">SuperAdmin Security Gate</h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter SuperAdmin access PIN to inspect enterprise registries and manage merchants.
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{pinError}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (adminPin === "9999" || adminPin === "admin" || adminPin === "1234") {
                setIsAuthenticated(true);
                setPinError("");
              } else {
                setPinError("Invalid SuperAdmin PIN. (Use 9999 or click Instant Access below)");
              }
            }}
            className="space-y-4"
          >
            <input
              type="password"
              placeholder="Enter PIN (e.g. 9999)"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-mono py-3 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-sm text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock SuperAdmin Cockpit</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
            <Link href="/login" className="text-slate-500 hover:text-slate-800 transition-colors">
              ← Back to Login
            </Link>
            <button
              type="button"
              onClick={() => setIsAuthenticated(true)}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              One-Click Instant Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* ─── TOP SYSTEM BAR ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3.5">
            <Link href="/" className="group py-1">
              <img
                src="/MyDigiCatalogue Digital Bookmark Logo.png"
                alt="MyDigiCatalogue"
                className="h-12 sm:h-14 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
              />
            </Link>
            <div className="border-l border-slate-200 pl-3.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
                  SuperAdmin Control
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Business Registry
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Business Entry</span>
              <span className="sm:hidden">Add</span>
            </button>

            <button
              type="button"
              onClick={exportToCSV}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all flex items-center gap-1.5"
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            <button
              type="button"
              onClick={refreshData}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="Refresh Registry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/dashboard"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
            >
              <Store className="w-4 h-4 text-indigo-600" />
              <span>Owner App</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN COCKPIT BODY ──────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* TOP GLOWING METRIC KPI CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Registered Businesses */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Businesses
              </span>
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {stats.totalBusinesses}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> 100% Onboarded
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-2">
              <span className="text-emerald-600 font-bold">{stats.activeSubscriptions} Active</span> •{" "}
              <span className="text-amber-600 font-bold">{stats.graceSubscriptions} Grace</span> •{" "}
              <span className="text-rose-600 font-bold">{stats.expiredSubscriptions} Expired</span>
            </p>
          </div>

          {/* KPI 2: Gross Subscription Revenue */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Platform Revenue
              </span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-600">
                {formatCurrency(stats.totalRevenue)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
              <BadgePercent className="w-3.5 h-3.5 text-emerald-600" />
              <span>Razorpay Verified Merchant Collections</span>
            </p>
          </div>

          {/* KPI 3: Live Catalogues & Inventory */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Products Listed
              </span>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {stats.totalProducts}
              </span>
              <span className="text-xs font-semibold text-slate-500">SKUs in Catalogues</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Avg {Math.round(stats.totalProducts / Math.max(1, stats.totalBusinesses))} items per store
            </p>
          </div>

          {/* KPI 4: Customer Impressions & Views */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Consumer Traffic
              </span>
              <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {stats.totalViews.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-sky-600">Total Visits</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              QR Code Scans & Direct WhatsApp Shares
            </p>
          </div>
        </section>

        {/* ─── CONTROLS, SEARCH & FILTER TOOLBAR ────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by store name, slug, email, phone, city, or payment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Status Filters */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
                {(["all", "active", "grace", "expired"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                      statusFilter === st
                        ? st === "active"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : st === "grace"
                          ? "bg-amber-500 text-white shadow-sm"
                          : st === "expired"
                          ? "bg-rose-600 text-white shadow-sm"
                          : "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {st === "all" ? "All Status" : st}
                  </button>
                ))}
              </div>

              {/* Plan Filter */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 flex-wrap gap-1">
                {(
                  [
                    { id: "all", label: "All Plans" },
                    { id: "monthly_100", label: "1M (100) • ₹999" },
                    { id: "monthly_160", label: "1M (160) • ₹1400" },
                    { id: "six_month_100", label: "6M (100) • ₹5499" },
                    { id: "six_month_160", label: "6M (160) • ₹6499" },
                  ] as const
                ).map((pl) => (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() => setPlanFilter(pl.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      planFilter === pl.id
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {pl.label}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="name">Sort: Alphabetical (A-Z)</option>
                <option value="revenue">Sort: Highest Revenue</option>
                <option value="products">Sort: Most Products</option>
                <option value="views">Sort: Most Traffic</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-xl transition-colors ${
                    viewMode === "table" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-xl transition-colors ${
                    viewMode === "grid" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Grid Cards View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-900">{filteredBusinesses.length}</strong> of{" "}
              <strong className="text-slate-900">{businesses.length}</strong> registered businesses
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={exportToJSON}
                className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>JSON Backup</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to clear all registered businesses?")) {
                    store.resetRegistryToSeed();
                    refreshData();
                  }
                }}
                className="text-slate-400 hover:text-red-600 text-[11px] font-medium transition-colors"
              >
                Clear Registry
              </button>
            </div>
          </div>
        </section>

        {/* ─── REGISTERED BUSINESS ENTRIES DIRECTORY ─────────────────────────── */}
        {filteredBusinesses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Registered Businesses Match Filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try clearing your search query or adjusting your status and plan filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPlanFilter("all");
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === "table" ? (
          /* TABLE VIEW */
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-5">Business & Store</th>
                    <th className="py-4 px-4">Owner Contact</th>
                    <th className="py-4 px-4">Inventory & Traffic</th>
                    <th className="py-4 px-4">Subscription Plan</th>
                    <th className="py-4 px-4">Status & Validity</th>
                    <th className="py-4 px-4">Payment Ref</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBusinesses.map((biz) => {
                    const subDetails = getSubscriptionDetails(biz.end_date);
                    return (
                      <tr key={biz.id} className="hover:bg-slate-50 transition-colors group">
                        {/* Business Name & Slug */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
                              style={{ backgroundColor: biz.theme_color || "#2563eb" }}
                            >
                              {biz.logo_url ? (
                                <img
                                  src={biz.logo_url}
                                  alt={biz.firm_name}
                                  className="w-full h-full object-cover rounded-2xl"
                                />
                              ) : (
                                biz.firm_name.substring(0, 2).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {biz.firm_name}
                                </span>
                                {biz.is_verified && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                                <span className="font-mono text-indigo-600 font-semibold">/c/{biz.slug}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500">
                                  {new Date(biz.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Owner Contact */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                              <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <a
                                href={`https://wa.me/${biz.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono hover:text-emerald-600 transition-colors"
                              >
                                +{biz.whatsapp || "N/A"}
                              </a>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[150px]">{biz.email || "N/A"}</span>
                            </div>
                            {biz.address && (
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[150px]">{biz.address}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Inventory & Traffic */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-800">
                              <ShoppingBag className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span className="font-bold text-slate-900">{biz.product_count}</span>
                              <span className="text-slate-500 text-[11px]">products</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                              <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{biz.category_count} categories</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-sky-600 font-semibold">
                              <Eye className="w-3.5 h-3.5 shrink-0" />
                              <span>{biz.views_count.toLocaleString()} visits</span>
                            </div>
                          </div>
                        </td>

                        {/* Subscription Plan */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold capitalize border border-slate-200">
                              {biz.subscription_plan}
                            </span>
                            <div className="font-black text-slate-900 text-xs">
                              {formatCurrency(biz.subscription_amount || 399)}
                            </div>
                          </div>
                        </td>

                        {/* Status & Validity */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                                biz.subscription_status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : biz.subscription_status === "grace"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  biz.subscription_status === "active"
                                    ? "bg-emerald-500"
                                    : biz.subscription_status === "grace"
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                                }`}
                              />
                              {biz.subscription_status}
                            </span>
                            <p className="text-[10px] text-slate-500">
                              Exp: {new Date(biz.end_date).toLocaleDateString()}
                            </p>
                          </div>
                        </td>

                        {/* Payment Ref */}
                        <td className="py-4 px-4">
                          <div className="font-mono text-[11px] space-y-0.5">
                            <span className="text-slate-600 block truncate max-w-[120px]">
                              {biz.razorpay_payment_id || "pay_Sandbox"}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                              {biz.razorpay_order_id || "order_Direct"}
                            </span>
                          </div>
                        </td>

                        {/* Quick Action Buttons */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Public Link */}
                            <Link
                              href={`/c/${biz.slug}`}
                              target="_blank"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white border border-slate-200 transition-all shadow-sm"
                              title="Open Public Catalogue"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            {/* Open Store Dashboard */}
                            <button
                              type="button"
                              onClick={() => handleSwitchToStore(biz)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-purple-600 text-slate-600 hover:text-white border border-slate-200 transition-all shadow-sm"
                              title="Manage in Store Owner Dashboard"
                            >
                              <Store className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Business */}
                            <button
                              type="button"
                              onClick={() => openEditModal(biz)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-all"
                              title="Edit Registry Entry"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Extend +30 Days */}
                            <button
                              type="button"
                              onClick={() => handleExtend(biz.id, 30)}
                              className="px-2 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold transition-all"
                              title="Extend subscription by +30 days"
                            >
                              +30d
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(biz.id, biz.firm_name)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-all"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* GRID CARDS VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBusinesses.map((biz) => {
              const subDetails = getSubscriptionDetails(biz.end_date);
              return (
                <div
                  key={biz.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Store Identity & Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shrink-0 shadow-sm"
                          style={{ backgroundColor: biz.theme_color || "#2563eb" }}
                        >
                          {biz.logo_url ? (
                            <img
                              src={biz.logo_url}
                              alt={biz.firm_name}
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            biz.firm_name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900">{biz.firm_name}</h3>
                          <p className="font-mono text-xs text-indigo-600 font-semibold">/c/{biz.slug}</p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          biz.subscription_status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : biz.subscription_status === "grace"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {biz.subscription_status}
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-slate-500 block text-[10px]">WhatsApp:</span>
                        <a
                          href={`https://wa.me/${biz.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono font-bold text-slate-800 hover:text-emerald-600"
                        >
                          +{biz.whatsapp || "N/A"}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Plan Amount:</span>
                        <strong className="text-slate-900 font-black">
                          {formatCurrency(biz.subscription_amount || 399)} ({biz.subscription_plan})
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Products / SKU:</span>
                        <strong className="text-purple-600">{biz.product_count} items</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Traffic / Views:</span>
                        <strong className="text-sky-600">{biz.views_count.toLocaleString()} visits</strong>
                      </div>
                    </div>

                    {/* Expiry & Payment Ref */}
                    <div className="flex justify-between items-center text-[11px] text-slate-500 px-1">
                      <span>Exp: {new Date(biz.end_date).toLocaleDateString()}</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {biz.razorpay_payment_id || "pay_Direct"}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/c/${biz.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 text-xs font-bold text-slate-700 hover:text-white border border-slate-200 transition-all flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Catalogue</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleSwitchToStore(biz)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-600 text-xs font-bold text-slate-700 hover:text-white border border-slate-200 transition-all flex items-center gap-1"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleExtend(biz.id, 30)}
                        className="px-2 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold"
                        title="Extend 30 days"
                      >
                        +30d
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(biz)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(biz.id, biz.firm_name)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── MODAL: ADD BUSINESS ENTRY ──────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 my-8 animate-fade-in text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-slate-900">Add Registered Business</h3>
                  <p className="text-xs text-slate-500">Register a merchant entry directly into the platform</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Business / Firm Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saffron Heritage Sarees"
                  value={formData.firm_name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      firm_name: name,
                      slug: formData.slug ? formData.slug : slugify(name),
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Store Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="saffron-sarees"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Enquiry No. *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="919876543210"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/[^0-9]/g, "") })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="owner@store.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone (Landline / Alt)
                  </label>
                  <input
                    type="text"
                    placeholder="044-28156789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Physical Address / City
                </label>
                <input
                  type="text"
                  placeholder="Commercial Street, Bengaluru, Karnataka 560001"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subscription Plan
                  </label>
                  <select
                    value={formData.subscription_plan}
                    onChange={(e) => setFormData({ ...formData, subscription_plan: e.target.value as SubscriptionPlan })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="monthly_100">1 Month (100 Products) - ₹999</option>
                    <option value="monthly_160">1 Month (160 Products) - ₹1,400</option>
                    <option value="six_month_100">6 Months (100 Products) - ₹5,499</option>
                    <option value="six_month_160">6 Months (160 Products) - ₹6,499</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subscription Status
                  </label>
                  <select
                    value={formData.subscription_status}
                    onChange={(e) => setFormData({ ...formData, subscription_status: e.target.value as SubscriptionStatus })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">Active (Paid)</option>
                    <option value="grace">Grace Period</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold shadow-lg shadow-indigo-600/30"
                >
                  Register Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: EDIT BUSINESS ENTRY ─────────────────────────────────────── */}
      {isEditModalOpen && selectedBusiness && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 my-8 animate-fade-in text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-slate-900">Edit Business Record</h3>
                  <p className="text-xs text-slate-500">Update merchant entry details & subscription status</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Business / Firm Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.firm_name}
                  onChange={(e) => setFormData({ ...formData, firm_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Store Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Enquiry No.
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subscription Plan
                  </label>
                  <select
                    value={formData.subscription_plan}
                    onChange={(e) => setFormData({ ...formData, subscription_plan: e.target.value as SubscriptionPlan })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="monthly_100">1 Month (100 Products) - ₹999</option>
                    <option value="monthly_160">1 Month (160 Products) - ₹1,400</option>
                    <option value="six_month_100">6 Months (100 Products) - ₹5,499</option>
                    <option value="six_month_160">6 Months (160 Products) - ₹6,499</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subscription Status
                  </label>
                  <select
                    value={formData.subscription_status}
                    onChange={(e) => setFormData({ ...formData, subscription_status: e.target.value as SubscriptionStatus })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">Active (Paid)</option>
                    <option value="grace">Grace Period</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-lg shadow-indigo-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
