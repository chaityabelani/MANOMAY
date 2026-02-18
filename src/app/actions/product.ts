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
 * Get vendor statistics for dashboard
 */
export async function getVendorStats() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'vendor') {
            return {
                success: false,
                error: 'Unauthorized',
                stats: null
            };
        }

        await connectDB();
        const shop = await getVendorShop(session.user.userId);

        if (!shop) {
            return {
                success: false,
                error: 'Shop not found',
                stats: null
            };
        }

        // Get product stats
        const totalProducts = await Product.countDocuments({ shopId: shop._id });
        const activeProducts = await Product.countDocuments({
            shopId: shop._id,
            isAvailable: true
        });

        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Import Order model
        const Order = (await import('@/models/Order')).default;

        // Use aggregation pipeline for better performance
        const orderStats = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: today, $lt: tomorrow }
                }
            },
            {
                $unwind: '$items'
            },
            {
                $match: {
                    'items.shopId': shop._id
                }
            },
            {
                $group: {
                    _id: null,
                    ordersToday: { $sum: 1 },
                    revenueToday: {
                        $sum: {
                            $multiply: ['$items.price', '$items.quantity']
                        }
                    }
                }
            }
        ]);

        const stats = orderStats[0] || { ordersToday: 0, revenueToday: 0 };

        return {
            success: true,
            stats: {
                totalProducts,
                activeProducts,
                ordersToday: stats.ordersToday,
                revenueToday: stats.revenueToday
            }
        };
    } catch (error: any) {
        console.error('Get vendor stats error:', error);
        return {
            success: false,
            error: error.message,
            stats: null
        };
    }
}

/**
 * Save scanned products (bulk)
 */
export async function saveBulkProducts(products: { name: string; price: number; description?: string }[]) {
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

        // Extract the ID here, OUTSIDE the .map() function
        const shopId = shop._id;

        const productDocs = products.map(p => ({
            shopId: shopId,
            name: p.name,
            description: p.description || '',
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
        const description = (formData.get('description') as string) || '';
        const priceStr = formData.get('price') as string;
        const category = (formData.get('category') as string) || 'General';
        const image = (formData.get('image') as string) || '';
        const isVeg = formData.get('isVeg') === 'true';

        // Validation
        if (!name || !priceStr) {
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
 * Get single product by ID (for editing)
 */
export async function getProductById(productId: string) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'vendor') {
            return { success: false, error: 'Unauthorized', product: null };
        }

        await connectDB();
        const product = await Product.findById(productId).lean();

        if (!product) {
            return { success: false, error: 'Product not found', product: null };
        }

        return {
            success: true,
            product: {
                id: product._id.toString(),
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                image: product.image || '',
                isVeg: product.isVeg,
                isAvailable: product.isAvailable,
            },
        };
    } catch (error: any) {
        console.error('Get product error:', error);
        return { success: false, error: error.message, product: null };
    }
}

/**
 * Update product
 */
export async function updateProduct(productId: string, formData: FormData) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'vendor') {
            return { success: false, error: 'Unauthorized' };
        }

        await connectDB();

        // Extract form data
        const name = formData.get('name') as string;
        const description = (formData.get('description') as string) || '';
        const priceStr = formData.get('price') as string;
        const category = (formData.get('category') as string) || 'General';
        const image = (formData.get('image') as string) || '';
        const isVeg = formData.get('isVeg') === 'true';

        // Validation
        if (!name || !priceStr) {
            return { success: false, error: 'Missing required fields' };
        }

        const price = Number(priceStr);
        if (isNaN(price) || price < 0) {
            return { success: false, error: 'Invalid price' };
        }

        // Update product
        const product = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                description,
                price,
                category,
                image,
                isVeg,
            },
            { new: true }
        );

        if (!product) {
            return { success: false, error: 'Product not found' };
        }

        revalidatePath('/vendor/dashboard/products');
        return { success: true, productId: product._id.toString() };
    } catch (error: any) {
        console.error('Update product error:', error);
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
