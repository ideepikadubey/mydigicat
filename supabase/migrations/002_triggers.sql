-- ==============================================================================
-- 002_triggers.sql : Database Triggers (100 Product Limit & Auto-Profile)
-- ==============================================================================

-- 1. ENFORCE 100 PRODUCT LIMIT PER USER
CREATE OR REPLACE FUNCTION public.check_product_limit()
RETURNS TRIGGER AS $$
DECLARE
    product_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO product_count
    FROM public.products
    WHERE user_id = NEW.user_id;

    IF product_count >= 100 THEN
        RAISE EXCEPTION 'Product limit reached: Maximum 100 products per account allowed under current plan.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_product_limit ON public.products;
CREATE TRIGGER trg_check_product_limit
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.check_product_limit();

-- 2. AUTO-CREATE PROFILE ON AUTH USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    clean_name TEXT;
    suggested_slug TEXT;
    temp_slug TEXT;
    counter INTEGER := 1;
BEGIN
    clean_name := COALESCE(NEW.raw_user_meta_data->>'firm_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    suggested_slug := lower(regexp_replace(clean_name, '[^a-zA-Z0-9]+', '-', 'g'));
    suggested_slug := trim(both '-' from suggested_slug);
    
    IF suggested_slug = '' THEN
        suggested_slug := 'shop-' || substr(NEW.id::text, 1, 8);
    END IF;

    temp_slug := suggested_slug;
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE slug = temp_slug) LOOP
        counter := counter + 1;
        temp_slug := suggested_slug || '-' || counter;
    END LOOP;

    INSERT INTO public.profiles (id, firm_name, slug, email, theme_color)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'firm_name', clean_name),
        temp_slug,
        NEW.email,
        '#2563eb'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
