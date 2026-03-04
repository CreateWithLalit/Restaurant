import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
                    res = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        res.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 1. Refresh the session so it doesn't expire unexpectedly
    // We use getUser() here as it's more secure than getSession()
    // It will also handle invalid refresh tokens by returning an error instead of a stale session
    let user = null;
    try {
        const { data: { user: foundUser }, error } = await supabase.auth.getUser();
        if (!error) user = foundUser;
    } catch (e) {
        // Log error but don't crash the middleware
        console.error('Middleware Auth Error:', e);
    }

    // If there's an error (like an invalid refresh token), we treat the user as logged out
    const session = user ? { user } : null;

    // 2. Define protected routes
    const isAdminPath = req.nextUrl.pathname.startsWith('/admin');
    const isLoginPage = req.nextUrl.pathname === '/admin/login';

    // 3. Security Logic:
    // If a user tries to access /admin (but NOT the login page) and isn't logged in, 
    // redirect them to the login page.
    if (isAdminPath && !isLoginPage && !session) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/admin/login';
        return NextResponse.redirect(redirectUrl);
    }

    // 4. Optimization: Redirect logged-in users away from the login page
    if (isLoginPage && session) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/admin/bookings';
        return NextResponse.redirect(redirectUrl);
    }

    // 5. Root Admin Redirect: If exactly /admin and logged in, go to bookings
    if (req.nextUrl.pathname === '/admin' && session) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/admin/bookings';
        return NextResponse.redirect(redirectUrl);
    }

    return res;
}

// Global Matcher configuration: Run middleware on all routes except static assets
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public assets (images, etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};