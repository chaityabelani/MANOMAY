'use client';

import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, getTotalPrice, getItemsByShop, clearCart } = useCartStore();

    const itemsByShop = getItemsByShop();
    const totalPrice = getTotalPrice();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                    <p className="text-slate-600 mb-6">Add some delicious items to get started!</p>
                    <Link
                        href="/menu"
                        className="inline-block px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition"
                    >
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-8">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900">Your Cart</h1>
                        <Link
                            href="/menu"
                            className="text-slate-600 hover:text-slate-900 font-medium"
                        >
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Items grouped by shop */}
                <div className="space-y-6 mb-8">
                    {Array.from(itemsByShop.entries()).map(([shopId, shopItems]) => {
                        const shopTotal = shopItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

                        return (
                            <div key={shopId} className="bg-white rounded-2xl p-6 border border-slate-200">
                                {/* Shop Header */}
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        🏪 {shopItems[0].shopName}
                                    </h3>
                                    <span className="text-lg font-bold text-orange-600">
                                        ₹{shopTotal}
                                    </span>
                                </div>

                                {/* Shop Items */}
                                <div className="space-y-4">
                                    {shopItems.map((item) => (
                                        <div key={item.productId} className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-2xl">
                                                        🍽️
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                            {item.name}
                                                            <span className="text-lg">
                                                                {item.isVeg ? '🟢' : '🔴'}
                                                            </span>
                                                        </h4>
                                                        <p className="text-sm text-slate-600">₹{item.price} each</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.productId)}
                                                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold transition"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="font-bold text-lg w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold transition"
                                                    >
                                                        +
                                                    </button>
                                                    <span className="ml-auto font-bold text-slate-900">
                                                        ₹{item.price * item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Total and Checkout */}
                <div className="bg-white rounded-2xl p-6 border-2 border-orange-200">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-xl font-bold text-slate-900">Total</span>
                        <span className="text-3xl font-bold text-orange-600">₹{totalPrice}</span>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/checkout"
                            className="block w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white text-center font-bold py-4 rounded-xl hover:shadow-xl transition"
                        >
                            Proceed to Checkout
                        </Link>
                        <button
                            onClick={clearCart}
                            className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
