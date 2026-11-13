# MyDigiCatalogue 🚀

> **Production-ready SaaS Digital Catalogue Builder for Indian Businesses & Merchants.**
> Turn your inventory into an interactive mobile-first digital catalogue with instant QR codes, 100-product inventory caps, WhatsApp ordering, and Razorpay prepaid plans.

---

## 🌟 Key Features

1. **Prepaid Subscriptions & Expiry Management**
   - **Monthly Plan**: ₹899 / 1 month
   - **Quarterly Plan**: ₹2,499 / 3 months (*Save ₹198*)
   - **100 Products Maximum Limit**: Enforced via PostgreSQL trigger (`check_product_limit`) AND interactive UI safeguards.
   - **3-Day Grace Period Protection**: If payment expires, public store stays live for 3 days with reminder banners (7-day and 1-day warnings). After 3 grace days, public store shows friendly "Temporarily Unavailable" page without data loss.

2. **Business Owner Dashboard**
   - **Live Interactive Preview**: Test on mobile device frame or desktop view with live instant sync.
   - **Product Management**: Full CRUD, client-side automated image compression (<500KB output, up to 5MB input), in-stock toggle, search, filter by category, bulk delete.
   - **Category Reordering**: Add, rename, reorder (drag & drop / up-down), delete.
   - **Branding & Theme Customization**: Hex color picker with presets, automated light/dark WCAG contrast text calculator, logo upload.
   - **Permanent QR & Sharing**: Download high-resolution PNG & SVG, copy smart link, 1-click WhatsApp share, printable table standee template.
   - **Billing & Invoices**: Downloadable GST-compliant Tax Invoices, renewal checkout, built-in 1-click subscription lifecycle simulator.

3. **Public Dynamic Store (`/c/[slug]`)**
   - Mobile-first, fast SSR/ISR loading.
   - Dynamic business branding & theme color.
   - WhatsApp 1-click enquiry button with pre-filled item name & price.
   - Anonymous view counter.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons + Confetti
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Triggers)
- **Payment Gateway**: Razorpay (INR) with HMAC-SHA256 signature verification
- **QR Generation**: `qrcode` (PNG data URLs and Vector SVGs)

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase & Razorpay credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase SQL Migrations
Run the SQL scripts located in `supabase/migrations/` inside your Supabase SQL Editor in numerical order:
1. `001_create_schema.sql` (Creates `profiles`, `subscriptions`, `categories`, `products`, `catalogue_views` tables)
2. `002_triggers.sql` (Enforces 100-product cap & auto-creates profile on auth signup)
3. `003_rls_policies.sql` (Row Level Security policies & 3-day grace period access functions)
4. `004_seed.sql` (Seeds demo store "Artisan Leather Works" with 10 handcrafted products)

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💳 Razorpay Webhook Configuration

1. In Razorpay Dashboard, go to **Settings > Webhooks > Add New Webhook**.
2. Webhook URL: `https://your-domain.com/api/razorpay/webhook`
3. Secret: Enter the string configured in `RAZORPAY_WEBHOOK_SECRET`.
4. Active Events: `order.paid`, `payment.captured`.

---

## ☁️ Deploy to Vercel

1. Push code to GitHub.
2. Import repository into [Vercel](https://vercel.com).
3. Add Environment Variables from `.env.example`.
4. Deploy!
