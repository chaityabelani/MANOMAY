'use client';

import { useCartStore } from '@/store/useCartStore';
import { createOrder } from '@/app/actions/order';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, tableNumber, getTotalPrice, getItemsByShop, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const totalPrice = getTotalPrice();
    const itemsByShop = getItemsByShop();

    async function handlePlaceOrder(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const customerName = formData.get('name') as string;
        const customerPhone = formData.get('phone') as string;

        const result = await createOrder({
            tableNumber: tableNumber || '1',
            customerName,
            customerPhone,
            items: items.map(item => ({
                productId: item.productId,
                shopId: item.shopId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
        });

        if (result.success) {
            clearCart();
            router.push(`/confirmation?orders=${result.orderIds?.join(',')}`);
        } else {
            setError(result.error || 'Failed to place order');
            setLoading(false);
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-600 mb-4">Your cart is empty</p>
                    <a href="/menu" className="text-orange-600 font-bold">
                        Back to Menu
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                    {Array.from(itemsByShop.entries()).map(([shopId, shopItems]) => {
                        const shopTotal = shopItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

                        return (
                            <div key={shopId} className="mb-4 pb-4 border-b border-slate-100 last:border-0">
                                <h3 className="font-bold text-slate-900 mb-2">
                                    🏪 {shopItems[0].shopName}
                                </h3>
                                {shopItems.map(item => (
                                    <div key={item.productId} className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">
                                            {item.name} x {item.quantity}
                                        </span>
                                        <span className="font-medium">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-slate-100">
                                    <span>Subtotal</span>
                                    <span className="text-orange-600">₹{shopTotal}</span>
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-between items-center text-xl font-bold pt-4 border-t-2 border-slate-200">
                        <span>Total</span>
                        <span className="text-orange-600">₹{totalPrice}</span>
                    </div>
                </div>

                {/* Customer Details Form */}
                <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h2 className="text-xl font-bold mb-4">Your Details</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                pattern="[0-9]{10}"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="10-digit mobile number"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-4 rounded-xl hover:shadow-xl transition disabled:opacity-50"
                    >
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}
