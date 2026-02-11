'use client'

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { registerShop } from '@/app/actions/vendor'; // We'll hook this up
import { Input } from "@/components/ui/input" // Assuming specific components if we had them, OR use raw HTML
// Since we don't have components setup, I'll use raw Tailwind form

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
        >
            {pending ? 'Registering...' : 'Complete Registration'}
        </button>
    );
}

export default function VendorRegisterPage() {
    // using raw form action for now, or useActionState in React 19/Next 14+
    // But sticking to simple form action to avoid hydration mismatch if not set up perfect
    // Actually, `useFormState` is safer. Let's try basic form action first.

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-neutral-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-playfair font-bold text-neutral-900 mb-2">Vendor Onboarding</h1>
                    <p className="text-neutral-500">Join Manomay Food Park and start selling.</p>
                </div>

                <form action={registerShop} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Shop Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="e.g. Burger King"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            placeholder="e.g. Best burgers in town..."
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="cuisineType" className="block text-sm font-medium text-neutral-700 mb-1">Cuisine Types (comma separated)</label>
                        <input
                            type="text"
                            id="cuisineType"
                            name="cuisineType"
                            placeholder="e.g. Fast Food, American, Burgers"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                        />
                    </div>

                    <SubmitButton />

                    {/* Error handling would ideally use useFormState to show server errors here */}
                </form>
            </div>
        </div>
    );
}
