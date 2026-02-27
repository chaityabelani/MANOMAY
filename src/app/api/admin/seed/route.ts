import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

/**
 * DIAGNOSTIC + SETUP ENDPOINT
 * Visit /api/admin/seed to create or reset the super-admin account.
 * DELETE THIS FILE after you have logged in successfully.
 */
export async function GET() {
    const diagnostics: Record<string, any> = {};

    try {
        // 1. Check env var
        const uri = process.env.MONGODB_URI || '';
        diagnostics.mongodb_uri_set = !!uri;
        if (uri) {
            // Mask password in URI for safe display
            diagnostics.mongodb_uri_masked = uri.replace(/:([^@]+)@/, ':***@');
        }

        // 2. Connect
        await connectDB();
        diagnostics.db_connected = true;
        diagnostics.db_name = mongoose.connection.name;

        const email = 'admin@manomay.com';
        const password = 'Manomay@2024';

        // 3. Look up existing user
        const existing = await User.findOne({ email });
        diagnostics.user_found = !!existing;

        if (existing) {
            diagnostics.existing_role = existing.role;

            // Force update to super-admin with fresh password hash
            const newHash = await bcrypt.hash(password, 10);
            diagnostics.hash_generated = true;

            // Verify the hash round-trip before saving
            const roundTripOk = await bcrypt.compare(password, newHash);
            diagnostics.bcrypt_roundtrip_ok = roundTripOk;

            existing.role = 'super-admin';
            existing.password = newHash;
            await existing.save();
            diagnostics.user_saved = true;

            return NextResponse.json({
                message: '✅ Admin account updated — try logging in now',
                email,
                password,
                loginUrl: '/admin/login',
                diagnostics,
                note: '⚠️ DELETE /api/admin/seed/route.ts after logging in!',
            });
        }

        // 4. Create fresh admin
        const hashed = await bcrypt.hash(password, 10);
        const roundTripOk = await bcrypt.compare(password, hashed);
        diagnostics.bcrypt_roundtrip_ok = roundTripOk;

        await User.create({
            name: 'Super Admin',
            email,
            password: hashed,
            role: 'super-admin',
        });
        diagnostics.user_created = true;

        return NextResponse.json({
            message: '✅ Super admin created — try logging in now',
            email,
            password,
            loginUrl: '/admin/login',
            diagnostics,
            note: '⚠️ DELETE /api/admin/seed/route.ts after logging in!',
        });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            diagnostics,
            stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
        }, { status: 500 });
    }
}
