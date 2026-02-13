'use client';

import { useEffect, useState } from 'react';
import { getVendorDetails } from '@/app/actions/analytics';
import Link from 'next/link';
import { Store, Package, ShoppingCart, DollarSign, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

type VendorDetails = {
    id: string;
    name: string;
    email: string;
    shop: {
        id: string;
        name: string;
        active: boolean;
        products: number;
        totalOrders: number;
        totalRevenue: number;
    } | null;
    recentProducts: Array<{
        id: string;
        name: string;
        price: number;
        available: boolean;
    }>;
    recentOrders: Array<{
        id: string;
        totalAmount: number;
        status: string;
        createdAt: string | null;
    }>;
};

export default function VendorDetailsPage() {
    const params = useParams();
    const vendorId = params.id as string;

    const [vendor, setVendor] = useState<VendorDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadVendorDetails();
    }, [vendorId]);

    async function loadVendorDetails() {
        try {
            setLoading(true);
            setError('');
            const result = await getVendorDetails(vendorId);

            if (result.success) {
                setVendor(result.vendor);
            } else {
                setError(result.error || 'Failed to load vendor details');
            }
        } catch (err: any) {
            console.error('Load vendor details error:', err);
            setError(err.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-4">
                    <Link href="/admin/dashboard/vendors" className="text-slate-600 hover:text-slate-900 text-sm">
                        ← Back to Vendors
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-slate-600 mt-4">Loading vendor details...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-red-900 mb-1">Error Loading Vendor</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                ) : vendor ? (
                    <>
                        {/* Vendor Header */}
                        <div className="bg-white rounded-3xl p-8 mb-6 border border-slate-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl font-bold text-slate-900 mb-2">{vendor.name}</h1>
                                    <p className="text-slate-600 mb-4">{vendor.email}</p>
                                    {vendor.shop && (
                                        <div className="flex items-center gap-2">
                                            <Store className="w-5 h-5 text-purple-600" />
                                            <span className="font-semibold text-lg">{vendor.shop.name}</span>
                                            {vendor.shop.active ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {vendor.shop ? (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Package className="w-8 h-8 text-blue-600" />
                                            <h3 className="text-slate-600">Products</h3>
                                        </div>
                                        <p className="text-4xl font-bold text-slate-900">{vendor.shop.products}</p>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <ShoppingCart className="w-8 h-8 text-green-600" />
                                            <h3 className="text-slate-600">Total Orders</h3>
                                        </div>
                                        <p className="text-4xl font-bold text-slate-900">{vendor.shop.totalOrders}</p>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <DollarSign className="w-8 h-8 text-purple-600" />
                                            <h3 className="text-slate-600">Total Revenue</h3>
                                        </div>
                                        <p className="text-4xl font-bold text-slate-900">₹{vendor.shop.totalRevenue.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Recent Products */}
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Products</h2>
                                    {vendor.recentProducts.length === 0 ? (
                                        <p className="text-slate-600">No products yet</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {vendor.recentProducts.map((product) => (
                                                <div key={product.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50">
                                                    <span className="font-medium">{product.name}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-purple-600">₹{product.price}</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {product.available ? 'Available' : 'Unavailable'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Recent Orders */}
                                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Orders</h2>
                                    {vendor.recentOrders.length === 0 ? (
                                        <p className="text-slate-600">No orders yet</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {vendor.recentOrders.map((order) => (
                                                <div key={order.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50">
                                                    <div>
                                                        <p className="font-medium">Order #{order.id.slice(-6)}</p>
                                                        <p className="text-sm text-slate-600">
                                                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-lg">₹{order.totalAmount}</span>
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                                <Store className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Shop Created</h3>
                                <p className="text-slate-600">This vendor hasn't created their shop yet</p>
                            </div>
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
}
