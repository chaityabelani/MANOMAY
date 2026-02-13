'use server';

import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

/**
 * ====================
 * VENDOR EARNINGS SERVER ACTIONS
 * ====================
 * Revenue dashboard and analytics for vendors
 */

/**
 * Get vendor earnings summary
 */
export async function getVendorEarnings(dateRange: 'week' | 'month' | 'all' = 'month') {
    try {
        const session = await getSession();

        if (!session || session.user.role !== 'vendor') {
            return { success: false, error: 'Unauthorized - Vendor access required' };
        }

        if (!session.user.shopId) {
            return { success: false, error: 'Shop not found for vendor' };
        }

        await connectDB();

        // Calculate date filter
        let dateFilter: Date | undefined;
        if (dateRange === 'week') {
            dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        } else if (dateRange === 'month') {
            dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        }

        const query: any = { shopId: session.user.shopId };
        if (dateFilter) {
            query.createdAt = { $gte: dateFilter };
        }

        // Get all orders
        const orders = await Order.find(query).lean().catch(() => []);

        // Calculate earnings (only completed/delivered orders)
        const completedOrders = orders.filter(o => o.status === 'delivered');
        const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalEarnings / totalOrders : 0;

        // Orders by status
        const ordersByStatus = orders.reduce((acc, o) => {
            const status = o.status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            success: true,
            earnings: {
                total: Math.round(totalEarnings * 100) / 100,
                totalOrders,
                avgOrderValue: Math.round(avgOrderValue * 100) / 100,
                ordersByStatus,
            },
        };

    } catch (error: any) {
        console.error('[Earnings] Error in getVendorEarnings:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch earnings',
        };
    }
}

/**
 * Get top-selling products for vendor
 */
export async function getTopProducts() {
    try {
        const session = await getSession();

        if (!session || session.user.role !== 'vendor') {
            return { success: false, error: 'Unauthorized', products: [] };
        }

        if (!session.user.shopId) {
            return { success: false, error: 'Shop not found', products: [] };
        }

        await connectDB();

        // Aggregate product sales
        const result = await Order.aggregate([
            { $match: { shopId: new (require('mongoose').Types.ObjectId)(session.user.shopId) } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    productName: { $first: '$items.name' },
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 }
        ]).catch(() => []);

        const products = result.map(r => ({
            id: r._id?.toString() || '',
            name: r.productName || 'Unknown Product',
            quantity: r.totalQuantity || 0,
            revenue: Math.round((r.totalRevenue || 0) * 100) / 100,
        }));

        return {
            success: true,
            products,
        };

    } catch (error: any) {
        console.error('[Earnings] Error in getTopProducts:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch top products',
            products: [],
        };
    }
}
