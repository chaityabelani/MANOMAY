'use server';

import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

/**
 * ====================
 * EXPORT SERVER ACTIONS
 * ====================
 * CSV export for orders and earnings
 */

/**
 * Export vendor orders as CSV
 */
export async function exportOrdersCSV(dateRange: 'week' | 'month' | 'all' = 'month') {
    try {
        const session = await getSession();

        if (!session || session.user.role !== 'vendor') {
            return { success: false, error: 'Unauthorized', csv: '' };
        }

        if (!session.user.shopId) {
            return { success: false, error: 'Shop not found', csv: '' };
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

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .lean()
            .catch(() => []);

        if (orders.length === 0) {
            return { success: false, error: 'No orders to export', csv: '' };
        }

        // Generate CSV
        const headers = 'Order ID,Date,Table,Items,Total Amount,Status';
        const rows = orders.map(o => {
            const items = (o.items || []).map(i => `${i.name} x${i.quantity}`).join('; ');
            const date = o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : 'N/A';
            const total = (o.totalAmount || 0).toFixed(2);

            return `${o._id},${date},${o.tableNumber || 'N/A'},"${items}",${total},${o.status}`;
        });

        const csv = [headers, ...rows].join('\n');

        console.log(`[Export] Exported ${orders.length} orders for vendor ${session.user.userId}`);

        return {
            success: true,
            csv,
            filename: `orders_${dateRange}_${Date.now()}.csv`,
        };

    } catch (error: any) {
        console.error('[Export] Error in exportOrdersCSV:', error);
        return {
            success: false,
            error: error.message || 'Failed to export orders',
            csv: '',
        };
    }
}

/**
 * Export admin analytics as CSV
 */
export async function exportAnalyticsCSV() {
    try {
        const session = await getSession();

        if (!session || session.user.role !== 'super-admin') {
            return { success: false, error: 'Unauthorized', csv: '' };
        }

        await connectDB();

        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(1000)
            .lean()
            .catch(() => []);

        if (orders.length === 0) {
            return { success: false, error: 'No data to export', csv: '' };
        }

        // Generate CSV
        const headers = 'Order ID,Date,Shop ID,Table,Total Amount,Status';
        const rows = orders.map(o => {
            const date = o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : 'N/A';
            const total = (o.totalAmount || 0).toFixed(2);

            return `${o._id},${date},${o.shopId || 'N/A'},${o.tableNumber || 'N/A'},${total},${o.status}`;
        });

        const csv = [headers, ...rows].join('\n');

        console.log(`[Export] Admin exported ${orders.length} orders`);

        return {
            success: true,
            csv,
            filename: `analytics_${Date.now()}.csv`,
        };

    } catch (error: any) {
        console.error('[Export] Error in exportAnalyticsCSV:', error);
        return {
            success: false,
            error: error.message || 'Failed to export analytics',
            csv: '',
        };
    }
}
