"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export function FloatingCartButton() {
    const { getTotalItems, getTotalPrice } = useCartStore();
    const itemCount = getTotalItems();

    if (itemCount === 0) return null;

    return (
        <Link
            href="/cart"
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="View cart"
        >
            <div className="relative">
                {/* Main Button */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-brand-500/50 transition-all hover:scale-105 active:scale-95 touch-target-lg">
                    <div className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        {/* Badge */}
                        <span className="absolute -top-2 -right-2 bg-white text-brand-700 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                            {itemCount}
                        </span>
                    </div>
                    <div className="hidden sm:block">
                        <div className="text-xs opacity-90">Cart</div>
                        <div className="font-bold">₹{getTotalPrice()}</div>
                    </div>
                </div>

                {/* Pulse Effect */}
                <div className="absolute inset-0 bg-brand-600 rounded-full animate-ping opacity-20"></div>
            </div>
        </Link>
    );
}
