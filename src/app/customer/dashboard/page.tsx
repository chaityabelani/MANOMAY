import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Clock } from 'lucide-react';
import UserNotification from '@/components/UserNotification';

export const dynamic = 'force-dynamic';

export default async function CustomerDashboard() {
    const session = await getSession();

    if (!session || session.user.role !== 'customer') {
        redirect('/customer/login');
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo - Fixed: Now navigates to homepage instead of triggering logout */}
                    <Link
                        href="/customer/dashboard"
                        className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition cursor-pointer"
                    >
                        🍽️ MANOMAY
                    </Link>

                    {/* User Notification Component - Replaces static "Hi Customer" text */}
                    <div className="flex items-center gap-4">
                        <UserNotification
                            userName={session.user.name}
                            message="Welcome back!"
                        />
                        {/* Edit Profile button retained */}
                        <Link
                            href="/customer/dashboard/profile"
                            className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                        >
                            Edit Profile
                        </Link>
                        {/* Logout button REMOVED as per requirements */}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-3xl p-8 mb-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {session.user.name}! 👋</h2>
                    <p className="text-orange-100">Track your orders and manage your account</p>
                </div>

                {/* Quick Actions - Profile section REMOVED */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link
                        href="/menu"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition group"
                    >
                        <ShoppingBag className="w-12 h-12 text-orange-600 mb-4" />
                        <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-orange-600">
                            Browse Menu
                        </h3>
                        <p className="text-slate-600 text-sm">
                            Explore food from all vendors
                        </p>
                    </Link>

                    <Link
                        href="/customer/dashboard/orders"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-pink-300 hover:shadow-xl transition group"
                    >
                        <Clock className="w-12 h-12 text-pink-600 mb-4" />
                        <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-pink-600">
                            Order History
                        </h3>
                        <p className="text-slate-600 text-sm">
                            View your past orders
                        </p>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-slate-600">No recent orders</p>
                        <Link
                            href="/menu"
                            className="inline-block mt-4 px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition"
                        >
                            Start Ordering
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
