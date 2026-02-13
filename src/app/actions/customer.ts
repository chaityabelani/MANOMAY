'use server';

import connectDB from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { hash } from 'bcryptjs';
import { createSession, getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * Customer signup
 */
export async function customerSignup(formData: FormData) {
    try {
        await connectDB();

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!name || !email || !password) {
            return { success: false, error: 'All fields required' };
        }

        // Check if user exists
        const existing = await User.findOne({ email });
        if (existing) {
            return { success: false, error: 'Email already registered' };
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create customer
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'customer',
        });

        // Create session
        await createSession({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        });

        return { success: true };
    } catch (error: any) {
        console.error('Customer signup error:', error);
        return { success: false, error: error.message || 'Signup failed' };
    }
}

/**
 * Customer login
 */
export async function customerLogin(formData: FormData) {
    try {
        await connectDB();

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return { success: false, error: 'All fields required' };
        }

        const user = await User.findOne({ email, role: 'customer' });

        if (!user) {
            return { success: false, error: 'Invalid credentials' };
        }

        const bcrypt = require('bcryptjs');
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return { success: false, error: 'Invalid credentials' };
        }

        await createSession({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        });

        return { success: true };
    } catch (error: any) {
        console.error('Customer login error:', error);
        return { success: false, error: error.message || 'Login failed' };
    }
}

/**
 * Get customer order history
 */
export async function getCustomerOrders() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'customer') {
            return { success: false, error: 'Unauthorized', orders: [] };
        }

        await connectDB();

        const orders = await Order.find({ customerPhone: session.user.email }) // Using email as identifier for now
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        return {
            success: true,
            orders: orders.map(o => ({
                id: o._id.toString(),
                tableNumber: o.tableNumber,
                items: o.items.map(item => ({
                    productId: item.productId.toString(),
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                totalAmount: o.totalAmount,
                status: o.status,
                createdAt: o.createdAt.toISOString(),
            })),
        };
    } catch (error: any) {
        console.error('Get customer orders error:', error);
        return { success: false, error: error.message, orders: [] };
    }
}
