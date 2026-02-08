"use client";

import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { items, addToCart, removeFromCart, updateQuantity } = useCartStore();
    const cartItem = items.find((item) => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    return (
        <div className="group relative flex flex-col h-full bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {product.isPopular && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-brand-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-brand-600" /> POPULAR
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-1 p-5">
                <h3 className="font-display font-bold text-lg text-slate-800 leading-tight mb-2 group-hover:text-brand-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
                    {product.description}
                </p>

                <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-50">
                    <span className="font-bold text-xl text-slate-900">
                        ₹{product.price}
                    </span>

                    {quantity === 0 ? (
                        <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            className="bg-slate-900 hover:bg-brand-600 text-white rounded-full px-6 transition-all duration-300 shadow-md hover:shadow-brand-200"
                        >
                            Add <Plus className="ml-1 h-4 w-4" />
                        </Button>
                    ) : (
                        <div className="flex items-center bg-slate-100 rounded-full p-1">
                            <button
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:text-brand-600 transition-colors"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-bold text-slate-900 text-sm">{quantity}</span>
                            <button
                                onClick={() => addToCart(product)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
