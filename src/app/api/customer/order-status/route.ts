import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

/**
 * GET /api/customer/order-status?phone=<customerPhone>
 * Returns statuses for all orders in the last 24h for this phone number.
 * Phone is used because ALL orders (guest + logged-in) always have customerPhone.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const phone = searchParams.get('phone');

        if (!phone) {
            return NextResponse.json({ error: 'phone is required' }, { status: 400 });
        }

        await connectDB();

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const orders = await Order.find({
            customerPhone: phone,
            createdAt: { $gte: since },
        })
            .select('_id status shopId')
            .populate('shopId', 'name')
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const result = orders.map((o: any) => ({
            id: o._id.toString(),
            status: o.status,
            shopName: o.shopId?.name || 'your shop',
        }));

        return NextResponse.json({ orders: result });
    } catch (error: any) {
        console.error('[order-status] error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch order status' },
            { status: 500 }
        );
    }
}
