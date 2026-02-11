'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { validateEnv } from '@/lib/env';

// --- Validation Schemas ---

const SignupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// --- Actions ---

export async function signupAction(prevState: any, formData: FormData) {
    try {
        // 1. Validate Environment (Graceful Failure)
        const envCheck = validateEnv();
        if (!envCheck.success) {
            console.error("❌ Signup Blocked: Missing Environment Variables");
            return {
                success: false,
                message: 'System configuration error. Please contact the administrator.'
            };
        }

        const rawData = Object.fromEntries(formData.entries());
        const result = SignupSchema.safeParse(rawData);

        if (!result.success) {
            return { success: false, errors: result.error.flatten().fieldErrors };
        }

        const { name, email, password } = result.data;

        await dbConnect();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { success: false, message: 'User with this email already exists' };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user', // Default role
        });

        // Automatically log in the user (set cookie)
        await createSession(newUser);

        return { success: true, message: 'Account created successfully!' };
    } catch (error: any) {
        console.error('Signup Error:', error);
        // Return a generic error message to the client, but log the specific error on the server
        return {
            success: false,
            message: 'Internal server error. Please try again later.'
        };
    }
}

export async function loginAction(prevState: any, formData: FormData) {
    try {
        // 1. Validate Environment (Graceful Failure)
        const envCheck = validateEnv();
        if (!envCheck.success) {
            console.error("❌ Login Blocked: Missing Environment Variables");
            return {
                success: false,
                message: 'System configuration error. Please contact the administrator.'
            };
        }

        const rawData = Object.fromEntries(formData.entries());
        const result = LoginSchema.safeParse(rawData);

        if (!result.success) {
            return { success: false, errors: result.error.flatten().fieldErrors };
        }

        const { email, password } = result.data;

        await dbConnect();

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return { success: false, message: 'Invalid credentials' };
        }

        const isMatch = await bcrypt.compare(password, user.password!);

        if (!isMatch) {
            return { success: false, message: 'Invalid credentials' };
        }

        await createSession(user);

        return { success: true, message: 'Login successful!' };
    } catch (error: any) {
        console.error('Login Error:', error);
        return {
            success: false,
            message: 'Internal server error. Please try again later.'
        };
    }
}

// --- Helper Functions ---

async function createSession(user: any) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('JWT_SECRET is not defined in environment variables.');
        }
        console.warn('WARNING: Using fallback JWT secret. Do not use this in production!');
    }

    const token = jwt.sign(
        { userId: user._id, role: user.role, email: user.email },
        secret || 'fallback_secret_dev_only',
        { expiresIn: '1d' }
    );



    (await cookies()).set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        return null;
    }

    try {
        const secret = process.env.JWT_SECRET || 'fallback_secret_dev_only';
        const decoded = jwt.verify(token, secret) as { userId: string; role: string; email: string };

        return {
            user: {
                _id: decoded.userId,
                email: decoded.email,
                role: decoded.role,
            }
        };
    } catch (error) {
        console.error('Session Error:', error);
        return null;
    }
}
