'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPark } from '@/app/actions/admin';

export default function CreateParkPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const result = await createPark(formData);

        if (result.success) {
            router.push(`/admin/dashboard/parks/${result.parkId}`);
        } else {
            setError(result.error || 'Failed to create park');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="text-slate-600 hover:text-slate-900 mb-4"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    Create New Food Park
                </h1>
                <p className="text-slate-600 mb-8">
                    Set up a new location with tables and QR codes
                </p>

                <div className="bg-white rounded-3xl p-8 border border-slate-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                                Park Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                                placeholder="Downtown Food Court"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                                placeholder="123 Main Street, Mumbai"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                                Number of Tables *
                            </label>
                            <input
                                type="number"
                                name="tableCount"
                                required
                                min="1"
                                max="100"
                                defaultValue="10"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                            />
                            <p className="text-sm text-slate-500 mt-2">
                                QR codes will be automatically generated for each table
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl transition disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Food Park'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
