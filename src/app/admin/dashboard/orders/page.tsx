'use client';

import useSWR from 'swr';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import BackButton from '@/components/BackButton';

interface OrderItem { name: string; price: number; quantity: number; }
interface Order {
    id: string; shopName: string; tableNumber: string;
    customerName: string; customerPhone: string;
    items: OrderItem[]; totalAmount: number;
    status: string; paymentStatus: string; createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_COLORS: Record<string, string> = {
    placed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-green-100 text-green-700',
    delivered: 'bg-slate-100 text-slate-600',
    cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [exporting, setExporting] = useState(false);

    // Build SWR key with server-side params so we re-fetch on filter change
    const apiUrl = useMemo(() => {
        const p = new URLSearchParams();
        if (statusFilter !== 'all') p.set('status', statusFilter);
        if (dateFrom) p.set('from', dateFrom);
        if (dateTo) p.set('to', dateTo);
        return `/api/admin/orders?${p.toString()}`;
    }, [statusFilter, dateFrom, dateTo]);

    const { data, isLoading, isValidating, mutate } = useSWR<{ orders: Order[] }>(
        apiUrl,
        fetcher,
        { refreshInterval: 15000, revalidateOnFocus: true }
    );

    const orders = data?.orders ?? [];

    // ─── Excel Export ─────────────────────────────────────────────────────────
    async function handleExport() {
        setExporting(true);
        try {
            const rows = orders.flatMap((o) =>
                o.items.map((item) => ({
                    'Order ID': o.id.slice(-8).toUpperCase(),
                    'Date': o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : 'N/A',
                    'Vendor Shop': o.shopName,
                    'Customer': o.customerName,
                    'Phone': o.customerPhone,
                    'Table': o.tableNumber,
                    'Product': item.name,
                    'Qty': item.quantity,
                    'Unit Price (₹)': item.price,
                    'Item Total (₹)': item.price * item.quantity,
                    'Order Total (₹)': o.totalAmount,
                    'Status': o.status.toUpperCase(),
                    'Payment': o.paymentStatus.toUpperCase(),
                }))
            );

            if (rows.length === 0) { alert('No orders to export.'); return; }

            const ws = XLSX.utils.json_to_sheet(rows);
            ws['!cols'] = [12, 20, 18, 18, 14, 7, 22, 5, 14, 14, 14, 12, 10].map((wch) => ({ wch }));
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'All Orders');
            XLSX.writeFile(wb, `manomay-all-orders-${new Date().toISOString().slice(0, 10)}.xlsx`);
        } finally { setExporting(false); }
    }
    // ──────────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <BackButton href="/admin/dashboard" label="Back to Dashboard" />
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className={`w-2 h-2 rounded-full ${isValidating ? 'bg-orange-400 animate-pulse' : 'bg-green-400'}`} />
                        {isValidating ? 'Updating…' : 'Live · 15s'}
                        <button onClick={() => mutate()} className="ml-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition font-medium">↻</button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-1">Platform Orders</h1>
                        <p className="text-slate-600 text-sm">All orders across every vendor — auto-refreshes every 15 seconds</p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={exporting || orders.length === 0}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-xl transition shadow-sm whitespace-nowrap"
                    >
                        {exporting
                            ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating…</>
                            : <>📥 Export to Excel</>
                        }
                    </button>
                </div>

                {/* Status filter tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                    {['all', 'placed', 'preparing', 'ready', 'delivered', 'cancelled'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl font-medium capitalize whitespace-nowrap transition text-sm ${statusFilter === s
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >{s}</button>
                    ))}
                </div>

                {/* Date range */}
                <div className="flex flex-wrap gap-3 items-center mb-6 p-4 bg-white rounded-xl border border-slate-200">
                    <span className="text-sm font-semibold text-slate-600">📅 Date Range:</span>
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-500">From</label>
                        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                            className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-500">To</label>
                        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                            className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>
                    {(dateFrom || dateTo) && (
                        <button onClick={() => { setDateFrom(''); setDateTo(''); }}
                            className="text-xs text-red-500 hover:text-red-700 font-medium underline">Clear</button>
                    )}
                    <span className="ml-auto text-xs text-slate-500">
                        {orders.length} order{orders.length !== 1 ? 's' : ''} shown
                    </span>
                </div>

                {/* Orders list */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />)}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="text-5xl mb-3">📋</div>
                        <h3 className="font-bold text-slate-900">No orders match filters</h3>
                        <p className="text-slate-600 text-sm">Try a different status or date range</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-lg transition">
                                <div className="flex flex-wrap justify-between gap-3 mb-3">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-slate-900">#{order.id.slice(-8).toUpperCase()}</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                                {order.status}
                                            </span>
                                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{order.paymentStatus}</span>
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            🏪 {order.shopName} &nbsp;·&nbsp; 📍 Table {order.tableNumber} &nbsp;·&nbsp; 👤 {order.customerName}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="text-2xl font-bold text-purple-600">₹{order.totalAmount}</div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {order.items.map((item, idx) => (
                                        <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                                            {item.quantity}× {item.name} (₹{item.price * item.quantity})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
