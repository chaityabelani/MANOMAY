'use client';

import { toggleProductAvailability, deleteProduct } from '@/app/actions/product';
import { useState } from 'react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    image: string;
    isVeg: boolean;
    isAvailable: boolean;
}

export default function ProductList({ products }: { products: Product[] }) {
    async function handleToggle(productId: string) {
        await toggleProductAvailability(productId);
    }

    async function handleDelete(productId: string, productName: string) {
        if (!confirm(`Delete "${productName}"?`)) return;
        await deleteProduct(productId);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition"
                >
                    {/* Product Image */}
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                        />
                    ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <span className="text-6xl">🍽️</span>
                        </div>
                    )}

                    <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">
                                    {product.name}
                                </h3>
                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                    {product.category}
                                </span>
                            </div>
                            <span className="text-2xl">{product.isVeg ? '🟢' : '🔴'}</span>
                        </div>

                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {product.description}
                        </p>

                        <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-orange-600">
                                ₹{product.price}
                            </span>
                            <button
                                onClick={() => handleToggle(product.id)}
                                className={`px-3 py-1 rounded-full text-sm font-bold transition ${product.isAvailable
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                {product.isAvailable ? '✅ Available' : '❌ Unavailable'}
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <Link
                                href={`/vendor/dashboard/products/edit/${product.id}`}
                                className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition text-sm text-center"
                            >
                                ✏️ Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(product.id, product.name)}
                                className="flex-1 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition text-sm"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
