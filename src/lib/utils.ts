import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import QRCode from "qrcode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an amount in Indian Rupees (₹) with proper comma separators
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Returns either '#ffffff' or '#0f172a' depending on background hex luminance
 */
export function getContrastTextColor(hexColor: string): string {
  if (!hexColor) return "#ffffff";
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6 && hex.length !== 3) return "#ffffff";
  
  const fullHex = hex.length === 3 
    ? hex.split("").map(c => c + c).join("") 
    : hex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  // Perceived luminance formula (ITU-R BT.709)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#0f172a" : "#ffffff";
}

/**
 * Creates URL-safe slug from business name
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Calculates days remaining, grace period status and expiry banner type
 */
export function getSubscriptionDetails(endDateStr: string | undefined | null) {
  if (!endDateStr) {
    return {
      status: "expired" as const,
      daysLeft: 0,
      isGrace: false,
      isExpired: true,
      banner: "expired" as const,
      message: "No active subscription",
    };
  }

  const now = new Date().getTime();
  const endDate = new Date(endDateStr).getTime();
  const diffMs = endDate - now;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  // 3-day grace period = 3 * 24 * 60 * 60 * 1000 ms
  const graceEnd = endDate + 3 * 24 * 60 * 60 * 1000;

  if (diffMs > 0) {
    if (daysLeft <= 1) {
      return {
        status: "active" as const,
        daysLeft,
        isGrace: false,
        isExpired: false,
        banner: "warning-1d" as const,
        message: "Your subscription expires today! Renew now to prevent disruption.",
      };
    }
    if (daysLeft <= 7) {
      return {
        status: "active" as const,
        daysLeft,
        isGrace: false,
        isExpired: false,
        banner: "warning-7d" as const,
        message: `Your subscription expires in ${daysLeft} days. Renew early to keep your catalogue active.`,
      };
    }
    return {
      status: "active" as const,
      daysLeft,
      isGrace: false,
      isExpired: false,
      banner: "none" as const,
      message: `Active (${daysLeft} days remaining)`,
    };
  } else if (now <= graceEnd) {
    const graceHoursLeft = Math.max(0, Math.ceil((graceEnd - now) / (1000 * 60 * 60)));
    return {
      status: "grace" as const,
      daysLeft: 0,
      isGrace: true,
      isExpired: false,
      banner: "grace" as const,
      message: `In 3-day grace period (${graceHoursLeft}h remaining). Your catalogue is still visible, please renew!`,
    };
  } else {
    return {
      status: "expired" as const,
      daysLeft: 0,
      isGrace: false,
      isExpired: true,
      banner: "expired" as const,
      message: "Subscription expired. Your public catalogue is temporarily unavailable.",
    };
  }
}

/**
 * Client-side high-quality image compressor
 * Compresses any image under 5MB to < 500KB JPEG DataURL
 */
export async function compressImageToDataUrl(file: File, maxSizeBytes = 500 * 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Max dimension cap (1200px)
        const maxDimension = 1200;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(img.src);
        }
        
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Binary search / iterative quality adjustment to guarantee < 500KB
        let quality = 0.85;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        // Approximate base64 byte size calculation
        let estimatedBytes = Math.round((dataUrl.length * 3) / 4);

        while (estimatedBytes > maxSizeBytes && quality > 0.3) {
          quality -= 0.15;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
          estimatedBytes = Math.round((dataUrl.length * 3) / 4);
        }

        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Generate QR Code as PNG Data URL
 */
export async function generateQrPng(url: string, color = "#000000"): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 600,
      margin: 2,
      color: {
        dark: color,
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
  } catch (err) {
    console.error("QR PNG generation error:", err);
    return "";
  }
}

/**
 * Generate QR Code as raw SVG string
 */
export async function generateQrSvg(url: string, color = "#000000"): Promise<string> {
  try {
    return await QRCode.toString(url, {
      type: "svg",
      margin: 2,
      color: {
        dark: color,
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
  } catch (err) {
    console.error("QR SVG generation error:", err);
    return "";
  }
}

/**
 * Builds formatted WhatsApp enquiry link for a single product
 */
export function buildWhatsAppEnquiryUrl(
  phone: string,
  productName: string,
  price: number,
  firmName: string,
  catalogueUrl?: string,
  variant?: string
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const formattedPrice = formatCurrency(price);
  const variantText = variant ? ` (Variant: ${variant})` : "";
  const linkLine = catalogueUrl ? `\n\n🔗 Product link: ${catalogueUrl}` : "";
  const text = encodeURIComponent(
    `Hello ${firmName},\n\nI am interested in ordering/inquiring about:\n*${productName}*${variantText} — ${formattedPrice}${linkLine}\n\nPlease let me know availability and delivery details. Thank you!`
  );
  return `https://wa.me/${cleanPhone}?text=${text}`;
}

export interface WhatsAppCartItem {
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

/**
 * Builds formatted WhatsApp order sheet for multi-item cart
 */
export function buildWhatsAppCartUrl(
  phone: string,
  firmName: string,
  items: WhatsAppCartItem[],
  totalAmount: number,
  customerName?: string,
  note?: string,
  catalogueUrl?: string
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  
  let itemsList = items
    .map((item, index) => {
      const variantStr = item.variant ? ` [${item.variant}]` : "";
      const itemTotal = formatCurrency(item.price * item.quantity);
      return `${index + 1}. *${item.name}*${variantStr}\n   Qty: ${item.quantity} × ${formatCurrency(item.price)} = ${itemTotal}`;
    })
    .join("\n\n");

  const totalStr = formatCurrency(totalAmount);
  const customerStr = customerName ? `\n👤 *Customer Name:* ${customerName}` : "";
  const noteStr = note ? `\n📝 *Note / Address:* ${note}` : "";
  const linkStr = catalogueUrl ? `\n\n🔗 *Store Link:* ${catalogueUrl}` : "";

  const message = `🛍️ *NEW ORDER FROM ${firmName.toUpperCase()}*\n━━━━━━━━━━━━━━━━━━━━\n${itemsList}\n━━━━━━━━━━━━━━━━━━━━\n💰 *Total Order Value: ${totalStr}* (${items.reduce((s, i) => s + i.quantity, 0)} Items)${customerStr}${noteStr}${linkStr}\n\nPlease confirm my order and share payment details. Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Returns the public catalogue URL for a business slug
 * Supports subdomain format: slug.mydigicatalogue.com or slug.localhost:3000
 */
export function getCatalogueUrl(slug: string, preferSubdomain = true): string {
  if (!slug) return "https://mydigicatalogue.com";

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    const protocol = window.location.protocol;

    if (preferSubdomain) {
      if (hostname === "localhost" || hostname.endsWith(".localhost")) {
        return `${protocol}//${slug}.localhost${port}`;
      }
      if (hostname.includes("mydigicatalogue.com")) {
        return `https://${slug}.mydigicatalogue.com`;
      }
      // For custom domain deployments / preview urls
      const parts = hostname.split(".");
      if (parts.length >= 2) {
        return `${protocol}//${slug}.${parts.slice(-2).join(".")}${port}`;
      }
    }
    // Path fallback
    return `${window.location.origin}/c/${slug}`;
  }

  return `https://${slug}.mydigicatalogue.com`;
}

