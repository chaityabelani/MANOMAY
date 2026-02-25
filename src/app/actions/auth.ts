'use server';

import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, verifyPassword, createToken, setAuthCookie, clearAuthCookie, getSession } from '@/lib/auth';
export type { }; // keep module boundary
import { redirect } from 'next/navigation';

/**
 * Vendor Signup
 */
export async function vendorSignup(formData: FormData) {
    try {
        await connectDB();

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Validation
        if (!name || !email || !password) {
            return { success: false, error: 'All fields are required' };
        }

        if (password.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters' };
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return { success: false, error: 'Email already registered' };
        }

        // Create user
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'vendor',
        });

        // Create token
        const token = createToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        });

        await setAuthCookie(token);

        return { success: true };
    } catch (error: any) {
        console.error('Vendor signup error:', error);
        return { success: false, error: error.message || 'Signup failed' };
    }
}

/**
 * Vendor Login
 */
export async function vendorLogin(formData: FormData) {
    try {
        await connectDB();

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return { success: false, error: 'Email and password are required' };
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return { success: false, error: 'Invalid credentials' };
        }

        // Verify vendor role
        if (user.role !== 'vendor') {
            return { success: false, error: 'Access denied - vendors only' };
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return { success: false, error: 'Invalid credentials' };
        }

        // Create token
        const token = createToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            shopId: user.shopId?.toString(),
        });

        await setAuthCookie(token);

        return { success: true };
    } catch (error: any) {
        console.error('Vendor login error:', error);
        return { success: false, error: error.message || 'Login failed' };
    }
}

/**
 * Admin Login (super-admin only)
 */
export async function adminLogin(formData: FormData) {
    try {
        await connectDB();

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return { success: false, error: 'Email and password are required' };
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return { success: false, error: 'Invalid credentials' };
        }

        // Must be super-admin
        if (user.role !== 'super-admin') {
            return { success: false, error: 'Access denied — admin only' };
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return { success: false, error: 'Invalid credentials' };
        }

        // Create JWT
        const token = createToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        });

        await setAuthCookie(token);
        return { success: true };
    } catch (error: any) {
        console.error('Admin login error:', error);
        return { success: false, error: error.message || 'Login failed' };
    }
}

/**
 * Logout
 */
export async function logout() {
    await clearAuthCookie();
    redirect('/');
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
    return await getSession();
}
