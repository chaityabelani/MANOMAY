import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('auth_token')?.value;

    // Define route patterns
    const isVendorRoute = path.startsWith('/vendor');
    const isAuthPage = ['/login', '/signup', '/vendor-login', '/vendor-signup'].some(p => path.startsWith(p));

    // Handle public auth pages (login/signup)
    if (isAuthPage) {
        // If already logged in, redirect to appropriate dashboard
        if (token) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_dev_only');
                const { payload } = await jwtVerify(token, secret);
                const userRole = payload.role as string;

                // Redirect based on role
                if (userRole === 'vendor') {
                    return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
                } else {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            } catch {
                // Invalid token, allow access to login/signup
            }
        }
        return NextResponse.next();
    }

    // Require authentication for all protected routes
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify role for protected routes
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_dev_only');
        const { payload } = await jwtVerify(token, secret);
        const userRole = payload.role as string;

        // Block non-vendors from vendor routes
        if (isVendorRoute && userRole !== 'vendor' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
    } catch {
        // Invalid/expired token - redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes (they have their own auth)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
