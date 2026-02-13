'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { customerLogin } from '@/app/actions/customer';
import Link from 'next/link';

export default function CustomerLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const result = await customerLogin(formData);

        if (result.success) {
            router.push('/customer/dashboard');
        } else {
            setError(result.error || 'Login failed');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-950 via-slate-950 to-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">👤</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome Back!
                    </h1>
                    <p className="text-white/60">Sign in to track your orders</p>
                </div>

                <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white/90 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-500"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/90 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-orange-500"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl transition disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-3">
                        <Link href="/customer/signup" className="text-orange-400 hover:text-orange-300 text-sm">
                            Don't have an account? Sign up
                        </Link>
                        <br />
                        <Link href="/" className="text-white/60 hover:text-white text-sm">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
