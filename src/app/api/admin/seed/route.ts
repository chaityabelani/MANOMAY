import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

/**
 * ONE-TIME SETUP ENDPOINT
 * Visit /api/admin/seed to create the super-admin account.
 * DELETE THIS FILE after you have logged in successfully.
 */
export async function GET() {
    try {
        await connectDB();

        const email = 'admin@manomay.com';
        const password = 'Manomay@2024';

        const existing = await User.findOne({ email });

        if (existing) {
            // Update role and password if user already exists with wrong role
            existing.role = 'super-admin';
            existing.password = await bcrypt.hash(password, 10);
            await existing.save();
            return NextResponse.json({
                message: '✅ Admin account updated successfully',
                email,
                password,
                loginUrl: '/admin/login',
                note: '⚠️ DELETE /api/admin/seed/route.ts after logging in!',
            });
        }

        const hashed = await bcrypt.hash(password, 10);
        await User.create({
            name: 'Super Admin',
            email,
            password: hashed,
            role: 'super-admin',
        });

        return NextResponse.json({
            message: '✅ Super admin created successfully',
            email,
            password,
            loginUrl: '/admin/login',
            note: '⚠️ DELETE /api/admin/seed/route.ts after logging in!',
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
