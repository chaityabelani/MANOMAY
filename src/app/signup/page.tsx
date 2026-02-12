'use client';

import { useState } from 'react';
import { signupAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ShoppingBag, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');

        const result = await signupAction(null, formData, 'user');

        if (result.success) {
            router.push('/');
            router.refresh();
        } else {
            setError(result.message || 'Signup failed');
            setLoading(false);
        }
    }

    const benefits = [
        'Quick QR code ordering',
        'Save your favorite items',
        'Track order history',
        'Exclusive offers & deals',
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 relative overflow-hidden">
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl animate-bounce-slow"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
                <div className="w-full max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left Side - Benefits */}
                        <div className="text-center md:text-left animate-slide-up">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl shadow-glow mb-6">
                                <ShoppingBag className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-5xl font-bold text-slate-900 mb-4">Join the Food Park</h1>
                            <p className="text-xl text-slate-600 mb-8">
                                Order from multiple vendors with a single tap
                            </p>

                            {/* Benefits List */}
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 animate-slide-up"
                                        style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-success-600" />
                                        </div>
                                        <span className="text-slate-700 font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side - Signup Form */}
                        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Account</h2>

                                <form action={handleSubmit} className="space-y-5">
                                    {/* Name */}
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        required
                                        icon={<User className="w-5 h-5" />}
                                        label="Full Name"
                                    />

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
                                                <span>Create Account</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </Button>

                                    {/* Terms */}
                                    <p className="text-xs text-slate-500 text-center">
                                        By signing up, you agree to our{' '}
                                        <a href="#" className="text-brand-600 hover:text-brand-700">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="text-brand-600 hover:text-brand-700">
                                            Privacy Policy
                                        </a>
                                    </p>
                                </form>

                                {/* Login Link */}
                                <div className="mt-6 text-center">
                                    <p className="text-slate-600">
                                        Already have an account?{' '}
                                        <Link href="/login" className="text-brand-600 hover:text-brand-700 font-semibold transition-colors">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Vendor Signup Link */}
                            <div className="mt-4 text-center">
                                <Link
                                    href="/vendor/signup"
                                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    <span>Want to become a vendor?</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
