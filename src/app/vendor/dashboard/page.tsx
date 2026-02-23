import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getVendorStats } from '@/app/actions/product';
import VendorKPICards from '@/components/VendorKPICards';

export const dynamic = 'force-dynamic';

export default async function VendorDashboard() {
    const session = await getSession();

    if (!session || session.user.role !== 'vendor') {
        redirect('/vendor/login');
    }

    // Fetch stats for the sticky action banner (server-rendered)
    const statsResult = await getVendorStats();
    const pendingOrders = statsResult.success && statsResult.stats
        ? statsResult.stats.pendingOrders ?? 0
        : 0;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Vendor Dashboard</h1>
                        <p className="text-xs text-slate-500">KPIs update every 15 seconds</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/vendor/dashboard/orders"
                            className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
                        >
                            Orders
                        </Link>
                        <Link
                            href="/vendor/dashboard/profile"
                            className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                        >
                            Profile
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Action Required Banner */}
                {pendingOrders > 0 && (
                    <Link href="/vendor/dashboard/orders">
                        <div className="flex items-center gap-3 mb-6 px-5 py-4 bg-red-50 border-2 border-red-400 rounded-2xl animate-pulse cursor-pointer hover:bg-red-100 transition">
                            <span className="text-2xl">🚨</span>
                            <div>
                                <p className="font-bold text-red-700">Action Required</p>
                                <p className="text-sm text-red-600">
                                    {pendingOrders} pending order{pendingOrders > 1 ? 's' : ''} waiting for you
                                </p>
                            </div>
                            <span className="ml-auto text-red-500 font-bold text-sm">View Orders →</span>
                        </div>
                    </Link>
                )}

                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-3xl p-8 mb-8">
                    <h2 className="text-3xl font-bold mb-1">Welcome back! 👋</h2>
                    <p className="text-orange-100 text-sm">Here's your store performance at a glance</p>
                </div>

                {/* Live KPI Cards — polls /api/vendor/stats every 15s */}
                <VendorKPICards />

                {/* Quick Actions */}
                <h3 className="font-bold text-lg text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Link
                        href="/vendor/dashboard/orders"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition group"
                    >
                        <div className="text-4xl mb-3">📋</div>
                        <h3 className="font-bold text-lg mb-1 text-slate-900 group-hover:text-orange-600">
                            Manage Orders
                        </h3>
                        <p className="text-slate-600 text-sm">View, update & export order history</p>
                    </Link>

                    <Link
                        href="/vendor/dashboard/products"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition group"
                    >
                        <div className="text-4xl mb-3">📦</div>
                        <h3 className="font-bold text-lg mb-1 text-slate-900 group-hover:text-orange-600">
                            Products
                        </h3>
                        <p className="text-slate-600 text-sm">Manage menu items & availability</p>
                    </Link>

                    <Link
                        href="/vendor/dashboard/products/scan"
                        className="bg-white rounded-2xl p-6 border-2 border-dashed border-orange-300 hover:border-orange-500 hover:shadow-xl transition group"
                    >
                        <div className="text-4xl mb-3">📸</div>
                        <h3 className="font-bold text-lg mb-1 text-slate-900 group-hover:text-orange-600">
                            AI Menu Scanner
                        </h3>
                        <p className="text-slate-600 text-sm">Upload menu photo, AI extracts items</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
