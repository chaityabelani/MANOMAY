'use client';

import useSWR from 'swr';
import Link from 'next/link';

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

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
    placed: { label: 'Placed', className: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    preparing: { label: 'Preparing', className: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    ready: { label: 'Ready! 🎉', className: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    delivered: { label: 'Delivered', className: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-600', dot: 'bg-red-500' },
};

export default function RecentOrders() {
    const { data, isLoading } = useSWR<{ orders: Order[] }>(
        '/api/customer/orders',
        fetcher,
        {
            refreshInterval: 8000,        // poll every 8s
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        }
    );

    const orders = data?.orders?.slice(0, 3) ?? [];

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-slate-500 text-sm">No recent orders</p>
                <Link
                    href="/menu"
                    className="inline-block mt-4 px-5 py-2 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition"
                >
                    Start Ordering
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {orders.map((order) => {
                const cfg = statusConfig[order.status] ?? statusConfig.placed;
                return (
                    <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-orange-200 transition"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Live status dot */}
                            <span
                                className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${cfg.dot} ${order.status === 'preparing' ? 'animate-pulse' : ''}`}
                            />
                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900 text-sm truncate">
                                    {order.shopName} — Table {order.tableNumber}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.className}`}>
                                {cfg.label}
                            </span>
                            <span className="text-xs font-semibold text-orange-600">₹{order.totalAmount}</span>
                        </div>
                    </div>
                );
            })}

            <Link
                href="/customer/dashboard/orders"
                className="block text-center text-sm text-orange-600 font-semibold hover:text-orange-700 pt-2"
            >
                View all orders →
            </Link>
        </div>
    );
}
