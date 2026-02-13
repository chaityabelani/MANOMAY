import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Building2, Users, BarChart3, Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const session = await getSession();

    if (!session || session.user.role !== 'super-admin') {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        👑 Super Admin Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600">{session.user.email}</span>
                        <form action="/api/logout" method="POST">
                            <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Welcome */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, Admin! 👑</h2>
                    <p className="text-purple-100">Manage your digital food court platform from here</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Link
                        href="/admin/dashboard/parks"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-300 hover:shadow-xl transition group"
                    >
                        <Building2 className="w-12 h-12 text-purple-600 mb-4" />
                        <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-purple-600">
                            Food Parks
                        </h3>
                        <p className="text-slate-600 text-sm">
                            Manage food parks and tables
                        </p>
                    </Link>

                    <Link
                        href="/admin/dashboard/vendors"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-pink-300 hover:shadow-xl transition group"
                    >
                        <Users className="w-12 h-12 text-pink-600 mb-4" />
                        <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-pink-600">
                            Vendors
                        </h3>
                        <p className="text-slate-600 text-sm">
                            Approve and manage vendors
                        </p>
                    </Link>

                    <Link
                        href="/admin/dashboard/analytics"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition group"
                    >
                        <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
                        <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-blue-600">
                            Analytics
                        </h3>
                        <p className="text-slate-600 text-sm">
                            View reports and insights
                        </p>
                    </Link>

                    <Link
                        href="/admin/dashboard/settings"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition group"
                    >
                        <Settings className="w-12 h-12 text-orange-600 mb-4" />
                        <h3 className="font-bold text-xl mb-2 text-slate-900 group-hover:text-orange-600">
                            Settings
                        </h3>
                        <p className="text-slate-600 text-sm">
                            Platform configuration
                        </p>
                    </Link>
                </div>

                {/* Stats */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-bold text-lg mb-4">Platform Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-3xl font-bold text-purple-600">0</div>
                            <div className="text-sm text-slate-600">Food Parks</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-pink-600">0</div>
                            <div className="text-sm text-slate-600">Vendors</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600">0</div>
                            <div className="text-sm text-slate-600">Total Orders</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-orange-600">₹0</div>
                            <div className="text-sm text-slate-600">Revenue</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
