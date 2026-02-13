'use server';

import connectDB from '@/lib/db';
import FoodPark from '@/models/FoodPark';
import Shop from '@/models/Shop';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

/**
 * Create new food park
 */
export async function createPark(formData: FormData) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'super-admin') {
            return { success: false, error: 'Unauthorized' };
        }

        await connectDB();

        const name = formData.get('name') as string;
        const location = formData.get('location') as string;
        const tableCount = parseInt(formData.get('tableCount') as string);

        if (!name || !location || !tableCount) {
            return { success: false, error: 'All fields required' };
        }

        // Generate tables with QR codes
        const tables = Array.from({ length: tableCount }, (_, i) => ({
            number: `${i + 1}`,
            qrCode: `https://manomay.vercel.app/menu?table=${i + 1}&park=PARK_ID`,
        }));

        const park = await FoodPark.create({
            name,
            location,
            adminId: session.user.userId,
            tables,
            isActive: true,
        });

        // Update QR codes with actual park ID
        park.tables = park.tables.map(table => ({
            ...table,
            qrCode: `https://manomay.vercel.app/menu?table=${table.number}&park=${park._id}`,
        }));
        await park.save();

        revalidatePath('/admin/dashboard/parks');
        return {
            success: true,
            parkId: park._id.toString(),
        };
    } catch (error: any) {
        console.error('Create park error:', error);
        return { success: false, error: error.message || 'Failed to create park' };
    }
}

/**
 * Get all parks
 */
export async function getAllParks() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'super-admin') {
            return { success: false, error: 'Unauthorized', parks: [] };
        }

        await connectDB();

        const parks = await FoodPark.find().sort({ createdAt: -1 }).lean();

        return {
            success: true,
            parks: parks.map(p => ({
                id: p._id.toString(),
                name: p.name,
                location: p.location,
                isActive: p.isActive,
                tableCount: p.tables.length,
                createdAt: p.createdAt.toISOString(),
            })),
        };
    } catch (error: any) {
        console.error('Get parks error:', error);
        return { success: false, error: error.message, parks: [] };
    }
}

/**
 * Get park details with tables
 */
export async function getParkDetails(parkId: string) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'super-admin') {
            return { success: false, error: 'Unauthorized' };
        }

        await connectDB();

        const park = await FoodPark.findById(parkId).lean();

        if (!park) {
            return { success: false, error: 'Park not found' };
        }

        return {
            success: true,
            park: {
                id: park._id.toString(),
                name: park.name,
                location: park.location,
                isActive: park.isActive,
                tables: park.tables,
                createdAt: park.createdAt.toISOString(),
            },
        };
    } catch (error: any) {
        console.error('Get park details error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get all vendors for approval
 */
export async function getAllVendors() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'super-admin') {
            return { success: false, error: 'Unauthorized', vendors: [] };
        }

        await connectDB();

        const shops = await Shop.find()
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true,
            vendors: shops.map(s => ({
                id: s._id.toString(),
                name: s.name,
                owner: (s.ownerId as any).name,
                email: (s.ownerId as any).email,
                cuisineType: s.cuisineType,
                isActive: s.isActive,
                createdAt: s.createdAt.toISOString(),
            })),
        };
    } catch (error: any) {
        console.error('Get vendors error:', error);
        return { success: false, error: error.message, vendors: [] };
    }
}

/**
 * Toggle vendor active status
 */
export async function toggleVendorStatus(shopId: string, isActive: boolean) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'super-admin') {
            return { success: false, error: 'Unauthorized' };
        }

        await connectDB();

        await Shop.findByIdAndUpdate(shopId, { isActive });

        revalidatePath('/admin/dashboard/vendors');
        return { success: true };
    } catch (error: any) {
        console.error('Toggle vendor status error:', error);
        return { success: false, error: error.message };
    }
}
