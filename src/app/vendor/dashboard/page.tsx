'use client';

import { useState, useEffect } from 'react';
import { parseMenuImage, ParsedMenuItem, saveMenuItems } from '@/app/actions/menu';
import { getVendorShops } from '@/app/actions/shop';
import { Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import ProfileDropdown from '@/components/ProfileDropdown';

export default function VendorDashboardPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [parsedItems, setParsedItems] = useState<ParsedMenuItem[]>([]);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [shops, setShops] = useState<any[]>([]);
    const [selectedShopId, setSelectedShopId] = useState<string>('');
    const [saving, setSaving] = useState(false);

    // Fetch vendor's shops on mount
    useEffect(() => {
        async function loadShops() {
            const result = await getVendorShops();
            if (result.success && result.shops) {
                setShops(result.shops);
                if (result.shops.length > 0) {
                    setSelectedShopId(result.shops[0].id);
                }
            }
        }
        loadShops();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setParsedItems([]);
            setError('');
            setSuccess('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('menuImage', selectedFile);

            const result = await parseMenuImage(formData);

            if (result.success && result.items) {
                setParsedItems(result.items);
                setSuccess(`Successfully parsed ${result.items.length} items!`);
            } else {
                setError(result.error || 'Failed to parse menu');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveItems = async () => {
        if (!selectedShopId) {
            setError('Please select a shop first');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const result = await saveMenuItems(selectedShopId, parsedItems);

            if (result.success) {
                setSuccess(`✅ ${result.message}`);
                setParsedItems([]);
                setSelectedFile(null);
                setPreview(null);
            } else {
                setError(result.error || 'Failed to save items');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header with Profile */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Vendor Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Upload your menu photo and let AI extract the items
                        </p>
                    </div>

                    {/* Profile Dropdown */}
                    <ProfileDropdown
                        userName="Vendor User"
                        userEmail="vendor@example.com"
                        userRole="vendor"
                    />
                </div>

                {/* Shop Selector */}
                {shops.length > 0 && (
                    <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
                        <label htmlFor="shop-select" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Your Shop
                        </label>
                        <select
                            id="shop-select"
                            value={selectedShopId}
                            onChange={(e) => setSelectedShopId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        >
                            {shops.map((shop) => (
                                <option key={shop.id} value={shop.id}>
                                    {shop.name} {shop.cuisineType.length > 0 && `(${shop.cuisineType.join(', ')})`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-semibold mb-4">Upload Menu Photo</h2>

                        <label
                            htmlFor="menu-upload"
                            className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-brand-500 cursor-pointer transition-colors"
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Menu preview"
                                    className="max-h-64 mx-auto rounded-lg"
                                />
                            ) : (
                                <div className="space-y-4">
                                    <Upload className="w-16 h-16 mx-auto text-gray-400" />
                                    <div>
                                        <p className="text-lg font-medium text-gray-700">
                                            Click to upload menu photo
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            PNG, JPG, WEBP up to 10MB
                                        </p>
                                    </div>
                                </div>
                            )}
                            <input
                                id="menu-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        {selectedFile && (
                            <button
                                onClick={handleUpload}
                                disabled={loading}
                                className="w-full mt-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Parsing Menu...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Parse Menu with AI
                                    </>
                                )}
                            </button>
                        )}

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-green-800 text-sm">{success}</p>
                            </div>
                        )}
                    </div>

                    {/* Parsed Results Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-semibold mb-4">Parsed Menu Items</h2>

                        {parsedItems.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <p>No items parsed yet</p>
                                <p className="text-sm mt-2">Upload a menu to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {parsedItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-brand-300 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                {item.name}
                                            </h3>
                                            <span className="text-brand-600 font-bold">
                                                ${item.price.toFixed(2)}
                                            </span>
                                        </div>
                                        {item.description && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                {item.description}
                                            </p>
                                        )}
                                        <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-xs font-medium rounded-full">
                                            {item.category}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {parsedItems.length > 0 && (
                            <button
                                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSaveItems}
                                disabled={saving || !selectedShopId}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Save {parsedItems.length} Items to Database
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
