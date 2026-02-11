'use client';

import { useState, useEffect } from 'react';
import { getVendorOrders, updateOrderStatus } from '@/app/actions/order';
import { Package, Clock, CheckCircle, Truck, XCircle, Loader2, Filter } from 'lucide-react';
import ProfileDropdown from '@/components/ProfileDropdown';

interface OrderItem {
    productId: string;
    shopId: string;
    name: string;
    quantity: number;
    price: number;
    customizations: Record<string, any>;
}

interface Order {
    id: string;
    orderNumber: string;
    tableNumber: string;
    customerName: string;
    customerEmail: string | null;
    parkName: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedShop, setSelectedShop] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, [selectedShop, statusFilter]);

    async function loadOrders() {
        setLoading(true);
        const result = await getVendorOrders(
            selectedShop === 'all' ? undefined : selectedShop,
            statusFilter
        );

        if (result.success) {
            setOrders(result.orders || []);
            setShops(result.shops || []);
        } else {
            setError(result.error || 'Failed to load orders');
        }
        setLoading(false);
    }

    async function handleStatusUpdate(orderId: string, newStatus: string) {
        setUpdatingOrderId(orderId);
        const result = await updateOrderStatus(orderId, newStatus);

        if (result.success) {
            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } else {
            alert(result.error || 'Failed to update status');
        }
        setUpdatingOrderId(null);
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'placed': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'preparing': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'ready': return 'bg-green-100 text-green-700 border-green-300';
            case 'delivered': return 'bg-gray-100 text-gray-700 border-gray-300';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'placed': return <Clock className="w-4 h-4" />;
            case 'preparing': return <Package className="w-4 h-4" />;
            case 'ready': return <CheckCircle className="w-4 h-4" />;
            case 'delivered': return <Truck className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getNextStatus = (currentStatus: string) => {
        const workflow: Record<string, string> = {
            placed: 'preparing',
            preparing: 'ready',
            ready: 'delivered'
        };
        return workflow[currentStatus];
    };

    const statusTabs = [
        { value: 'all', label: 'All Orders', count: orders.length },
        { value: 'placed', label: 'New', count: orders.filter(o => o.status === 'placed').length },
        { value: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
        { value: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
        { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Management</h1>
                        <p className="text-gray-600">Track and manage incoming orders</p>
                    </div>
                    <ProfileDropdown userName="Vendor User" userEmail="vendor@example.com" userRole="vendor" />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    </div>

                    {/* Shop Filter */}
                    {shops.length > 1 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Shop</label>
                            <select
                                value={selectedShop}
                                onChange={(e) => setSelectedShop(e.target.value)}
                                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="all">All Shops</option>
                                {shops.map(shop => (
                                    <option key={shop.id} value={shop.id}>{shop.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Status Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {statusTabs.map(tab => (
                            <button
                                key={tab.value}
                                onClick={() => setStatusFilter(tab.value)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${statusFilter === tab.value
                                        ? 'bg-brand-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-600">Orders will appear here when customers place them</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                {/* Order Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{order.orderNumber}</h3>
                                        <p className="text-sm text-gray-600">Table {order.tableNumber} • {order.customerName}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(order.createdAt).toLocaleString('en-US', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            <span className="capitalize">{order.status}</span>
                                        </div>
                                        <p className="text-2xl font-bold text-brand-600 mt-2">${order.totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="border-t border-gray-200 pt-4 mb-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">Items:</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                                                <div>
                                                    <span className="font-medium text-gray-900">{item.quantity}x {item.name}</span>
                                                    {Object.keys(item.customizations).length > 0 && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {Object.entries(item.customizations).map(([key, value]) => `${key}: ${value}`).join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                    <div className="flex gap-3">
                                        {getNextStatus(order.status) && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
                                                disabled={updatingOrderId === order.id}
                                                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {updatingOrderId === order.id ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Updating...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Mark as {getNextStatus(order.status).replace('_', ' ')}</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        {order.status === 'placed' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                                disabled={updatingOrderId === order.id}
                                                className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
