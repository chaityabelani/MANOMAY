'use client';

import useSWR from 'swr';
import { useState, useMemo } from 'react';
import { updateOrderStatus } from '@/app/actions/order';
import * as XLSX from 'xlsx';

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
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [exporting, setExporting] = useState(false);

    // Auto-refresh every 8 seconds for near real-time order visibility
    const { data: swrData, mutate } = useSWR(
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

    // Apply status + date range filters
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            if (statusFilter !== 'all' && order.status !== statusFilter) return false;
            if (dateFrom && new Date(order.createdAt) < new Date(dateFrom)) return false;
            if (dateTo) {
                const endOfDay = new Date(dateTo);
                endOfDay.setHours(23, 59, 59, 999);
                if (new Date(order.createdAt) > endOfDay) return false;
            }
            return true;
        });
    }, [orders, statusFilter, dateFrom, dateTo]);

    async function handleStatusChange(orderId: string, newStatus: string) {
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.success) mutate();
    }

    // ─── Excel Export ─────────────────────────────────────────────────────────
    /**
     * Logic breakdown:
     * 1. Flatten filteredOrders into one row PER ITEM (multi-item orders repeat order metadata)
     * 2. Map to plain objects matching the required column schema
     * 3. Convert to XLSX worksheet via XLSX.utils.json_to_sheet
     * 4. Set column widths for readability in Excel
     * 5. Embed in a workbook and trigger browser download — fully client-side, no server call
     */
    async function handleExport() {
        setExporting(true);
        try {
            // Step 1 — flatten: one row per item
            const rows = filteredOrders.flatMap((order) =>
                order.items.map((item) => ({
                    'Order ID': order.id.slice(-8).toUpperCase(),
                    'Date': new Date(order.createdAt).toLocaleString('en-IN'),
                    'Customer Name': order.customerName,
                    'Customer Phone': order.customerPhone,
                    'Table': order.tableNumber,
                    'Product': item.name,
                    'Qty': item.quantity,
                    'Unit Price (₹)': item.price,
                    'Item Total (₹)': item.price * item.quantity,
                    'Order Total (₹)': order.totalAmount,
                    'Status': order.status.toUpperCase(),
                }))
            );

            if (rows.length === 0) {
                alert('No orders match the current filters.');
                return;
            }

            // Step 2 — build worksheet
            const ws = XLSX.utils.json_to_sheet(rows);

            // Step 3 — set column widths
            ws['!cols'] = [
                { wch: 12 }, // Order ID
                { wch: 20 }, // Date
                { wch: 18 }, // Customer Name
                { wch: 14 }, // Phone
                { wch: 7 },  // Table
                { wch: 22 }, // Product
                { wch: 5 },  // Qty
                { wch: 14 }, // Unit Price
                { wch: 14 }, // Item Total
                { wch: 14 }, // Order Total
                { wch: 12 }, // Status
            ];

            // Step 4 — embed in workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Orders');

            // Step 5 — download
            const timestamp = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(wb, `manomay-orders-${timestamp}.xlsx`);
        } finally {
            setExporting(false);
        }
    }
    // ──────────────────────────────────────────────────────────────────────────

    const statusColors: Record<string, string> = {
        placed: 'bg-blue-100 text-blue-700',
        preparing: 'bg-yellow-100 text-yellow-700',
        ready: 'bg-green-100 text-green-700',
        delivered: 'bg-slate-100 text-slate-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <div>
            {/* ── Toolbar ──────────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
                {/* Status filter tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {['all', 'placed', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl font-medium capitalize whitespace-nowrap transition text-sm ${statusFilter === status
                                    ? 'bg-orange-600 text-white shadow-md'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Export button */}
                <button
                    onClick={handleExport}
                    disabled={exporting || filteredOrders.length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-xl transition shadow-sm whitespace-nowrap"
                >
                    {exporting ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating…
                        </>
                    ) : (
                        <>📥 Export to Excel</>
                    )}
                </button>
            </div>

            {/* ── Date Range Filter ─────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 items-center mb-6 p-4 bg-white rounded-xl border border-slate-200">
                <span className="text-sm font-semibold text-slate-600">📅 Date Range:</span>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500">From</label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500">To</label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>
                {(dateFrom || dateTo) && (
                    <button
                        onClick={() => { setDateFrom(''); setDateTo(''); }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium underline"
                    >
                        Clear dates
                    </button>
                )}
                <span className="ml-auto text-xs text-slate-500">
                    {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} shown
                </span>
            </div>

            {/* ── Orders List ───────────────────────────────────────────────── */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No orders match filters</h3>
                    <p className="text-slate-600">Try changing the status or date range</p>
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
                                        <span className="text-slate-700">{item.name} x {item.quantity}</span>
                                        <span className="font-medium">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Total and Actions */}
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-orange-600">
                                    Total: ₹{order.totalAmount}
                                </span>
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
