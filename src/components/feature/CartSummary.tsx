"use client";

import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Link from "next/link";

export function CartSummary() {
    const { items, getTotalPrice, removeFromCart, updateQuantity } = useCartStore();
    const total = getTotalPrice();

    if (items.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <p className="text-xl font-semibold mb-2">Cart is empty</p>
                <p>Start adding items to your order!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">Your Order</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="font-semibold">{item.name}</span>
                                <span className="font-semibold">₹{item.price * item.quantity}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-3 bg-secondary rounded-lg p-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        -
                                    </Button>
                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 border-t bg-muted/20">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-3xl font-bold text-primary">₹{total}</span>
                </div>
                <Link href="/checkout" className="w-full">
                    <Button size="lg" className="w-full text-xl font-bold">
                        Checkout
                    </Button>
                </Link>
            </div>
        </div>
    );
}
