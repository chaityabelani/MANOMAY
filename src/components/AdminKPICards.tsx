'use client';

import useSWR from 'swr';
import Link from 'next/link';

interface AdminStats {
    totalParks: number;
    totalVendors: number;
    ordersToday: number;
    revenueToday: number;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminKPICards() {
    const { data, isLoading } = useSWR<AdminStats>(
        '/api/admin/stats',
        fetcher,
        { refreshInterval: 15000, revalidateOnFocus: true }
    );

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    const stats = data ?? { totalParks: 0, totalVendors: 0, ordersToday: 0, revenueToday: 0 };

    const cards = [
        {
            title: 'Total Parks',
            value: stats.totalParks,
            icon: '🏢',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-slate-100',
            href: '/admin/dashboard/parks',
        },
        {
            title: 'Total Vendors',
            value: stats.totalVendors,
            icon: '🏪',
            color: 'text-pink-600',
            bg: 'bg-pink-50',
            border: 'border-slate-100',
            href: '/admin/dashboard/vendors',
        },
        {
            title: 'Orders Today',
            value: stats.ordersToday,
            icon: '📋',
            color: stats.ordersToday > 0 ? 'text-blue-600' : 'text-slate-500',
            bg: 'bg-blue-50',
            border: 'border-slate-100',
            href: '/admin/dashboard/orders',
        },
        {
            title: 'Revenue Today',
            value: `₹${stats.revenueToday.toLocaleString('en-IN')}`,
            icon: '💰',
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-slate-100',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => {
                const inner = (
                    <div className={`bg-white rounded-2xl p-5 border-2 ${card.border} hover:shadow-lg transition-all duration-200 h-full`}>
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 text-2xl ${card.bg}`}>
                            {card.icon}
                        </div>
                        <div className={`text-3xl font-extrabold ${card.color} mb-1 tabular-nums`}>{card.value}</div>
                        <div className="text-sm font-medium text-slate-600">{card.title}</div>
                    </div>
                );
                return card.href
                    ? <Link key={card.title} href={card.href}>{inner}</Link>
                    : <div key={card.title}>{inner}</div>;
            })}
        </div>
    );
}
