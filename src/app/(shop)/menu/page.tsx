"use client";

import { useState, useEffect } from "react";
import { CATEGORIES } from "@/data/mockData";
import { getProducts } from "@/app/actions/product";
import { ProductCard } from "@/components/feature/ProductCard";
import { CategoryTabs } from "@/components/feature/CategoryTabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import type { Product } from "@/types";

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { getTotalItems, getTotalPrice } = useCartStore();

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
            setLoading(false);
        }
        fetchProducts();
    }, []);

    // Map database categories to UI categories if needed
    const filteredProducts =
        activeCategory === "all"
            ? products
            : products.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-600">Loading menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Sticky Category Navigation */}
            <div className="sticky top-[4.5rem] z-40 px-4 md:px-8 py-4 pointer-events-none">
                <div className="container mx-auto pointer-events-auto">
                    <div className="glass rounded-full p-2 pl-6 flex items-center justify-between shadow-lg">
                        <div className="flex-1 overflow-hidden">
                            <CategoryTabs
                                categories={CATEGORIES}
                                activeCategory={activeCategory}
                                onSelect={setActiveCategory}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 p-4 md:p-8 pt-4">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-3xl font-display font-bold text-slate-900">
                            {activeCategory === "all" ? "All Items" : CATEGORIES.find(c => c.id === activeCategory)?.name}
                        </h2>
                        <span className="text-slate-500 font-medium">
                            {filteredProducts.length} items
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-32">
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
                <div className="fixed bottom-6 left-4 right-4 z-50 animate-slide-up md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl">
                    <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 flex items-center justify-between gap-4 ring-4 ring-white/20 backdrop-blur-sm">
                        <div className="flex items-center gap-4 pl-2">
                            <div className="bg-slate-800 p-3 rounded-xl relative">
                                <ShoppingCart className="h-6 w-6 text-brand-500" />
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold">
                                    {getTotalItems()}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total</p>
                                <p className="text-xl font-bold">₹{getTotalPrice()}</p>
                            </div>
                        </div>
                        <Link href="/cart">
                            <Button size="lg" className="rounded-xl px-8 font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-900/20">
                                View Cart <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
