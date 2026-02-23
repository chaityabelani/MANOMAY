import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * GET /api/auth/me
 * Returns the current user's userId and role from the JWT cookie.
 * Used by client-side components (e.g. OrderNotificationProvider) that need
 * the authenticated user's ID without a full server component render.
 */
export async function GET() {
    const session = await getSession();

    if (!session || session.user.role !== 'customer') {
        return NextResponse.json({ userId: null }, { status: 200 });
    }

    return NextResponse.json({
        userId: session.user.userId,
        role: session.user.role,
    });
}
