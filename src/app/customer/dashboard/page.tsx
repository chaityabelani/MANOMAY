import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Clock, User } from 'lucide-react';
import UserNotification from '@/components/UserNotification';
import RecentOrders from '@/components/RecentOrders';

export const dynamic = 'force-dynamic';

export default async function CustomerDashboard() {
    const session = await getSession();

    if (!session || session.user.role !== 'customer') {
        redirect('/customer/login');
    }

    return (
        /* pb-20 gives space above the fixed bottom nav bar */
        <div className="min-h-screen bg-slate-50 pb-20">

            {/* ── Compact Header ────────────────────────────────── */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        href="/customer/dashboard"
                        className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"
                    >
                        🍽️ MANOMAY
                    </Link>

                    {/* Right: notification + profile */}
                    <div className="flex items-center gap-2">
                        <UserNotification
                            userName={session.user.name}
                            message="Welcome back!"
                        />
                        <Link
                            href="/customer/dashboard/profile"
                            className="w-9 h-9 flex items-center justify-center bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition"
                            aria-label="Edit profile"
                        >
                            <User className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Content ───────────────────────────────────────── */}
            <div className="container mx-auto px-4 py-6">

                {/* Welcome Banner — compact on mobile */}
                <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl p-5 sm:p-8 mb-6 text-white">
                    <h2 className="text-xl sm:text-3xl font-bold mb-1">
                        Welcome back, {session.user.name}! 👋
                    </h2>
                    <p className="text-orange-100 text-sm">Track your orders and manage your account</p>
                </div>

                {/* Quick Actions — always 2 columns side by side */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Link
                        href="/menu"
                        className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition group"
                    >
                        <ShoppingBag className="w-9 h-9 sm:w-12 sm:h-12 text-orange-600 mb-3" />
                        <h3 className="font-bold text-base sm:text-xl mb-1 text-slate-900 group-hover:text-orange-600">
                            Browse Menu
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm">
                            Explore all vendors
                        </p>
                    </Link>

                    <Link
                        href="/customer/dashboard/orders"
                        className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 hover:border-pink-300 hover:shadow-xl transition group"
                    >
                        <Clock className="w-9 h-9 sm:w-12 sm:h-12 text-pink-600 mb-3" />
                        <h3 className="font-bold text-base sm:text-xl mb-1 text-slate-900 group-hover:text-pink-600">
                            Order History
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm">
                            View past orders
                        </p>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Recent Activity</h3>
                        <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Live
                        </span>
                    </div>
                    <RecentOrders />
                </div>
            </div>

            {/* ── Bottom Tab Bar ────────────────────────────────── */}
            <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-200 flex items-stretch h-16 safe-bottom">
                <Link
                    href="/menu"
                    className="flex-1 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-orange-600 transition group"
                >
                    <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium">Browse</span>
                </Link>

                <Link
                    href="/customer/dashboard"
                    className="flex-1 flex flex-col items-center justify-center gap-1 text-orange-600 font-bold"
                >
                    <span className="text-2xl leading-none">🏠</span>
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link
                    href="/customer/dashboard/orders"
                    className="flex-1 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-orange-600 transition group"
                >
                    <Clock className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium">Orders</span>
                </Link>
            </nav>
        </div>
    );
}
