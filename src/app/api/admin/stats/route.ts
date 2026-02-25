import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FoodPark from '@/models/FoodPark';
import User from '@/models/User';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

/**
 * GET /api/admin/stats
 * Returns live platform-wide KPI data for the super admin dashboard.
 */
export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'super-admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [totalParks, totalVendors, ordersToday, revenueAgg] = await Promise.all([
            FoodPark.countDocuments(),
            User.countDocuments({ role: 'vendor' }),
            Order.countDocuments({ createdAt: { $gte: todayStart } }),
            Order.aggregate([
                { $match: { createdAt: { $gte: todayStart }, status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
        ]);

        return NextResponse.json(
            {
                totalParks,
                totalVendors,
                ordersToday,
                revenueToday: revenueAgg[0]?.total ?? 0,
            },
            { headers: { 'Cache-Control': 'no-store' } }
        );
    } catch (error: any) {
        console.error('[admin/stats]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
