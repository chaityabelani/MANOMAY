'use server';

import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Shop from '@/models/Shop';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

/**
 * Get vendor's shop - creates one if doesn't exist
 */
async function getVendorShop(userId: string) {
    await connectDB();

    const user = await User.findById(userId);
    if (!user || user.role !== 'vendor') {
        throw new Error('Not a vendor');
    }

    // If vendor has a shop, return it
    if (user.shopId) {
        return await Shop.findById(user.shopId);
    }

    // Create default shop for vendor
    const shop = await Shop.create({
        name: `${user.name}'s Shop`,
        ownerId: userId,
        parkId: null, // Will be assigned by super admin later
        isActive: true,
    });

    user.shopId = shop._id;
    await user.save();

    return shop;
}

/**
 * Save scanned products (bulk)
 */
export async function saveBulkProducts(products: { name: string; price: number; description: string }[]) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'vendor') {
            return { success: false, error: 'Unauthorized' };
        }

        const shop = await getVendorShop(session.user.userId);

        // Null safety check
        if (!shop) {
            return { success: false, error: 'Shop not found. Please contact support.' };
        }

        const productDocs = products.map(p => ({
            shopId: shop._id,
            name: p.name,
            description: p.description,
            price: p.price,
            category: 'General', // Default category
            isVeg: false, // Default
            isAvailable: true,
        }));

        await Product.insertMany(productDocs);

        revalidatePath('/vendor/dashboard');
        return { success: true, count: products.length };
    } catch (error: any) {
        console.error('Bulk save error:', error);
        return { success: false, error: error.message || 'Failed to save products' };
    }
}

/**
 * Create single product
 */
export async function createProduct(formData: FormData) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'vendor') {
            return { success: false, error: 'Unauthorized' };
        }

        const shop = await getVendorShop(session.user.userId);

        if (!shop) {
            return { success: false, error: 'Shop not found. Please contact support.' };
        }

        // Extract and validate form data
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const priceStr = formData.get('price') as string;
        const category = (formData.get('category') as string) || 'General';
        const image = (formData.get('image') as string) || '';
        const isVeg = formData.get('isVeg') === 'true';

        // Validation
        if (!name || !description || !priceStr) {
            return { success: false, error: 'Missing required fields' };
        }

        const price = Number(priceStr);
        if (isNaN(price) || price < 0) {
            return { success: false, error: 'Invalid price' };
        }

        const product = await Product.create({
            shopId: shop._id,
            name,
            description,
            price,
            category,
            image,
            isVeg,
            isAvailable: true,
        });

        revalidatePath('/vendor/dashboard/products');
        return { success: true, productId: product._id.toString() };
    } catch (error: any) {
        console.error('Create product error:', error);
        return { success: false, error: error.message || 'Failed to create product' };
    }
}

/**
 * Get all vendor's products
 */
export async function getVendorProducts() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'vendor') {
            return { success: false, error: 'Unauthorized', products: [] };
        }

        const shop = await getVendorShop(session.user.userId);

        if (!shop) {
            return { success: false, error: 'Shop not found', products: [] };
        }

        const products = await Product.find({ shopId: shop._id }).sort({ createdAt: -1 }).lean();

        return {
            success: true,
            products: products.map(p => ({
                id: p._id.toString(),
                name: p.name,
                description: p.description,
                price: p.price,
                category: p.category,
                image: p.image || '',
                isVeg: p.isVeg,
                isAvailable: p.isAvailable,
            })),
        };
    } catch (error: any) {
        console.error('Get products error:', error);
        return { success: false, error: error.message, products: [] };
    }
}

/**
 * Toggle product availability
 */
export async function toggleProductAvailability(productId: string) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'vendor') {
            return { success: false, error: 'Unauthorized' };
        }

        await connectDB();
        const product = await Product.findById(productId);

        if (!product) {
            return { success: false, error: 'Product not found' };
        }

        product.isAvailable = !product.isAvailable;
        await product.save();

        revalidatePath('/vendor/dashboard/products');
        return { success: true, isAvailable: product.isAvailable };
    } catch (error: any) {
        console.error('Toggle availability error:', error);
        return { success: false, error: error.message || 'Failed to update product' };
    }
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'vendor') {
            return { success: false, error: 'Unauthorized' };
        }

        await connectDB();
        await Product.findByIdAndDelete(productId);

        revalidatePath('/vendor/dashboard/products');
        return { success: true };
    } catch (error: any) {
        console.error('Delete product error:', error);
        return { success: false, error: error.message || 'Failed to delete product' };
    }
}
