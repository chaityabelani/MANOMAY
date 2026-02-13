'use server';

import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import { getSession } from '@/lib/auth';

/**
 * ====================
 * NOTIFICATION SERVER ACTIONS
 * ====================
 * Simple polling-based notifications (Vercel compatible)
 */

/**
 * Get customer notifications
 * Returns unread + recent read notifications
 */
export async function getCustomerNotifications() {
    try {
        const session = await getSession();

        if (!session) {
            return { success: false, error: 'Not logged in', notifications: [] };
        }

        await connectDB();

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Get unread + recent read notifications
        const notifications = await Notification.find({
            userId: session.user.userId,
            $or: [
                { read: false },
                { read: true, createdAt: { $gte: oneDayAgo } }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
            .catch(() => []);

        const formattedNotifications = notifications.map(n => ({
            id: n._id.toString(),
            type: n.type || 'order_placed',
            title: n.title || '',
            message: n.message || '',
            orderId: n.orderId?.toString() || null,
            read: n.read ?? false,
            createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : null,
        }));

        const unreadCount = formattedNotifications.filter(n => !n.read).length;

        return {
            success: true,
            notifications: formattedNotifications,
            unreadCount,
        };

    } catch (error: any) {
        console.error('[Notification] Error in getCustomerNotifications:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch notifications',
            notifications: [],
        };
    }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string) {
    try {
        const session = await getSession();

        if (!session) {
            return { success: false, error: 'Not logged in' };
        }

        if (!notificationId || notificationId.length !== 24) {
            return { success: false, error: 'Invalid notification ID' };
        }

        await connectDB();

        await Notification.findOneAndUpdate(
            { _id: notificationId, userId: session.user.userId },
            { read: true }
        );

        return { success: true };

    } catch (error: any) {
        console.error('[Notification] Error in markAsRead:', error);
        return { success: false, error: error.message || 'Failed to mark as read' };
    }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead() {
    try {
        const session = await getSession();

        if (!session) {
            return { success: false, error: 'Not logged in' };
        }

        await connectDB();

        await Notification.updateMany(
            { userId: session.user.userId, read: false },
            { read: true }
        );

        console.log(`[Notification] Marked all notifications as read for user ${session.user.userId}`);

        return { success: true };

    } catch (error: any) {
        console.error('[Notification] Error in markAllAsRead:', error);
        return { success: false, error: error.message || 'Failed to mark all as read' };
    }
}

/**
 * Create a notification (called internally when order status changes)
 */
export async function createNotification(
    userId: string,
    type: 'order_placed' | 'order_preparing' | 'order_ready' | 'order_delivered',
    orderId: string,
    customMessage?: string
) {
    try {
        await connectDB();

        const titles = {
            order_placed: '🎉 Order Placed!',
            order_preparing: '👨‍🍳 Order Preparing',
            order_ready: '✅ Order Ready!',
            order_delivered: '🎁 Order Delivered',
        };

        const messages = {
            order_placed: customMessage || 'Your order has been placed successfully',
            order_preparing: customMessage || 'Your order is being prepared',
            order_ready: customMessage || 'Your order is ready for pickup!',
            order_delivered: customMessage || 'Your order has been delivered. Enjoy!',
        };

        await Notification.create({
            userId,
            type,
            title: titles[type],
            message: messages[type],
            orderId,
            read: false,
        });

        console.log(`[Notification] Created ${type} notification for user ${userId}`);

        return { success: true };

    } catch (error: any) {
        console.error('[Notification] Error in createNotification:', error);
        return { success: false, error: error.message };
    }
}
