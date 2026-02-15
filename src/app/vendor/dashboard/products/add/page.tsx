'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';
import { createProduct } from '@/app/actions/product';

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // CRITICAL: Prevent default form submission to avoid logout

        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const result = await createProduct(formData);

        if (result.success) {
            alert('✅ Product added successfully!');
            router.push('/vendor/dashboard/products');
        } else {
            setError(result.error || 'Failed to add product');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-2xl mx-auto">
                <BackButton href="/vendor/dashboard" />

                <h1 className="text-4xl font-bold text-slate-900 mb-2 mt-6">
                    Add New Product
                </h1>
                <p className="text-slate-600 mb-8">
                    Add a product to your menu manually
                </p>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200">
                    <div className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                                placeholder="e.g., Chicken Tikka Masala"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                                placeholder="e.g., 250"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                                placeholder="Brief description of the dish..."
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                            >
                                <option value="General">General</option>
                                <option value="Appetizer">Appetizer</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Beverage">Beverage</option>
                            </select>
                        </div>

                        {/* Is Vegetarian */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="isVeg"
                                value="true"
                                id="isVeg"
                                className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                            />
                            <label htmlFor="isVeg" className="text-sm font-medium text-slate-700">
                                Vegetarian Product
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-4 rounded-2xl hover:shadow-xl transition disabled:opacity-50"
                        >
                            {loading ? 'Adding Product...' : '✅ Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
