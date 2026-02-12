"use client";

import Image from "next/image";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { items, addToCart, removeFromCart, updateQuantity } = useCartStore();
    const cartItem = items.find((item) => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    return (
        <Card className="group overflow-hidden flex flex-col h-full border-0 shadow-sm hover:shadow-2xl transition-all duration-300 bg-white rounded-3xl hover-lift">
            {/* Image Section with Next.js Image */}
            <div className="relative h-52 sm:h-64 w-full bg-slate-100 overflow-hidden rounded-t-3xl">
                <Image
                    src={product.image || '/placeholder-food.png'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />

                {product.isPopular && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-md animate-pulse-slow flex items-center gap-1">
                        ★ POPULAR
                    </span>
                )}

                {/* Quick Add Button - Larger for touch */}
                {quantity === 0 && (
                    <button
                        onClick={() => addToCart(product)}
                        className="absolute bottom-3 right-3 w-12 h-12 bg-white/95 backdrop-blur text-slate-900 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-600 hover:text-white transition-all hover:scale-110 active:scale-95 touch-target-lg"
                        aria-label="Add to cart"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-1">
                <div className="mb-4">
                    <h3 className="font-display font-bold text-xl lg:text-2xl leading-tight mb-2 text-slate-900 group-hover:text-brand-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className="font-display font-bold text-2xl lg:text-3xl text-slate-900">
                        ₹{product.price}
                    </span>

                    {quantity === 0 ? (
                        <Button
                            size="lg"
                            onClick={() => addToCart(product)}
                            className="rounded-full px-7 py-6 font-semibold text-base bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-100 transition-all hover:scale-105 active:scale-95 touch-target-lg"
                        >
                            Add
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1.5 h-12">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full hover:bg-white hover:text-red-500 hover:shadow-sm touch-target"
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-semibold text-base w-8 text-center text-slate-900">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full hover:bg-white hover:text-green-600 hover:shadow-sm touch-target"
                                onClick={() => addToCart(product)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
