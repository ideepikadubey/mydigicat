import {
  Profile,
  Category,
  Product,
  Subscription,
  CatalogueView,
  PublicCatalogueData,
  RegisteredBusiness,
  SuperadminStats,
  SubscriptionPlan,
  SubscriptionStatus,
  getPlanConfig,
  SUBSCRIPTION_PLANS,
} from "./types";
import { getSubscriptionDetails } from "./utils";

const DEFAULT_USER_ID = "local-user-001";

// ─── Store version: bump this to auto-clear old localStorage caches ───────────
const STORE_VERSION = "production-clean-v1";

export const BLANK_PROFILE: Profile = {
  id: DEFAULT_USER_ID,
  firm_name: "",
  slug: "",
  address: "",
  phone: "",
  whatsapp: "",
  email: "",
  logo_url: "",
  banner_url: "",
  theme_color: "#2563eb",
  created_at: new Date().toISOString(),
};

export const BLANK_SUBSCRIPTION: Subscription = {
  id: "",
  user_id: DEFAULT_USER_ID,
  plan: "monthly",
  amount: 399,
  start_date: "",
  end_date: "",
  status: "expired",
  razorpay_order_id: "",
  razorpay_payment_id: "",
  created_at: new Date().toISOString(),
};

export const BLANK_CATEGORIES: Category[] = [];

export const BLANK_PRODUCTS: Product[] = [];

// Production Business Registry (Populated dynamically as merchants register)
export const SEED_BUSINESS_REGISTRY: RegisteredBusiness[] = [];

const STORAGE_KEYS = {
  PROFILE: "mydigicat_profile",
  SUBSCRIPTION: "mydigicat_subscription",
  CATEGORIES: "mydigicat_categories",
  PRODUCTS: "mydigicat_products",
  VIEWS_COUNT: "mydigicat_views_count",
  AUTH_USER: "mydigicat_auth_user",
  REGISTRY: "mydigicat_business_registry",
  VERSION: "mydigicat_store_version",
};

/**
 * In-memory / localStorage reactive Store
 */
class CatalogueStore {
  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  // Auto-clear stale localStorage if store version changed (preserves login session and remember-me)
  private checkVersion(): void {
    if (!this.isBrowser()) return;
    const saved = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (saved !== STORE_VERSION) {
      const preservedAuth = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      const preservedAdmin = localStorage.getItem("mydigicat_admin_auth");
      const preservedRememberedEmail = localStorage.getItem("mydigicat_remembered_email");

      // Wipe old schema data
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(STORAGE_KEYS.VERSION, STORE_VERSION);

      // Restore authentication session if Remember Me was active
      if (preservedAuth) localStorage.setItem(STORAGE_KEYS.AUTH_USER, preservedAuth);
      if (preservedAdmin) localStorage.setItem("mydigicat_admin_auth", preservedAdmin);
      if (preservedRememberedEmail) localStorage.setItem("mydigicat_remembered_email", preservedRememberedEmail);
    }
  }

  // Profile
  getProfile(): Profile {
    if (!this.isBrowser()) return BLANK_PROFILE;
    this.checkVersion();
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!stored) return BLANK_PROFILE;
    try {
      return JSON.parse(stored);
    } catch {
      return BLANK_PROFILE;
    }
  }

  setProfile(profile: Profile): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    this.syncProfileToRegistry(profile);
    this.dispatchUpdate();
  }

  // Subscription
  getSubscription(): Subscription {
    if (!this.isBrowser()) return BLANK_SUBSCRIPTION;
    const stored = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (!stored) return BLANK_SUBSCRIPTION;
    try {
      return JSON.parse(stored);
    } catch {
      return BLANK_SUBSCRIPTION;
    }
  }

  setSubscription(subscription: Subscription): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));
    this.syncProfileToRegistry();
    this.dispatchUpdate();
  }

  private syncProfileToRegistry(passedProfile?: Profile): void {
    try {
      const prof = passedProfile || this.getProfile();
      if (!prof.firm_name && !prof.slug) return;
      const sub = this.getSubscription();
      const cats = this.getCategories();
      const prods = this.getProducts();
      const views = this.getViewsCount();
      this.registerBusiness({
        id: prof.id || DEFAULT_USER_ID,
        firm_name: prof.firm_name || "Active Store",
        slug: prof.slug || "store",
        email: prof.email || "",
        whatsapp: prof.whatsapp || "",
        phone: prof.phone || "",
        address: prof.address || "",
        logo_url: prof.logo_url || "",
        theme_color: prof.theme_color || "#2563eb",
        category_count: cats.length,
        product_count: prods.length,
        views_count: views,
        subscription_plan: sub.plan || "monthly",
        subscription_status: sub.status || "active",
        subscription_amount: sub.amount || 399,
        start_date: sub.start_date || new Date().toISOString(),
        end_date: sub.end_date || new Date(Date.now() + 30 * 86400000).toISOString(),
        razorpay_payment_id: sub.razorpay_payment_id,
        razorpay_order_id: sub.razorpay_order_id,
        created_at: prof.created_at || new Date().toISOString(),
        is_verified: true,
      });
    } catch (e) {
      console.warn("Failed syncing profile to registry:", e);
    }
  }

  // Categories
  getCategories(): Category[] {
    if (!this.isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  setCategories(categories: Category[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.dispatchUpdate();
  }

  addCategory(name: string): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      user_id: DEFAULT_USER_ID,
      name: name.trim(),
      sort_order: categories.length + 1,
      created_at: new Date().toISOString(),
    };
    categories.push(newCat);
    this.setCategories(categories);
    return newCat;
  }

  updateCategory(id: string, name: string): void {
    const categories = this.getCategories().map((c) =>
      c.id === id ? { ...c, name: name.trim() } : c
    );
    this.setCategories(categories);
  }

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter((c) => c.id !== id);
    this.setCategories(categories);
    // Unlink products assigned to this category
    const products = this.getProducts().map((p) =>
      p.category_id === id ? { ...p, category_id: null } : p
    );
    this.setProducts(products);
  }

  // Products (Plan-aware limit enforcement: 100 or 160)
  getProducts(): Product[] {
    if (!this.isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  setProducts(products: Product[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.dispatchUpdate();
  }

  getProductLimit(): number {
    const sub = this.getSubscription();
    const config = getPlanConfig(sub?.plan);
    return config.productLimit || 100;
  }

  addProduct(productData: Omit<Product, "id" | "user_id" | "created_at">): Product {
    const products = this.getProducts();
    const maxLimit = this.getProductLimit();
    if (products.length >= maxLimit) {
      throw new Error(`Product limit reached: Maximum ${maxLimit} products allowed under your active plan. Please upgrade your subscription for higher capacity.`);
    }

    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      user_id: DEFAULT_USER_ID,
      sort_order: products.length + 1,
      created_at: new Date().toISOString(),
    };
    products.unshift(newProd);
    this.setProducts(products);
    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    const products = this.getProducts().map((p) =>
      p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    this.setProducts(products);
  }

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.setProducts(products);
  }

  deleteBulkProducts(ids: string[]): void {
    const idSet = new Set(ids);
    const products = this.getProducts().filter((p) => !idSet.has(p.id));
    this.setProducts(products);
  }

  // Analytics Views
  getViewsCount(): number {
    if (!this.isBrowser()) return 0;
    const stored = localStorage.getItem(STORAGE_KEYS.VIEWS_COUNT);
    return stored ? parseInt(stored, 10) : 0;
  }

  incrementView(): void {
    if (!this.isBrowser()) return;
    const current = this.getViewsCount();
    localStorage.setItem(STORAGE_KEYS.VIEWS_COUNT, (current + 1).toString());
    this.dispatchUpdate();
  }

  incrementProductView(productId: string): void {
    if (!this.isBrowser() || !productId) return;
    const products = this.getProducts();
    const updated = products.map((p) =>
      p.id === productId ? { ...p, views_count: (p.views_count || 0) + 1 } : p
    );
    this.setProducts(updated);
  }

  // Plan Expiry Simulation Helper
  simulatePlanStatus(status: "active" | "warning-7d" | "warning-1d" | "grace" | "expired"): void {
    const sub = this.getSubscription();
    const now = Date.now();
    let newEndDate: Date;

    if (status === "active") {
      newEndDate = new Date(now + 45 * 24 * 60 * 60 * 1000); // 45 days left
    } else if (status === "warning-7d") {
      newEndDate = new Date(now + 6 * 24 * 60 * 60 * 1000); // 6 days left
    } else if (status === "warning-1d") {
      newEndDate = new Date(now + 18 * 60 * 60 * 1000); // 18 hours left
    } else if (status === "grace") {
      newEndDate = new Date(now - 1 * 24 * 60 * 60 * 1000); // Expired 1 day ago (in 3-day grace)
    } else {
      newEndDate = new Date(now - 5 * 24 * 60 * 60 * 1000); // Expired 5 days ago (past grace)
    }

    const calculated = getSubscriptionDetails(newEndDate.toISOString());
    this.setSubscription({
      ...sub,
      end_date: newEndDate.toISOString(),
      status: calculated.status,
    });
  }

  // Batch Fill Products (To test the 100 limit in 1-click)
  fillToLimit(targetCount: number = 100): void {
    const existing = this.getProducts();
    const categories = this.getCategories();
    const defaultCatId = categories[0]?.id || null;
    const needed = Math.max(0, targetCount - existing.length);
    
    const sampleNames = [
      "Vintage Leather Duffel Bag", "Handmade Suede Belt", "Hand-stitched Passport Cover",
      "Executive Laptop Sleeve", "Bespoke Oxford Shoes", "Distressed Leather Journal",
      "Solid Brass Key Hook", "Classic Monogram Card Case", "Oiled Leather Camera Strap",
      "Luxury Cigar Case", "Handmade Travel Toiletry Kit", "Woven Leather Bracelet"
    ];
    
    const sampleImages = [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606503829068-d069b2756616?w=800&auto=format&fit=crop&q=80",
    ];

    const added: Product[] = [];
    for (let i = 0; i < needed; i++) {
      const idx = existing.length + i + 1;
      added.push({
        id: `prod-bulk-${Date.now()}-${i}`,
        user_id: DEFAULT_USER_ID,
        category_id: defaultCatId,
        name: `${sampleNames[i % sampleNames.length]} #${idx}`,
        description: `Premium hand-crafted catalog specimen #${idx} designed with highest grade materials.`,
        price: Math.floor(Math.random() * 4000 + 499),
        image_url: sampleImages[i % sampleImages.length],
        in_stock: true,
        is_active: true,
        sort_order: idx,
        created_at: new Date().toISOString(),
      });
    }

    this.setProducts([...existing, ...added]);
  }

  // Clear all data back to blank state
  resetToDemo(): void {
    if (!this.isBrowser()) return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.setItem(STORAGE_KEYS.VERSION, STORE_VERSION);
    this.dispatchUpdate();
  }

  // ─── SuperAdmin Business Registry ───────────────────────────────────────────
  getRegisteredBusinesses(): RegisteredBusiness[] {
    if (!this.isBrowser()) return SEED_BUSINESS_REGISTRY;
    this.checkVersion();
    const stored = localStorage.getItem(STORAGE_KEYS.REGISTRY);
    if (!stored) {
      // Seed with initial realistic data + current active profile if valid
      const initial = [...SEED_BUSINESS_REGISTRY];
      const activeProf = this.getProfile();
      if (activeProf.firm_name && activeProf.slug) {
        const sub = this.getSubscription();
        const cats = this.getCategories();
        const prods = this.getProducts();
        const views = this.getViewsCount();
        initial.unshift({
          id: activeProf.id || DEFAULT_USER_ID,
          firm_name: activeProf.firm_name,
          slug: activeProf.slug,
          email: activeProf.email || "owner@business.com",
          whatsapp: activeProf.whatsapp || "919876543210",
          phone: activeProf.phone || "",
          address: activeProf.address || "",
          logo_url: activeProf.logo_url || "",
          theme_color: activeProf.theme_color || "#2563eb",
          category_count: cats.length,
          product_count: prods.length,
          views_count: views || 120,
          subscription_plan: sub?.plan || "monthly",
          subscription_status: sub?.status || "active",
          subscription_amount: sub?.amount || 399,
          start_date: sub?.start_date || new Date().toISOString(),
          end_date: sub?.end_date || new Date(Date.now() + 30 * 86400000).toISOString(),
          razorpay_payment_id: sub?.razorpay_payment_id || "pay_LiveDemo12345",
          razorpay_order_id: sub?.razorpay_order_id || "order_LiveDemo6789",
          created_at: activeProf.created_at || new Date().toISOString(),
          is_verified: true,
        });
      }
      localStorage.setItem(STORAGE_KEYS.REGISTRY, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return SEED_BUSINESS_REGISTRY;
    }
  }

  setRegisteredBusinesses(list: RegisteredBusiness[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.REGISTRY, JSON.stringify(list));
    this.dispatchUpdate();
  }

  registerBusiness(businessData: Partial<RegisteredBusiness>): RegisteredBusiness {
    const list = this.getRegisteredBusinesses();
    const existingIndex = list.findIndex(
      (b) => (businessData.id && b.id === businessData.id) || (businessData.slug && b.slug === businessData.slug)
    );

    const planConfig = getPlanConfig(businessData.subscription_plan);
    const now = new Date();
    const days = planConfig.durationDays;
    const amount = planConfig.amount;

    const fullRecord: RegisteredBusiness = {
      id: businessData.id || `biz-${Date.now()}`,
      firm_name: businessData.firm_name || "New Business",
      slug: businessData.slug || `biz-${Date.now()}`,
      email: businessData.email || "",
      whatsapp: businessData.whatsapp || "",
      phone: businessData.phone || "",
      address: businessData.address || "",
      logo_url: businessData.logo_url || "",
      theme_color: businessData.theme_color || "#2563eb",
      category_count: businessData.category_count ?? 0,
      product_count: businessData.product_count ?? 0,
      views_count: businessData.views_count ?? 0,
      subscription_plan: (businessData.subscription_plan as SubscriptionPlan) || "monthly",
      subscription_status: businessData.subscription_status || "active",
      subscription_amount: businessData.subscription_amount || amount,
      start_date: businessData.start_date || now.toISOString(),
      end_date: businessData.end_date || new Date(now.getTime() + days * 86400000).toISOString(),
      razorpay_payment_id: businessData.razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 12)}`,
      razorpay_order_id: businessData.razorpay_order_id || `order_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      created_at: businessData.created_at || now.toISOString(),
      is_verified: businessData.is_verified ?? true,
    };

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...fullRecord };
    } else {
      list.unshift(fullRecord);
    }

    this.setRegisteredBusinesses(list);
    return fullRecord;
  }

  updateBusinessStatus(id: string, status: SubscriptionStatus, extendDays?: number): void {
    const list = this.getRegisteredBusinesses().map((b) => {
      if (b.id !== id) return b;
      let newEndDate = b.end_date;
      if (extendDays) {
        const currentEnd = new Date(b.end_date).getTime();
        const base = Math.max(Date.now(), currentEnd);
        newEndDate = new Date(base + extendDays * 86400000).toISOString();
      }
      return {
        ...b,
        subscription_status: status,
        end_date: newEndDate,
      };
    });
    this.setRegisteredBusinesses(list);
  }

  deleteRegisteredBusiness(id: string): void {
    const list = this.getRegisteredBusinesses().filter((b) => b.id !== id);
    this.setRegisteredBusinesses(list);
  }

  resetRegistryToSeed(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.REGISTRY, JSON.stringify([]));
    this.dispatchUpdate();
  }

  getSuperadminStats(): SuperadminStats {
    const list = this.getRegisteredBusinesses();
    const active = list.filter((b) => b.subscription_status === "active").length;
    const expired = list.filter((b) => b.subscription_status === "expired").length;
    const grace = list.filter((b) => b.subscription_status === "grace").length;
    const totalRevenue = list.reduce((sum, b) => sum + (b.subscription_amount || 0), 0);
    const totalProducts = list.reduce((sum, b) => sum + (b.product_count || 0), 0);
    const totalViews = list.reduce((sum, b) => sum + (b.views_count || 0), 0);

    return {
      totalBusinesses: list.length,
      activeSubscriptions: active,
      expiredSubscriptions: expired,
      graceSubscriptions: grace,
      totalRevenue,
      totalProducts,
      totalViews,
    };
  }

  // Event dispatcher for cross-component reactive updates
  private dispatchUpdate(): void {
    if (this.isBrowser()) {
      window.dispatchEvent(new Event("mydigicat_store_update"));
    }
  }

  // Get Public Catalogue Data by Slug
  getPublicCatalogueBySlug(slug: string): PublicCatalogueData | null {
    const profile = this.getProfile();
    // Check if active profile matches
    if (profile.slug && profile.slug.toLowerCase() === slug.toLowerCase()) {
      const subscription = this.getSubscription();
      const subDetails = getSubscriptionDetails(subscription?.end_date);
      const isAvailable = !subDetails.isExpired;
      const categories = this.getCategories().sort((a, b) => a.sort_order - b.sort_order);
      const products = this.getProducts()
        .filter((p) => p.is_active)
        .sort((a, b) => a.sort_order - b.sort_order);

      return {
        profile,
        subscription,
        categories,
        products,
        isAvailable,
        statusMessage: subDetails.message,
      };
    }

    // Check in registered business registry
    const regList = this.getRegisteredBusinesses();
    const matched = regList.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
    if (!matched) return null;

    const subDetails = getSubscriptionDetails(matched.end_date);
    const isAvailable = !subDetails.isExpired;

    return {
      profile: {
        id: matched.id,
        firm_name: matched.firm_name,
        slug: matched.slug,
        address: matched.address || "",
        phone: matched.phone || "",
        whatsapp: matched.whatsapp || "",
        email: matched.email || "",
        logo_url: matched.logo_url || "",
        theme_color: matched.theme_color || "#2563eb",
        created_at: matched.created_at,
      },
      subscription: {
        id: `sub-${matched.id}`,
        user_id: matched.id,
        plan: matched.subscription_plan,
        amount: matched.subscription_amount,
        start_date: matched.start_date,
        end_date: matched.end_date,
        status: matched.subscription_status,
        razorpay_payment_id: matched.razorpay_payment_id,
        razorpay_order_id: matched.razorpay_order_id,
        created_at: matched.created_at,
      },
      categories: [
        { id: "c1", user_id: matched.id, name: "Featured Collections", sort_order: 1, created_at: matched.created_at },
        { id: "c2", user_id: matched.id, name: "Best Sellers", sort_order: 2, created_at: matched.created_at },
      ],
      products: [
        {
          id: `p-${matched.id}-1`,
          user_id: matched.id,
          category_id: "c1",
          name: `${matched.firm_name} Signature Selection`,
          description: `Exclusive catalog collection from ${matched.firm_name}. Enquire directly on WhatsApp.`,
          price: 1499,
          image_url: matched.logo_url || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
          in_stock: true,
          is_active: true,
          sort_order: 1,
          created_at: matched.created_at,
        },
      ],
      isAvailable,
      statusMessage: subDetails.message,
    };
  }
}

export const store = new CatalogueStore();
