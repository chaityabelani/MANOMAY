"use client";

import { useState } from "react";
import { CATEGORIES, PRODUCTS } from "@/data/mockData";
import { ProductCard } from "@/components/feature/ProductCard";
import { CategoryTabs } from "@/components/feature/CategoryTabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart } from "lucide-react";

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const { getTotalItems, getTotalPrice } = useCartStore();

    const filteredProducts =
        activeCategory === "all"
            ? PRODUCTS
            : PRODUCTS.filter((p) => p.categoryId === activeCategory);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Sticky Category Navigation */}
            <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-lg shadow-md p-6 border-b-4 border-blue-500">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Menu</h2>
                    <CategoryTabs
                        categories={CATEGORIES}
                        activeCategory={activeCategory}
                        onSelect={setActiveCategory}
                    />
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-32">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="animate-fade-in">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Cart Summary Bar */}
            {getTotalItems() > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-6 border-t-4 border-blue-500 bg-white shadow-2xl z-50 animate-slide-up">
                    <div className="container mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-4 rounded-full">
                                <ShoppingCart className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-600">{getTotalItems()} items</p>
                                <p className="text-3xl font-bold text-blue-600">₹{getTotalPrice()}</p>
                            </div>
                        </div>
                        <Link href="/cart">
                            <Button size="lg" className="h-16 px-10 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                                View Cart
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
