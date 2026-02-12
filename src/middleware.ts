import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the path for the incoming request
    const path = request.nextUrl.pathname;

    // Define public paths that don't require authentication
    const publicPaths = [
        '/login',
        '/signup',
        '/vendor/login',    // Allow vendor login
        '/vendor/signup',   // Allow vendor registration
        '/api/auth',
        '/api/test-db'
    ];

    // Check if the current path is public
    const isPublicPath = publicPaths.some((pp) => path.startsWith(pp));

    // Get the token from the cookies
    const token = request.cookies.get('auth_token')?.value || '';

    // Redirect logic
    if (isPublicPath && token) {
        // If user is already logged in and tries to access public auth pages, redirect to home
        if (path === '/login' || path === '/signup') {
            return NextResponse.redirect(new URL('/', request.nextUrl));
        }
    }

    if (!isPublicPath && !token) {
        // If user is not logged in and tries to access a protected route, redirect to login
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    return NextResponse.next();
}

// Ensure middleware runs on relevant paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes) -> actually we want to protect some API routes, but let's exclude for now to be safe, 
         *   or selectively protect. The logic above handles /api/auth as public.
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
