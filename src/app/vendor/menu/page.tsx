'use client'

import { useState } from 'react';
import { parseMenuImage, saveMenuItems } from '@/app/actions/vendor';
import toast from 'react-hot-toast';

export default function MenuUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [parsedItems, setParsedItems] = useState<any[]>([]);
    const [shopId, setShopId] = useState<string | null>(null); // Ideally fetch this

    // We need to know the shop ID. 
    // In a real app, we fetch the user's shop. 
    // For now, we will handle "finding the shop" in the server action based on user session.
    // Or we pass it down. Simple MVP: Server action finds the shop owned by user.

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    const handleScan = async () => {
        if (!file) return;
        setScanning(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await parseMenuImage(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                setParsedItems(result.items);
                toast.success(`Found ${result.items.length} items!`);
            }
        } catch (e) {
            toast.error("Scanning failed");
        } finally {
            setScanning(false);
        }
    };

    const handleSave = async () => {
        // We will call a server action that first finds the user's shop, then saves items.
        // We pass the items array.
        // Since we don't have the shopId easily here without fetching, 
        // let's rely on the server action to find the shop by Owner ID (User ID).
        // WAIT: server action `saveMenuItems` needs `shopId`. 
        // I should probably fetch the shop ID first.
        // Actually, let's make `saveMenuItems` find the shop if not provided.
        // Or better, let's skip `shopId` in the client call and let server handle it.
        // I'll update the server action signature momentarily or handling logic.
        // Let's assume the server action `saveMenuItems` takes `items` and finds the shop.

        // Temporarily, we will assume the User OWNS only ONE shop.

        // We need a wrapper action for this page that doesn't require shopId.
        // Or we modify `saveMenuItems` to infer shopId.

        // Let's assume we call a new action `saveMyMenuItems(items)`.
        // I will implement this logic in `handleSave` via a modified action call.

        toast.error("Saving not fully connected yet - check logic");
        // Placeholder
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-playfair font-bold text-gray-900">AI Menu Manager</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                {/* Upload Section */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-orange-400 transition-colors">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="menu-upload"
                    />
                    <label htmlFor="menu-upload" className="cursor-pointer flex flex-col items-center gap-4">
                        {preview ? (
                            <img src={preview} alt="Preview" className="max-h-64 rounded-lg shadow-md" />
                        ) : (
                            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📸</span>
                            </div>
                        )}
                        <div>
                            <span className="text-orange-600 font-bold">Click to upload</span>
                            <span className="text-gray-500"> or drag and drop</span>
                        </div>
                        <p className="text-sm text-gray-400">JPG, PNG, WebP up to 10MB</p>
                    </label>
                </div>

                {/* Actions */}
                {file && (
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={handleScan}
                            disabled={scanning}
                            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                        >
                            {scanning ? 'Analyzing with Gemini...' : '✨ Scan Menu'}
                        </button>
                    </div>
                )}
            </div>

            {/* Results Section */}
            {parsedItems.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Extracted Items ({parsedItems.length})</h2>
                        <button
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                            onClick={() => {
                                // Call save action
                                import('@/app/actions/vendor').then(mod => {
                                    // wrapper to find shop
                                    // For now, we need to create that wrapper.
                                    toast("Saving...");
                                    mod.saveMenuItems("FIND_MY_SHOP", parsedItems).then(res => {
                                        if (res.success) toast.success("Saved!");
                                        else toast.error(res.error);
                                    });
                                })
                            }}
                        >
                            Save All
                        </button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Category</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {parsedItems.map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{item.name}</td>
                                    <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{item.description}</td>
                                    <td className="p-4">₹{item.price}</td>
                                    <td className="p-4 text-xs uppercase tracking-wide text-gray-400">{item.category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
