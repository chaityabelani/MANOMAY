'use server';

import connectDB from '@/lib/db';
import FoodPark from '@/models/FoodPark';
import Shop from '@/models/Shop';
import Product from '@/models/Product';

export async function getMenuByPark(parkId: string) {
    try {
        await connectDB();

        // Get food park details
        const park = await FoodPark.findById(parkId).lean();
        if (!park) {
            return { success: false, error: 'Food park not found', data: null };
        }

        // Get all shops in this park
        const shops = await Shop.find({ parkId, isActive: true }).lean();

        // Get all products for these shops
        const shopIds = shops.map(shop => shop._id);
        const products = await Product.find({
            shopId: { $in: shopIds },
            isAvailable: true,
        }).lean();

        // Group products by shop
        const shopsWithProducts = shops.map((shop) => ({
            id: shop._id.toString(),
            name: shop.name,
            description: shop.description || '',
            cuisineTypes: shop.cuisineType || [],
            logo: shop.logo || null,
            products: products
                .filter((product: any) => product.shopId.toString() === shop._id.toString())
                .map((product: any) => ({
                    id: product._id.toString(),
                    name: product.name,
                    description: product.description || '',
                    price: product.price,
                    category: product.category,
                    image: product.image || null,
                })),
        }));

        return {
            success: true,
            data: {
                park: {
                    id: park._id.toString(),
                    name: park.name,
                    location: park.location,
                },
                shops: shopsWithProducts,
            },
        };
    } catch (error: any) {
        console.error('Get menu by park error:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch menu',
            data: null,
        };
    }
}
