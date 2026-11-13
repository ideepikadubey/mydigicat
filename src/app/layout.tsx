import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MyDigiCatalogue — Digital Product Catalogue Builder for Businesses",
  description:
    "Transform your physical product inventory into an interactive mobile-first digital catalogue. Generate instant QR codes, receive WhatsApp enquiries, and grow your sales seamlessly.",
  keywords: ["digital catalogue", "whatsapp catalogue", "qr code product catalog", "business store", "e-catalogue india"],
  authors: [{ name: "MyDigiCatalogue" }],
  openGraph: {
    title: "MyDigiCatalogue — Digital Product Catalogue Builder",
    description: "Launch your business catalogue in minutes with QR codes and direct WhatsApp ordering.",
    type: "website",
    locale: "en_IN",
    siteName: "MyDigiCatalogue",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${jakarta.variable} ${outfit.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
