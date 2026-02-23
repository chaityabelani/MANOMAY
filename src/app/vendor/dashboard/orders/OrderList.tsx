'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { updateOrderStatus } from '@/app/actions/order';

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    tableNumber: string;
    customerName: string;
    customerPhone: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

const fetcher = async (url: string) => {
    const res = await fetch(url);
    return res.json();
};

export default function OrderList({
    initialOrders,
    vendorId,
}: {
    initialOrders: Order[];
    vendorId: string;
}) {
    const [filter, setFilter] = useState<string>('all');

    // Auto-refresh every 8 seconds for near real-time order visibility
    const { data: swrData, error, mutate } = useSWR(
        `/api/vendor/orders?vendorId=${vendorId}`,
        fetcher,
        {
            fallbackData: { orders: initialOrders },
            refreshInterval: 8000,
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        }
    );

    const orders: Order[] = swrData?.orders || initialOrders;

    const filteredOrders = orders.filter((order) => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    async function handleStatusChange(orderId: string, newStatus: string) {
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.success) {
            mutate(); // Refresh the data
        }
    }

    const statusColors: Record<string, string> = {
        placed: 'bg-blue-100 text-blue-700',
        preparing: 'bg-yellow-100 text-yellow-700',
        ready: 'bg-green-100 text-green-700',
        delivered: 'bg-slate-100 text-slate-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
                <p className="text-slate-600">Orders will appear here when customers place them</p>
            </div>
        );
    }

    return (
        <div>
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'placed', 'preparing', 'ready', 'delivered'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-xl font-medium capitalize whitespace-nowrap transition ${filter === status
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
                    <p className="text-slate-600">No {filter} orders</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition"
                        >
                            {/* Order Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        Table {order.tableNumber}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        {order.customerName} • {order.customerPhone}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-bold capitalize ${statusColors[order.status] || 'bg-slate-100 text-slate-700'
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            {/* Order Items */}
                            <div className="mb-4 pb-4 border-b border-slate-100">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm py-1">
                                        <span className="text-slate-700">
                                            {item.name} x {item.quantity}
                                        </span>
                                        <span className="font-medium">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Total and Actions */}
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-orange-600">
                                    Total: ₹{order.totalAmount}
                                </span>

                                {/* Status Update Buttons */}
                                <div className="flex gap-2">
                                    {order.status === 'placed' && (
                                        <button
                                            onClick={() => handleStatusChange(order.id, 'preparing')}
                                            className="px-4 py-2 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 transition"
                                        >
                                            Start Preparing
                                        </button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <button
                                            onClick={() => handleStatusChange(order.id, 'ready')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
                                        >
                                            Mark Ready
                                        </button>
                                    )}
                                    {order.status === 'ready' && (
                                        <button
                                            onClick={() => handleStatusChange(order.id, 'delivered')}
                                            className="px-4 py-2 bg-slate-600 text-white rounded-xl font-bold hover:bg-slate-700 transition"
                                        >
                                            Mark Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
