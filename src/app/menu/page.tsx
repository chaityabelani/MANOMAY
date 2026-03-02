'use client';

import { Suspense, useEffect, useState } from 'react';
import { searchProducts, getCategories } from '@/app/actions/search';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import TableNumberInput from '@/components/TableNumberInput';
import { useCartStore } from '@/store/useCartStore';

type Product = {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    image: string;
    isAvailable: boolean;
    shopId: string;
    shopName: string;
};

function MenuContent() {
    const searchParams = useSearchParams();
    const tableNumber = searchParams.get('table') || '1';

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(['all']);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [availableOnly, setAvailableOnly] = useState(true);

    const { items, addToCart, updateQuantity } = useCartStore();
    const totalCartItems = items.reduce((sum, i) => sum + i.quantity, 0);

    function handleAddToCart(product: Product) {
        addToCart({
            productId: product.id,
            shopId: product.shopId,
            shopName: product.shopName,
            name: product.name,
            price: product.price,
            image: product.image || '',
            isVeg: false,
        });
    }

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => { loadProducts(); }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, availableOnly]);

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    async function loadCategories() {
        const result = await getCategories();
        if (result.success) setCategories(result.categories);
    }

    async function loadProducts() {
        try {
            setLoading(true);
            const result = await searchProducts(searchQuery, { category: selectedCategory, availableOnly });
            if (result.success) setProducts(result.products);
        } catch (err) {
            console.error('Load products error:', err);
        } finally {
            setLoading(false);
        }
    }

    function clearFilters() {
        setSearchQuery('');
        setSelectedCategory('all');
        setAvailableOnly(true);
    }

    const hasActiveFilters = searchQuery || selectedCategory !== 'all' || !availableOnly;

    return (
        <div className="min-h-screen bg-slate-50 pb-6">
            {/* ── Sticky Header ─────────────────────────────────── */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto px-4 py-3">

                    {/* Top row: back + title + cart */}
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Link
                                href="/customer/dashboard"
                                className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600"
                                aria-label="Back to home"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight">
                                    Manomay Food Court
                                </h1>
                                <TableNumberInput />
                            </div>
                        </div>

                        {/* Cart FAB */}
                        <Link
                            href="/cart"
                            className="relative flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition shadow-lg min-h-[44px]"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="hidden sm:inline">Cart</span>
                            {totalCartItems > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {totalCartItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Search bar */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search for food..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* ── Category Pill Tabs — horizontally scrollable ── */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap min-h-[36px] ${selectedCategory === cat
                                        ? 'bg-orange-600 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {cat === 'all' ? 'All' : cat}
                            </button>
                        ))}
                        {/* Available only toggle as a pill */}
                        <button
                            onClick={() => setAvailableOnly(!availableOnly)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap min-h-[36px] ${availableOnly
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            ✓ Available
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Main Content ──────────────────────────────────── */}
            <main className="container mx-auto px-4 py-5">

                {/* Results count + clear */}
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-slate-600 font-medium">
                        {loading ? 'Searching…' : `${products.length} item${products.length !== 1 ? 's' : ''}`}
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-orange-600 font-medium flex items-center gap-1 hover:text-orange-700"
                        >
                            <X className="w-3.5 h-3.5" /> Clear filters
                        </button>
                    )}
                </div>

                {/* Loading skeleton */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 animate-pulse">
                                <div className="h-36 bg-slate-200" />
                                <div className="p-3 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                        <div className="text-5xl mb-3">🔍</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">No items found</h3>
                        <p className="text-slate-500 text-sm mb-5">
                            {searchQuery ? 'Try a different search or clear filters' : 'No products available right now'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2.5 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    /* ── 2-column grid on mobile, 3 on desktop ── */
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                        {products.map((product) => {
                            const quantity = items.find(i => i.productId === product.id)?.quantity || 0;

                            return (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition flex flex-col"
                                >
                                    {/* Product Image — shorter on mobile */}
                                    <div className="relative h-32 sm:h-44 bg-gradient-to-br from-orange-100 to-orange-200 flex-shrink-0">
                                        {product.image && (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                        {!product.isAvailable && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                    Unavailable
                                                </span>
                                            </div>
                                        )}
                                        {/* Veg/Non-veg badge */}
                                        <div className="absolute top-2 left-2 w-5 h-5 rounded-sm border-2 border-white flex items-center justify-center bg-white/80">
                                            <span className="text-xs">{product.category === 'Veg' ? '🟢' : '🔴'}</span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-3 flex flex-col flex-1">
                                        <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-0.5 line-clamp-1">
                                            {product.name}
                                        </h4>
                                        <p className="text-xs text-slate-500 mb-1 line-clamp-1">{product.shopName}</p>
                                        {product.description && (
                                            <p className="text-xs text-slate-400 line-clamp-1 mb-2 hidden sm:block">
                                                {product.description}
                                            </p>
                                        )}

                                        {/* Price + Add to cart */}
                                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
                                            <span className="text-base font-bold text-orange-600">₹{product.price}</span>

                                            {quantity === 0 ? (
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!product.isAvailable}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition min-h-[34px] ${product.isAvailable
                                                            ? 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
                                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    + Add
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(product.id, quantity - 1)}
                                                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-lg leading-none flex items-center justify-center transition"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="font-bold text-sm w-5 text-center">{quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(product.id, quantity + 1)}
                                                        className="w-7 h-7 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold text-lg leading-none flex items-center justify-center transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* View shop — compact link */}
                                        <Link
                                            href={`/shop/${product.shopId}?table=${tableNumber}`}
                                            className="text-xs text-orange-500 hover:text-orange-700 font-medium mt-1 block"
                                        >
                                            View full shop →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function MenuPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full mx-auto" />
                    <p className="text-slate-500 mt-3 text-sm">Loading menu…</p>
                </div>
            </div>
        }>
            <MenuContent />
        </Suspense>
    );
}
