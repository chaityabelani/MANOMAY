'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import BackButton from '@/components/BackButton';
import { getProductById, updateProduct } from '@/app/actions/product';
import { toast } from 'react-hot-toast';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.productId as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'General',
        isVeg: false,
    });

    const [imageBase64, setImageBase64] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string>('');

    // Fetch product data on mount
    useEffect(() => {
        async function fetchProduct() {
            const result = await getProductById(productId);

            if (result.success && result.product) {
                setFormData({
                    name: result.product.name,
                    description: result.product.description,
                    price: result.product.price.toString(),
                    category: result.product.category,
                    isVeg: result.product.isVeg,
                });

                if (result.product.image) {
                    setImageBase64(result.product.image);
                    setImagePreview(result.product.image);
                }
            } else {
                toast.error(result.error || 'Failed to load product');
                router.push('/vendor/dashboard/products');
            }

            setFetching(false);
        }

        fetchProduct();
    }, [productId, router]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Validate file size (max 1MB for base64 storage)
        if (file.size > 1 * 1024 * 1024) {
            toast.error('Image size must be less than 1MB');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setImageBase64(base64String);
            setImagePreview(base64String);
        };
        reader.readAsDataURL(file);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.set('name', formData.name);
            data.set('description', formData.description);
            data.set('price', formData.price);
            data.set('category', formData.category);
            data.set('isVeg', String(formData.isVeg));

            // Add image (could be original or new)
            if (imageBase64) {
                data.set('image', imageBase64);
            }

            const result = await updateProduct(productId, data);

            if (result.success) {
                toast.success('✅ Product updated successfully!');
                router.push('/vendor/dashboard/products');
            } else {
                setError(result.error || 'Failed to update product');
                setLoading(false);
            }
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.message || 'Failed to update product');
            setLoading(false);
        }
    }

    if (fetching) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-slate-600">Loading product...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-2xl mx-auto">
                <BackButton href="/vendor/dashboard/products" label="Back to Products" />

                <h1 className="text-4xl font-bold text-slate-900 mb-2 mt-6">
                    Edit Product
                </h1>
                <p className="text-slate-600 mb-8">
                    Update product details
                </p>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200">
                    <div className="space-y-6">
                        {/* Product Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Product Image (max 1MB)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50"
                            />

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-sm text-slate-600 mb-2">Preview:</p>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-w-xs h-48 object-cover rounded-xl border-2 border-slate-200"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none disabled:opacity-50 disabled:bg-slate-50"
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
                                value={formData.price}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none disabled:opacity-50 disabled:bg-slate-50"
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
                                value={formData.description}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none disabled:opacity-50 disabled:bg-slate-50"
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
                                value={formData.category}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none disabled:opacity-50 disabled:bg-slate-50"
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
                                checked={formData.isVeg}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                            />
                            <label className="text-sm font-medium text-slate-700">
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
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-4 rounded-2xl hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating Product...' : '✅ Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
