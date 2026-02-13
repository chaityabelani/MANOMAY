'use client';

import { useEffect, useState } from 'react';
import { getAllVendorsWithShops, toggleVendorStatus } from '@/app/actions/analytics';
import Link from 'next/link';
import { CheckCircle, XCircle, Store, Package, ShoppingCart, AlertCircle } from 'lucide-react';

type Vendor = {
    id: string;
    name: string;
    email: string;
    joinedAt: string | null;
    shop: {
        id: string;
        name: string;
        active: boolean;
        productCount: number;
        orderCount: number;
    } | null;
};

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadVendors();
    }, []);

    async function loadVendors() {
        try {
            setLoading(true);
            setError('');
            const result = await getAllVendorsWithShops();

            if (result.success) {
                setVendors(result.vendors);
            } else {
                setError(result.error || 'Failed to load vendors');
            }
        } catch (err: any) {
            console.error('Load vendors error:', err);
            setError(err.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleStatus(vendorId: string, currentStatus: boolean) {
        try {
            setUpdating(vendorId);
            const result = await toggleVendorStatus(vendorId, !currentStatus);

            if (result.success) {
                // Update local state
                setVendors(prev => prev.map(v =>
                    v.id === vendorId && v.shop
                        ? { ...v, shop: { ...v.shop, active: !currentStatus } }
                        : v
                ));
            } else {
                alert(result.error || 'Failed to update status');
            }
        } catch (err: any) {
            alert(err.message || 'Unexpected error');
        } finally {
            setUpdating(null);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
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
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Vendor Management</h1>
                        <p className="text-slate-600">Manage vendor approvals and monitor performance</p>
                    </div>
                    <button
                        onClick={loadVendors}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-900">Error Loading Vendors</h3>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-slate-600 mt-4">Loading vendors...</p>
                    </div>
                ) : vendors.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                        <Store className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No Vendors Yet</h3>
                        <p className="text-slate-600">Vendors who sign up will appear here</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {vendors.map((vendor) => (
                            <div
                                key={vendor.id}
                                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-slate-900">{vendor.name}</h3>
                                            {vendor.shop ? (
                                                vendor.shop.active ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <XCircle className="w-3 h-3" />
                                                        Inactive
                                                    </span>
                                                )
                                            ) : (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                                                    No Shop
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-600 text-sm mb-4">{vendor.email}</p>

                                        {vendor.shop && (
                                            <div className="flex gap-6 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Store className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-600">{vendor.shop.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-600">{vendor.shop.productCount} products</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ShoppingCart className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-600">{vendor.shop.orderCount} orders</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        {vendor.shop && (
                                            <button
                                                onClick={() => handleToggleStatus(vendor.id, vendor.shop!.active)}
                                                disabled={updating === vendor.id}
                                                className={`px-4 py-2 rounded-xl font-medium transition ${vendor.shop.active
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    } disabled:opacity-50`}
                                            >
                                                {updating === vendor.id
                                                    ? 'Updating...'
                                                    : vendor.shop.active ? 'Deactivate' : 'Activate'
                                                }
                                            </button>
                                        )}
                                        <Link
                                            href={`/admin/dashboard/vendors/${vendor.id}`}
                                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 font-medium transition"
                                        >
                                            View Details
                                        </Link>
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
