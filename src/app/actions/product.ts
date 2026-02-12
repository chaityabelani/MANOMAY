'use server';

import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Shop from '@/models/Shop';

export async function getProducts(parkId?: string) {
    try {
        await connectDB();

        const query: any = { isAvailable: true };

        // Filter by park if provided
        if (parkId) {
            // First get shops in this park
            const shops = await Shop.find({ parkId }).select('_id');
            const shopIds = shops.map(s => s._id);
            query.shopId = { $in: shopIds };
        }

        const products = await Product.find(query)
            .populate('shopId', 'name logoUrl')
            .lean();

        // Transform for client
        return products.map(p => ({
            id: p._id.toString(),
            _id: p._id.toString(),
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            image: p.image,
            isVeg: p.isVeg,
            isAvailable: p.isAvailable,
            shopId: p.shopId?._id?.toString() || '',
            shopName: p.shopId?.name || 'Unknown Shop',
            shopLogo: p.shopId?.logoUrl || ''
        }));

    } catch (error: any) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export async function getProductById(productId: string) {
    try {
        await connectDB();

        const product = await Product.findById(productId)
            .populate('shopId', 'name logoUrl')
            .lean();

        if (!product) {
            return null;
        }

        return {
            id: product._id.toString(),
            _id: product._id.toString(),
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            isVeg: product.isVeg,
            isAvailable: product.isAvailable,
            shopId: product.shopId?._id?.toString() || '',
            shopName: product.shopId?.name || 'Unknown Shop',
            shopLogo: product.shopId?.logoUrl || ''
        };

    } catch (error: any) {
        console.error('Error fetching product:', error);
        return null;
    }
}
