import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

/**
 * GET /api/customer/orders
 * Returns the authenticated customer's order history, sorted newest-first.
 * Polled by the client every 8s for real-time status updates.
 * Cache-Control: no-store prevents Vercel CDN from serving stale data.
 */
export async function GET() {
    try {
        const session = await getSession();

        if (!session || session.user.role !== 'customer') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const orders = await Order.find({ userId: session.user.userId })
            .populate('shopId', 'name')
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        const result = orders.map((o: any) => ({
            id: o._id.toString(),
            tableNumber: o.tableNumber,
            shopName: o.shopId?.name || 'Unknown Shop',
            items: o.items.map((item: any) => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
            totalAmount: o.totalAmount,
            status: o.status,
            createdAt: o.createdAt.toISOString(),
        }));

        return NextResponse.json(
            { orders: result },
            {
                headers: {
                    // Prevent Vercel CDN from caching — always fetch fresh data
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            }
        );
    } catch (error: any) {
        console.error('[customer/orders] error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
