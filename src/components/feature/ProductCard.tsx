"use client";

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
        <Card className="overflow-hidden flex flex-col h-full border-2 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
            <div className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.isPopular && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                        ⭐ POPULAR
                    </span>
                )}
            </div>
            <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50">
                <h3 className="font-bold text-xl leading-tight mb-2 text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                    {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                    <span className="font-bold text-2xl text-blue-600">₹{product.price}</span>

                    {quantity === 0 ? (
                        <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-transform"
                        >
                            Add +
                        </Button>
                    ) : (
                        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-2 shadow-md">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 hover:bg-blue-200 text-blue-700 font-bold rounded-lg"
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                            >
                                <Minus className="h-5 w-5" />
                            </Button>
                            <span className="font-bold text-xl w-8 text-center text-blue-700">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 hover:bg-purple-200 text-purple-700 font-bold rounded-lg"
                                onClick={() => addToCart(product)}
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
