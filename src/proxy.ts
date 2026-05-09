import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// ─── Simple In-Memory Rate Limiter ─────────────────────────────────────────
// For production, replace this with Redis (e.g. Upstash) for multi-instance support
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMITS: Record<string, number> = {
  "/api/suraksha/sos": 5,      // Max 5 SOS per IP per minute (prevents spam)
  "/api/suraksha/failsafe": 5, // Max 5 failsafe triggers per IP per minute
  "/api/iot/stream": 60,       // Max 60 IoT pings per IP per minute (10s interval)
  "/api/send-trip-alert": 10,  // Max 10 alerts per IP per minute
  default: 120,                // All other API routes: 120 req/min
};

function getRateLimit(pathname: string): number {
  for (const [route, limit] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(route)) return limit;
  }
  return RATE_LIMITS.default;
}

function checkRateLimit(ip: string, pathname: string): boolean {
  if (!pathname.startsWith("/api/")) return true; // Only rate-limit API routes

  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const limit = getRateLimit(pathname);
  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// ─── Protected Routes ──────────────────────────────────────────────────────
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/shesecure",
  "/admin",
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

// ─── Proxy ────────────────────────────────────────────────────────────
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Get real IP (handles Vercel / Cloudflare proxies)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 2. Rate limiting check
  if (!checkRateLimit(ip, pathname)) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please slow down." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
          "X-RateLimit-Limit": String(getRateLimit(pathname)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // 3. IoT API secret key protection
  if (pathname.startsWith("/api/iot/")) {
    const iotSecret = request.headers.get("x-iot-secret");
    const expectedSecret = process.env.IOT_API_SECRET;
    if (expectedSecret && iotSecret !== expectedSecret) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 4. Auth session management (Supabase) — handles all route protection & redirects
  const response = await updateSession(request);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt|xml)$).*)",
  ],
};
