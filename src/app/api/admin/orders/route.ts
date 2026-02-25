import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Shop from '@/models/Shop';
import { getSession } from '@/lib/auth';

/**
 * GET /api/admin/orders
 * Returns all platform orders with optional filters:
 *   ?status=placed|preparing|ready|delivered|cancelled
 *   ?from=YYYY-MM-DD
 *   ?to=YYYY-MM-DD
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'super-admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        // Build filter
        const filter: Record<string, any> = {};
        if (status && status !== 'all') filter.status = status;
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) {
                const endOfDay = new Date(to);
                endOfDay.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = endOfDay;
            }
        }

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .limit(200)
            .lean();

        // Get shop names for all unique shopIds
        const shopIds = [...new Set(orders.map((o) => o.shopId?.toString()).filter(Boolean))];
        const shops = await Shop.find({ _id: { $in: shopIds } }).select('name').lean();
        const shopMap: Record<string, string> = {};
        shops.forEach((s: any) => { shopMap[s._id.toString()] = s.name; });

        const result = orders.map((o: any) => ({
            id: o._id.toString(),
            shopId: o.shopId?.toString() ?? '',
            shopName: shopMap[o.shopId?.toString()] ?? 'Unknown',
            tableNumber: o.tableNumber,
            customerName: o.customerName,
            customerPhone: o.customerPhone,
            items: o.items.map((i: any) => ({
                name: i.name,
                price: i.price,
                quantity: i.quantity,
            })),
            totalAmount: o.totalAmount,
            status: o.status,
            paymentStatus: o.paymentStatus,
            createdAt: o.createdAt?.toISOString() ?? null,
        }));

        return NextResponse.json(
            { orders: result },
            { headers: { 'Cache-Control': 'no-store' } }
        );
    } catch (error: any) {
        console.error('[admin/orders]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
