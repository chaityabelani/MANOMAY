'use server';

import connectDB from '@/lib/db';
import User from '@/models/User';
import Shop from '@/models/Shop';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getSession } from '@/lib/auth';

/**
 * ====================
 * ANALYTICS SERVER ACTIONS
 * ====================
 * Production-ready analytics with comprehensive error handling
 */

// ============ VENDOR MANAGEMENT ============

/**
 * Get all vendors with shop details
 * Includes error handling for missing data
 */
export async function getAllVendorsWithShops() {
    try {
        const session = await getSession();

        // Auth check: Only super-admin can access
        if (!session || session.user.role !== 'super-admin') {
            console.warn('[Analytics] Unauthorized access attempt');
            return {
                success: false,
                error: 'Unauthorized - Admin access required',
                vendors: []
            };
        }

        await connectDB();

        // Safe query with error handling
        const vendors = await User.find({ role: 'vendor' })
            .select('_id name email createdAt')
            .lean()
            .catch(err => {
                console.error('[Analytics] Vendor query error:', err);
                return [];
            });

        if (!vendors || vendors.length === 0) {
            return { success: true, vendors: [] };
        }

        // Fetch shops for each vendor with null safety
        const vendorsWithShops = await Promise.all(
            vendors.map(async (vendor) => {
                try {
                    const shop = await Shop.findOne({ ownerId: vendor._id }).lean();

                    // Count products safely
                    const productCount = shop
                        ? await Product.countDocuments({ shopId: shop._id }).catch(() => 0)
                        : 0;

                    // Count orders safely
                    const orderCount = shop
                        ? await Order.countDocuments({ shopId: shop._id }).catch(() => 0)
                        : 0;

                    return {
                        id: vendor._id.toString(),
                        name: vendor.name || 'Unknown',
                        email: vendor.email || 'N/A',
                        joinedAt: vendor.createdAt ? new Date(vendor.createdAt).toISOString() : null,
                        shop: shop ? {
                            id: shop._id.toString(),
                            name: shop.name || 'Unnamed Shop',
                            active: shop.isActive ?? false,
                            productCount,
                            orderCount,
                        } : null,
                    };
                } catch (err) {
                    console.error(`[Analytics] Error processing vendor ${vendor._id}:`, err);
                    return {
                        id: vendor._id.toString(),
                        name: vendor.name || 'Unknown',
                        email: vendor.email || 'N/A',
                        joinedAt: vendor.createdAt ? new Date(vendor.createdAt).toISOString() : null,
                        shop: null,
                    };
                }
            })
        );

        return { success: true, vendors: vendorsWithShops };

    } catch (error: any) {
        console.error('[Analytics] Fatal error in getAllVendorsWithShops:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch vendors',
            vendors: []
        };
    }
}

/**
 * Get detailed vendor information
 */
export async function getVendorDetails(vendorId: string) {
    try {
        const session = await getSession();

        if (!session || session.user.role !== 'super-admin') {
            return { success: false, error: 'Unauthorized' };
        }

        // Validate vendorId
        if (!vendorId || vendorId.length !== 24) {
            return { success: false, error: 'Invalid vendor ID' };
        }

        await connectDB();

        const vendor = await User.findById(vendorId).lean();
        if (!vendor || vendor.role !== 'vendor') {
            return { success: false, error: 'Vendor not found' };
        }

        const shop = await Shop.findOne({ ownerId: vendorId }).lean();

        if (!shop) {
            return {
                success: true,
                vendor: {
                    id: vendor._id.toString(),
                    name: vendor.name || 'Unknown',
                    email: vendor.email || 'N/A',
                    shop: null,
                },
            };
        }

        // Get products safely
        const products = await Product.find({ shopId: shop._id })
            .select('name price category available')
            .lean()
            .catch(() => []);

        // Get recent orders safely
        const orders = await Order.find({ shopId: shop._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()
            .catch(() => []);

        // Calculate revenue safely
        const totalRevenue = orders.reduce((sum, order) => {
            return sum + (order.totalAmount || 0);
        }, 0);

        return {
            success: true,
            vendor: {
                id: vendor._id.toString(),
                name: vendor.name,
                email: vendor.email,
                shop: {
                    id: shop._id.toString(),
                    name: shop.name,
                    active: shop.isActive ?? false,
                    products: products.length,
                    totalOrders: orders.length,
                    totalRevenue,
                },
                recentProducts: products.slice(0, 5).map(p => ({
                    id: p._id.toString(),
                    name: p.name,
                    price: p.price || 0,
                    available: p.isAvailable ?? false,
                })),
                recentOrders: orders.map(o => ({
                    id: o._id.toString(),
                    totalAmount: o.totalAmount || 0,
                    status: o.status || 'unknown',
                    createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
                })),
            },
        };

    } catch (error: any) {
        console.error('[Analytics] Error in getVendorDetails:', error);
        return { success: false, error: error.message || 'Failed to fetch details' };
    }
}

// ============ PLATFORM ANALYTICS ============

/**
 * Get platform-wide analytics
 */
export async function getPlatformAnalytics() {
    try {
        const session = await getSession();

        if (!session || session.user.role !== 'super-admin') {
            return { success: false, error: 'Unauthorized' };
        }

        await connectDB();

        // Parallel queries with error handling
        const [
            totalVendors,
            totalShops,
            totalProducts,
            totalOrders,
        ] = await Promise.all([
            User.countDocuments({ role: 'vendor' }).catch(() => 0),
            Shop.countDocuments().catch(() => 0),
            Product.countDocuments().catch(() => 0),
            Order.countDocuments().catch(() => 0),
        ]);

        // Get all orders for revenue calculation
        const orders = await Order.find()
            .select('totalAmount createdAt status')
            .lean()
            .catch(() => []);

        // Safe revenue calculation
        const totalRevenue = orders.reduce((sum, order) => {
            return sum + (order.totalAmount || 0);
        }, 0);

        // Calculate average order value safely
        const avgOrderValue = orders.length > 0
            ? totalRevenue / orders.length
            : 0;

        // Status distribution
        const ordersByStatus = orders.reduce((acc, order) => {
            const status = order.status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Get top vendors by order count
        const vendorOrderCounts = await Order.aggregate([
            {
                $group: {
                    _id: '$shopId',
                    orderCount: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { orderCount: -1 } },
            { $limit: 5 }
        ]).catch(() => []);

        // Enrich with shop names
        const topVendors = await Promise.all(
            vendorOrderCounts.map(async (v) => {
                const shop = await Shop.findById(v._id).lean().catch(() => null);
                return {
                    shopId: v._id?.toString() || null,
                    shopName: shop?.name || 'Unknown Shop',
                    orderCount: v.orderCount || 0,
                    revenue: v.revenue || 0,
                };
            })
        );

        return {
            success: true,
            analytics: {
                overview: {
                    totalVendors,
                    totalShops,
                    totalProducts,
                    totalOrders,
                    totalRevenue: Math.round(totalRevenue * 100) / 100, // Round to 2 decimals
                    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
                },
                ordersByStatus,
                topVendors: topVendors.filter(v => v.shopId !== null),
            },
        };

    } catch (error: any) {
        console.error('[Analytics] Error in getPlatformAnalytics:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch analytics'
        };
    }
}

/**
 * Toggle vendor shop status (activate/deactivate)
 */
export async function toggleVendorStatus(vendorId: string, active: boolean) {
    try {
        const session = await getSession();

        if (!session || session.user.role !== 'super-admin') {
            return { success: false, error: 'Unauthorized' };
        }

        if (!vendorId || vendorId.length !== 24) {
            return { success: false, error: 'Invalid vendor ID' };
        }

        await connectDB();

        const shop = await Shop.findOneAndUpdate(
            { ownerId: vendorId },
            { isActive: active },
            { new: true }
        );

        if (!shop) {
            return { success: false, error: 'Shop not found' };
        }

        console.log(`[Analytics] Vendor ${vendorId} shop ${active ? 'activated' : 'deactivated'}`);

        return {
            success: true,
            message: `Shop ${active ? 'activated' : 'deactivated'} successfully`
        };

    } catch (error: any) {
        console.error('[Analytics] Error in toggleVendorStatus:', error);
        return { success: false, error: error.message || 'Failed to update status' };
    }
}
