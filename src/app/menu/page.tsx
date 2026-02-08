"use client";

import { useState } from "react";
import { CATEGORIES, PRODUCTS } from "@/data/mockData";
import { ProductCard } from "@/components/feature/ProductCard";
import { CategoryTabs } from "@/components/feature/CategoryTabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const { getTotalItems, getTotalPrice } = useCartStore();

    const filteredProducts =
        activeCategory === "all"
            ? PRODUCTS
            : PRODUCTS.filter((p) => p.categoryId === activeCategory);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header / Title Section */}
            <div className="bg-white border-b border-slate-100 pt-8 pb-4">
                <div className="container mx-auto px-4 md:px-6">
                    <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">Our Menu</h1>
                    <p className="text-slate-500">Explore our delicious range of street food classics.</p>
                </div>
            </div>

            {/* Sticky Category Navigation */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm transition-all">
                <div className="container mx-auto px-4 md:px-6">
                    <CategoryTabs
                        categories={CATEGORIES}
                        activeCategory={activeCategory}
                        onSelect={setActiveCategory}
                    />
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 w-full container mx-auto px-4 md:px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-32">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="animate-fade-in">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Cart Summary Bar */}
            {getTotalItems() > 0 && (
                <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 animate-slide-up">
                    <div className="glass-dark rounded-2xl p-4 md:p-6 shadow-2xl flex items-center justify-between gap-6 max-w-2xl mx-auto md:ml-auto w-full border border-white/10 bg-slate-900 text-white">
                        <div className="flex items-center gap-4">
                            <div className="bg-brand-600 p-3 rounded-xl hidden sm:block">
                                <ShoppingBag className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 font-medium">{getTotalItems()} items added</p>
                                <p className="text-2xl font-bold">₹{getTotalPrice()}</p>
                            </div>
                        </div>
                        <Link href="/cart">
                            <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-xl bg-white text-slate-900 hover:bg-brand-50 hover:text-brand-700 transition-colors">
                                View Cart <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
