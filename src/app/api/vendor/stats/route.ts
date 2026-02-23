import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Shop from '@/models/Shop';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

/**
 * GET /api/vendor/stats
 * Returns live KPI data for the vendor dashboard.
 * Polled every 15s by VendorKPICards client component.
 */
export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'vendor') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const shop = await Shop.findOne({ ownerId: session.user.userId }).lean();

        if (!shop) {
            return NextResponse.json({
                pendingOrders: 0, preparingOrders: 0,
                outOfStockProducts: 0, revenueThisWeek: 0,
                ordersToday: 0, totalProducts: 0,
            });
        }

        const shopId = (shop as any)._id;

        // Today and this-week boundaries
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        weekStart.setHours(0, 0, 0, 0);

        // Run all queries in parallel
        const [
            pendingOrders,
            preparingOrders,
            ordersToday,
            outOfStockProducts,
            totalProducts,
            weeklyRevenue,
        ] = await Promise.all([
            Order.countDocuments({ shopId, status: 'placed' }),
            Order.countDocuments({ shopId, status: 'preparing' }),
            Order.countDocuments({ shopId, createdAt: { $gte: todayStart } }),
            Product.countDocuments({ shopId, isAvailable: false }),
            Product.countDocuments({ shopId }),
            Order.aggregate([
                { $match: { shopId, createdAt: { $gte: weekStart }, status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
        ]);

        return NextResponse.json(
            {
                pendingOrders,
                preparingOrders,
                ordersToday,
                outOfStockProducts,
                totalProducts,
                revenueThisWeek: weeklyRevenue[0]?.total ?? 0,
            },
            { headers: { 'Cache-Control': 'no-store' } }
        );
    } catch (error: any) {
        console.error('[vendor/stats]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
