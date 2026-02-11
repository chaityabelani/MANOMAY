'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logoutAction } from '@/app/actions/auth';
import { User, Mail, Shield, LogOut, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        async function loadSession() {
            const sessionData = await getSession();
            if (!sessionData?.user) {
                // Redirect to login if not authenticated
                router.push('/login');
                return;
            }
            setSession(sessionData);
            setLoading(false);
        }
        loadSession();
    }, [router]);

    const handleLogout = async () => {
        setLoggingOut(true);
        const result = await logoutAction();

        if (result.success) {
            // Redirect based on role
            if (session?.user?.role === 'vendor') {
                router.push('/vendor/login');
            } else {
                router.push('/login');
            }
            router.refresh();
        } else {
            setLoggingOut(false);
            alert('Failed to logout. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            </div>
        );
    }

    const getRoleBadgeColor = () => {
        if (session?.user?.role === 'vendor') return 'bg-purple-100 text-purple-700 border-purple-300';
        if (session?.user?.role === 'admin') return 'bg-red-100 text-red-700 border-red-300';
        return 'bg-blue-100 text-blue-700 border-blue-300';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Back Button */}
                <Link
                    href={session?.user?.role === 'vendor' ? '/vendor/dashboard' : '/'}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </Link>

                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-12 text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4 shadow-lg">
                            <User className="w-12 h-12 text-brand-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {session?.user?.name || 'User'}
                        </h1>
                        <p className="text-brand-100">{session?.user?.email}</p>
                    </div>

                    {/* Profile Details */}
                    <div className="p-8 space-y-6">
                        {/* Email */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Mail className="w-6 h-6 text-brand-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-600 mb-1">Email Address</p>
                                <p className="text-lg font-semibold text-gray-900 truncate">
                                    {session?.user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-brand-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-600 mb-1">Account Type</p>
                                <span
                                    className={`inline-block px-4 py-2 rounded-lg font-semibold border ${getRoleBadgeColor()}`}
                                >
                                    {session?.user?.role === 'vendor' ? 'Vendor Account' :
                                        session?.user?.role === 'admin' ? 'Admin Account' :
                                            'Customer Account'}
                                </span>
                            </div>
                        </div>

                        {/* Account ID */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <User className="w-6 h-6 text-brand-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-600 mb-1">User ID</p>
                                <p className="text-sm font-mono text-gray-700 truncate">
                                    {session?.user?._id}
                                </p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loggingOut ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Logging Out...</span>
                                </>
                            ) : (
                                <>
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout from Account</span>
                                </>
                            )}
                        </button>

                        {/* Additional Info */}
                        <p className="text-center text-sm text-gray-500 mt-6">
                            Need help? Contact support@foodpark.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
