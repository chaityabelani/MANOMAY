import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Shop from '@/models/Shop';

export async function GET(request: NextRequest) {
    try {
        const vendorId = request.nextUrl.searchParams.get('vendorId');

        if (!vendorId) {
            return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
        }

        await connectDB();

        // Get vendor's shop
        const shop = await Shop.findOne({ ownerId: vendorId }).lean();

        if (!shop) {
            return NextResponse.json({ orders: [] });
        }

        // Get orders for this shop
        const orders = await Order.find({ shopId: shop._id })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        return NextResponse.json({
            orders: orders.map(o => ({
                id: o._id.toString(),
                tableNumber: o.tableNumber,
                customerName: o.customerName,
                customerPhone: o.customerPhone,
                items: o.items,
                totalAmount: o.totalAmount,
                status: o.status,
                createdAt: o.createdAt.toISOString(),
            })),
        });
    } catch (error: any) {
        console.error('Get vendor orders API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
