'use client';

import { useState } from 'react';
import { loginAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');

        const result = await loginAction(null, formData, 'user');

        if (result.success) {
            router.push('/');
            router.refresh();
        } else {
            setError(result.message || 'Login failed');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 relative overflow-hidden">
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl animate-pulse-ring"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8 animate-slide-up">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl shadow-glow mb-4">
                            <ShoppingBag className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                        <p className="text-slate-600">Sign in to continue your food journey</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <form action={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <Input
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                required
                                icon={<Mail className="w-5 h-5" />}
                                label="Email Address"
                            />

                            {/* Password */}
                            <Input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                icon={<Lock className="w-5 h-5" />}
                                label="Password"
                            />

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-error-50 border border-error-200 rounded-xl">
                                    <p className="text-sm text-error-700">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                isLoading={loading}
                                className="w-full"
                            >
                                {!loading && (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </Button>

                            {/* Forgot Password */}
                            <div className="text-center">
                                <a href="#" className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors">
                                    Forgot your password?
                                </a>
                            </div>
                        </form>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <p className="text-slate-600">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-brand-600 hover:text-brand-700 font-semibold transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    {/* Vendor Login Link */}
                    <div className="mt-4 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <Link
                            href="/vendor/login"
                            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <span>Are you a vendor?</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
