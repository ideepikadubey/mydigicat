-- ==============================================================================
-- 004_seed.sql : Demo Seed Data for "Artisan Leather Crafts"
-- ==============================================================================

DO $$
DECLARE
    demo_user_id UUID := 'd0000000-0000-0000-0000-000000000001'::uuid;
    cat_bags UUID := 'c0000000-0000-0000-0000-000000000001'::uuid;
    cat_wallets UUID := 'c0000000-0000-0000-0000-000000000002'::uuid;
    cat_footwear UUID := 'c0000000-0000-0000-0000-000000000003'::uuid;
    cat_accessories UUID := 'c0000000-0000-0000-0000-000000000004'::uuid;
BEGIN
    -- 1. Insert Profile
    INSERT INTO public.profiles (id, firm_name, slug, address, phone, whatsapp, email, logo_url, theme_color)
    VALUES (
        demo_user_id,
        'Artisan Leather Works',
        'artisan-leather',
        'Shop 42, Heritage Market, Connaught Place, New Delhi - 110001',
        '+91 98765 43210',
        '919876543210',
        'contact@artisanleather.in',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&auto=format&fit=crop&q=80',
        '#854d0e' -- Warm Amber/Leather Brown
    )
    ON CONFLICT (id) DO UPDATE SET
        firm_name = EXCLUDED.firm_name,
        slug = EXCLUDED.slug,
        address = EXCLUDED.address,
        phone = EXCLUDED.phone,
        whatsapp = EXCLUDED.whatsapp,
        email = EXCLUDED.email,
        theme_color = EXCLUDED.theme_color;

    -- 2. Insert Active Subscription (Valid for next 90 days)
    INSERT INTO public.subscriptions (user_id, plan, amount, start_date, end_date, status, razorpay_order_id, razorpay_payment_id)
    VALUES (
        demo_user_id,
        'quarterly',
        2499.00,
        now(),
        now() + INTERVAL '90 days',
        'active',
        'order_seed_demo_9981',
        'pay_seed_demo_7721'
    );

    -- 3. Insert Categories
    INSERT INTO public.categories (id, user_id, name, sort_order)
    VALUES
        (cat_bags, demo_user_id, 'Handbags & Backpacks', 1),
        (cat_wallets, demo_user_id, 'Wallets & Cardholders', 2),
        (cat_footwear, demo_user_id, 'Handcrafted Footwear', 3),
        (cat_accessories, demo_user_id, 'Belts & Accessories', 4)
    ON CONFLICT (id) DO NOTHING;

    -- 4. Insert Products
    INSERT INTO public.products (user_id, category_id, name, description, price, image_url, in_stock, is_active, sort_order)
    VALUES
        (demo_user_id, cat_bags, 'Classic Full-Grain Leather Satchel', 'Handmade vegetable-tanned leather messenger satchel with brass hardware, laptop divider up to 15-inch, and adjustable shoulder strap.', 4999.00, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', true, true, 1),
        (demo_user_id, cat_bags, 'Vintage Roll-Top Travel Backpack', 'Water-resistant waxed canvas and oiled leather roll-top backpack. Features 28L storage capacity and hidden passport pocket.', 5499.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', true, true, 2),
        (demo_user_id, cat_bags, 'Minimalist Executive Tote', 'Sleek Italian pebble-grain leather tote bag with top zip closure, interior organizer pockets, and comfortable shoulder drop.', 3899.00, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80', true, true, 3),
        (demo_user_id, cat_wallets, 'Slim RFID Bi-Fold Leather Wallet', 'Genuine top-grain cowhide leather with 8 card slots, dual currency compartments, and military-grade RFID blocking liner.', 1299.00, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', true, true, 4),
        (demo_user_id, cat_wallets, 'Minimalist Brass Money Clip Wallet', 'Ultra-slim front pocket card sleeve with an integrated solid brushed brass spring clip for bills.', 899.00, 'https://images.unsplash.com/photo-1606503829068-d069b2756616?w=800&auto=format&fit=crop&q=80', true, true, 5),
        (demo_user_id, cat_footwear, 'Handmade Goodyear Welted Chelsea Boots', 'Rich chestnut brown pull-up leather boots with cork footbed that molds to your feet, oil-resistant studded rubber sole.', 6499.00, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=80', true, true, 6),
        (demo_user_id, cat_footwear, 'Artisanal Suede Penny Loafers', 'Luxurious unlined suede loafers with cushioned insole and hand-stitched apron. Perfect for smart casual occasions.', 4799.00, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80', true, true, 7),
        (demo_user_id, cat_accessories, 'Heavy Duty Full-Grain Leather Belt', '1.5-inch wide 9oz full-grain bridle leather with interchangeable antique nickel roller buckle. Built to last decades.', 1499.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', true, true, 8),
        (demo_user_id, cat_accessories, 'Leather Watch Roll Organizer (3 Slots)', 'Cylindrical travel storage roll with soft velvet lining and removable cushions to secure luxury timepieces safely.', 1999.00, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80', true, true, 9),
        (demo_user_id, cat_accessories, 'Key Clip Keychain with Antique Brass Hook', 'Compact heavy leather key fob with military snap hook and heavy split ring.', 449.00, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80', true, true, 10);

    -- 5. Seed Some Sample Views
    INSERT INTO public.catalogue_views (user_id, viewed_at)
    SELECT demo_user_id, now() - (interval '1 hour' * s.i)
    FROM generate_series(1, 142) AS s(i);
END $$;
