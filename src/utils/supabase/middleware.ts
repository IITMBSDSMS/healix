import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAdmin } from '@/lib/admin'

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ── Mock auth fast-path ──────────────────────────────────────────────────
  // If dummy-mock-token cookie is present, skip Supabase entirely to avoid
  // the redirect loop caused by getUser() failing against the dummy URL.
  const hasMockToken = !!request.cookies.get('dummy-mock-token')?.value;

  if (hasMockToken) {
    const isAdminRoute = pathname.startsWith('/dashboard/hero-manager') || pathname.startsWith('/admin');
    if (isAdminRoute && !isAdmin('demo@healix.tech')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Redirect away from login/signup if already "logged in" via mock
    if (pathname === '/login' || pathname === '/signup') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    // Allow all other routes through
    return NextResponse.next({ request });
  }

  // ── Real Supabase auth path ──────────────────────────────────────────────
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/shesecure');

  const isAdminRoute = pathname.startsWith('/dashboard/hero-manager') || pathname.startsWith('/admin');

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && isAdminRoute) {
    if (!isAdmin(user.email)) {
      // Redirect non-admins trying to access admin panel
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  if (user && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
