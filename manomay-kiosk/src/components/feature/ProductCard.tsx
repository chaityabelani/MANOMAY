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
        <Card className="overflow-hidden flex flex-col h-full border-2 border-transparent hover:border-primary/20 transition-all">
            <div className="relative h-48 w-full bg-muted">
                {/* Placeholder for real image implementation using Next/Image */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                />
                {product.isPopular && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        POPULAR
                    </span>
                )}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                    {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-xl">₹{product.price}</span>

                    {quantity === 0 ? (
                        <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            className="px-6"
                        >
                            Add
                        </Button>
                    ) : (
                        <div className="flex items-center gap-3 bg-secondary rounded-lg p-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-bold w-4 text-center">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
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
