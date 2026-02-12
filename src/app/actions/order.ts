'use server';

import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';

interface OrderItem {
    productId: string;
    shopId: string;
    name: string;
    price: number;
    quantity: number;
}

interface CreateOrderData {
    parkId?: string;
    tableNumber: string;
    customerName: string;
    customerPhone: string;
    items: OrderItem[];
}

/**
 * Create order(s) - splits by vendor if multi-vendor cart
 */
export async function createOrder(data: CreateOrderData) {
    try {
        await connectDB();

        const { tableNumber, customerName, customerPhone, items } = data;

        // Group items by shopId
        const itemsByShop = items.reduce((acc: any, item) => {
            if (!acc[item.shopId]) {
                acc[item.shopId] = [];
            }
            acc[item.shopId].push(item);
            return acc;
        }, {});

        // Create separate order for each shop
        const orderIds: string[] = [];

        for (const [shopId, shopItems] of Object.entries(itemsByShop) as [string, OrderItem[]][]) {
            const totalAmount = shopItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            const order = await Order.create({
                parkId: data.parkId || null,
                shopId,
                tableNumber,
                customerName,
                customerPhone,
                items: shopItems.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                totalAmount,
                status: 'placed',
            });

            orderIds.push(order._id.toString());
        }

        revalidatePath('/vendor/dashboard/orders');

        return {
            success: true,
            orderIds,
            message: `${orderIds.length} order(s) placed successfully!`,
        };
    } catch (error: any) {
        console.error('Create order error:', error);
        return {
            success: false,
            error: error.message || 'Failed to place order',
        };
    }
}

/**
 * Get orders for a specific shop (vendor view)
 */
export async function getShopOrders(shopId: string) {
    try {
        await connectDB();

        const orders = await Order.find({ shopId })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        return {
            success: true,
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
        };
    } catch (error: any) {
        console.error('Get shop orders error:', error);
        return { success: false, error: error.message, orders: [] };
    }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await connectDB();

        await Order.findByIdAndUpdate(orderId, { status });

        revalidatePath('/vendor/dashboard/orders');

        return { success: true };
    } catch (error: any) {
        console.error('Update order status error:', error);
        return { success: false, error: error.message };
    }
}
