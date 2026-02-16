'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveBulkProducts } from '@/app/actions/product';
import BackButton from '@/components/BackButton';

interface ScannedProduct {
    name: string;
    price: number;
    description: string;
}

export default function AIMenuScanner() {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);
    const [error, setError] = useState('');

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setError('');
        setScannedProducts([]);

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    async function handleScan() {
        if (!selectedFile) return;

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const res = await fetch('/api/scan-menu', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setScannedProducts(data.products);
            } else {
                setError(data.error || 'Failed to scan menu');
            }
        } catch (err: any) {
            setError(err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveAll() {
        setSaving(true);
        setError('');

        const result = await saveBulkProducts(scannedProducts);

        if (result.success) {
            alert(`✅ Saved ${result.count} products successfully!`);
            router.push('/vendor/dashboard/products');
        } else {
            setError(result.error || 'Failed to save products');
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <BackButton href="/vendor/dashboard" label="Back to Dashboard" />
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        AI Menu Scanner 📸
                    </h1>
                    <p className="text-slate-600">
                        Upload a photo of your menu and let AI extract all items instantly
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Upload Section */}
                    <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-slate-200 hover:border-orange-400 transition">
                        <label className="cursor-pointer block">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {!preview ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📷</div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                                        Click to upload menu photo
                                    </h3>
                                    <p className="text-slate-500 text-sm">
                                        Supports JPG, PNG, WebP
                                    </p>
                                </div>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={preview}
                                        alt="Menu preview"
                                        className="w-full rounded-2xl shadow-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedFile(null);
                                            setPreview(null);
                                            setScannedProducts([]);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </label>

                        {selectedFile && !loading && scannedProducts.length === 0 && (
                            <button
                                onClick={handleScan}
                                className="w-full mt-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-4 rounded-2xl hover:shadow-xl transition"
                            >
                                🚀 Scan Menu with AI
                            </button>
                        )}

                        {loading && (
                            <div className="mt-6 text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                                <p className="text-slate-600 mt-4">Analyzing menu...</p>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right: Scanned Products */}
                    <div>
                        {scannedProducts.length > 0 && (
                            <div className="bg-white rounded-3xl p-6 border border-slate-200">
                                <h3 className="text-xl font-bold mb-4 text-slate-900">
                                    Scanned Products ({scannedProducts.length})
                                </h3>

                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {scannedProducts.map((product, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900">
                                                    {product.name}
                                                </h4>
                                                <span className="font-bold text-orange-600">
                                                    ₹{product.price}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600">
                                                {product.description || 'No description'}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 space-y-3">
                                    <button
                                        onClick={handleSaveAll}
                                        disabled={saving}
                                        className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : `✅ Add All ${scannedProducts.length} Products to Menu`}
                                    </button>
                                    <button
                                        onClick={() => setScannedProducts([])}
                                        className="w-full bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition"
                                    >
                                        🔄 Scan Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {scannedProducts.length === 0 && !loading && (
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 border border-orange-200">
                                <h3 className="text-xl font-bold mb-4 text-slate-900">
                                    How it works
                                </h3>
                                <ol className="space-y-3 text-slate-700">
                                    <li className="flex gap-3">
                                        <span className="font-bold text-orange-600">1.</span>
                                        <span>Upload a clear photo of your menu</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-orange-600">2.</span>
                                        <span>AI extracts dish names, prices, descriptions</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-orange-600">3.</span>
                                        <span>Review and add all items in one click</span>
                                    </li>
                                </ol>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
