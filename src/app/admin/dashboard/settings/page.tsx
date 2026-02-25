import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import { Shield, Globe, Mail, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
    const session = await getSession();
    if (!session || session.user.role !== 'super-admin') redirect('/admin/login');

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 py-4">
                    <BackButton href="/admin/dashboard" label="Back to Dashboard" />
                </div>
            </header>

            <div className="container mx-auto px-6 py-8 max-w-3xl">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Platform Settings</h1>
                <p className="text-slate-600 mb-8">Configuration and administrative controls for Manomay</p>

                {/* Platform Info */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
                    <div className="flex items-center gap-3 mb-5">
                        <Globe className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-bold text-slate-900">Platform Info</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600 text-sm font-medium">Platform Name</span>
                            <span className="font-bold text-slate-900">Manomay Food Park</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600 text-sm font-medium">Admin Email</span>
                            <span className="font-bold text-slate-900">{session.user.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-600 text-sm font-medium">Role</span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">Super Admin</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-slate-600 text-sm font-medium">Deployment</span>
                            <span className="font-bold text-slate-900">Vercel (Production)</span>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
                    <div className="flex items-center gap-3 mb-5">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-slate-900">Security</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                            <div>
                                <p className="font-semibold text-green-800">JWT Authentication</p>
                                <p className="text-sm text-green-700">HTTP-only cookies, role-based access control</p>
                            </div>
                            <span className="text-green-600 font-bold text-sm">✅ Active</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                            <div>
                                <p className="font-semibold text-green-800">Password Hashing</p>
                                <p className="text-sm text-green-700">bcrypt, salt rounds 10</p>
                            </div>
                            <span className="text-green-600 font-bold text-sm">✅ Active</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div>
                                <p className="font-semibold text-blue-800">Database</p>
                                <p className="text-sm text-blue-700">MongoDB Atlas — encrypted at rest</p>
                            </div>
                            <span className="text-blue-600 font-bold text-sm">✅ Connected</span>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
                    <div className="flex items-center gap-3 mb-5">
                        <Mail className="w-6 h-6 text-orange-600" />
                        <h2 className="text-xl font-bold text-slate-900">Quick Links</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: '🏢 Manage Parks', href: '/admin/dashboard/parks' },
                            { label: '👥 Manage Vendors', href: '/admin/dashboard/vendors' },
                            { label: '📋 All Orders', href: '/admin/dashboard/orders' },
                            { label: '📊 Analytics', href: '/admin/dashboard/analytics' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="p-4 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl font-medium text-slate-800 transition text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl p-6 border-2 border-red-200">
                    <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <h2 className="text-xl font-bold text-red-700">Danger Zone</h2>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                        Destructive actions are disabled in this version. Contact the development team for data management operations.
                    </p>
                    <div className="space-y-2">
                        {['Archive All Parks', 'Export Full Database', 'Reset Platform Data'].map((action) => (
                            <div key={action} className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                                <span className="text-sm text-slate-700 font-medium">{action}</span>
                                <span className="text-xs text-red-500 font-bold bg-red-100 px-2 py-1 rounded-full">Disabled</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
