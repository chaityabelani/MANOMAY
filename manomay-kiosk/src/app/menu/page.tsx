"use client";

import { useState } from "react";
import { CATEGORIES, PRODUCTS } from "@/data/mockData";
import { ProductCard } from "@/components/feature/ProductCard";
import { CategoryTabs } from "@/components/feature/CategoryTabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const { getTotalItems, getTotalPrice } = useCartStore();

    const filteredProducts =
        activeCategory === "all"
            ? PRODUCTS
            : PRODUCTS.filter((p) => p.categoryId === activeCategory);

    return (
        <div className="flex flex-col h-full bg-muted/10">
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur p-4 border-b">
                <CategoryTabs
                    categories={CATEGORIES}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Bottom Bar for Mobile/Kiosk */}
            {getTotalItems() > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background shadow-up-lg z-50">
                    <div className="container flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{getTotalItems()} items</span>
                            <span className="text-xl font-bold">₹{getTotalPrice()}</span>
                        </div>
                        <Link href="/cart">
                            <Button size="lg" className="px-8 text-lg">
                                View Cart
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
