import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static & _next/image
     * - favicon.ico, sitemap, robots
     * - files with extensions (e.g. .png, .jpg, .svg, .css, .js)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Strip port (e.g. "zara.localhost:3000" -> "zara.localhost")
  const currentHost = hostname.replace(/:\d+$/, "").toLowerCase();

  let subdomain: string | null = null;

  // 1. Local development: *.localhost (e.g., artisan.localhost)
  if (currentHost.includes(".localhost")) {
    const parts = currentHost.split(".localhost");
    if (parts[0] && parts[0] !== "localhost" && parts[0] !== "www") {
      subdomain = parts[0];
    }
  }
  // 2. Production / Staging: *.mydigicatalogue.com or *.vercel.app
  else if (currentHost.includes(".")) {
    const parts = currentHost.split(".");
    // Ignore www, app, dashboard, admin, superadmin, api
    const reserved = ["www", "app", "dashboard", "admin", "superadmin", "api", "mail"];
    if (parts.length >= 3 && !reserved.includes(parts[0])) {
      subdomain = parts[0];
    }
  }

  // If a valid tenant subdomain is detected and we aren't already on /c/
  if (subdomain) {
    // If requesting the root "/" of the subdomain -> rewrite to "/c/[subdomain]"
    if (url.pathname === "/") {
      return NextResponse.rewrite(new URL(`/c/${subdomain}`, req.url));
    }
    // If already requesting "/c/...", keep as is or rewrite other sub-paths
    if (!url.pathname.startsWith("/c/")) {
      return NextResponse.rewrite(new URL(`/c/${subdomain}${url.pathname}`, req.url));
    }
  }

  return NextResponse.next();
}
