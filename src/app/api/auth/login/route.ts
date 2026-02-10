import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Input Validation Schema
const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(req: Request) {
    try {
        // 1. Parse Input
        const body = await req.json();
        const result = LoginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid input data',
                    errors: result.error.flatten().fieldErrors
                },
                { status: 400 }
            );
        }

        const { email, password } = result.data;

        // 2. Connect to Database
        await dbConnect();

        // 3. Find User (Explicitly select password)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            // Security: Use generic message
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // 4. Verify Password
        const isMatch = await bcrypt.compare(password, user.password!);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // 5. Generate JWT
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

        // 6. Create Response with HTTP-Only Cookie
        const response = NextResponse.json(
            { success: true, message: 'Login successful', user: { name: user.name, email: user.email, role: user.role } },
            { status: 200 }
        );

        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
