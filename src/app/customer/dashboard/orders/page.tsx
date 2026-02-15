'use client';

import { useEffect, useState } from 'react';
import { getCustomerOrders } from '@/app/actions/customer';
import Link from 'next/link';

type Order = {
    id: string;
    tableNumber: string;
    items: { name: string; quantity: number; price: number }[];
    totalAmount: number;
    status: string;
    createdAt: string;
};

export default function CustomerOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrders() {
            const result = await getCustomerOrders();
            if (result.success) {
                setOrders(result.orders);
            }
            setLoading(false);
        }
        loadOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'placed':
                return 'bg-blue-100 text-blue-700';
            case 'preparing':
                return 'bg-yellow-100 text-yellow-700';
            case 'ready':
                return 'bg-green-100 text-green-700';
            case 'delivered':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-4">
                    <Link
                        href="/customer/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-xl transition font-bold text-slate-900 hover:text-orange-600"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Order History</h1>
                <p className="text-slate-600 mb-8">Track all your orders</p>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            No orders yet
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Start browsing the menu to place your first order
                        </p>
                        <Link
                            href="/menu"
                            className="inline-flex px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition"
                        >
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg">Order #{order.id.slice(-6)}</h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            <span>📍 Table {order.tableNumber}</span>
                                            <span className="mx-2">•</span>
                                            <span>{new Date(order.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-orange-600">
                                            ₹{order.totalAmount}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4">
                                    <h4 className="font-semibold text-sm text-slate-700 mb-2">Items:</h4>
                                    <div className="space-y-1">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-slate-600">
                                                    {item.quantity}x {item.name}
                                                </span>
                                                <span className="font-medium">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
