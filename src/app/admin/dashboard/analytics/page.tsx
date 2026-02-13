'use client';

import { useEffect, useState } from 'react';
import { getPlatformAnalytics } from '@/app/actions/analytics';
import Link from 'next/link';
import { Store, Package, ShoppingCart, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

type Analytics = {
    overview: {
        totalVendors: number;
        totalShops: number;
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
        avgOrderValue: number;
    };
    ordersByStatus: Record<string, number>;
    topVendors: Array<{
        shopId: string | null;
        shopName: string;
        orderCount: number;
        revenue: number;
    }>;
};

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAnalytics();
    }, []);

    async function loadAnalytics() {
        try {
            setLoading(true);
            setError('');
            const result = await getPlatformAnalytics();

            if (result.success) {
                setAnalytics(result.analytics);
            } else {
                setError(result.error || 'Failed to load analytics');
            }
        } catch (err: any) {
            console.error('Load analytics error:', err);
            setError(err.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-4">
                    <Link href="/admin/dashboard" className="text-slate-600 hover:text-slate-900 text-sm">
                        ← Back to Dashboard
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Platform Analytics</h1>
                        <p className="text-slate-600">Monitor platform performance and growth</p>
                    </div>
                    <button
                        onClick={loadAnalytics}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-900">Error Loading Analytics</h3>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-slate-600 mt-4">Loading analytics...</p>
                    </div>
                ) : analytics ? (
                    <>
                        {/* Overview Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <Store className="w-8 h-8 text-purple-600" />
                                    <h3 className="text-slate-600">Total Vendors</h3>
                                </div>
                                <p className="text-4xl font-bold text-slate-900">{analytics.overview.totalVendors}</p>
                                <p className="text-sm text-slate-600 mt-1">{analytics.overview.totalShops} active shops</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <Package className="w-8 h-8 text-blue-600" />
                                    <h3 className="text-slate-600">Total Products</h3>
                                </div>
                                <p className="text-4xl font-bold text-slate-900">{analytics.overview.totalProducts}</p>
                                <p className="text-sm text-slate-600 mt-1">Listed on platform</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShoppingCart className="w-8 h-8 text-green-600" />
                                    <h3 className="text-slate-600">Total Orders</h3>
                                </div>
                                <p className="text-4xl font-bold text-slate-900">{analytics.overview.totalOrders}</p>
                                <p className="text-sm text-slate-600 mt-1">All time</p>
                            </div>
                        </div>

                        {/* Revenue Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <DollarSign className="w-10 h-10" />
                                    <h3 className="text-white/90 text-lg">Total Revenue</h3>
                                </div>
                                <p className="text-5xl font-bold">₹{analytics.overview.totalRevenue.toLocaleString('en-IN')}</p>
                                <p className="text-white/80 mt-2">Platform lifetime revenue</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <TrendingUp className="w-10 h-10" />
                                    <h3 className="text-white/90 text-lg">Avg Order Value</h3>
                                </div>
                                <p className="text-5xl font-bold">₹{analytics.overview.avgOrderValue.toFixed(2)}</p>
                                <p className="text-white/80 mt-2">Per customer order</p>
                            </div>
                        </div>

                        {/* Top Vendors */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Top Performing Vendors</h2>
                            {analytics.topVendors.length === 0 ? (
                                <p className="text-slate-600">No vendor data yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {analytics.topVendors.map((vendor, index) => (
                                        <div key={vendor.shopId || index} className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">{vendor.shopName}</p>
                                                    <p className="text-sm text-slate-600">{vendor.orderCount} orders</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-2xl text-purple-600">₹{vendor.revenue.toLocaleString('en-IN')}</p>
                                                <p className="text-sm text-slate-600">Revenue</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Orders by Status */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Orders by Status</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
                                    <div key={status} className="p-4 rounded-xl bg-slate-50">
                                        <p className="text-3xl font-bold text-slate-900">{count}</p>
                                        <p className="text-sm text-slate-600 capitalize mt-1">{status}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
