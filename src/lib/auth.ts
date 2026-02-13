import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export interface JWTPayload {
    userId: string;
    email: string;
    name: string;
    role: 'super-admin' | 'vendor' | 'customer';
    shopId?: string;
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Create JWT token
 */
export function createToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d',
    });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

/**
 * Get session from cookies (server-side only)
 */
export async function getSession(): Promise<{ user: JWTPayload } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    return { user: payload };
}

/**
 * Set auth cookie
 */
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

/**
 * Clear auth cookie
 */
export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
}
