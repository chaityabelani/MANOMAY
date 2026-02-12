'use client';

import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { useState } from 'react';

interface Product {
    id: string;
    shopId: string;
    shopName: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isVeg: boolean;
    category: string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
    const addToCart = useCartStore((state) => state.addToCart);
    const [addedProduct, setAddedProduct] = useState<string | null>(null);

    function handleAddToCart(product: Product) {
        addToCart({
            productId: product.id,
            shopId: product.shopId,
            shopName: product.shopName,
            name: product.name,
            price: product.price,
            image: product.image,
            isVeg: product.isVeg,
        });

        setAddedProduct(product.id);
        setTimeout(() => setAddedProduct(null), 1500);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition"
                >
                    {/* Product Image */}
                    <div className="relative h-48 bg-slate-100">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-6xl">
                                🍽️
                            </div>
                        )}
                        {/* Veg/Non-veg Badge */}
                        <div className="absolute top-3 left-3">
                            <span className="text-2xl">
                                {product.isVeg ? '🟢' : '🔴'}
                            </span>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                        <h3 className="font-bold text-lg text-slate-900 mb-1">
                            {product.name}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-orange-600">
                                ₹{product.price}
                            </span>
                            <button
                                onClick={() => handleAddToCart(product)}
                                className={`px-5 py-2 rounded-xl font-bold transition ${addedProduct === product.id
                                        ? 'bg-green-600 text-white'
                                        : 'bg-orange-600 text-white hover:bg-orange-700'
                                    }`}
                            >
                                {addedProduct === product.id ? '✓ Added!' : '+ Add'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
