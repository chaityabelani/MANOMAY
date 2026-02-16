import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export default async function VendorDashboard() {
    const session = await getSession();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Vendor Dashboard
                    </h1>
                    <div className="flex items-center gap-4">

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
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-3xl p-8 mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        Welcome back! 👋
                    </h2>
                    <p className="text-orange-100">
                        Manage your products and orders from one place
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link
                        href="/vendor/dashboard/products/scan"
                        className="bg-white rounded-2xl p-6 border-2 border-dashed border-orange-300 hover:border-orange-500 hover:shadow-xl transition group"
                    >
                        <div className="text-4xl mb-4">📸</div>
                        <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-orange-600">
                            AI Menu Scanner
                        </h3>
                        <p className="text-slate-600 text-sm">
                            Upload a photo of your menu and let AI extract items instantly
                        </p>
                    </Link>

                    <Link
                        href="/vendor/dashboard/products"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition group"
                    >
                        <div className="text-4xl mb-4">📦</div>
                        <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-orange-600">
                            View All Products
                        </h3>
                        <p className="text-slate-600 text-sm">
                            Manage your existing menu items
                        </p>
                    </Link>
                </div>

                {/* Stats */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-3xl font-bold text-orange-600">0</div>
                            <div className="text-sm text-slate-600">Total Products</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-600">0</div>
                            <div className="text-sm text-slate-600">Active Products</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600">0</div>
                            <div className="text-sm text-slate-600">Orders Today</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-600">₹0</div>
                            <div className="text-sm text-slate-600">Revenue Today</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
