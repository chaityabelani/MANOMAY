'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { searchProducts, getCategories } from '@/app/actions/search';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, X, ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import TableNumberInput from '@/components/TableNumberInput';
import { useCartStore } from '@/store/useCartStore';

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    isAvailable: boolean;
    shopId: string;
    shopName: string;
};

function MenuContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tableNumber = searchParams.get('table') || '1';

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(['all']);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [availableOnly, setAvailableOnly] = useState(true);

    // Cart functionality
    const { items, addToCart, updateQuantity } = useCartStore();
    const [addedProduct, setAddedProduct] = useState<string | null>(null);

    // Add to cart handler
    function handleAddToCart(product: Product) {
        addToCart({
            productId: product.id,
            shopId: product.shopId,
            shopName: product.shopName,
            name: product.name,
            price: product.price,
            image: product.image || '',
            isVeg: false, // Default, can be enhanced
        });

        // Visual feedback
        setAddedProduct(product.id);
        setTimeout(() => setAddedProduct(null), 1500);
    }

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts();
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, availableOnly]);

    // Load categories on mount
    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    async function loadCategories() {
        const result = await getCategories();
        if (result.success) {
            setCategories(result.categories);
        }
    }

    async function loadProducts() {
        try {
            setLoading(true);
            const result = await searchProducts(searchQuery, {
                category: selectedCategory,
                availableOnly,
            });

            if (result.success) {
                setProducts(result.products);
            }
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
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-slate-100 rounded-lg transition flex items-center gap-1 text-slate-600 hover:text-slate-900"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="text-sm font-medium">Back</span>
                            </button>
                            <div className="border-l border-slate-300 h-6"></div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Manomay Food Court</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <TableNumberInput />
                            <Link
                                href="/cart"
                                className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-500 transition shadow-lg"
                            >
                                🛒 Cart
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search for food..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition ${showFilters ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex flex-wrap gap-3">
                                {/* Category Filter */}
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat === 'all' ? 'All Categories' : cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Available Only Filter */}
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={availableOnly}
                                            onChange={(e) => setAvailableOnly(e.target.checked)}
                                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                        />
                                        <span className="text-sm font-medium text-slate-700">Available only</span>
                                    </label>
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" />
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">
                        {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
                    </h3>
                    <p className="text-slate-600">
                        {products.length} {products.length === 1 ? 'item' : 'items'} found
                    </p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-slate-600 mt-4">Searching...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No products found</h3>
                        <p className="text-slate-600 mb-4">
                            {searchQuery ? 'Try a different search term or adjust filters' : 'No products available'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-500 shadow-lg"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition"
                            >
                                {/* Product Image */}
                                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200">
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
                                            <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                                                Unavailable
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-lg font-bold text-slate-900">{product.name}</h4>
                                        <span className="price-tag">₹{product.price}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>

                                    {/* Enhanced Footer with Shop Link and Add to Cart */}
                                    <div className="space-y-3">
                                        {/* Shop Link */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">{product.shopName}</span>
                                            <Link
                                                href={`/shop/${product.shopId}?table=${tableNumber}`}
                                                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition hover:underline"
                                                onClick={(e) => {
                                                    console.log('🔍 DEBUG: View Shop clicked');
                                                    console.log('Product:', product.name);
                                                    console.log('ShopID:', product.shopId);
                                                    console.log('Target URL:', `/shop/${product.shopId}?table=${tableNumber}`);

                                                    // Temporary alert for debugging
                                                    if (!product.shopId) {
                                                        e.preventDefault();
                                                        alert('ERROR: This product has no shopId!');
                                                        return;
                                                    }
                                                }}
                                            >
                                                View Shop →
                                            </Link>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                            <span className="text-xl font-bold text-orange-600">
                                                ₹{product.price}
                                            </span>

                                            {(() => {
                                                const quantity = items.find(i => i.productId === product.id)?.quantity || 0;

                                                if (quantity === 0) {
                                                    return (
                                                        <button
                                                            onClick={() => handleAddToCart(product)}
                                                            disabled={!product.isAvailable}
                                                            className={`px-5 py-2 rounded-xl font-bold transition ${product.isAvailable
                                                                ? 'bg-orange-600 text-white hover:bg-orange-700'
                                                                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            + Add
                                                        </button>
                                                    );
                                                } else {
                                                    return (
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold transition"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="font-bold text-lg w-8 text-center">
                                                                {quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                                                className="w-8 h-8 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold transition"
                                                            >
                                                                +
                                                            </button>
                                                            <span className="ml-2 font-bold text-slate-900">
                                                                ₹{product.price * quantity}
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                    <div className="animate-spin w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-slate-600 mt-4">Loading menu...</p>
                </div>
            </div>
        }>
            <MenuContent />
        </Suspense>
    );
}
