'use client';

import useSWR from 'swr';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

type Order = {
    id: string;
    tableNumber: string;
    shopName: string;
    items: { name: string; quantity: number; price: number }[];
    totalAmount: number;
    status: string;
    createdAt: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const statusConfig: Record<string, { label: string; className: string }> = {
    placed: { label: 'PLACED', className: 'bg-blue-100 text-blue-700' },
    preparing: { label: 'PREPARING', className: 'bg-yellow-100 text-yellow-700' },
    ready: { label: 'READY 🎉', className: 'bg-green-100 text-green-700' },
    delivered: { label: 'DELIVERED', className: 'bg-gray-100 text-gray-700' },
    cancelled: { label: 'CANCELLED', className: 'bg-red-100 text-red-600' },
};

export default function CustomerOrdersPage() {
    const { data, isLoading, mutate, isValidating } = useSWR<{ orders: Order[] }>(
        '/api/customer/orders',
        fetcher,
        {
            refreshInterval: 8000,       // Poll every 8 seconds
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        }
    );

    const orders = data?.orders ?? [];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <BackButton href="/customer/dashboard" />
                    {/* Live indicator */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span
                            className={`w-2 h-2 rounded-full ${isValidating ? 'bg-orange-400 animate-pulse' : 'bg-green-400'}`}
                        />
                        {isValidating ? 'Updating…' : 'Live'}
                        <button
                            onClick={() => mutate()}
                            className="ml-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition font-medium"
                        >
                            ↻ Refresh
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Order History</h1>
                <p className="text-slate-600 mb-8">Updates automatically every 8 seconds</p>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h3>
                        <p className="text-slate-600 mb-6">Start browsing the menu to place your first order</p>
                        <Link
                            href="/menu"
                            className="inline-flex px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition"
                        >
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const cfg = statusConfig[order.status] ?? statusConfig.placed;
                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-lg">Order #{order.id.slice(-6)}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.className}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <div className="text-sm text-slate-600 flex gap-3">
                                                <span>🏪 {order.shopName}</span>
                                                <span>•</span>
                                                <span>📍 Table {order.tableNumber}</span>
                                                <span>•</span>
                                                <span>{new Date(order.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-orange-600">₹{order.totalAmount}</div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-4">
                                        <h4 className="font-semibold text-sm text-slate-700 mb-2">Items:</h4>
                                        <div className="space-y-1">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-slate-600">{item.quantity}x {item.name}</span>
                                                    <span className="font-medium">₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
