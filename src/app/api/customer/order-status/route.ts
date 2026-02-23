import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

/**
 * GET /api/customer/order-status
 * Accepts either:
 *   - ?phone=<customerPhone>  (guest + logged-in customers who checked out)
 *   - ?userId=<userId>        (logged-in customers who skipped checkout this session)
 * Returns statuses for all orders in the last 24h matching the identifier.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') ?? '';
        let phone = searchParams.get('phone') ?? '';

        // Normalize phone — strip non-digits, remove country code, take last 10 digits
        phone = phone.replace(/\D/g, '').replace(/^91/, '').slice(-10);

        // Require at least one valid identifier
        const hasPhone = phone.length === 10;
        const hasUserId = userId.length > 0;

        if (!hasPhone && !hasUserId) {
            return NextResponse.json(
                { error: 'Provide a valid phone number or userId' },
                { status: 400 }
            );
        }

        await connectDB();

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Build query — prefer phone when available, fall back to userId
        const query: Record<string, unknown> = { createdAt: { $gte: since } };
        if (hasPhone) {
            query.customerPhone = phone;
        } else {
            query.userId = userId;
        }

        const orders = await Order.find(query)
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
