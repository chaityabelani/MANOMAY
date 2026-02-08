"use client";

import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { items, addToCart, removeFromCart, updateQuantity } = useCartStore();
    const cartItem = items.find((item) => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    return (
        <Card className="group overflow-hidden flex flex-col h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
            {/* Image Section */}
            <div className="relative h-48 sm:h-56 w-full bg-slate-100 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />

                {product.isPopular && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-950 text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse-slow flex items-center gap-1">
                        ★ POPULAR
                    </span>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <div className="mb-4">
                    <h3 className="font-display font-bold text-xl leading-tight mb-2 text-slate-900 group-hover:text-brand-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className="font-display font-bold text-2xl text-slate-900">
                        ₹{product.price}
                    </span>

                    {quantity === 0 ? (
                        <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            className="rounded-full px-6 font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-100 transition-all hover:scale-105 active:scale-95"
                        >
                            Add
                        </Button>
                    ) : (
                        <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1 h-9">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-white hover:text-red-500 hover:shadow-sm"
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                            >
                                <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <span className="font-semibold text-sm w-6 text-center text-slate-900">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-white hover:text-green-600 hover:shadow-sm"
                                onClick={() => addToCart(product)}
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
