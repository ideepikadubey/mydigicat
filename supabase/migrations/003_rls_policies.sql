-- ==============================================================================
-- 003_rls_policies.sql : Row Level Security (RLS) & Storage Policies
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue_views ENABLE ROW LEVEL SECURITY;

-- Helper function: Is subscription active or in grace period?
CREATE OR REPLACE FUNCTION public.is_subscription_valid(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    sub_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO sub_count
    FROM public.subscriptions
    WHERE user_id = p_user_id
      AND (
          status = 'active'
          OR (status = 'grace' AND end_date + INTERVAL '3 days' >= now())
          OR (end_date + INTERVAL '3 days' >= now())
      );
    RETURN sub_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES POLICIES
-- Owner can do all operations on their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Public can view profile ONLY IF subscription is active/in grace
CREATE POLICY "Public can view active catalogues"
ON public.profiles FOR SELECT
TO anon, authenticated
USING (public.is_subscription_valid(id));

-- 2. SUBSCRIPTIONS POLICIES
CREATE POLICY "Users can view own subscriptions"
ON public.subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
ON public.subscriptions FOR ALL
TO service_role
USING (true);

-- 3. CATEGORIES POLICIES
CREATE POLICY "Users can manage own categories"
ON public.categories FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view categories of active catalogues"
ON public.categories FOR SELECT
TO anon, authenticated
USING (public.is_subscription_valid(user_id));

-- 4. PRODUCTS POLICIES
CREATE POLICY "Users can manage own products"
ON public.products FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view active products of active catalogues"
ON public.products FOR SELECT
TO anon, authenticated
USING (
    is_active = true 
    AND public.is_subscription_valid(user_id)
);

-- 5. CATALOGUE VIEWS POLICIES
CREATE POLICY "Users can view own catalogue views"
ON public.catalogue_views FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert catalogue view"
ON public.catalogue_views FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 6. STORAGE BUCKETS (Run in Supabase dashboard or storage API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;
