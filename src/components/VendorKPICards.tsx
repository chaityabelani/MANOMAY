'use client';

import useSWR from 'swr';
import Link from 'next/link';

interface VendorStats {
    pendingOrders: number;
    preparingOrders: number;
    ordersToday: number;
    outOfStockProducts: number;
    totalProducts: number;
    revenueThisWeek: number;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface KPICardProps {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    bg: string;
    border: string;
    pulse?: boolean;
    href?: string;
    badge?: string;
}

function KPICard({ title, value, icon, color, bg, border, pulse, href, badge }: KPICardProps) {
    const content = (
        <div className={`relative bg-white rounded-2xl p-5 border-2 ${border} hover:shadow-lg transition-all duration-200`}>
            {/* Pulsing alert dot */}
            {pulse && Number(value) > 0 && (
                <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-red-500 animate-ping" />
            )}
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 text-2xl ${bg}`}>
                {icon}
            </div>
            <div className={`text-3xl font-extrabold ${color} mb-1 tabular-nums`}>{value}</div>
            <div className="text-sm font-medium text-slate-600">{title}</div>
            {badge && (
                <span className="mt-2 inline-block px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                    {badge}
                </span>
            )}
        </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
}

export default function VendorKPICards() {
    const { data, isLoading } = useSWR<VendorStats>(
        '/api/vendor/stats',
        fetcher,
        { refreshInterval: 15000, revalidateOnFocus: true }
    );

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    const stats = data ?? {
        pendingOrders: 0, preparingOrders: 0,
        ordersToday: 0, outOfStockProducts: 0,
        totalProducts: 0, revenueThisWeek: 0,
    };

    const cards: KPICardProps[] = [
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: '🔔',
            color: stats.pendingOrders > 0 ? 'text-red-600' : 'text-slate-700',
            bg: 'bg-red-50',
            border: stats.pendingOrders > 0 ? 'border-red-300' : 'border-slate-100',
            pulse: true,
            href: '/vendor/dashboard/orders',
            badge: stats.pendingOrders > 0 ? 'Action required' : undefined,
        },
        {
            title: 'Preparing',
            value: stats.preparingOrders,
            icon: '⚙️',
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-slate-100',
            href: '/vendor/dashboard/orders',
        },
        {
            title: 'Inventory Alerts',
            value: stats.outOfStockProducts,
            icon: '⚠️',
            color: stats.outOfStockProducts > 0 ? 'text-orange-600' : 'text-slate-500',
            bg: 'bg-orange-50',
            border: stats.outOfStockProducts > 0 ? 'border-orange-300' : 'border-slate-100',
            href: '/vendor/dashboard/products',
            badge: stats.outOfStockProducts > 0 ? `${stats.outOfStockProducts} unavailable` : undefined,
        },
        {
            title: 'Revenue This Week',
            value: `₹${stats.revenueThisWeek.toLocaleString('en-IN')}`,
            icon: '💰',
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-slate-100',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
                <KPICard key={card.title} {...card} />
            ))}
        </div>
    );
}
