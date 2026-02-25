import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Building2, Users, BarChart3, Settings, ClipboardList } from 'lucide-react';
import AdminKPICards from '@/components/AdminKPICards';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session || session.user.role !== 'super-admin') redirect('/admin/login');

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            👑 Super Admin Dashboard
                        </h1>
                        <p className="text-xs text-slate-500">Platform stats update every 15 seconds</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 hidden sm:block">{session.user.email}</span>
                        <Link href="/admin/dashboard/settings"
                            className="px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                            ⚙️ Settings
                        </Link>
                        <form action="/api/logout" method="POST">
                            <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">Logout</button>
                        </form>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Welcome */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white">
                    <h2 className="text-3xl font-bold mb-1">Welcome back, Admin! 👑</h2>
                    <p className="text-purple-100 text-sm">Platform performance at a glance — live stats below</p>
                </div>

                {/* Live KPI Cards — polls /api/admin/stats every 15s */}
                <AdminKPICards />

                {/* Quick Actions */}
                <h3 className="font-bold text-lg text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Link href="/admin/dashboard/parks"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-300 hover:shadow-xl transition group">
                        <Building2 className="w-10 h-10 text-purple-600 mb-3" />
                        <h3 className="font-bold text-lg mb-1 text-slate-900 group-hover:text-purple-600">Food Parks</h3>
                        <p className="text-slate-600 text-sm">Manage parks, tables & QR codes</p>
                    </Link>

                    <Link href="/admin/dashboard/vendors"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-pink-300 hover:shadow-xl transition group">
                        <Users className="w-10 h-10 text-pink-600 mb-3" />
                        <h3 className="font-bold text-lg mb-1 text-slate-900 group-hover:text-pink-600">Vendors</h3>
                        <p className="text-slate-600 text-sm">Approve, activate & monitor vendors</p>
                    </Link>

                    <Link href="/admin/dashboard/orders"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition group">
                        <ClipboardList className="w-10 h-10 text-blue-600 mb-3" />
                        <h3 className="font-bold text-lg mb-1 text-slate-900 group-hover:text-blue-600">All Orders</h3>
                        <p className="text-slate-600 text-sm">View & export platform-wide orders</p>
                    </Link>

                    <Link href="/admin/dashboard/analytics"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-green-300 hover:shadow-xl transition group">
                        <BarChart3 className="w-10 h-10 text-green-600 mb-3" />
                        <h3 className="font-bold text-lg mb-1 text-slate-900 group-hover:text-green-600">Analytics</h3>
                        <p className="text-slate-600 text-sm">Revenue, top vendors & order insights</p>
                    </Link>

                    <Link href="/admin/dashboard/settings"
                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition group">
                        <Settings className="w-10 h-10 text-orange-600 mb-3" />
                        <h3 className="font-bold text-lg mb-1 text-slate-900 group-hover:text-orange-600">Settings</h3>
                        <p className="text-slate-600 text-sm">Platform config & security info</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
