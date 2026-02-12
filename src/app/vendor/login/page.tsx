'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '@/app/actions/auth';
import { Lock, Mail, ArrowRight, AlertCircle, Store } from 'lucide-react';

export default function VendorLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        const formData = new FormData(e.currentTarget);
        const result = await loginAction(null, formData, 'vendor');

        if (result.success) {
            router.push('/vendor/dashboard');
            router.refresh();
        } else {
            if (result.errors) {
                setFieldErrors(result.errors);
            }
            if (result.message) {
                setError(result.message);
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-4">
            {/* Animated Background Circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                {/* Glass Card */}
                <div className="glass-pro rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/30">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                            <Store className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white mb-2">
                            Vendor Portal
                        </h1>
                        <p className="text-white/80 text-sm">
                            Manage your food stall
                        </p>
                    </div>

                    {/* Sign In Header */}
                    <h2 className="text-2xl font-bold text-white text-center mb-6">
                        Vendor Sign In
                    </h2>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-300/40 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-100 flex-shrink-0 mt-0.5" />
                            <p className="text-red-100 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-white/90 text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/20 border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                    placeholder="vendor@example.com"
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="text-xs text-red-200 mt-2 ml-1">{fieldErrors.email[0]}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-white/90 text-sm font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/20 border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            {fieldErrors.password && (
                                <p className="text-xs text-red-200 mt-2 ml-1">{fieldErrors.password[0]}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 bg-white hover:bg-white/90 text-blue-600 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In to Dashboard</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-transparent text-white/70">or</span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-white/80 text-sm mb-4">
                        New vendor?{' '}
                        <Link
                            href="/vendor/signup"
                            className="font-semibold text-white hover:underline transition-all"
                        >
                            Register Your Shop
                        </Link>
                    </p>

                    {/* Customer Login Link */}
                    <p className="text-center text-white/60 text-xs">
                        Are you a customer?{' '}
                        <Link
                            href="/login"
                            className="text-white/90 hover:underline"
                        >
                            Customer Login
                        </Link>
                    </p>
                </div>

                {/* Decorative Element */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gradient-to-b from-black/20 to-transparent blur-xl rounded-full"></div>
            </div>
        </div>
    );
}
