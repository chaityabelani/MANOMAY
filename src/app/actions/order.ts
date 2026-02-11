'use server';

import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Shop from '@/models/Shop';
import { getSession } from './auth';

export async function getVendorOrders(shopId?: string, statusFilter?: string) {
    try {
        await connectDB();

        const session = await getSession();
        if (!session?.user?._id) {
            return { success: false, error: 'Unauthorized' };
        }

        // Get vendor's shops
        const vendorShops = await Shop.find({ ownerId: session.user._id }).select('_id name');
        const vendorShopIds = vendorShops.map(shop => shop._id.toString());

        if (vendorShopIds.length === 0) {
            return { success: true, orders: [], shops: [] };
        }

        // Build query
        const query: any = {
            'items.shopId': { $in: vendorShopIds }
        };

        // Filter by specific shop if provided
        if (shopId) {
            query['items.shopId'] = shopId;
        }

        // Filter by status
        if (statusFilter && statusFilter !== 'all') {
            query.status = statusFilter;
        }

        // Fetch orders
        const orders = await Order.find(query)
            .populate('userId', 'name email')
            .populate('parkId', 'name')
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        // Transform orders for frontend
        const transformedOrders = orders.map((order: any) => ({
            id: order._id.toString(),
            orderNumber: `#${order._id.toString().slice(-6).toUpperCase()}`,
            tableNumber: order.tableNumber,
            customerName: order.userId?.name || 'Guest',
            customerEmail: order.userId?.email || null,
            parkName: order.parkId?.name || 'Food Park',
            status: order.status,
            paymentStatus: order.paymentStatus,
            totalAmount: order.totalAmount,
            items: order.items
                .filter((item: any) => vendorShopIds.includes(item.shopId.toString()))
                .map((item: any) => ({
                    productId: item.productId.toString(),
                    shopId: item.shopId.toString(),
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    customizations: item.customizations || {}
                })),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }));

        return {
            success: true,
            orders: transformedOrders,
            shops: vendorShops.map(shop => ({
                id: shop._id.toString(),
                name: shop.name
            }))
        };
    } catch (error: any) {
        console.error('Error fetching vendor orders:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch orders'
        };
    }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
        await connectDB();

        const session = await getSession();
        if (!session?.user?._id) {
            return { success: false, error: 'Unauthorized' };
        }

        // Validate status
        const validStatuses = ['placed', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (!validStatuses.includes(newStatus)) {
            return { success: false, error: 'Invalid status' };
        }

        // Find order
        const order = await Order.findById(orderId);
        if (!order) {
            return { success: false, error: 'Order not found' };
        }

        // Verify vendor owns at least one shop in this order
        const vendorShopIds = await Shop.find({ ownerId: session.user._id }).distinct('_id');
        const hasVendorItems = order.items.some((item: any) =>
            vendorShopIds.some(id => id.toString() === item.shopId.toString())
        );

        if (!hasVendorItems) {
            return { success: false, error: 'Unauthorized to update this order' };
        }

        // Update status
        order.status = newStatus;
        await order.save();

        return {
            success: true,
            message: `Order status updated to ${newStatus}`,
            order: {
                id: order._id.toString(),
                status: order.status
            }
        };
    } catch (error: any) {
        console.error('Error updating order status:', error);
        return {
            success: false,
            error: error.message || 'Failed to update order status'
        };
    }
}
