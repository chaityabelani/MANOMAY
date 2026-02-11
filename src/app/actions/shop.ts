'use server';

import { getSession } from './auth';
import Shop from '@/models/Shop';
import connectDB from '@/lib/db';

export async function getVendorShops() {
    try {
        const session = await getSession();
        if (!session?.user) {
            return { success: false, error: 'Unauthorized', shops: [] };
        }

        await connectDB();

        // For now, return all shops
        // TODO: Filter by ownerId when we add proper user-shop relationship
        const shops = await Shop.find({ isActive: true })
            .select('_id name description cuisineType')
            .lean();

        return {
            success: true,
            shops: shops.map(shop => ({
                id: shop._id.toString(),
                name: shop.name,
                description: shop.description || '',
                cuisineType: shop.cuisineType || [],
            })),
        };
    } catch (error: any) {
        console.error('Get vendor shops error:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch shops',
            shops: [],
        };
    }
}
