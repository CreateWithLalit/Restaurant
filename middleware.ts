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
    const {
        data: { session },
    } = await supabase.auth.getSession();

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

// 5. Matcher configuration: Only run middleware on admin routes for performance
export const config = {
    matcher: ['/admin/:path*'],
};