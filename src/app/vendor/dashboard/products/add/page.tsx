'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';
import { createProduct } from '@/app/actions/product';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from 'react-hot-toast';

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const { startUpload, isUploading } = useUploadThing("productImage", {
        onClientUploadComplete: (res) => {
            console.log("Upload complete:", res);
            setUploadProgress(100);
        },
        onUploadError: (error) => {
            console.error("Upload error:", error);
            toast.error(`Upload failed: ${error.message}`);
            setLoading(false);
        },
        onUploadProgress: (progress) => {
            setUploadProgress(progress);
        },
    });

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Validate file size (max 4MB to match UploadThing config)
        if (file.size > 4 * 1024 * 1024) {
            toast.error('Image size must be less than 4MB');
            return;
        }

        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            const formData = new FormData(e.currentTarget);

            // Upload image if selected
            let imageUrl = '';
            if (imageFile) {
                const uploadResult = await startUpload([imageFile]);

                if (!uploadResult || uploadResult.length === 0) {
                    throw new Error('Image upload failed');
                }

                imageUrl = uploadResult[0].url;
                formData.set('image', imageUrl);
            }

            // Create product
            const result = await createProduct(formData);

            if (result.success) {
                toast.success('✅ Product added successfully!');
                router.push('/vendor/dashboard/products');
            } else {
                setError(result.error || 'Failed to add product');
                setLoading(false);
            }
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.message || 'Failed to add product');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-2xl mx-auto">
                <BackButton href="/vendor/dashboard/products" label="Back to Products" />

                <h1 className="text-4xl font-bold text-slate-900 mb-2 mt-6">
                    Add New Product
                </h1>
                <p className="text-slate-600 mb-8">
                    Add a product to your menu manually
                </p>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200">
                    <div className="space-y-6">
                        {/* Product Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Product Image
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

                            {/* Upload Progress */}
                            {isUploading && (
                                <div className="mt-3">
                                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                                        <span>Uploading image...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div
                                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
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
                                value="true"
                                id="isVeg"
                                disabled={loading}
                                className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500 disabled:opacity-50"
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
                            disabled={loading || isUploading}
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-4 rounded-2xl hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (isUploading ? `Uploading... ${uploadProgress}%` : 'Adding Product...') : '✅ Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
