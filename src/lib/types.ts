export type SubscriptionPlan = 'monthly';

export type SubscriptionStatus = 'active' | 'grace' | 'expired';

export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  badge?: string;
  tagline: string;
  durationLabel: string;
  durationMonths: number;
  durationDays: number;
  amount: number;
  productLimit: number;
  popular?: boolean;
  savings?: string;
}

export const SUBSCRIPTION_PLANS: Record<string, PlanConfig> = {
  monthly: {
    id: "monthly",
    name: "1 Month Plan",
    tagline: "Full access to your digital catalogue for 30 days",
    durationLabel: "1 Month (30 Days)",
    durationMonths: 1,
    durationDays: 30,
    amount: 399,
    productLimit: 100,
    popular: true,
    badge: "Best Value",
  },
};

export function getPlanConfig(plan?: SubscriptionPlan | string | null): PlanConfig {
  return SUBSCRIPTION_PLANS.monthly;
}

export interface Profile {
  id: string;
  firm_name: string;
  slug: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  logo_url: string;
  banner_url?: string;
  theme_color: string;
  created_at: string;
  updated_at?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  amount: number;
  start_date: string;
  end_date: string;
  status: SubscriptionStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  category_id?: string | null;
  name: string;
  description: string;
  price: number;
  image_url: string;
  in_stock: boolean;
  is_active: boolean;
  variants?: string[]; // e.g. ["S", "M", "L", "XL"] or ["Gold", "Silver"] or ["250g", "500g"]
  views_count?: number; // Per-product view analytics
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface CatalogueView {
  id: string;
  user_id: string;
  viewed_at: string;
}

export interface PublicCatalogueData {
  profile: Profile;
  subscription: Subscription | null;
  categories: Category[];
  products: Product[];
  isAvailable: boolean; // false if subscription is expired beyond grace period
  statusMessage?: string;
}

export interface RegisteredBusiness {
  id: string;
  firm_name: string;
  slug: string;
  email: string;
  whatsapp: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  theme_color?: string;
  category_count: number;
  product_count: number;
  views_count: number;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  subscription_amount: number;
  start_date: string;
  end_date: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  created_at: string;
  is_verified: boolean;
}

export interface SuperadminStats {
  totalBusinesses: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  graceSubscriptions: number;
  totalRevenue: number;
  totalProducts: number;
  totalViews: number;
}

